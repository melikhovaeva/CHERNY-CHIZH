import type { JSX } from 'react';

export interface SafeHtmlContentProps {
  html: string;
  className?: string;
  as?: 'div' | 'article' | 'section' | 'span';
}

export function SafeHtmlContent({
  html,
  className,
  as: Wrapper = 'div',
}: SafeHtmlContentProps): JSX.Element | null {
  if (!html) {
    return null;
  }

  return (
    <Wrapper
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
