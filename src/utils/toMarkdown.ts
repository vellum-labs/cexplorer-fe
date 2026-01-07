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
    return `https://ipfs.io/ipfs/${trimmed.slice(7)}`;
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

function formatInternalVote(
  iv: NonNullable<CIP136Body["internalVote"]>,
): string {
  const voteFields = [
    { key: "constitutional", label: "Constitutional" },
    { key: "unconstitutional", label: "Unconstitutional" },
    { key: "abstain", label: "Abstain" },
    { key: "didNotVote", label: "Did Not Vote" },
    { key: "againstVote", label: "Against Vote" },
  ] as const;

  const votes = voteFields
    .filter(({ key }) => iv[key] !== undefined)
    .map(({ key, label }) => `- **${label}:** ${iv[key]}`);

  return votes.length > 0 ? `\n## Internal Vote\n${votes.join("\n")}\n` : "";
}

function formatReferences(refs: NonNullable<CIP136Body["references"]>): string {
  const formatted = refs
    .filter(ref => ref.label && ref.uri)
    .map(ref => {
      const normalizedUri = normalizeUri(ref.uri!);
      return normalizedUri
        ? `- [${ref.label}](${normalizedUri})`
        : `- ${ref.label}: \`${ref.uri}\``;
    });

  return formatted.length > 0
    ? `\n## References\n${formatted.join("\n")}\n`
    : "";
}

function formatAuthors(
  authors: NonNullable<CIP136Metadata["authors"]>,
): string {
  const names = authors
    .map(a => a.name)
    .filter(Boolean)
    .join(", ");

  return names ? `\n---\n**Authors:** ${names}` : "";
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

  const sections: Array<{ condition: boolean; content: string }> = [
    {
      condition: !!body.summary,
      content: body.summary || "",
    },
    {
      condition: !!body.rationaleStatement,
      content: `\n---\n## Rationale\n${body.rationaleStatement}`,
    },
    {
      condition: !!body.precedentDiscussion,
      content: `\n## Precedent Discussion\n${body.precedentDiscussion}`,
    },
    {
      condition: !!body.counterargumentDiscussion,
      content: `\n## Counterargument Discussion\n${body.counterargumentDiscussion}`,
    },
    {
      condition: !!body.conclusion,
      content: `\n## Conclusion\n${body.conclusion}`,
    },
  ];

  const parts = sections.filter(s => s.condition).map(s => s.content);

  if (body.internalVote) {
    parts.push(formatInternalVote(body.internalVote));
  }

  if (body.references?.length) {
    parts.push(formatReferences(body.references));
  }

  if (obj.authors?.length) {
    parts.push(formatAuthors(obj.authors));
  }

  return parts.length > 0 ? parts.join("") : null;
}

export function toMarkdown(input: MdInput): string {
  if (typeof input !== "string") {
    return `\`\`\`json\n${JSON.stringify(input, null, 2)}\n\`\`\``;
  }

  const s = input.trim();
  const isJson =
    (s.startsWith("{") && s.endsWith("}")) ||
    (s.startsWith("[") && s.endsWith("]"));

  if (!isJson) return input;

  try {
    const obj = JSON.parse(s);

    const comment = obj?.body?.comment;
    if (typeof comment === "string" && comment.trim()) {
      return comment;
    }

    const cip136 = formatCIP136(obj);
    if (cip136) return cip136;

    return `\`\`\`json\n${JSON.stringify(obj, null, 2)}\n\`\`\``;
  } catch {
    return input;
  }
}
