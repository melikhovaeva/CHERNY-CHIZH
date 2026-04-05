import type { JSX } from 'react';
import { SafeHtmlContent } from '@/shared/ui';
import type { ContentBlock } from '../../api/articleAdmin.api';
import { CONTENT_BLOCK_TYPE } from '../../config/contentBlockTypes';
import { normalizeContentBlocks } from '../../lib/normalizeContentBlocks';
import { resolveApiAssetUrl } from '../../lib/resolveApiAssetUrl';

export interface ArticleContentPreviewProps {
  /** Сырой массив блоков из API или уже нормализованный список. */
  blocks: unknown;
  className?: string;
  as?: 'div' | 'article' | 'section';
}

export function ArticleContentPreview({
  blocks: rawBlocks,
  className,
  as: Wrapper = 'div',
}: ArticleContentPreviewProps): JSX.Element | null {
  const blocks = normalizeContentBlocks(rawBlocks);
  if (blocks.length === 0) {
    return null;
  }

  return (
    <Wrapper className={className}>
      {blocks.map((block) => (
        <ArticleContentBlockView key={block.id} block={block} />
      ))}
    </Wrapper>
  );
}

function ArticleContentBlockView({
  block,
}: {
  block: ContentBlock;
}): JSX.Element | null {
  switch (block.type) {
    case CONTENT_BLOCK_TYPE.TEXT:
      return <SafeHtmlContent html={block.html} />;
    case CONTENT_BLOCK_TYPE.IMAGE: {
      if (!block.url) return null;
      const src = resolveApiAssetUrl(block.url);
      return (
        <figure>
          <img src={src} alt={block.alt} />
          {block.caption ? <figcaption>{block.caption}</figcaption> : null}
        </figure>
      );
    }
    case CONTENT_BLOCK_TYPE.VIDEO: {
      if (!block.url) return null;
      const src = resolveApiAssetUrl(block.url);
      return (
        <figure data-block-type="video">
          <video src={src} controls preload="metadata" />
          {block.title ? <figcaption>{block.title}</figcaption> : null}
        </figure>
      );
    }
    case CONTENT_BLOCK_TYPE.FILE: {
      if (!block.url) return null;
      const href = resolveApiAssetUrl(block.url);
      return (
        <p>
          <a href={href} download={block.name}>
            {block.name}
          </a>
        </p>
      );
    }
    default:
      return null;
  }
}
