import { motion } from 'framer-motion'
import { Rocket, Target } from 'lucide-react'
import { Button } from '../components/Button'
import { Astronaut, AstronautDefs } from '../components/Astronaut'
import { RESOURCE_META } from '../components/icons'
import { SoundSettings } from '../components/SoundSettings'
import { TOTAL_DAYS } from '../game/engine'

const CREW = [
  { name: 'Nova', role: 'Engineer', accent: '#FFB84D', text: 'Fixes machines and keeps the power on.' },
  { name: 'Kai', role: 'Doctor', accent: '#5CE1E6', text: 'Watches over everyone\'s health and mood.' },
  { name: 'Zuri', role: 'Gardener', accent: '#7BE0A4', text: 'Grows fresh food and looks after the water.' },
]

const EXPLAIN = {
  water: 'For drinking, growing plants and cooling machines. It can even block radiation. If it hits zero, the mission ends.',
  energy: 'Power from solar panels and batteries runs lights, heaters and air machines. If it hits zero, everything stops.',
  safety: 'How healthy and happy the crew is, and how well protected they are from dangers like radiation. If it hits zero, the crew must leave.',
} as const

export function Briefing({ onBegin }: { onBegin: () => void }) {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-6 sm:py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Mission briefing</h1>
        <SoundSettings />
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-start gap-4 rounded-3xl border-2 border-earth/40 bg-panel/90 p-5 sm:p-6">
        <Target className="mt-1 shrink-0 text-earth" size={30} aria-hidden />
        <div>
          <h2 className="font-display text-xl font-bold sm:text-2xl">Your job: survive {TOTAL_DAYS} lunar days</h2>
          <p className="mt-1 text-base leading-relaxed text-white/85 sm:text-lg">
            You are the commander of a tiny Moon outpost. Each day, something surprising happens. Pick one of three fixes. Every fix helps one thing and costs another, so think like an engineer!
          </p>
        </div>
      </motion.div>

      <h2 className="mb-3 font-display text-xl font-bold">Meet your crew</h2>
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {CREW.map((c, i) => (
          <motion.div key={c.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 * i }}
            className="flex items-center gap-4 rounded-3xl border-2 border-white/10 bg-panel/80 p-4 sm:flex-col sm:text-center">
            <svg viewBox="-30 -80 60 90" className="h-24 w-16 shrink-0 sm:h-32 sm:w-24" aria-hidden>
              <AstronautDefs />
              <Astronaut x={0} y={0} accent={c.accent} delay={i * 0.5} />
            </svg>
            <div>
              <p className="font-display text-xl font-bold" style={{ color: c.accent }}>{c.name}</p>
              <p className="font-bold text-white/80">{c.role}</p>
              <p className="text-sm text-white/70">{c.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <h2 className="mb-3 font-display text-xl font-bold">Three things to protect</h2>
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {(Object.keys(EXPLAIN) as (keyof typeof EXPLAIN)[]).map((k) => {
          const { Icon, label, color } = RESOURCE_META[k]
          return (
            <div key={k} className="rounded-3xl border-2 bg-panel/80 p-4" style={{ borderColor: `${color}55` }}>
              <p className="mb-1 flex items-center gap-2 font-display text-lg font-bold" style={{ color }}>
                <Icon size={22} aria-hidden /> {label}
              </p>
              <p className="text-sm leading-relaxed text-white/85 sm:text-base">{EXPLAIN[k]}</p>
            </div>
          )
        })}
      </div>

      <div className="flex flex-col items-center gap-2 pb-6">
        <Button onClick={onBegin} className="!px-10 !py-4 !text-2xl"><Rocket size={26} aria-hidden /> Begin Mission</Button>
        <p className="text-sm text-white/60">Tip: there is no single perfect answer. Mistakes help you learn.</p>
      </div>
    </main>
  )
}
