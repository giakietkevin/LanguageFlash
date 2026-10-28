/** Inline style for a staggered entrance: 70ms between siblings. */
export const stagger = (i: number) => ({ "--d": `${i * 70}ms` }) as React.CSSProperties;
