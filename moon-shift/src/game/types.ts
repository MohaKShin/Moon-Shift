export type ResourceKey = 'water' | 'energy' | 'safety'
export type Resources = Record<ResourceKey, number>
export type Effects = Partial<Record<ResourceKey, number>>

export const RESOURCE_KEYS: ResourceKey[] = ['water', 'energy', 'safety']

export type Severity = 'calm' | 'warning' | 'emergency'
export type Category =
  | 'solar' | 'oxygen' | 'water' | 'power' | 'food' | 'radiation'
  | 'heat' | 'comms' | 'dust' | 'cold' | 'impact' | 'quake' | 'morale' | 'rover' | 'ice'

/** How a choice plays: crew-first, conserve resources, or take a risk for a bigger gain. */
export type Style = 'protect' | 'save' | 'gamble'

export interface DelayedEffect {
  inDays: number
  effects: Effects
  title: string
  message: string
}

export interface Choice {
  id: string
  label: string
  detail: string
  effects: Effects
  result: string
  science: string
  style: Style
  delayed?: DelayedEffect
}

export interface GameEvent {
  id: string
  title: string
  category: Category
  severity: Severity
  description: string
  nasaInspired?: boolean
  choices: [Choice, Choice, Choice]
}

export interface PendingEffect extends DelayedEffect {
  dueDay: number
  fromEvent: string
}

export interface HistoryEntry {
  day: number
  eventTitle: string
  choiceLabel: string
  deltas: Effects
}

export interface Outcome {
  choice: Choice
  deltas: Effects
  scheduledLater: boolean
}

export interface Arrivals {
  upkeep: Effects
  delayed: { title: string; message: string; effects: Effects }[]
}

export interface GameState {
  day: number
  resources: Resources
  usedEventIds: string[]
  event: GameEvent
  step: 'choosing' | 'resolved'
  outcome: Outcome | null
  arrivals: Arrivals | null
  pending: PendingEffect[]
  history: HistoryEntry[]
  decisions: number
  styleCounts: Record<Style, number>
  delayedTriggered: number
  lowest: Resources
  status: 'running' | 'won' | 'lost'
  lossReason: ResourceKey | null
}
