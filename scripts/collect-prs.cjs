#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const { execSync } = require("child_process");

/**
 * Collect PRs for changelog based on Conventional Commits
 */
class PRCollector {
  constructor() {
    this.conventionalTypes = {
      feat: { section: "Features", emoji: "✨" },
      fix: { section: "Bug Fixes", emoji: "🐛" },
      perf: { section: "Performance", emoji: "⚡" },
      refactor: { section: "Code Refactoring", emoji: "♻️" },
      docs: { section: "Documentation", emoji: "📚" },
      style: { section: "Styles", emoji: "🎨" },
      test: { section: "Tests", emoji: "✅" },
      build: { section: "Build System", emoji: "🔧" },
      ci: { section: "CI/CD", emoji: "🤖" },
      chore: { section: "Chores", emoji: "🔨" },
      revert: { section: "Reverts", emoji: "⏪" },
    };
  }

  /**
   * Get last release tag or commit
   */
  getLastReleaseRef() {
    try {
      // Try to get last release tag
      const lastTag = execSync(
        'gh release list --limit 1 --json tagName -q ".[0].tagName" 2>/dev/null || echo ""',
        { encoding: "utf8" },
      ).trim();
      if (lastTag && lastTag !== "null") {
        return lastTag;
      }
    } catch (error) {
      console.log("No releases found via gh cli");
    }

    try {
      // Fallback to git tags
      const lastTag = execSync(
        'git describe --tags --abbrev=0 2>/dev/null || echo ""',
        { encoding: "utf8" },
      ).trim();
      if (lastTag) {
        return lastTag;
      }
    } catch (error) {
      console.log("No git tags found");
    }

    // Fallback to first commit
    try {
      return execSync("git rev-list --max-parents=0 HEAD", {
        encoding: "utf8",
      }).trim();
    } catch (error) {
      throw new Error("Could not determine last release reference");
    }
  }

  /**
   * Get merged PRs since last release
   */
  getMergedPRs(sinceRef) {
    try {
      console.log(`Collecting PRs since: ${sinceRef}`);

      // Get merge commits since last release
      const gitLog = `git log ${sinceRef}..HEAD --merges --pretty=format:'%H|%s|%an|%ad' --date=short --grep="Merge pull request"`;
      const output = execSync(gitLog, { encoding: "utf8" }).trim();

      if (!output) {
        console.log("No merge commits found");
        return [];
      }

      const mergeCommits = output.split("\n").filter(line => line.trim());
      const prs = [];

      for (const commit of mergeCommits) {
        const [hash, subject, author, date] = commit.split("|");

        // Extract PR number
        const prMatch = subject.match(/Merge pull request #(\d+)/);
        if (!prMatch) continue;

        const prNumber = prMatch[1];

        // Get PR details via GitHub API
        const prData = this.getPRDetails(prNumber);
        if (prData) {
          prs.push({
            number: prNumber,
            title: prData.title,
            author: prData.author,
            date: date,
            hash: hash.substring(0, 7),
            type: this.extractTypeFromTitle(prData.title),
            scope: this.extractScopeFromTitle(prData.title),
            url: prData.url,
          });
        }
      }

      return prs;
    } catch (error) {
      console.error("Error getting merged PRs:", error.message);
      return [];
    }
  }

  /**
   * Get PR details from GitHub API
   */
  getPRDetails(prNumber) {
    try {
      const prData = execSync(
        `gh pr view ${prNumber} --json title,author,url -q '{title: .title, author: .author.login, url: .url}'`,
        { encoding: "utf8" },
      ).trim();
      return JSON.parse(prData);
    } catch (error) {
      console.warn(`Could not fetch PR #${prNumber} details:`, error.message);
      return {
        title: `PR #${prNumber}`,
        author: "unknown",
        url: `https://github.com/${this.getRepoName()}/pull/${prNumber}`,
      };
    }
  }

  /**
   * Extract conventional commit type from PR title
   */
  extractTypeFromTitle(title) {
    const match = title.match(/^([a-z]+)(\(.+\))?:/);
    return match ? match[1] : "chore";
  }

  /**
   * Extract scope from PR title
   */
  extractScopeFromTitle(title) {
    const match = title.match(/^[a-z]+\((.+)\):/);
    return match ? match[1] : null;
  }

  /**
   * Get repository name from git remote
   */
  getRepoName() {
    try {
      const remote = execSync("git config --get remote.origin.url", {
        encoding: "utf8",
      }).trim();
      const match = remote.match(/github\.com[:/]([^/]+\/[^/\.]+)/);
      return match ? match[1] : "unknown/repo";
    } catch {
      return "unknown/repo";
    }
  }

  /**
   * Group PRs by type
   */
  groupPRsByType(prs) {
    const grouped = {};

    for (const pr of prs) {
      const type = pr.type;
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(pr);
    }

    return grouped;
  }

  /**
   * Generate changelog markdown
   */
  generateChangelog(prs, deployNumber) {
    if (prs.length === 0) {
      return {
        title: `Deployment ${deployNumber}`,
        body: "No changes in this deployment.",
      };
    }

    const grouped = this.groupPRsByType(prs);
    let content = "";

    // Order types by importance
    const typeOrder = [
      "feat",
      "fix",
      "perf",
      "refactor",
      "docs",
      "style",
      "test",
      "build",
      "ci",
      "chore",
      "revert",
    ];

    for (const type of typeOrder) {
      if (!grouped[type] || grouped[type].length === 0) continue;

      const typeInfo = this.conventionalTypes[type];
      content += `## ${typeInfo.emoji} ${typeInfo.section}\n\n`;

      for (const pr of grouped[type]) {
        // Clean title by removing conventional commit prefix
        let cleanTitle = pr.title.replace(/^[a-z]+(\(.+\))?:\s*/, "");

        // Format: - Title by @author (#123)
        content += `- ${cleanTitle} by @${pr.author} ([#${pr.number}](${pr.url}))\n`;
      }

      content += "\n";
    }

    // Add summary at the end
    content += `---\n\n**Total changes:** ${prs.length} pull requests\n`;
    content += `**Contributors:** ${[...new Set(prs.map(pr => pr.author))].length} people\n`;

    return {
      title: `Deployment ${deployNumber}`,
      body: content.trim(),
    };
  }

  /**
   * Create GitHub release
   */
  createRelease(releaseData, deployNumber) {
    try {
      const tag = `deploy-${deployNumber}`;
      const now = new Date().toISOString().split("T")[0];
      const title = `${releaseData.title} - ${now}`;

      console.log(`Creating GitHub release: ${tag}`);

      const command = [
        "gh",
        "release",
        "create",
        `"${tag}"`,
        "--title",
        `"${title}"`,
        "--notes",
        `"${releaseData.body}"`,
        "--latest",
      ].join(" ");

      execSync(command, { stdio: "inherit" });
      console.log(`✅ GitHub release created: ${tag}`);

      return tag;
    } catch (error) {
      console.error("Failed to create GitHub release:", error.message);
      throw error;
    }
  }

  /**
   * Main execution
   */
  run() {
    try {
      const deployNumber =
        process.env.GITHUB_RUN_NUMBER || Math.floor(Date.now() / 1000);

      console.log("🔍 Collecting PRs for changelog...");

      const lastRef = this.getLastReleaseRef();
      console.log(`Last release reference: ${lastRef}`);

      const prs = this.getMergedPRs(lastRef);
      console.log(`Found ${prs.length} merged PRs`);

      if (prs.length > 0) {
        console.log("PRs found:");
        prs.forEach(pr => {
          console.log(`  - #${pr.number}: ${pr.title} (${pr.type})`);
        });
      }

      const changelog = this.generateChangelog(prs, deployNumber);
      console.log("\n📝 Generated changelog:");
      console.log("Title:", changelog.title);
      console.log("Body preview:", changelog.body.substring(0, 200) + "...");

      const tag = this.createRelease(changelog, deployNumber);

      // Output for GitHub Actions
      console.log(`::set-output name=release_tag::${tag}`);
      console.log(`::set-output name=changes_count::${prs.length}`);

      return { tag, changesCount: prs.length };
    } catch (error) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }
  }
}

// Run if called directly
if (require.main === module) {
  const collector = new PRCollector();
  collector.run();
}

module.exports = PRCollector;
