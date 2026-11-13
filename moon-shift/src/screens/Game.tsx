import { useMemo } from 'react'
import { ResourceBar } from '../components/ResourceBar'
import { LunarScene, type SceneMood } from '../components/LunarScene'
import { EventCard } from '../components/EventCard'
import { NasaPanel } from '../components/NasaPanel'
import { HistoryPanel } from '../components/HistoryPanel'
import { SoundSettings } from '../components/SoundSettings'
import { DayTracker } from '../components/DayTracker'
import { minResource, LOW_LEVEL } from '../game/engine'
import { RESOURCE_KEYS, type GameState } from '../game/types'
import type { NasaState } from '../nasa/useNasa'

interface Props {
  state: GameState
  nasa: NasaState
  onNasaRetry: () => void
  onChoose: (id: string) => void
  onNext: () => void
}

export function Game({ state, nasa, onNasaRetry, onChoose, onNext }: Props) {
  const { event, resources, step, outcome } = state
  const choosing = step === 'choosing'
  const mood: SceneMood = useMemo(() => {
    if (choosing && event.category === 'solar') return 'storm'
    if (minResource(resources) <= LOW_LEVEL || (choosing && event.severity === 'emergency')) return 'danger'
    return 'calm'
  }, [choosing, event, resources])

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 pb-10 pt-4 sm:px-6">
      <header className="mb-4 flex items-center justify-between gap-3">
        <DayTracker day={state.day} />
        <SoundSettings />
      </header>

      <section aria-label="Resources" className="mb-4 flex gap-4 rounded-3xl border-2 border-white/10 bg-panel/80 p-4 pt-6 sm:gap-8 sm:px-6">
        {RESOURCE_KEYS.map((k) => (
          <ResourceBar key={k} resource={k} value={resources[k]} delta={outcome?.deltas[k]} />
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl border-2 border-white/10 bg-[#050a1c]">
            <LunarScene
              energy={resources.energy}
              mood={mood}
              dust={event.category === 'dust' && choosing}
              className="h-44 w-full sm:h-64 lg:h-72"
            />
          </div>
          <EventCard state={state} onChoose={onChoose} onNext={onNext} />
        </div>
        <div className="space-y-4">
          <NasaPanel state={nasa} onRetry={onNasaRetry} />
          <HistoryPanel history={state.history} />
        </div>
      </div>
    </main>
  )
}
