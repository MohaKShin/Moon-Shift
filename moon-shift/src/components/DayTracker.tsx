import { Moon } from 'lucide-react'
import { TOTAL_DAYS } from '../game/engine'

export function DayTracker({ day }: { day: number }) {
  return (
    <div className="flex items-center gap-3" aria-label={`Day ${day} of ${TOTAL_DAYS}`}>
      <span className="font-display text-2xl font-bold sm:text-3xl">Day {day}<span className="text-white/50"> of {TOTAL_DAYS}</span></span>
      <div className="hidden items-center gap-1.5 sm:flex" aria-hidden>
        {Array.from({ length: TOTAL_DAYS }, (_, i) => {
          const n = i + 1
          return (
            <Moon
              key={n} size={18}
              className={n < day ? 'fill-regolith text-regolith' : n === day ? 'fill-earth text-earth drop-shadow-[0_0_6px_#5CE1E6]' : 'text-white/25'}
            />
          )
        })}
      </div>
    </div>
  )
}
