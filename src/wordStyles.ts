/** The styles visitors can stamp onto a word. Shared by the page and the /api/styles route. */
export const WORD_STYLES = ['highlight', 'strikethrough', 'bold'] as const

export type WordStyle = (typeof WORD_STYLES)[number]

/** Every word ID that has each style, as stored in Redis. */
export type StyledWords = Record<WordStyle, string[]>

/**
 * A word ID is `<block>:<index>`, such as `bio-1:7`, where the index counts words in that block.
 * The API rejects anything else so visitors can't fill Redis with junk keys.
 */
export const WORD_ID_PATTERN = /^[a-z0-9-]{1,48}:\d{1,3}$/

export function isWordStyle(value: unknown): value is WordStyle {
  return typeof value === 'string' && (WORD_STYLES as readonly string[]).includes(value)
}

export function emptyStyledWords(): StyledWords {
  return { highlight: [], strikethrough: [], bold: [] }
}
