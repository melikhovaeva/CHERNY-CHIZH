import {
  type ContentBlock,
  type ImageBlock,
  type VideoBlock,
  type FileBlock,
  type UploadMediaResponse,
  normalizeContentBlocks,
  useGetArticleAdminQuery,
  useUpdateArticleMutation,
  useUploadArticleMediaMutation,
} from '@/entities/article';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ARTICLE_STATUS, BLOCK_TYPE, type BlockTypeValue } from '../config';

function newBlockId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `b-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function emptyBlock(type: BlockTypeValue): ContentBlock {
  const id = newBlockId();
  switch (type) {
    case BLOCK_TYPE.TEXT:
      return { id, type: BLOCK_TYPE.TEXT, html: '<p><br></p>' };
    case BLOCK_TYPE.IMAGE:
      return { id, type: BLOCK_TYPE.IMAGE, url: '', alt: '' };
    case BLOCK_TYPE.VIDEO:
      return { id, type: BLOCK_TYPE.VIDEO, url: '' };
    case BLOCK_TYPE.FILE:
      return { id, type: BLOCK_TYPE.FILE, url: '', name: '', size: 0 };
  }
}

export function useArticleEditor(articleSlug: string) {
  const {
    data: article,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetArticleAdminQuery(articleSlug);

  const [updateArticle, { isLoading: isSaving }] = useUpdateArticleMutation();
  const [uploadArticleMedia] = useUploadArticleMediaMutation();
  const [uploadingBlockId, setUploadingBlockId] = useState<string | null>(
    null,
  );

  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

  const initializedRef = useRef(false);
  const slugRef = useRef(articleSlug);

  useEffect(() => {
    if (slugRef.current !== articleSlug) {
      slugRef.current = articleSlug;
      initializedRef.current = false;
      setBlocks([]);
      setIsDirty(false);
      setEditingBlockId(null);
    }
  }, [articleSlug]);

  useEffect(() => {
    if (!article || initializedRef.current) return;
    initializedRef.current = true;
    setBlocks(normalizeContentBlocks(article.contentBlocks));
  }, [article]);

  const addBlock = useCallback(
    (
      type: BlockTypeValue,
      relative?: { after?: string; before?: string },
    ) => {
      const block = emptyBlock(type);
      setBlocks((prev) => {
        if (relative?.before) {
          const idx = prev.findIndex((b) => b.id === relative.before);
          if (idx === -1) return [...prev, block];
          const next = [...prev];
          next.splice(idx, 0, block);
          return next;
        }
        if (relative?.after) {
          const idx = prev.findIndex((b) => b.id === relative.after);
          if (idx === -1) return [...prev, block];
          const next = [...prev];
          next.splice(idx + 1, 0, block);
          return next;
        }
        return [...prev, block];
      });
      setIsDirty(true);
      setEditingBlockId(block.id);
    },
    [],
  );

  const updateBlock = useCallback((id: string, patch: Partial<ContentBlock>) => {
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        return { ...b, ...patch } as ContentBlock;
      }),
    );
    setIsDirty(true);
  }, []);

  const deleteBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    setEditingBlockId((e) => (e === id ? null : e));
    setIsDirty(true);
  }, []);

  const moveBlock = useCallback((id: string, dir: 'up' | 'down') => {
    setBlocks((prev) => {
      const i = prev.findIndex((b) => b.id === id);
      if (i === -1) return prev;
      const j = dir === 'up' ? i - 1 : i + 1;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j]!, next[i]!];
      return next;
    });
    setIsDirty(true);
  }, []);

  const save = useCallback(async () => {
    await updateArticle({
      slug: articleSlug,
      data: { contentBlocks: blocks },
    }).unwrap();
    setIsDirty(false);
  }, [articleSlug, blocks, updateArticle]);

  const publish = useCallback(async () => {
    await updateArticle({
      slug: articleSlug,
      data: {
        contentBlocks: blocks,
        status: ARTICLE_STATUS.PUBLISHED,
      },
    }).unwrap();
    setIsDirty(false);
  }, [articleSlug, blocks, updateArticle]);

  const unpublish = useCallback(async () => {
    await updateArticle({
      slug: articleSlug,
      data: { status: ARTICLE_STATUS.UNPUBLISHED },
    }).unwrap();
  }, [articleSlug, updateArticle]);

  const applyMediaToBlock = useCallback(
    (blockId: string, blockType: BlockTypeValue, res: UploadMediaResponse) => {
      if (blockType === BLOCK_TYPE.IMAGE) {
        updateBlock(blockId, {
          type: BLOCK_TYPE.IMAGE,
          url: res.url,
          alt: res.name,
        } as Partial<ImageBlock>);
      } else if (blockType === BLOCK_TYPE.VIDEO) {
        updateBlock(blockId, {
          type: BLOCK_TYPE.VIDEO,
          url: res.url,
          title: res.name,
        } as Partial<VideoBlock>);
      } else {
        updateBlock(blockId, {
          type: BLOCK_TYPE.FILE,
          url: res.url,
          name: res.name,
          size: res.size,
        } as Partial<FileBlock>);
      }
    },
    [updateBlock],
  );

  const uploadBlockMedia = useCallback(
    async (blockId: string, file: File) => {
      const block = blocks.find((b) => b.id === blockId);
      if (!block) return;
      setUploadingBlockId(blockId);
      try {
        const res = await uploadArticleMedia({
          slug: articleSlug,
          file,
        }).unwrap();
        applyMediaToBlock(blockId, block.type, res);
      } finally {
        setUploadingBlockId(null);
      }
    },
    [articleSlug, blocks, uploadArticleMedia, applyMediaToBlock],
  );

  const isPublished = article?.status?.code === ARTICLE_STATUS.PUBLISHED;

  return {
    article,
    blocks,
    isLoading,
    isError,
    error,
    refetch,
    isDirty,
    isSaving,
    uploadingBlockId,
    editingBlockId,
    setEditingBlockId,
    isPublished,
    addBlock,
    updateBlock,
    deleteBlock,
    moveBlock,
    save,
    publish,
    unpublish,
    uploadBlockMedia,
  };
}
