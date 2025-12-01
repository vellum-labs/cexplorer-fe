#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");

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

  getLastReleaseRef() {
    try {
      const output = execSync('gh release list --limit 1 2>nul', { encoding: "utf8" }).trim();
      const lines = output.split('\n');
      if (lines.length > 0 && lines[0]) {
        const tag = lines[0].split('\t')[0];
        if (tag) return tag;
      }
    } catch (error) {
      console.log("No releases found via gh cli");
    }

    try {
      const lastTag = execSync('git describe --tags --abbrev=0 2>nul', { encoding: "utf8" }).trim();
      if (lastTag) {
        return lastTag;
      }
    } catch (error) {
      console.log("No git tags found");
    }

    try {
      return execSync("git rev-list --max-parents=0 HEAD", {
        encoding: "utf8",
      }).trim();
    } catch (error) {
      throw new Error("Could not determine last release reference");
    }
  }

  getMergedPRs(sinceRef) {
    try {
      console.log(`Collecting PRs since: ${sinceRef}`);

      const gitLog = `git log ${sinceRef}..HEAD --merges --pretty=format:"%H|%s|%an|%ad" --date=short --grep="Merge pull request"`;
      const output = execSync(gitLog, { encoding: "utf8" }).trim();

      if (!output) {
        console.log("No merge commits found");
        return [];
      }

      const mergeCommits = output.split("\n").filter(line => line.trim());
      const prs = [];

      for (const commit of mergeCommits) {
        const [hash, subject, , date] = commit.split("|");

        const prMatch = subject.match(/Merge pull request #(\d+)/);
        if (!prMatch) continue;

        const prNumber = prMatch[1];

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

  getPRDetails(prNumber) {
    try {
      const output = execSync(`gh pr view ${prNumber} 2>nul`, { encoding: "utf8" }).trim();

      const titleMatch = output.match(/title:\s+(.+)/i);
      const authorMatch = output.match(/author:\s+(.+)/i);

      const title = titleMatch ? titleMatch[1].trim() : `PR #${prNumber}`;
      const author = authorMatch ? authorMatch[1].trim() : "unknown";

      return {
        title,
        author,
        url: `https://github.com/${this.getRepoName()}/pull/${prNumber}`,
      };
    } catch (error) {
      return {
        title: `PR #${prNumber}`,
        author: "unknown",
        url: `https://github.com/${this.getRepoName()}/pull/${prNumber}`,
      };
    }
  }

  extractTypeFromTitle(title) {
    const match = title.match(/^([a-z]+)(\(.+\))?:/);
    return match ? match[1] : "chore";
  }

  extractScopeFromTitle(title) {
    const match = title.match(/^[a-z]+\((.+)\):/);
    return match ? match[1] : null;
  }

  getRepoName() {
    try {
      const remote = execSync("git config --get remote.origin.url", {
        encoding: "utf8",
      }).trim();
      const match = remote.match(/github\.com[:/]([^/]+\/[^/.]+)/);
      return match ? match[1] : "unknown/repo";
    } catch {
      return "unknown/repo";
    }
  }

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

  generateChangelog(prs, deploymentName) {
    if (prs.length === 0) {
      return null;
    }

    const grouped = this.groupPRsByType(prs);
    let content = "";

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
        let cleanTitle = pr.title.replace(/^[a-z]+(\(.+\))?:\s*/, "");
        content += `- ${cleanTitle} by @${pr.author} ([#${pr.number}](${pr.url}))\n`;
      }

      content += "\n";
    }

    content += `---\n\n**Total changes:** ${prs.length} pull requests\n`;
    content += `**Contributors:** ${[...new Set(prs.map(pr => pr.author))].length} people\n`;

    return {
      title: deploymentName,
      body: content.trim(),
    };
  }

  createRelease(releaseData, deployNumber) {
    try {
      const tag = `deploy-${deployNumber}`;
      const now = new Date().toISOString().split("T")[0];
      const title = `${releaseData.title} - ${now}`;

      console.log(`Creating GitHub release: ${tag}`);

      const tempFile = `notes-${Date.now()}.md`;
      fs.writeFileSync(tempFile, releaseData.body);

      try {
        execSync(
          `gh release create "${tag}" --title "${title}" --notes-file "${tempFile}" --latest`,
          { stdio: "inherit" }
        );
        console.log(`✅ GitHub release created: ${tag}`);
      } finally {
        if (fs.existsSync(tempFile)) {
          fs.unlinkSync(tempFile);
        }
      }

      return tag;
    } catch (error) {
      console.error("Failed to create GitHub release:", error.message);
      throw error;
    }
  }

  run() {
    try {
      const deployNumber = process.env.GITHUB_RUN_NUMBER || Math.floor(Date.now() / 1000);
      const deploymentName = process.env.DEPLOYMENT_NAME || `Deployment ${deployNumber}`;

      console.log("🔍 Collecting PRs for changelog...");

      const lastRef = this.getLastReleaseRef();
      console.log(`Last release reference: ${lastRef}`);

      const prs = this.getMergedPRs(lastRef);
      console.log(`Found ${prs.length} merged PRs`);

      if (prs.length === 0) {
        console.log("ℹ️ No PRs found, skipping release creation");
        return { tag: null, changesCount: 0 };
      }

      console.log("PRs found:");
      prs.forEach(pr => {
        console.log(`  - #${pr.number}: ${pr.title} (${pr.type})`);
      });

      const changelog = this.generateChangelog(prs, deploymentName);
      console.log("\n📝 Generated changelog:");
      console.log("Title:", changelog.title);
      console.log("Body preview:", changelog.body.substring(0, 200) + "...");

      const tag = this.createRelease(changelog, deployNumber);

      const outputFile = process.env.GITHUB_OUTPUT;
      if (outputFile) {
        fs.appendFileSync(outputFile, `release_tag=${tag}\n`);
        fs.appendFileSync(outputFile, `changes_count=${prs.length}\n`);
      }

      return { tag, changesCount: prs.length };
    } catch (error) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }
  }
}

if (require.main === module) {
  const collector = new PRCollector();
  collector.run();
}

module.exports = PRCollector;
