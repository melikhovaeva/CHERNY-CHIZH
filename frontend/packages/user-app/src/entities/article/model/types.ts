export interface Article {
  id: number;
  title: string;
  slug: string;
  description: string;
  imagePreview: string | null;
  status: { code: string; label: string } | null;
  tags: Array<{ id: number; code: string; label: string; order: number }>;
  contentHtml: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleMinimal {
  id: number;
  title: string;
  slug: string;
  description: string;
  imagePreview: string | null;
}

export interface HomeLibraryTag {
  id: number;
  code: string;
  label: string;
  order: number;
}

export interface HomeLibraryResponse {
  tags: HomeLibraryTag[];
  groups: Array<{ tagId: number; articles: ArticleMinimal[] }>;
}
