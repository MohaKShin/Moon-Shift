import { motion } from 'framer-motion'
import { FlaskConical, RotateCcw, Trophy, Rocket, Users } from 'lucide-react'
import { Button } from '../components/Button'
import { LunarScene } from '../components/LunarScene'
import { ResourceBar } from '../components/ResourceBar'
import { Astronaut, AstronautDefs } from '../components/Astronaut'
import { SoundSettings } from '../components/SoundSettings'
import { buildReport, RESOURCE_NAMES } from '../game/analysis'
import { RESOURCE_KEYS, type GameState } from '../game/types'

const CREW = [
  { name: 'Nova', accent: '#FFB84D' },
  { name: 'Kai', accent: '#5CE1E6' },
  { name: 'Zuri', accent: '#7BE0A4' },
]

const reveal = (i: number) => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.8 + i * 0.45, duration: 0.7 } })

export function Results({ state, onRestart }: { state: GameState; onRestart: () => void }) {
  const won = state.status === 'won'
  const report = buildReport(state)
  const safety = state.resources.safety
  const crewMood = (won ? (safety >= 60 ? 'Happy and healthy' : safety >= 30 ? 'Tired but okay' : 'Worn out, needs rest') : 'Safe, heading home')

  return (
    <main className="relative min-h-screen overflow-hidden">
      <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 1.6 }} className="pointer-events-none fixed inset-0 z-40 bg-black" />
      <LunarScene energy={won ? 100 : 15} mood="calm" className="absolute inset-x-0 top-0 h-80 w-full opacity-60" />
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-transparent to-void" />

      <div className="relative z-10 mx-auto max-w-4xl px-5 py-6 sm:py-10">
        <div className="mb-8 flex justify-end"><SoundSettings /></div>

        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 1 }} className="mb-8 text-center">
          <div className={`mx-auto mb-3 grid h-20 w-20 place-items-center rounded-full ${won ? 'bg-moss/20 text-moss' : 'bg-solar/20 text-solar'}`}>
            {won ? <Trophy size={40} aria-hidden /> : <Rocket size={40} aria-hidden />}
          </div>
          <h1 className="font-display text-5xl font-bold sm:text-7xl">{won ? 'Mission success!' : 'Mission ended early'}</h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-white/85">
            {won
              ? `You kept all three astronauts going for ${state.day} days. Great engineering, Commander!`
              : `${RESOURCE_NAMES[state.lossReason ?? 'safety']} ran out on day ${state.day}. Mission control called the crew home safely. Real engineers learn from every try, so go again!`}
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2">
          <motion.section {...reveal(0)} className="rounded-3xl border-2 border-white/10 bg-panel/90 p-5">
            <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-bold"><Users size={22} className="text-earth" aria-hidden /> Crew status</h2>
            <div className="mb-3 flex justify-around">
              {CREW.map((c, i) => (
                <div key={c.name} className="text-center">
                  <svg viewBox="-30 -80 60 90" className="mx-auto h-24 w-16" aria-hidden>
                    <AstronautDefs /><Astronaut x={0} y={0} accent={c.accent} delay={i * 0.4} />
                  </svg>
                  <p className="font-display font-bold" style={{ color: c.accent }}>{c.name}</p>
                </div>
              ))}
            </div>
            <p className="text-center font-bold">3 of 3 astronauts: {crewMood}</p>
          </motion.section>

          <motion.section {...reveal(1)} className="rounded-3xl border-2 border-white/10 bg-panel/90 p-5">
            <h2 className="mb-5 font-display text-xl font-bold">Final levels</h2>
            <div className="mb-5 space-y-5">
              {RESOURCE_KEYS.map((k) => <ResourceBar key={k} resource={k} value={state.resources[k]} />)}
            </div>
            <p className="text-sm text-white/80">Decisions made: <b className="text-lg text-white">{state.decisions}</b> &nbsp; Days: <b className="text-lg text-white">{state.day} of 7</b></p>
          </motion.section>
        </div>

        <motion.section {...reveal(2)} className="mt-4 rounded-3xl border-2 border-earth/30 bg-panel/90 p-5">
          <h2 className="font-display text-xl font-bold">Your style: {report.title}</h2>
          <p className="mt-1 max-w-prose leading-relaxed text-white/85">{report.summary}</p>
        </motion.section>

        <motion.section {...reveal(3)} className="mt-4 rounded-3xl border border-earth/30 bg-earth/10 p-5">
          <h2 className="mb-2 flex items-center gap-2 font-display text-xl font-bold text-earth"><FlaskConical size={22} aria-hidden /> What you learned</h2>
          <ul className="space-y-2">
            {report.lessons.map((l) => <li key={l} className="max-w-prose leading-relaxed text-white/90">{l}</li>)}
          </ul>
        </motion.section>

        <motion.div {...reveal(4)} className="mt-8 flex justify-center pb-8">
          <Button onClick={onRestart} className="!px-10 !py-4 !text-2xl"><RotateCcw size={24} aria-hidden /> Play Again</Button>
        </motion.div>
      </div>
    </main>
  )
}
