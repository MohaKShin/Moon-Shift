import { EVENTS } from './events'
import {
  RESOURCE_KEYS,
  type Arrivals, type Effects, type GameEvent, type GameState,
  type HistoryEntry, type PendingEffect, type ResourceKey, type Resources,
} from './types'

export const TOTAL_DAYS = 7
export const START_RESOURCES: Resources = { water: 65, energy: 65, safety: 65 }
/** Everyday life on the outpost slowly uses water and power. */
export const DAILY_UPKEEP: Effects = { water: -8, energy: -8, safety: -2 }
export const LOW_LEVEL = 25

export const clampResource = (n: number) => Math.max(0, Math.min(100, Math.round(n)))

export function applyEffects(r: Resources, effects: Effects): Resources {
  const next = { ...r }
  for (const k of RESOURCE_KEYS) next[k] = clampResource(r[k] + (effects[k] ?? 0))
  return next
}

export function diff(before: Resources, after: Resources): Effects {
  const d: Effects = {}
  for (const k of RESOURCE_KEYS) if (after[k] !== before[k]) d[k] = after[k] - before[k]
  return d
}

export function weakest(r: Resources): ResourceKey {
  return RESOURCE_KEYS.reduce((a, b) => (r[b] < r[a] ? b : a))
}

export const minResource = (r: Resources) => Math.min(...RESOURCE_KEYS.map((k) => r[k]))

const empty = (r: Resources): ResourceKey | null => RESOURCE_KEYS.find((k) => r[k] <= 0) ?? null

const pick = <T,>(list: T[]): T => list[Math.floor(Math.random() * list.length)]

/**
 * Chooses the next event at random, with gentle balancing:
 *  - Day 1 is never an emergency.
 *  - If a resource is running low, prefer events that give a way to refill it.
 *  - Make sure every mission has at least one quiet "calm" day.
 */
export function pickEvent(day: number, used: string[], resources: Resources): GameEvent {
  let pool = EVENTS.filter((e) => !used.includes(e.id))
  if (pool.length === 0) pool = EVENTS

  if (day === 1) {
    const gentle = pool.filter((e) => e.severity !== 'emergency')
    if (gentle.length) pool = gentle
  }

  const calmUsed = used.some((id) => EVENTS.find((e) => e.id === id)?.severity === 'calm')
  const calmPool = pool.filter((e) => e.severity === 'calm')
  if (!calmUsed && day >= 4 && calmPool.length) return pick(calmPool)

  const low = weakest(resources)
  if (resources[low] < 35) {
    const helpful = pool.filter((e) => e.choices.some((c) => (c.effects[low] ?? 0) >= 10))
    if (helpful.length) return pick(helpful)
  }
  return pick(pool)
}

export function createGame(): GameState {
  const event = pickEvent(1, [], START_RESOURCES)
  return {
    day: 1,
    resources: { ...START_RESOURCES },
    usedEventIds: [event.id],
    event,
    step: 'choosing',
    outcome: null,
    arrivals: null,
    pending: [],
    history: [],
    decisions: 0,
    styleCounts: { protect: 0, save: 0, gamble: 0 },
    delayedTriggered: 0,
    lowest: { ...START_RESOURCES },
    status: 'running',
    lossReason: null,
  }
}

const trackLowest = (lowest: Resources, r: Resources): Resources => {
  const next = { ...lowest }
  for (const k of RESOURCE_KEYS) next[k] = Math.min(next[k], r[k])
  return next
}

/** Player picks one of the three options. Invalid or repeated picks are ignored. */
export function choose(state: GameState, choiceId: string): GameState {
  if (state.status !== 'running' || state.step !== 'choosing') return state
  const choice = state.event.choices.find((c) => c.id === choiceId)
  if (!choice) return state

  const resources = applyEffects(state.resources, choice.effects)
  const deltas = diff(state.resources, resources)
  const pending: PendingEffect[] = choice.delayed
    ? [...state.pending, { ...choice.delayed, dueDay: state.day + choice.delayed.inDays, fromEvent: state.event.id }]
    : state.pending

  const entry: HistoryEntry = {
    day: state.day,
    eventTitle: state.event.title,
    choiceLabel: choice.label,
    deltas,
  }
  const lossReason = empty(resources)
  const finished = state.day >= TOTAL_DAYS

  return {
    ...state,
    resources,
    pending,
    step: 'resolved',
    outcome: { choice, deltas, scheduledLater: Boolean(choice.delayed) },
    history: [...state.history, entry],
    decisions: state.decisions + 1,
    styleCounts: { ...state.styleCounts, [choice.style]: state.styleCounts[choice.style] + 1 },
    lowest: trackLowest(state.lowest, resources),
    status: lossReason ? 'lost' : finished ? 'won' : 'running',
    lossReason,
  }
}

/** Moves to the next day: upkeep, delayed consequences, then a new event. */
export function advanceDay(state: GameState): GameState {
  if (state.status !== 'running' || state.step !== 'resolved') return state
  const day = state.day + 1

  let resources = applyEffects(state.resources, DAILY_UPKEEP)
  const upkeepDeltas = diff(state.resources, resources)

  const due = state.pending.filter((p) => p.dueDay <= day)
  const pending = state.pending.filter((p) => p.dueDay > day)
  const delayed: Arrivals['delayed'] = []
  for (const p of due) {
    const before = resources
    resources = applyEffects(resources, p.effects)
    delayed.push({ title: p.title, message: p.message, effects: diff(before, resources) })
  }

  const lossReason = empty(resources)
  const lowest = trackLowest(state.lowest, resources)
  const arrivals: Arrivals = { upkeep: upkeepDeltas, delayed }
  const delayedTriggered = state.delayedTriggered + delayed.length

  if (lossReason) {
    return { ...state, day, resources, pending, arrivals, lowest, delayedTriggered, status: 'lost', lossReason }
  }

  const event = pickEvent(day, state.usedEventIds, resources)
  return {
    ...state,
    day,
    resources,
    pending,
    arrivals,
    lowest,
    delayedTriggered,
    event,
    usedEventIds: [...state.usedEventIds, event.id],
    step: 'choosing',
    outcome: null,
  }
}
