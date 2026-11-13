import { motion, AnimatePresence } from 'framer-motion'
import { RESOURCE_META } from './icons'
import { LOW_LEVEL } from '../game/engine'
import type { ResourceKey } from '../game/types'

interface Props {
  resource: ResourceKey
  value: number
  delta?: number
}

export function ResourceBar({ resource, value, delta }: Props) {
  const { label, Icon, color } = RESOURCE_META[resource]
  const low = value <= LOW_LEVEL
  return (
    <div className="min-w-0 flex-1">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 font-display text-sm font-semibold sm:text-base" style={{ color }}>
          <Icon size={18} aria-hidden /> {label}
        </span>
        <span className="relative flex items-center gap-1 font-display text-lg font-bold tabular-nums">
          {low && <span className="rounded-full bg-alarm px-2 py-0.5 text-xs font-bold text-void">Low</span>}
          {value}
          <AnimatePresence>
            {delta ? (
              <motion.span
                key={`${value}-${delta}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: -2 }}
                exit={{ opacity: 0 }}
                className={`absolute -top-5 right-0 text-sm font-bold ${delta > 0 ? 'text-moss' : 'text-alarm'}`}
              >
                {delta > 0 ? '+' : ''}{delta}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </span>
      </div>
      <div
        role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}
        className={`h-4 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10 ${low ? 'animate-ring' : ''}`}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: low ? '#FF6B6B' : color }}
          initial={false}
          animate={{ width: `${value}%` }}
          transition={{ type: 'spring', stiffness: 70, damping: 16 }}
        />
      </div>
    </div>
  )
}
