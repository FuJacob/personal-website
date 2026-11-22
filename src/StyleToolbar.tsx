import { usePaint } from './paint'
import type { WordStyle } from './wordStyles'

const tools: { style: WordStyle; label: string }[] = [
  { style: 'highlight', label: 'highlight' },
  { style: 'strikethrough', label: 'strike' },
  { style: 'bold', label: 'bold' },
]

/** Lets visitors pick a style, then click any word on the page to stamp it for everyone. */
export function StyleToolbar() {
  const { tool, setTool } = usePaint()

  return (
    <section className="mt-6" aria-labelledby="style-toolbar-label">
      <h2 id="style-toolbar-label">leave a mark on any word:</h2>
      <div role="toolbar" aria-label="Word styles" className="mt-2 flex flex-wrap gap-2">
        {tools.map(({ style, label }) => (
          <button
            key={style}
            type="button"
            className="style-tool"
            aria-pressed={tool === style}
            onClick={() => setTool(tool === style ? null : style)}
          >
            <span className={`word-${style}`}>{label}</span>
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs opacity-60">
        {tool === null
          ? 'pick a tool, then click a word. everyone sees it, and it stays.'
          : 'click any word. press esc or the tool again to stop.'}
      </p>
    </section>
  )
}
