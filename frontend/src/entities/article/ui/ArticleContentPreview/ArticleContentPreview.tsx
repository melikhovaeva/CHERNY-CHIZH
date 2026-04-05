import type { JSX } from 'react';
import { formatFileSize } from '@/shared/lib/formatFileSize';
import { SafeHtmlContent } from '@/shared/ui';
import { FileAttachmentCard } from '@/shared/ui/components/FileAttachmentCard';
import type { ContentBlock } from '../../api/articleAdmin.api';
import { CONTENT_BLOCK_TYPE } from '../../config/contentBlockTypes';
import { normalizeContentBlocks } from '../../lib/normalizeContentBlocks';
import { resolveApiAssetUrl } from '../../lib/resolveApiAssetUrl';
import { resolveVideoEmbed } from '../../lib/resolveVideoEmbed';
import previewStyles from './ArticleContentPreview.module.scss';

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
        <figure className={previewStyles.imageFigure}>
          <img
            className={previewStyles.image}
            src={src}
            alt={block.alt}
          />
          {block.caption ? (
            <figcaption className={previewStyles.imageCaption}>
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    }
    case CONTENT_BLOCK_TYPE.VIDEO: {
      if (!block.url) return null;
      const { embedType, embedUrl } = resolveVideoEmbed(block.url);
      const isEmbed = embedType === 'youtube' || embedType === 'vimeo';
      return (
        <figure className={previewStyles.imageFigure} data-block-type='video'>
          {isEmbed ? (
            <iframe
              className={previewStyles.videoEmbed}
              src={embedUrl}
              title={block.title ?? 'Видео'}
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            />
          ) : (
            <video
              className={previewStyles.image}
              src={resolveApiAssetUrl(block.url)}
              controls
              preload='metadata'
            />
          )}
          {block.title ? (
            <figcaption className={previewStyles.imageCaption}>
              {block.title}
            </figcaption>
          ) : null}
        </figure>
      );
    }
    case CONTENT_BLOCK_TYPE.FILE: {
      if (!block.url) return null;
      const href = resolveApiAssetUrl(block.url);
      return (
        <div className={previewStyles.fileAttachmentWrap}>
          <FileAttachmentCard
            href={href}
            fileName={block.name || 'Файл'}
            fileSizeLabel={formatFileSize(block.size)}
            download={block.name || undefined}
          />
        </div>
      );
    }
    default:
      return null;
  }
}
