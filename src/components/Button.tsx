import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { audio } from '../audio/audioManager'

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> {
  variant?: 'primary' | 'ghost'
  children: ReactNode
  silent?: boolean
}

export function Button({ variant = 'primary', children, className = '', onClick, silent, ...rest }: Props) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-display text-lg font-semibold transition-colors disabled:opacity-50'
  const look =
    variant === 'primary'
      ? 'bg-earth text-void shadow-[0_0_30px_rgba(92,225,230,0.35)] hover:bg-white'
      : 'border-2 border-white/25 text-white hover:border-earth hover:text-earth'
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`${base} ${look} ${className}`}
      onClick={(e) => {
        if (!silent) void audio.sfx('click')
        onClick?.(e)
      }}
      {...rest}
    >
      {children}
    </motion.button>
  )
}
