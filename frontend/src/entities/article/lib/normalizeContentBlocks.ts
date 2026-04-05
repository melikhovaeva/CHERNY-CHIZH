import { CONTENT_BLOCK_TYPE } from '../config/contentBlockTypes';
import type {
  ContentBlock,
  FileBlock,
  ImageBlock,
  TextBlock,
  VideoBlock,
} from '../api/articleAdmin.api';

function newBlockId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `b-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
  );
}

/** Приводит ответ API к типам редактора / предпросмотра. */
export function normalizeContentBlocks(raw: unknown): ContentBlock[] {
  if (!Array.isArray(raw)) return [];
  const out: ContentBlock[] = [];
  for (const item of raw) {
    if (typeof item !== 'object' || item === null) continue;
    const b = item as Record<string, unknown>;
    const id = typeof b.id === 'string' ? b.id : newBlockId();
    const type = b.type;
    if (type === CONTENT_BLOCK_TYPE.TEXT) {
      out.push({
        id,
        type: CONTENT_BLOCK_TYPE.TEXT,
        html: typeof b.html === 'string' ? b.html : '',
      } satisfies TextBlock);
    } else if (type === CONTENT_BLOCK_TYPE.IMAGE) {
      out.push({
        id,
        type: CONTENT_BLOCK_TYPE.IMAGE,
        url: typeof b.url === 'string' ? b.url : '',
        alt: typeof b.alt === 'string' ? b.alt : '',
        ...(typeof b.caption === 'string' ? { caption: b.caption } : {}),
      } satisfies ImageBlock);
    } else if (type === CONTENT_BLOCK_TYPE.VIDEO) {
      out.push({
        id,
        type: CONTENT_BLOCK_TYPE.VIDEO,
        url: typeof b.url === 'string' ? b.url : '',
        ...(typeof b.title === 'string' ? { title: b.title } : {}),
      } satisfies VideoBlock);
    } else if (type === CONTENT_BLOCK_TYPE.FILE) {
      out.push({
        id,
        type: CONTENT_BLOCK_TYPE.FILE,
        url: typeof b.url === 'string' ? b.url : '',
        name: typeof b.name === 'string' ? b.name : '',
        size: typeof b.size === 'number' ? b.size : 0,
      } satisfies FileBlock);
    }
  }
  return out;
}
