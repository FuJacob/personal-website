import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import {
  WORD_ID_PATTERN,
  WORD_STYLES,
  isWordStyle,
  type StyledWords,
} from '../src/wordStyles.js'

// Reads UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.
const redis = Redis.fromEnv()

// Each visitor gets 30 stamps a minute, which is plenty for play and cheap to abuse-proof.
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '1 m'),
  prefix: 'word-styles:ratelimit',
})

/** One Redis set per style, holding the IDs of every word with that style. */
const keyFor = (style: string) => `word-styles:${style}`

/** Stops the sets from growing without bound if someone scripts around the rate limit. */
const MAX_WORDS_PER_STYLE = 2000

/** Returns every styled word so the page can paint them on load. */
export async function GET() {
  const pipeline = redis.pipeline()
  for (const style of WORD_STYLES) pipeline.smembers(keyFor(style))
  const sets = await pipeline.exec<string[][]>()

  const body = Object.fromEntries(WORD_STYLES.map((style, index) => [style, sets[index]])) as StyledWords
  return Response.json(body, {
    // Let Vercel's edge cache serve repeat loads for a few seconds.
    headers: { 'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=30' },
  })
}

/** Adds one style to one word. Styles are permanent, so there is no remove. */
export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const { success } = await ratelimit.limit(ip)
  if (!success) return Response.json({ error: 'slow down a little' }, { status: 429 })

  const body: unknown = await request.json().catch(() => null)
  const { wordId, style } = (body ?? {}) as { wordId?: unknown; style?: unknown }

  if (typeof wordId !== 'string' || !WORD_ID_PATTERN.test(wordId) || !isWordStyle(style)) {
    return Response.json({ error: 'invalid word or style' }, { status: 400 })
  }

  const key = keyFor(style)
  if ((await redis.scard(key)) >= MAX_WORDS_PER_STYLE) {
    return Response.json({ error: 'the page is full' }, { status: 409 })
  }

  // SADD is atomic and ignores repeats, so simultaneous clicks on the same word are safe.
  await redis.sadd(key, wordId)
  return new Response(null, { status: 204 })
}
