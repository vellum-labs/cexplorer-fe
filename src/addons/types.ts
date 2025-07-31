export type RenderType = "embed-view" | "full-view" | "table-column";

export interface ModuleInput {
  type: RenderType;
  data: any;
}

export interface ModuleOutput {
  component: React.ReactNode | null;
}

export interface ModuleConfig {
  supportedTypes: RenderType[];
  displayName: string;
}
