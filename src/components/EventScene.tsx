import type { ComponentType } from 'react'
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion'
import { SceneDefs, type SceneProps } from './scene/parts'
import { DustScene, GardenScene, OxygenScene, PowerScene, SolarScene, WaterScene } from './scene/scenes1'
import { ColdScene, CommsScene, HeatScene, HomesickScene, IceScene, ImpactScene, QuakeScene, RoverScene, ShieldScene, SunnyScene } from './scene/scenes2'
import type { Category } from '../game/types'

const SCENES: Record<string, ComponentType<SceneProps>> = {
  'dusty-panels': DustScene,
  'solar-storm': SolarScene,
  'oxygen-leak': OxygenScene,
  'water-shortage': WaterScene,
  'night-power': PowerScene,
  'garden-trouble': GardenScene,
  'hot-machine': HeatScene,
  'comms-down': CommsScene,
  'cold-snap': ColdScene,
  'space-rock': ImpactScene,
  moonquake: QuakeScene,
  'shield-time': ShieldScene,
  homesick: HomesickScene,
  'rover-stuck': RoverScene,
  'sunny-day': SunnyScene,
  'ice-find': IceScene,
}

const ALT: Record<string, string> = {
  'dusty-panels': 'Solar panels covered in moon dust',
  'solar-storm': 'A glowing Sun sending particles toward the outpost',
  'oxygen-leak': 'A life support unit leaking air',
  'water-shortage': 'Nearly empty water tanks and a water recycler',
  'night-power': 'A dark outpost at night with a battery bank',
  'garden-trouble': 'A greenhouse with droopy plants',
  'hot-machine': 'An overheating machine with a radiator',
  'comms-down': 'A radio dish pointing away from Earth',
  'cold-snap': 'A frosty habitat and a thermometer',
  'space-rock': 'A small hole in the habitat roof',
  moonquake: 'Cracked ground and a leaking pipe',
  'shield-time': 'Radiation streaming toward the habitat',
  homesick: 'Three astronauts looking at Earth',
  'rover-stuck': 'A rover stuck in soft dust',
  'sunny-day': 'Bright sunshine on clean solar panels',
  'ice-find': 'Shiny ice inside a crater',
}

const E = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }
const X = { duration: 0.35 }
/** Each kind of problem arrives (and leaves) in its own way. */
const FX: Partial<Record<Category, Variants>> = {
  dust: { enter: { opacity: 0, filter: 'blur(14px) sepia(1)', scale: 1.05 }, center: { opacity: 1, filter: 'blur(0px) sepia(0)', scale: 1, transition: E }, exit: { opacity: 0, filter: 'blur(12px) sepia(1)', x: -30, transition: X } },
  solar: { enter: { opacity: 0, filter: 'brightness(4)' }, center: { opacity: 1, filter: 'brightness(1)', transition: { duration: 0.9 } }, exit: { opacity: 0, filter: 'brightness(3)', transition: X } },
  radiation: { enter: { opacity: 0, filter: 'brightness(2.5) hue-rotate(40deg)' }, center: { opacity: 1, filter: 'brightness(1) hue-rotate(0deg)', transition: E }, exit: { opacity: 0, transition: X } },
  power: { enter: { opacity: 0, filter: 'brightness(0.1)' }, center: { opacity: 1, filter: 'brightness(1)', transition: { duration: 1.1 } }, exit: { opacity: 0, filter: 'brightness(0)', transition: X } },
  oxygen: { enter: { opacity: 0, scale: 1.14 }, center: { opacity: 1, scale: 1, transition: E }, exit: { opacity: 0, scale: 0.94, transition: X } },
  impact: { enter: { opacity: 0, scale: 1.1, x: [0, -10, 8, -4, 0] }, center: { opacity: 1, scale: 1, x: 0, transition: E }, exit: { opacity: 0, transition: X } },
  quake: { enter: { opacity: 0, x: -12 }, center: { opacity: 1, x: [0, 10, -8, 5, 0], transition: { duration: 0.8 } }, exit: { opacity: 0, transition: X } },
  water: { enter: { clipPath: 'inset(100% 0% 0% 0%)', opacity: 1 }, center: { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } }, exit: { opacity: 0, transition: X } },
  ice: { enter: { clipPath: 'inset(0% 50% 0% 50%)', opacity: 1 }, center: { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, transition: { duration: 0.8 } }, exit: { opacity: 0, transition: X } },
  comms: { enter: { opacity: 0, x: 90 }, center: { opacity: 1, x: 0, transition: E }, exit: { opacity: 0, x: -90, transition: X } },
  rover: { enter: { opacity: 0, x: -90 }, center: { opacity: 1, x: 0, transition: E }, exit: { opacity: 0, x: 90, transition: X } },
  heat: { enter: { opacity: 0, filter: 'saturate(3) blur(10px)' }, center: { opacity: 1, filter: 'saturate(1) blur(0px)', transition: E }, exit: { opacity: 0, filter: 'saturate(3) blur(8px)', transition: X } },
  cold: { enter: { opacity: 0, filter: 'grayscale(1) brightness(1.8)' }, center: { opacity: 1, filter: 'grayscale(0) brightness(1)', transition: { duration: 0.9 } }, exit: { opacity: 0, filter: 'grayscale(1) brightness(1.6)', transition: X } },
  food: { enter: { clipPath: 'circle(0% at 45% 85%)', opacity: 1 }, center: { clipPath: 'circle(150% at 45% 85%)', opacity: 1, transition: { duration: 0.9 } }, exit: { opacity: 0, transition: X } },
  morale: { enter: { opacity: 0, y: 14 }, center: { opacity: 1, y: 0, transition: { duration: 1.1 } }, exit: { opacity: 0, transition: { duration: 0.5 } } },
}
const SIMPLE: Variants = { enter: { opacity: 0 }, center: { opacity: 1, transition: { duration: 0.3 } }, exit: { opacity: 0, transition: { duration: 0.2 } } }

interface Props { eventId: string; category: Category; pick: string | null; energy: number; className?: string }

export function EventScene({ eventId, category, pick, energy, className = '' }: Props) {
  const reduce = useReducedMotion()
  const Scene = SCENES[eventId] ?? DustScene
  const variants = reduce ? SIMPLE : FX[category] ?? SIMPLE
  return (
    <div className={`relative overflow-hidden bg-[#050a1c] ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={eventId} variants={variants} initial="enter" animate="center" exit="exit" className="absolute inset-0">
          <svg viewBox="0 0 800 360" preserveAspectRatio="xMidYMax slice" className="h-full w-full" role="img" aria-label={ALT[eventId] ?? 'Lunar outpost'}>
            <SceneDefs />
            <Scene pick={pick} energy={energy} />
          </svg>
        </motion.div>
      </AnimatePresence>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(3,6,15,0.55)_100%)]" />
    </div>
  )
}
