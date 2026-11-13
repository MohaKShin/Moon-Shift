import { History } from 'lucide-react'
import { DeltaChips } from './DeltaChips'
import type { HistoryEntry } from '../game/types'

export function HistoryPanel({ history }: { history: HistoryEntry[] }) {
  const recent = [...history].reverse().slice(0, 5)
  return (
    <section className="rounded-3xl border-2 border-white/10 bg-panel/80 p-5" aria-label="Recent decisions">
      <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold"><History size={20} className="text-earth" aria-hidden /> Mission log</h3>
      {recent.length === 0 ? (
        <p className="text-sm text-white/60">Your decisions will show up here.</p>
      ) : (
        <ol className="space-y-3">
          {recent.map((h) => (
            <li key={h.day} className="rounded-2xl bg-white/5 p-3 text-sm">
              <p className="font-display font-semibold">Day {h.day}: {h.eventTitle}</p>
              <p className="mb-1.5 text-white/70">{h.choiceLabel}</p>
              <DeltaChips deltas={h.deltas} small />
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
