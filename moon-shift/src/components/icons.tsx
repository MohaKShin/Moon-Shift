import {
  Sun, Wind, Droplets, BatteryLow, Sprout, ShieldAlert, Flame, Radio, Sparkles, Snowflake,
  Orbit, Activity, Heart, Truck, Gem, Zap, ShieldCheck, Users, type LucideIcon,
} from 'lucide-react'
import type { Category, ResourceKey } from '../game/types'

export const CATEGORY_ICON: Record<Category, LucideIcon> = {
  solar: Sun, oxygen: Wind, water: Droplets, power: BatteryLow, food: Sprout, radiation: ShieldAlert,
  heat: Flame, comms: Radio, dust: Sparkles, cold: Snowflake, impact: Orbit, quake: Activity,
  morale: Heart, rover: Truck, ice: Gem,
}

export const RESOURCE_META: Record<ResourceKey, { label: string; Icon: LucideIcon; color: string; text: string }> = {
  water: { label: 'Water', Icon: Droplets, color: '#5CE1E6', text: 'text-earth' },
  energy: { label: 'Energy', Icon: Zap, color: '#FFB84D', text: 'text-solar' },
  safety: { label: 'Crew Safety', Icon: ShieldCheck, color: '#7BE0A4', text: 'text-moss' },
}

export { Users }
