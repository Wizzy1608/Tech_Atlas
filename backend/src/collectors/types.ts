export type Resource = {
  title: string;
  description: string | null;
  url: string;
  source_type: string;
  source_name: string;
  tags: string[];
  category: string | null;
  difficulty: string | null;
  metadata: Record<string, unknown>;
};

export type Fetcher = (config: Record<string, unknown>) => Promise<Resource[]>;
