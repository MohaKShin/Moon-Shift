import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, FlaskConical, Hourglass, Moon, SatelliteDish } from 'lucide-react'
import { Button } from './Button'
import { DeltaChips } from './DeltaChips'
import { CATEGORY_ICON, RESOURCE_META } from './icons'
import { TOTAL_DAYS } from '../game/engine'
import { RESOURCE_KEYS, type Choice, type GameState } from '../game/types'

const SEVERITY = {
  calm: { label: 'Quiet moment', cls: 'bg-moss/20 text-moss' },
  warning: { label: 'Heads up', cls: 'bg-solar/20 text-solar' },
  emergency: { label: 'Emergency!', cls: 'bg-alarm/25 text-alarm' },
} as const

interface Props {
  state: GameState
  onChoose: (id: string) => void
  onNext: () => void
}

export function EventCard({ state, onChoose, onNext }: Props) {
  const { event, outcome, step, arrivals, day, status } = state
  const Icon = CATEGORY_ICON[event.category]
  const sev = SEVERITY[event.severity]
  const lastDay = day >= TOTAL_DAYS

  return (
    <motion.section
      key={event.id}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl border-2 bg-panel/90 p-5 shadow-xl backdrop-blur sm:p-7 ${event.severity === 'emergency' ? 'border-alarm/70' : 'border-earth/30'}`}
      aria-live="polite"
    >
      {arrivals && step === 'choosing' && (arrivals.delayed.length > 0 || Object.keys(arrivals.upkeep).length > 0) && (
        <div className="mb-5 rounded-2xl bg-white/5 p-4">
          <p className="mb-2 flex items-center gap-2 font-display font-semibold"><Moon size={18} className="text-regolith" /> Overnight</p>
          <p className="mb-2 flex flex-wrap items-center gap-2 text-sm text-white/80">
            Living on the outpost uses up supplies every day. <DeltaChips deltas={arrivals.upkeep} small />
          </p>
          {arrivals.delayed.map((d) => (
            <p key={d.title} className="mb-1 flex flex-wrap items-center gap-2 text-sm text-white/90">
              <Hourglass size={16} className="text-solar" />
              <span><b>{d.title}:</b> {d.message}</span>
              <DeltaChips deltas={d.effects} small />
            </p>
          ))}
        </div>
      )}

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <span className={`grid h-12 w-12 place-items-center rounded-2xl ${sev.cls}`}><Icon size={26} aria-hidden /></span>
        <span className={`rounded-full px-3 py-1 text-sm font-bold ${sev.cls}`}>{sev.label}</span>
        {event.nasaInspired && (
          <span className="flex items-center gap-1.5 rounded-full border border-dashed border-solar/70 px-3 py-1 text-sm font-bold text-solar">
            <SatelliteDish size={14} aria-hidden /> Inspired by real space weather
          </span>
        )}
      </div>
      <h2 className="mb-2 font-display text-2xl font-bold leading-tight sm:text-4xl">{event.title}</h2>
      <p className="mb-5 max-w-prose text-base leading-relaxed text-white/85 sm:text-lg">{event.description}</p>

      <AnimatePresence mode="wait">
        {step === 'choosing' || !outcome ? (
          <motion.div key="choices" exit={{ opacity: 0 }} className="grid gap-3 md:grid-cols-3">
            {event.choices.map((c, i) => (
              <ChoiceButton key={c.id} choice={c} index={i} onPick={() => onChoose(c.id)} />
            ))}
          </motion.div>
        ) : (
          <motion.div key="outcome" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="mb-1 font-display text-sm font-semibold text-white/60">You chose</p>
              <p className="mb-3 font-display text-xl font-bold">{outcome.choice.label}</p>
              <p className="mb-3 text-base leading-relaxed sm:text-lg">{outcome.choice.result}</p>
              <DeltaChips deltas={outcome.deltas} />
              {outcome.scheduledLater && (
                <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-solar">
                  <Hourglass size={16} aria-hidden /> Keep an eye out. This choice may matter again on a later day.
                </p>
              )}
            </div>
            <div className="rounded-2xl border border-earth/30 bg-earth/10 p-4">
              <p className="mb-1 flex items-center gap-2 font-display font-semibold text-earth"><FlaskConical size={18} aria-hidden /> Space science</p>
              <p className="leading-relaxed text-white/90">{outcome.choice.science}</p>
            </div>
            <div className="flex justify-end">
              <Button onClick={onNext}>
                {status === 'lost' ? 'See mission report' : lastDay ? 'Finish mission' : `Go to day ${day + 1}`}
                <ChevronRight size={20} aria-hidden />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}

function ChoiceButton({ choice, index, onPick }: { choice: Choice; index: number; onPick: () => void }) {
  const touched = RESOURCE_KEYS.filter((k) => choice.effects[k])
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={onPick}
      className="group flex min-h-[132px] flex-col justify-between rounded-2xl border-2 border-white/15 bg-deep p-4 text-left transition-colors hover:border-earth focus-visible:border-earth"
    >
      <span>
        <span className="block font-display text-lg font-semibold leading-snug">{choice.label}</span>
        <span className="mt-1 block text-sm text-white/70">{choice.detail}</span>
      </span>
      <span className="mt-3 flex items-center gap-2 text-xs text-white/60">
        Changes
        {touched.map((k) => {
          const { Icon, color, label } = RESOURCE_META[k]
          return <Icon key={k} size={18} style={{ color }} aria-label={label} />
        })}
      </span>
    </motion.button>
  )
}
