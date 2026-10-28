/** The LanguageFlash mark: two index cards, the front one with its tab raised. */
export function Mark({ size = 28, title }: { size?: number; title?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <path d="M4 9h24v4H4z" fill="currentColor" opacity="0.45" />
      <path d="M8 13l2-5h9l2 5h7v15H4V13z" fill="currentColor" />
    </svg>
  );
}
