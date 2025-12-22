type MdInput = string | unknown;

interface CIP136Body {
  comment?: string;
  summary?: string;
  rationaleStatement?: string;
  precedentDiscussion?: string;
  counterargumentDiscussion?: string;
  conclusion?: string;
  internalVote?: {
    constitutional?: number;
    unconstitutional?: number;
    abstain?: number;
    didNotVote?: number;
    againstVote?: number;
  };
  references?: Array<{
    "@type"?: string;
    label?: string;
    uri?: string;
  }>;
}

interface CIP136Metadata {
  body?: CIP136Body;
  authors?: Array<{ name?: string; did?: string }>;
}

function normalizeUri(uri: string): string {
  const trimmed = uri.trim();

  if (trimmed.startsWith("ipfs://")) {
    const cid = trimmed.replace("ipfs://", "");
    return `https://ipfs.io/ipfs/${cid}`;
  }

  if (
    (trimmed.startsWith("Qm") || trimmed.startsWith("bafy")) &&
    !trimmed.includes("/") &&
    !trimmed.includes(".")
  ) {
    return `https://ipfs.io/ipfs/${trimmed}`;
  }

  if (/^[a-f0-9]{64}$/i.test(trimmed)) {
    return "";
  }

  return trimmed;
}

function formatCIP136(obj: CIP136Metadata): string | null {
  const body = obj?.body;
  if (!body) return null;

  const hasCIP136Fields =
    body.summary ||
    body.rationaleStatement ||
    body.conclusion ||
    body.internalVote;

  if (!hasCIP136Fields) return null;

  const parts: string[] = [];

  if (body.summary) {
    parts.push(body.summary);
  }

  if (body.rationaleStatement) {
    if (parts.length > 0) parts.push("\n---\n");
    parts.push("## Rationale\n");
    parts.push(body.rationaleStatement);
  }

  if (body.precedentDiscussion) {
    parts.push("\n## Precedent Discussion\n");
    parts.push(body.precedentDiscussion);
  }

  if (body.counterargumentDiscussion) {
    parts.push("\n## Counterargument Discussion\n");
    parts.push(body.counterargumentDiscussion);
  }

  if (body.conclusion) {
    parts.push("\n## Conclusion\n");
    parts.push(body.conclusion);
  }

  if (body.internalVote) {
    const iv = body.internalVote;
    const hasVotes =
      iv.constitutional !== undefined ||
      iv.unconstitutional !== undefined ||
      iv.abstain !== undefined ||
      iv.didNotVote !== undefined ||
      iv.againstVote !== undefined;

    if (hasVotes) {
      parts.push("\n## Internal Vote\n");
      if (iv.constitutional !== undefined)
        parts.push(`- **Constitutional:** ${iv.constitutional}\n`);
      if (iv.unconstitutional !== undefined)
        parts.push(`- **Unconstitutional:** ${iv.unconstitutional}\n`);
      if (iv.abstain !== undefined)
        parts.push(`- **Abstain:** ${iv.abstain}\n`);
      if (iv.didNotVote !== undefined)
        parts.push(`- **Did Not Vote:** ${iv.didNotVote}\n`);
      if (iv.againstVote !== undefined)
        parts.push(`- **Against Vote:** ${iv.againstVote}\n`);
    }
  }

  if (body.references && body.references.length > 0) {
    parts.push("\n## References\n");
    for (const ref of body.references) {
      if (ref.label && ref.uri) {
        const normalizedUri = normalizeUri(ref.uri);
        if (normalizedUri) {
          parts.push(`- [${ref.label}](${normalizedUri})\n`);
        } else {
          parts.push(`- ${ref.label}: \`${ref.uri}\`\n`);
        }
      }
    }
  }

  if (obj.authors && obj.authors.length > 0) {
    const authorNames = obj.authors
      .map(a => a.name)
      .filter(Boolean)
      .join(", ");
    if (authorNames) {
      parts.push(`\n---\n**Authors:** ${authorNames}`);
    }
  }

  return parts.length > 0 ? parts.join("") : null;
}

export function toMarkdown(input: MdInput): string {
  if (typeof input !== "string") {
    return "```json\n" + JSON.stringify(input, null, 2) + "\n```";
  }

  const s = input.trim();

  if (
    (s.startsWith("{") && s.endsWith("}")) ||
    (s.startsWith("[") && s.endsWith("]"))
  ) {
    try {
      const obj = JSON.parse(s);

      const comment = obj?.body?.comment;
      if (typeof comment === "string" && comment.trim()) return comment;

      const cip136 = formatCIP136(obj);
      if (cip136) return cip136;

      return "```json\n" + JSON.stringify(obj, null, 2) + "\n```";
    } catch {
      return input;
    }
  }

  return input;
}
