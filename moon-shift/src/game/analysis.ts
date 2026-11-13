import { RESOURCE_KEYS, type GameState, type ResourceKey } from './types'

export const RESOURCE_NAMES: Record<ResourceKey, string> = {
  water: 'Water',
  energy: 'Energy',
  safety: 'Crew Safety',
}

export interface MissionReport {
  title: string
  summary: string
  lessons: string[]
}

const LESSON_BY_RESOURCE: Record<ResourceKey, string> = {
  water:
    'Water does many jobs in space: drinking, growing plants, cooling machines, making oxygen and even blocking radiation. Engineers have to share it wisely.',
  energy:
    'Power is a budget. Solar panels, batteries and fuel cells all work together, and the long lunar night (about two weeks) makes planning extra important.',
  safety:
    'The Moon has no thick air or magnetic field, so radiation is a real danger. Thick walls of soil or water, and quick shelter during a solar storm, protect astronauts.',
}

export function buildReport(s: GameState): MissionReport {
  const { protect, save, gamble } = s.styleCounts
  const total = Math.max(1, protect + save + gamble)

  let title = 'Balanced engineer'
  let summary = 'You mixed careful and clever choices and kept your options open.'
  if (protect / total >= 0.5) {
    title = 'Crew-first commander'
    summary = 'You protected your astronauts first. That keeps people safe, but it can use up power and water.'
  } else if (save / total >= 0.5) {
    title = 'Resource saver'
    summary = 'You were careful with supplies. Saving is smart, but it works best when the crew stays safe too.'
  } else if (gamble / total >= 0.4) {
    title = 'Bold risk taker'
    summary = 'You took chances for big rewards. Sometimes it paid off and sometimes it cost the crew.'
  }

  const lowestKey = RESOURCE_KEYS.reduce((a, b) => (s.lowest[b] < s.lowest[a] ? b : a))
  const strain = ` Your tightest moment was ${RESOURCE_NAMES[lowestKey].toLowerCase()}, which dipped to ${s.lowest[lowestKey]}.`
  const delayed =
    s.delayedTriggered > 0
      ? ` ${s.delayedTriggered === 1 ? 'One choice' : `${s.delayedTriggered} choices`} came back to surprise you later.`
      : ''

  const lessons: string[] = []
  const focus: ResourceKey = s.status === 'lost' && s.lossReason ? s.lossReason : lowestKey
  lessons.push(LESSON_BY_RESOURCE[focus])
  if (s.delayedTriggered > 0 || s.status === 'lost') {
    lessons.push('Some choices have effects that show up later. Good engineers ask, "What happens tomorrow if I do this today?"')
  } else {
    lessons.push('Every fix costs something. Engineers call this a trade-off, and picking the best one is the heart of the job.')
  }

  return { title, summary: summary + strain + delayed, lessons }
}
