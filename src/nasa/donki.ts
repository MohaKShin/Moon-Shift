/**
 * NASA DONKI (Space Weather Database Of Notifications, Knowledge, Information).
 * It reports real events on the Sun. It does NOT measure radiation on the Moon.
 */
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

const API_KEY = (import.meta.env.VITE_NASA_API_KEY as string | undefined)?.trim() || 'DEMO_KEY'
const BASE = 'https://api.nasa.gov/DONKI'
const DAYS = 60

export const usingDemoKey = API_KEY === 'DEMO_KEY'

const ymd = (d: Date) => d.toISOString().slice(0, 10)

async function getJson(kind: 'FLR' | 'CME', signal: AbortSignal): Promise<unknown[]> {
  const end = new Date()
  const start = new Date(end.getTime() - DAYS * 86400000)
  const url = `${BASE}/${kind}?startDate=${ymd(start)}&endDate=${ymd(end)}&api_key=${encodeURIComponent(API_KEY)}`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`NASA answered with status ${res.status}`)
  const data: unknown = await res.json()
  return Array.isArray(data) ? data : []
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
  const flares = (fl.status === 'fulfilled' ? fl.value : []) as Flare[]
  const cmes = (cm.status === 'fulfilled' ? cm.value : []) as Cme[]

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
  return { latest: events[0], flares: flares.length, cmes: cmes.length, days: DAYS }
}
