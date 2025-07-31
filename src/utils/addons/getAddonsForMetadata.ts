import type { ModuleOutput, RenderType } from "@/addons/types";

const modules = import.meta.glob("../../addons/metadata-key/**/index.ts");

export const getAddonsForMetadata = async (
  metadata: { key: number; json: any }[],
  type: RenderType,
): Promise<ModuleOutput[]> => {
  const results: ModuleOutput[] = [];

  for (const item of metadata) {
    const matched = Object.entries(modules).find(([key]) =>
      key.endsWith(`${item.key}/index.ts`),
    );

    if (!matched) {
      console.warn(`No addon for key ${item.key}`);
      continue;
    }

    const [, loader] = matched;
    const module = await loader();
    const { config, render } = (module as any).default;

    if (config.supportedTypes.includes(type)) {
      const result = render({ type, data: item });
      results.push(result);
    }
  }

  return results;
};
