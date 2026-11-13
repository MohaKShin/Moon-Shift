import { motion } from 'framer-motion'
import { Rocket } from 'lucide-react'
import { Button } from '../components/Button'
import { LunarScene } from '../components/LunarScene'
import { SoundSettings } from '../components/SoundSettings'

export function Landing({ onStart }: { onStart: () => void }) {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden">
      <LunarScene hero className="absolute inset-x-0 bottom-0 h-[62vh] w-full" />
      <div className="absolute inset-x-0 bottom-0 h-[62vh] bg-gradient-to-t from-void/50 via-transparent to-transparent" />

      <header className="relative z-10 flex justify-end p-4 sm:p-6">
        <SoundSettings />
      </header>

      <section className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-6 pt-4 text-center sm:pt-10">
        <motion.h1
          initial={{ opacity: 0, letterSpacing: '0.4em' }}
          animate={{ opacity: 1, letterSpacing: '0.08em' }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="font-display text-6xl font-bold leading-none text-white drop-shadow-[0_0_30px_rgba(92,225,230,0.45)] sm:text-8xl"
        >
          MOON SHIFT
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }}
          className="mt-5 max-w-xl text-lg leading-relaxed text-white/90 sm:text-xl"
        >
          Three astronauts. One small outpost. Seven days on the Moon. Make smart engineering choices and keep your crew alive.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }} className="mt-8">
          <Button onClick={onStart} className="!px-10 !py-4 !text-2xl">
            <Rocket size={26} aria-hidden /> Start Mission
          </Button>
          <p className="mt-3 text-sm text-white/60">Music and sounds begin after you press Start.</p>
        </motion.div>
      </section>

      <footer className="relative z-10 p-4 text-center text-xs text-white/70 sm:text-sm">
        Made for the NASA Space Apps Challenge 2026. Not an official NASA product. Solar event data from NASA DONKI.
      </footer>
    </main>
  )
}
