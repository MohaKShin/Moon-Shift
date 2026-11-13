import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { audio, type MusicId } from './audio/audioManager'
import { StarField } from './components/StarField'
import { advanceDay, choose, createGame, LOW_LEVEL, minResource } from './game/engine'
import type { GameState } from './game/types'
import { useNasa } from './nasa/useNasa'
import { Briefing } from './screens/Briefing'
import { Game } from './screens/Game'
import { Landing } from './screens/Landing'
import { Results } from './screens/Results'

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
    if (screen === 'game' && game.step === 'choosing') void audio.sfx(game.event.severity === 'emergency' ? 'alert' : 'day')
  }, [screen, game.event.id, game.step, game.event.severity])

  useEffect(() => {
    if (screen === 'results') void audio.sfx(game.status === 'won' ? 'success' : 'failed')
  }, [screen, game.status])

  const start = () => { audio.unlock(); setScreen('briefing') }
  const begin = () => { setGame(createGame()); setScreen('game') }

  const onChoose = (id: string) => {
    const next = choose(game, id)
    if (next === game) return
    const net = Object.values(next.outcome?.deltas ?? {}).reduce((a, b) => a + (b ?? 0), 0)
    void audio.sfx(net >= 0 ? 'good' : 'bad')
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
    </>
  )
}
