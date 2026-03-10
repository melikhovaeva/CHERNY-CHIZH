import type { JSX } from "react";

export interface SafeHtmlContentProps {
  /** Pre-rendered HTML string (e.g. from API). Must be sanitized on the server. */
  html: string;
  /** Optional class name for the wrapper element. */
  className?: string;
  /** Optional wrapper element. Default is "div". */
  as?: "div" | "article" | "section" | "span";
}

/**
 * Embeds server-rendered HTML without client-side processing.
 * Sanitization must be done on the backend; this component only injects the markup.
 */
export function SafeHtmlContent({
  html,
  className,
  as: Wrapper = "div",
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
