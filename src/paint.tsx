import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { WORD_STYLES, emptyStyledWords, type StyledWords, type WordStyle } from './wordStyles'

type PaintContextValue = {
  /** The toolbar tool in use, or null when visitors are just reading. */
  tool: WordStyle | null
  setTool: (tool: WordStyle | null) => void
  /** Which styles a word has, keyed by word ID. */
  stylesFor: (wordId: string) => WordStyle[]
  applyTool: (wordId: string) => void
}

const PaintContext = createContext<PaintContextValue | null>(null)

// eslint-disable-next-line react/only-export-components -- the hook belongs with its provider
export function usePaint() {
  const value = use(PaintContext)
  if (value === null) throw new Error('usePaint must be used inside <PaintProvider>')
  return value
}

/** Loads everyone's styled words once, and saves new ones as visitors click. */
export function PaintProvider({ children }: { children: ReactNode }) {
  const [tool, setTool] = useState<WordStyle | null>(null)
  const [styledWords, setStyledWords] = useState<StyledWords>(emptyStyledWords)

  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/styles', { signal: controller.signal })
      .then((response) => (response.ok ? (response.json() as Promise<StyledWords>) : null))
      .then((saved) => {
        if (saved === null) return
        // Merge rather than replace, in case someone clicked before the load finished.
        setStyledWords((current) => mergeStyledWords(current, saved))
      })
      // The page still works without the API (for example under plain `vite`), just unsaved.
      .catch(() => {})

    return () => controller.abort()
  }, [])

  // Esc puts the tool down.
  useEffect(() => {
    const putDownTool = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setTool(null)
    }
    window.addEventListener('keydown', putDownTool)
    return () => window.removeEventListener('keydown', putDownTool)
  }, [])

  const wordStyles = useMemo(() => {
    const byWord = new Map<string, WordStyle[]>()
    for (const style of WORD_STYLES) {
      for (const wordId of styledWords[style]) {
        byWord.set(wordId, [...(byWord.get(wordId) ?? []), style])
      }
    }
    return byWord
  }, [styledWords])

  const stylesFor = useCallback((wordId: string) => wordStyles.get(wordId) ?? [], [wordStyles])

  const applyTool = useCallback(
    (wordId: string) => {
      if (tool === null || styledWords[tool].includes(wordId)) return

      // Show the style right away; styles are permanent, so there is nothing to undo locally.
      setStyledWords((current) => ({ ...current, [tool]: [...current[tool], wordId] }))

      fetch('/api/styles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wordId, style: tool }),
      }).catch(() => {})
    },
    [tool, styledWords],
  )

  const value = useMemo(
    () => ({ tool, setTool, stylesFor, applyTool }),
    [tool, stylesFor, applyTool],
  )

  return <PaintContext value={value}>{children}</PaintContext>
}

function mergeStyledWords(a: StyledWords, b: StyledWords): StyledWords {
  const merged = emptyStyledWords()
  for (const style of WORD_STYLES) {
    merged[style] = [...new Set([...a[style], ...(b[style] ?? [])])]
  }
  return merged
}

type PaintableProps = {
  /** Stable name for this block of text. Word IDs are `<id>:<word index>`. */
  id: string
  children: string
}

/** Splits text on spaces so each word can be styled on its own. */
export function Paintable({ id, children }: PaintableProps) {
  const { tool, stylesFor, applyTool } = usePaint()

  return splitWords(children).map((token, tokenIndex) => {
    if (token.wordIndex === null) return token.text

    const wordId = `${id}:${token.wordIndex}`
    const classes = ['word', ...stylesFor(wordId).map((style) => `word-${style}`)]

    return (
      <span
        key={tokenIndex}
        className={classes.join(' ')}
        onClick={
          tool === null
            ? undefined
            : (event) => {
                // Inside a link, style the word instead of following it.
                event.preventDefault()
                applyTool(wordId)
              }
        }
      >
        {token.text}
      </span>
    )
  })
}

/** Tokens in order; whitespace runs get a null word index so they render as plain text. */
function splitWords(text: string) {
  const tokens: { text: string; wordIndex: number | null }[] = []
  let wordIndex = 0
  for (const piece of text.split(/(\s+)/)) {
    if (piece === '') continue
    if (/^\s+$/.test(piece)) {
      tokens.push({ text: piece, wordIndex: null })
    } else {
      tokens.push({ text: piece, wordIndex })
      wordIndex += 1
    }
  }
  return tokens
}
