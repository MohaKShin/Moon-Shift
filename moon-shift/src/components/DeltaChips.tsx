import { RESOURCE_META } from './icons'
import { RESOURCE_KEYS, type Effects } from '../game/types'

export function DeltaChips({ deltas, small }: { deltas: Effects; small?: boolean }) {
  const keys = RESOURCE_KEYS.filter((k) => deltas[k])
  if (!keys.length) return <span className="text-sm text-white/60">No change</span>
  return (
    <span className="flex flex-wrap gap-1.5">
      {keys.map((k) => {
        const v = deltas[k] as number
        const { Icon, label } = RESOURCE_META[k]
        return (
          <span
            key={k}
            title={label}
            className={`inline-flex items-center gap-1 rounded-full font-bold ${small ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'} ${v > 0 ? 'bg-moss/20 text-moss' : 'bg-alarm/20 text-alarm'}`}
          >
            <Icon size={small ? 12 : 15} aria-hidden />
            <span className="sr-only">{label}</span>
            {v > 0 ? '+' : ''}{v}
          </span>
        )
      })}
    </span>
  )
}
