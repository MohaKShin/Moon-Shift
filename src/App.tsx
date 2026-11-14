import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { audio, type MusicId } from './audio/audioManager'
import { ACTION, STINGER, type SfxId } from './audio/sfxBank'
import { StarField } from './components/StarField'
import { advanceDay, choose, createGame, LOW_LEVEL, minResource } from './game/engine'
import type { GameState } from './game/types'
import { useNasa } from './nasa/useNasa'
import { Briefing } from './screens/Briefing'
import { Game } from './screens/Game'
import { Landing } from './screens/Landing'
import { Results } from './screens/Results'
import { Analytics } from '@vercel/analytics/react'

type Screen = 'landing' | 'briefing' | 'game' | 'results'

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [game, setGame] = useState<GameState>(() => createGame())
  const nasa = useNasa()

  // ---- music follows the situation ----
  useEffect(() => {
    let track: MusicId = 'menu'
    if (screen === 'game') {
      const tense = minResource(game.resources) <= LOW_LEVEL || (game.step === 'choosing' && game.event.severity === 'emergency')
      track = tense ? 'emergency' : 'gameplay'
    } else if (screen === 'results') {
      track = game.status === 'won' ? 'victory' : 'failure'
    }
    audio.setMusic(track)
  }, [screen, game])

  // ---- sound effects for new events and outcomes ----
  useEffect(() => {
    if (screen !== 'game' || game.step !== 'choosing') return
    // timed to land just after the new scene starts to appear
    const calm = game.event.severity === 'calm'
    const stinger: SfxId = calm ? 'st-calm' : STINGER[game.event.category] ?? 'st-calm'
    const t1 = window.setTimeout(() => void audio.sfx('notify'), 250)
    const t2 = window.setTimeout(() => void audio.sfx(stinger), 800)
    return () => { window.clearTimeout(t1); window.clearTimeout(t2) }
  }, [screen, game.event.id, game.step, game.event.severity, game.event.category])

  useEffect(() => {
    if (screen === 'results') void audio.sfx(game.status === 'won' ? 'success' : 'failed')
  }, [screen, game.status])

  const start = () => { audio.unlock(); setScreen('briefing') }
  const begin = () => { setGame(createGame()); setScreen('game') }

  const onChoose = (id: string) => {
    const next = choose(game, id)
    if (next === game) return
    void audio.sfx('confirm')
    window.setTimeout(() => void audio.sfx(ACTION[game.event.category] ?? 'act-door'), 220)
    // the two biggest resource changes, one after the other
    const deltas = Object.entries(next.outcome?.deltas ?? {}) as [string, number][]
    deltas.sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])).slice(0, 2).forEach(([k, v], i) => {
      window.setTimeout(() => void audio.sfx(`${k}${v > 0 ? '+' : '-'}` as SfxId), 1000 + i * 320)
    })
    setGame(next)
  }

  const onNext = () => {
    if (game.status !== 'running') { setScreen('results'); return }
    const next = advanceDay(game)
    setGame(next)
    if (next.status !== 'running') setScreen('results')
  }

  const restart = () => { setGame(createGame()); setScreen('briefing') }

  return (
    <>
      <StarField />
      <AnimatePresence mode="wait">
        <motion.div key={screen} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
          {screen === 'landing' && <Landing onStart={start} />}
          {screen === 'briefing' && <Briefing onBegin={begin} />}
          {screen === 'game' && <Game state={game} nasa={nasa.state} onNasaRetry={nasa.reload} onChoose={onChoose} onNext={onNext} />}
          {screen === 'results' && <Results state={game} onRestart={restart} />}
        </motion.div>
      </AnimatePresence>
      <Analytics />
    </>
  )
}
