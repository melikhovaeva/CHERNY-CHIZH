export type VideoEmbedType = 'youtube' | 'vimeo' | 'direct';

export interface VideoEmbedInfo {
  embedType: VideoEmbedType;
  embedUrl: string;
}

const YT_PATTERN =
  /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
const VIMEO_PATTERN = /(?:vimeo\.com\/)(\d+)/;

/**
 * Определяет тип видео-URL и возвращает embed-URL для iframe (YouTube, Vimeo)
 * или исходный URL для прямого воспроизведения (MP4, WebM и т.д.).
 */
export function resolveVideoEmbed(url: string): VideoEmbedInfo {
  if (!url) return { embedType: 'direct', embedUrl: '' };

  const ytMatch = url.match(YT_PATTERN);
  if (ytMatch?.[1]) {
    return {
      embedType: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`,
    };
  }

  const vimeoMatch = url.match(VIMEO_PATTERN);
  if (vimeoMatch?.[1]) {
    return {
      embedType: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  return { embedType: 'direct', embedUrl: url };
}

/** Возвращает true, если URL является embed-совместимым (YouTube или Vimeo). */
export function isEmbedUrl(url: string): boolean {
  return YT_PATTERN.test(url) || VIMEO_PATTERN.test(url);
}
