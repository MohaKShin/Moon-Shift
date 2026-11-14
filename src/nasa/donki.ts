export interface SolarEvent {
  kind: 'flare' | 'cme'
  date: string // ISO
  title: string
  detail: string
  relevance: string
  link?: string
}

export interface SolarSummary {
  latest: SolarEvent
  flares: number
  cmes: number
  days: number
}

const BASE = 'https://ccmc.gsfc.nasa.gov/DONKI-API/get'
const DAYS = 60
const WINDOW = 30

const DAY_MS = 86400000
const ymd = (d: Date) => d.toISOString().slice(0, 10)

async function getWindow(kind: 'FLR' | 'CME', endOffsetDays: number, signal: AbortSignal): Promise<unknown[]> {
  const end = new Date(Date.now() - endOffsetDays * DAY_MS)
  const start = new Date(end.getTime() - (WINDOW - 1) * DAY_MS)
  const url = `${BASE}/${kind}?startDate=${ymd(start)}&endDate=${ymd(end)}`
  const res = await fetch(url, { signal })
  if (res.status === 429) throw new Error('NASA is busy right now (too many requests). Try again in a minute.')
  if (!res.ok) throw new Error(`NASA answered with status ${res.status}`)
  const text = (await res.text()).trim()
  if (!text) return [] // no events in this window
  let data: unknown
  try { data = JSON.parse(text) } catch { throw new Error('NASA sent a reply we could not read.') }
  return Array.isArray(data) ? data : []
}

/** Both 30-day windows for one event type; one window failing does not hide the other. */
async function getJson(kind: 'FLR' | 'CME', signal: AbortSignal) {
  const parts = await Promise.allSettled([getWindow(kind, 0, signal), getWindow(kind, WINDOW, signal)])
  const ok = parts.filter((p): p is PromiseFulfilledResult<unknown[]> => p.status === 'fulfilled')
  if (ok.length === 0) throw (parts[0] as PromiseRejectedResult).reason
  return { items: ok.flatMap((p) => p.value), windows: ok.length }
}

interface Flare { classType?: string; peakTime?: string; beginTime?: string; sourceLocation?: string; link?: string }
interface Cme {
  startTime?: string; sourceLocation?: string; note?: string; link?: string
  cmeAnalyses?: { speed?: number; type?: string }[] | null
}

function flareRelevance(cls: string) {
  const c = cls.charAt(0).toUpperCase()
  if (c === 'X') return 'An X-class flare is the strongest kind. Big ones can mess with radio signals and satellites, and astronauts may shelter.'
  if (c === 'M') return 'An M-class flare is medium-sized. It can cause short radio blackouts near the poles of Earth.'
  return 'A small flare like this is common and usually harmless. On the Moon there is no air, so crews still watch the Sun closely.'
}

export async function fetchSolarSummary(signal: AbortSignal): Promise<SolarSummary> {
  const [fl, cm] = await Promise.allSettled([getJson('FLR', signal), getJson('CME', signal)])
  if (fl.status === 'rejected' && cm.status === 'rejected') throw fl.reason
  const flares = (fl.status === 'fulfilled' ? fl.value.items : []) as Flare[]
  const cmes = (cm.status === 'fulfilled' ? cm.value.items : []) as Cme[]
  const windows = Math.max(fl.status === 'fulfilled' ? fl.value.windows : 0, cm.status === 'fulfilled' ? cm.value.windows : 0)

  const events: SolarEvent[] = []
  for (const f of flares) {
    const date = f.peakTime || f.beginTime
    if (!date) continue
    const cls = f.classType || 'unknown'
    events.push({
      kind: 'flare',
      date,
      title: `Solar flare (class ${cls})`,
      detail: f.sourceLocation ? `Seen on the Sun near ${f.sourceLocation}.` : 'A bright burst of light from the Sun.',
      relevance: flareRelevance(cls),
      link: f.link,
    })
  }
  for (const c of cmes) {
    if (!c.startTime) continue
    const speed = c.cmeAnalyses?.[0]?.speed
    events.push({
      kind: 'cme',
      date: c.startTime,
      title: 'Coronal mass ejection (CME)',
      detail: speed ? `A cloud of particles moving at about ${Math.round(speed)} km/s.` : 'A big cloud of particles thrown out by the Sun.',
      relevance: 'A CME is a giant cloud of charged particles. It can reach Earth in 1 to 4 days and sometimes causes space weather storms.',
      link: c.link,
    })
  }
  if (events.length === 0) throw new Error('No solar events were reported in this period.')
  events.sort((a, b) => +new Date(b.date) - +new Date(a.date))
  return { latest: events[0], flares: flares.length, cmes: cmes.length, days: Math.min(DAYS, windows * WINDOW) }
}
