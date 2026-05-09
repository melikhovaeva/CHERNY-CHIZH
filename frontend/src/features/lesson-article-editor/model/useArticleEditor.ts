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
} from "@/entities/article";
import { useCallback, useEffect, useRef, useState } from "react";
import { ARTICLE_STATUS, BLOCK_TYPE, type BlockTypeValue } from "../config";

function newBlockId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `b-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
  );
}

function emptyBlock(type: BlockTypeValue): ContentBlock {
  const id = newBlockId();
  switch (type) {
    case BLOCK_TYPE.TEXT:
      return { id, type: BLOCK_TYPE.TEXT, html: "<p><br></p>" };
    case BLOCK_TYPE.IMAGE:
      return { id, type: BLOCK_TYPE.IMAGE, url: "", alt: "" };
    case BLOCK_TYPE.VIDEO:
      return { id, type: BLOCK_TYPE.VIDEO, url: "" };
    case BLOCK_TYPE.FILE:
      return { id, type: BLOCK_TYPE.FILE, url: "", name: "", size: 0 };
  }
}

/**
 * @param articleSlug  Slug of an existing article, or null/undefined for a brand-new lesson
 *                     whose article has not been created on the server yet.
 * @param onBeforeSave Called the first time a save/publish/media-upload is attempted when
 *                     articleSlug is absent. Must create the lesson (and its parent stage) on
 *                     the server and return the newly-created article slug.
 */
export function useArticleEditor(
  articleSlug: string | null | undefined,
  onBeforeSave?: () => Promise<string>,
) {
  const {
    data: article,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetArticleAdminQuery(articleSlug ?? "", { skip: !articleSlug });

  const [updateArticle, { isLoading: isSaving }] = useUpdateArticleMutation();
  const [uploadArticleMedia] = useUploadArticleMediaMutation();
  const [uploadingBlockId, setUploadingBlockId] = useState<string | null>(null);

  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

  const initializedRef = useRef(false);

  // Ref so addBlock can trigger cascade creation without depending on onBeforeSave
  const onBeforeSaveRef = useRef(onBeforeSave);
  onBeforeSaveRef.current = onBeforeSave;

  /**
   * The slug that will actually be sent to the API.
   * - Starts from the prop value (may be empty for new lessons).
   * - Filled in by resolveSlug() after cascade creation completes.
   * - Kept in a ref so save/publish callbacks always see the latest value
   *   without needing it as a dependency.
   */
  const effectiveSlugRef = useRef<string>(articleSlug ?? "");

  // ── React to prop slug changes ─────────────────────────────────────────────
  useEffect(() => {
    const prev = effectiveSlugRef.current;
    const next = articleSlug ?? "";

    if (prev === next) return;

    if (prev && next && prev !== next) {
      // User navigated from one existing lesson to another → full reset
      effectiveSlugRef.current = next;
      initializedRef.current = false;
      setBlocks([]);
      setIsDirty(false);
      setEditingBlockId(null);
    } else if (!prev && next) {
      // The slug just became available after cascade creation.
      // Keep the blocks the user has already typed — only update the ref.
      // Mark as initialized so the freshly-created (empty) article loaded
      // from the server does not overwrite the user's local blocks.
      effectiveSlugRef.current = next;
      initializedRef.current = true;
    } else {
      // Any other transition (slug cleared, etc.) → reset
      effectiveSlugRef.current = next;
      initializedRef.current = false;
      setBlocks([]);
      setIsDirty(false);
      setEditingBlockId(null);
    }
  }, [articleSlug]);

  // ── Initialise blocks from server when article first loads ─────────────────
  useEffect(() => {
    if (!article || initializedRef.current) return;
    initializedRef.current = true;
    setBlocks(normalizeContentBlocks(article.contentBlocks));
  }, [article]);

  // ── Block manipulation ─────────────────────────────────────────────────────
  const addBlock = useCallback(
    (type: BlockTypeValue, relative?: { after?: string; before?: string }) => {
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

      // Eagerly start cascade creation (step → lesson → article) when the user
      // adds the first block to a new lesson. By the time they upload media the
      // slug will already be resolved, eliminating the race condition between
      // cascade creation and media upload.
      if (!effectiveSlugRef.current && onBeforeSaveRef.current) {
        // Mark as initialized before cascade so the empty server article that
        // loads after creation does not overwrite the user's local blocks —
        // regardless of whether .then() runs before or after React commits.
        initializedRef.current = true;
        void onBeforeSaveRef.current().then((slug) => {
          if (!effectiveSlugRef.current) effectiveSlugRef.current = slug;
        });
      }
    },
    [],
  );

  const updateBlock = useCallback(
    (id: string, patch: Partial<ContentBlock>) => {
      setBlocks((prev) =>
        prev.map((b) => {
          if (b.id !== id) return b;
          return { ...b, ...patch } as ContentBlock;
        }),
      );
      setIsDirty(true);
    },
    [],
  );

  const deleteBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    setEditingBlockId((e) => (e === id ? null : e));
    setIsDirty(true);
  }, []);

  const moveBlock = useCallback((id: string, dir: "up" | "down") => {
    setBlocks((prev) => {
      const i = prev.findIndex((b) => b.id === id);
      if (i === -1) return prev;
      const j = dir === "up" ? i - 1 : i + 1;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j]!, next[i]!];
      return next;
    });
    setIsDirty(true);
  }, []);

  // ── Slug resolution (lazy cascade creation) ────────────────────────────────
  /**
   * Returns the effective article slug to use for an API call.
   * If the slug is not yet known (new lesson), calls onBeforeSave() to trigger
   * the cascade creation of the stage + lesson + article on the server.
   */
  const resolveSlug = useCallback(async (): Promise<string> => {
    if (effectiveSlugRef.current) return effectiveSlugRef.current;

    if (!onBeforeSave) {
      throw new Error("Нет slug статьи и нет onBeforeSave");
    }

    const slug = await onBeforeSave();
    effectiveSlugRef.current = slug;
    return slug;
  }, [onBeforeSave]);

  // ── API operations ─────────────────────────────────────────────────────────
  const save = useCallback(async () => {
    const slug = await resolveSlug();
    await updateArticle({
      slug,
      data: { contentBlocks: blocks },
    }).unwrap();
    setIsDirty(false);
  }, [blocks, updateArticle, resolveSlug]);

  const publish = useCallback(async () => {
    const slug = await resolveSlug();
    await updateArticle({
      slug,
      data: {
        contentBlocks: blocks,
        status: ARTICLE_STATUS.PUBLISHED,
      },
    }).unwrap();
    setIsDirty(false);
  }, [blocks, updateArticle, resolveSlug]);

  const unpublish = useCallback(async () => {
    const slug = await resolveSlug();
    await updateArticle({
      slug,
      data: { status: ARTICLE_STATUS.UNPUBLISHED },
    }).unwrap();
  }, [updateArticle, resolveSlug]);

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
          sourceType: 'file',
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
        const slug = await resolveSlug();
        const res = await uploadArticleMedia({ slug, file }).unwrap();
        applyMediaToBlock(blockId, block.type, res);
      } finally {
        setUploadingBlockId(null);
      }
    },
    [blocks, uploadArticleMedia, applyMediaToBlock, resolveSlug],
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
