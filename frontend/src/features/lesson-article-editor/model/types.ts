import type {
  ContentBlock,
  FileBlock,
  ImageBlock,
  TextBlock,
  VideoBlock,
} from '@/entities/article';

export type {
  ContentBlock,
  FileBlock,
  ImageBlock,
  TextBlock,
  VideoBlock,
};

export interface EditorState {
  blocks: ContentBlock[];
  isDirty: boolean;
  editingBlockId: string | null;
}
