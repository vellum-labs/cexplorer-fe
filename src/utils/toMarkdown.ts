type MdInput = string | unknown;

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

      return "```json\n" + JSON.stringify(obj, null, 2) + "\n```";
    } catch {
      return input;
    }
  }

  return input;
}
