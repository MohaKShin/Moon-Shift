import { ExternalLink, RefreshCw, SatelliteDish, TriangleAlert } from 'lucide-react'
import { Button } from './Button'
import { usingDemoKey } from '../nasa/donki'
import type { NasaState } from '../nasa/useNasa'

export function NasaPanel({ state, onRetry }: { state: NasaState; onRetry: () => void }) {
  return (
    <aside className="rounded-3xl border-2 border-dashed border-solar/60 bg-[#1a1530]/80 p-5" aria-label="NASA Reality Check">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 font-display text-lg font-bold text-solar">
          <SatelliteDish size={20} aria-hidden /> NASA Reality Check
        </h3>
        <span className="rounded-full bg-solar px-2.5 py-0.5 text-xs font-bold text-void">Real data</span>
      </div>

      {state.status === 'loading' && <p className="text-sm text-white/70">Asking NASA what the Sun did lately...</p>}

      {state.status === 'ok' && (
        <div className="space-y-2 text-sm">
          <p className="text-white/70">Latest event on the Sun:</p>
          <p className="font-display text-lg font-semibold">{state.data.latest.title}</p>
          <p className="text-white/85">
            <b>Date:</b>{' '}
            {new Date(state.data.latest.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
          <p className="text-white/85"><b>Type:</b> {state.data.latest.kind === 'flare' ? 'Solar flare' : 'Coronal mass ejection'}</p>
          <p className="text-white/85">{state.data.latest.detail}</p>
          <p className="rounded-xl bg-white/5 p-3 leading-relaxed text-white/90">{state.data.latest.relevance}</p>
          <p className="text-xs text-white/60">
            In the last {state.data.days} days NASA logged {state.data.flares} flares and {state.data.cmes} CMEs.
          </p>
          {state.data.latest.link && (
            <a className="inline-flex items-center gap-1 text-xs font-bold text-solar underline" href={state.data.latest.link} target="_blank" rel="noreferrer">
              See NASA's record <ExternalLink size={12} aria-hidden />
            </a>
          )}
        </div>
      )}

      {state.status === 'error' && (
        <div className="space-y-3 text-sm">
          <p className="flex items-start gap-2 text-white/85">
            <TriangleAlert size={18} className="mt-0.5 shrink-0 text-solar" aria-hidden />
            We could not reach NASA just now. The game still works fine!
          </p>
          <p className="rounded-xl bg-white/5 p-3 leading-relaxed text-white/85">
            Normally this box shows the latest solar flare or coronal mass ejection (a giant cloud of particles from the Sun) reported by NASA. These events are what space weather scientists watch.
          </p>
          <Button variant="ghost" onClick={onRetry} className="!px-4 !py-2 !text-base">
            <RefreshCw size={16} aria-hidden /> Try again
          </Button>
        </div>
      )}

      <p className="mt-3 border-t border-white/10 pt-3 text-xs leading-relaxed text-white/60">
        Real events come from NASA DONKI{usingDemoKey ? ' (demo key)' : ''}. DONKI watches the Sun, not the Moon&rsquo;s surface. All the numbers in the game are made up.
      </p>
    </aside>
  )
}
