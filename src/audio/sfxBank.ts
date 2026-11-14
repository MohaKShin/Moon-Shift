/**
 * Original procedural sound effects. Every sound is layered from filtered noise,
 * detuned oscillators and soft envelopes: tactile and low-key, no arcade bleeps.
 */
export type SfxId =
  | 'click' | 'confirm' | 'notify' | 'success' | 'failed'
  | 'water+' | 'water-' | 'energy+' | 'energy-' | 'safety+' | 'safety-'
  | 'st-storm' | 'st-leak' | 'st-tank' | 'st-power' | 'st-heat' | 'st-static' | 'st-grit'
  | 'st-frost' | 'st-impact' | 'st-quake' | 'st-calm'
  | 'act-sweep' | 'act-door' | 'act-seal' | 'act-pump' | 'act-power' | 'act-warm' | 'act-grow' | 'act-radio'

export interface SfxDef { play: (c: AudioContext, out: AudioNode) => void; dur: number; pri: 0 | 1 | 2 }

let white: AudioBuffer | null = null
let brownBuf: AudioBuffer | null = null
function noiseBuf(c: AudioContext, brown: boolean) {
  const cached = brown ? brownBuf : white
  if (cached && cached.sampleRate === c.sampleRate) return cached
  const len = c.sampleRate * 2
  const b = c.createBuffer(1, len, c.sampleRate)
  const d = b.getChannelData(0)
  let last = 0
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1
    if (brown) { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5 } else d[i] = w
  }
  if (brown) brownBuf = b; else white = b
  return b
}

interface N { t?: number; dur: number; type?: BiquadFilterType; f0: number; f1?: number; q?: number; g?: number; a?: number; brown?: boolean }
function nz(c: AudioContext, out: AudioNode, o: N) {
  const t = c.currentTime + (o.t ?? 0)
  const src = c.createBufferSource()
  src.buffer = noiseBuf(c, !!o.brown)
  src.loop = true
  const f = c.createBiquadFilter()
  f.type = o.type ?? 'bandpass'
  f.Q.value = o.q ?? 1
  f.frequency.setValueAtTime(o.f0, t)
  if (o.f1) f.frequency.exponentialRampToValueAtTime(o.f1, t + o.dur)
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(o.g ?? 0.2, t + (o.a ?? 0.01))
  g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur)
  src.connect(f); f.connect(g); g.connect(out)
  src.start(t, Math.random()); src.stop(t + o.dur + 0.05)
}

interface O { t?: number; dur: number; type?: OscillatorType; f0: number; f1?: number; g?: number; a?: number; lp?: number }
function osc(c: AudioContext, out: AudioNode, o: O) {
  const t = c.currentTime + (o.t ?? 0)
  const s = c.createOscillator()
  s.type = o.type ?? 'sine'
  s.frequency.setValueAtTime(o.f0, t)
  if (o.f1) s.frequency.exponentialRampToValueAtTime(o.f1, t + o.dur)
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(o.g ?? 0.15, t + (o.a ?? 0.01))
  g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur)
  let node: AudioNode = s
  if (o.lp) { const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = o.lp; s.connect(f); node = f }
  node.connect(g); g.connect(out)
  s.start(t); s.stop(t + o.dur + 0.05)
}

const def = (dur: number, pri: 0 | 1 | 2, play: SfxDef['play']): SfxDef => ({ dur, pri, play })

export const SFX_BANK: Record<SfxId, SfxDef> = {
  // ---- interface ----
  click: def(0.1, 0, (c, o) => {
    nz(c, o, { f0: 2600, q: 3, dur: 0.03, g: 0.16 })
    osc(c, o, { f0: 170, f1: 90, dur: 0.06, g: 0.2 })
  }),
  confirm: def(0.5, 0, (c, o) => {
    osc(c, o, { f0: 88, f1: 52, dur: 0.24, g: 0.45 })
    nz(c, o, { f0: 1800, q: 4, dur: 0.05, g: 0.18 })
    nz(c, o, { type: 'lowpass', f0: 500, dur: 0.14, g: 0.2 })
    osc(c, o, { t: 0.03, f0: 1240, type: 'triangle', dur: 0.4, g: 0.04, lp: 3000 })
    osc(c, o, { t: 0.03, f0: 1873, type: 'triangle', dur: 0.3, g: 0.03, lp: 3000 })
  }),
  notify: def(1.6, 1, (c, o) => {
    nz(c, o, { f0: 400, f1: 1400, q: 0.7, dur: 0.9, a: 0.45, g: 0.1 })
    osc(c, o, { f0: 55, dur: 1.3, a: 0.3, g: 0.28 })
    osc(c, o, { t: 0.35, f0: 392, type: 'triangle', dur: 1.3, a: 0.4, g: 0.045, lp: 1200 })
    osc(c, o, { t: 0.5, f0: 587, type: 'triangle', dur: 1.2, a: 0.4, g: 0.03, lp: 1200 })
  }),
  success: def(4, 2, (c, o) => {
    ;[261.6, 329.6, 392, 523.3].forEach((f) => osc(c, o, { f0: f, type: 'triangle', dur: 3.6, a: 0.7, g: 0.06, lp: 1800 }))
    ;[523.3, 659.3, 784, 1046.5].forEach((f, i) => osc(c, o, { t: 0.5 + i * 0.3, f0: f, dur: 2.6, a: 0.02, g: 0.05, lp: 4000 }))
    osc(c, o, { f0: 65.4, dur: 3.4, a: 0.3, g: 0.25 })
    nz(c, o, { f0: 600, f1: 2400, q: 0.5, dur: 2.6, a: 1.2, g: 0.05 })
  }),
  failed: def(3.6, 2, (c, o) => {
    nz(c, o, { t: 0, f0: 2000, q: 5, dur: 0.03, g: 0.18 })
    osc(c, o, { t: 0.1, f0: 52, f1: 30, dur: 1, g: 0.35 })
    osc(c, o, { f0: 110, f1: 32, type: 'sawtooth', dur: 3, g: 0.07, lp: 300 })
    nz(c, o, { type: 'lowpass', brown: true, f0: 220, f1: 60, dur: 3.4, a: 0.2, g: 0.35 })
  }),
  // ---- resources ----
  'water+': def(0.7, 0, (c, o) => {
    osc(c, o, { f0: 700, f1: 1500, dur: 0.12, g: 0.18 })
    osc(c, o, { t: 0.06, f0: 1500, dur: 0.5, g: 0.035 })
    nz(c, o, { type: 'highpass', f0: 4000, dur: 0.05, g: 0.05 })
  }),
  'water-': def(0.6, 0, (c, o) => {
    osc(c, o, { f0: 900, f1: 300, dur: 0.2, g: 0.16 })
    nz(c, o, { f0: 800, q: 6, dur: 0.25, g: 0.07 })
    osc(c, o, { t: 0.1, f0: 180, dur: 0.3, g: 0.07 })
  }),
  'energy+': def(0.7, 0, (c, o) => {
    osc(c, o, { f0: 90, f1: 260, type: 'sawtooth', dur: 0.5, a: 0.08, g: 0.1, lp: 700 })
    osc(c, o, { f0: 180, f1: 520, type: 'triangle', dur: 0.5, a: 0.08, g: 0.035, lp: 1400 })
    nz(c, o, { t: 0.35, f0: 5000, q: 5, dur: 0.1, g: 0.035 })
  }),
  'energy-': def(0.7, 0, (c, o) => {
    osc(c, o, { f0: 240, f1: 60, type: 'sawtooth', dur: 0.55, g: 0.1, lp: 500 })
    ;[0.05, 0.19, 0.3].forEach((t) => nz(c, o, { t, f0: 3000, q: 8, dur: 0.05, g: 0.07 }))
  }),
  'safety+': def(1.1, 0, (c, o) => {
    osc(c, o, { f0: 330, type: 'triangle', dur: 0.9, a: 0.03, g: 0.09, lp: 1400 })
    osc(c, o, { t: 0.09, f0: 495, type: 'triangle', dur: 0.9, a: 0.03, g: 0.06, lp: 1400 })
    osc(c, o, { f0: 165, dur: 1, a: 0.04, g: 0.08 })
  }),
  'safety-': def(0.5, 0, (c, o) => {
    osc(c, o, { f0: 120, f1: 58, dur: 0.32, g: 0.3 })
    nz(c, o, { type: 'lowpass', f0: 300, dur: 0.16, g: 0.14 })
  }),
  // ---- event arrival stingers (low-key, cinematic) ----
  'st-storm': def(2.8, 2, (c, o) => {
    nz(c, o, { type: 'lowpass', brown: true, f0: 90, f1: 190, q: 0.7, dur: 2.6, a: 1.2, g: 0.5 })
    osc(c, o, { t: 0.5, f0: 247, type: 'triangle', dur: 0.4, g: 0.045, lp: 700 })
    osc(c, o, { t: 1.2, f0: 247, type: 'triangle', dur: 0.4, g: 0.045, lp: 700 })
    nz(c, o, { f0: 5000, q: 2, dur: 1.5, a: 0.8, g: 0.02 })
  }),
  'st-leak': def(1.8, 2, (c, o) => {
    osc(c, o, { f0: 120, f1: 70, dur: 0.16, g: 0.2 })
    nz(c, o, { type: 'highpass', f0: 3000, f1: 1500, dur: 1.6, a: 0.05, g: 0.2 })
    nz(c, o, { f0: 6000, q: 3, dur: 1.4, g: 0.07 })
    osc(c, o, { t: 0.04, f0: 1600, type: 'triangle', dur: 0.05, g: 0.05 })
  }),
  'st-tank': def(1.6, 2, (c, o) => {
    osc(c, o, { f0: 150, f1: 110, dur: 0.5, g: 0.28 })
    nz(c, o, { f0: 320, q: 12, dur: 0.45, g: 0.22 })
    osc(c, o, { t: 0.38, f0: 125, f1: 92, dur: 0.5, g: 0.18 })
    osc(c, o, { t: 0.95, f0: 1100, f1: 700, dur: 0.1, g: 0.08 })
  }),
  'st-power': def(1.6, 2, (c, o) => {
    nz(c, o, { f0: 2200, q: 5, dur: 0.03, g: 0.22 })
    osc(c, o, { f0: 140, f1: 35, type: 'sawtooth', dur: 1.4, g: 0.12, lp: 500 })
    osc(c, o, { t: 0.05, f0: 60, f1: 38, dur: 0.9, g: 0.4 })
    nz(c, o, { t: 0.05, type: 'lowpass', brown: true, f0: 120, dur: 1.1, g: 0.35 })
    nz(c, o, { t: 0.45, f0: 2200, q: 5, dur: 0.03, g: 0.2 })
  }),
  'st-heat': def(1.8, 2, (c, o) => {
    osc(c, o, { f0: 180, f1: 212, type: 'sawtooth', dur: 1.1, a: 0.3, g: 0.045, lp: 700 })
    osc(c, o, { f0: 183, f1: 204, type: 'sawtooth', dur: 1.1, a: 0.3, g: 0.045, lp: 700 })
    nz(c, o, { f0: 900, q: 8, dur: 1, a: 0.4, g: 0.09 })
    nz(c, o, { t: 0.3, f0: 1200, f1: 600, q: 0.5, dur: 1.4, a: 0.5, g: 0.11 })
    ;[0.2, 0.55, 0.9].forEach((t) => nz(c, o, { t, f0: 3000, q: 6, dur: 0.02, g: 0.1 }))
  }),
  'st-static': def(1.2, 2, (c, o) => {
    ;[0, 0.13, 0.3].forEach((t, i) => nz(c, o, { t, type: 'highpass', f0: 1800 + i * 600, dur: 0.1, g: 0.14 }))
    osc(c, o, { t: 0.5, f0: 700, f1: 180, dur: 0.5, g: 0.06, lp: 900 })
    nz(c, o, { t: 0.45, f0: 400, dur: 0.4, g: 0.05 })
  }),
  'st-grit': def(1.1, 2, (c, o) => {
    nz(c, o, { f0: 3500, q: 0.8, dur: 0.9, a: 0.1, g: 0.09 })
    nz(c, o, { f0: 1200, q: 1, dur: 0.8, g: 0.07 })
    osc(c, o, { f0: 80, dur: 0.3, g: 0.2 })
  }),
  'st-frost': def(2.4, 2, (c, o) => {
    nz(c, o, { f0: 500, f1: 900, q: 1.2, dur: 2.2, a: 0.8, g: 0.16 })
    nz(c, o, { t: 0.8, type: 'highpass', f0: 6000, dur: 0.05, g: 0.14 })
    osc(c, o, { t: 0.82, f0: 2400, f1: 1800, dur: 0.15, g: 0.03 })
    osc(c, o, { f0: 1568, type: 'triangle', dur: 0.8, a: 0.1, g: 0.018 })
  }),
  'st-impact': def(1.8, 2, (c, o) => {
    osc(c, o, { f0: 90, f1: 40, dur: 0.4, g: 0.5 })
    nz(c, o, { type: 'lowpass', f0: 800, dur: 0.2, g: 0.35 })
    nz(c, o, { t: 0.15, type: 'highpass', f0: 3000, dur: 1.2, a: 0.05, g: 0.1 })
    osc(c, o, { f0: 540, type: 'triangle', dur: 0.8, g: 0.04 })
  }),
  'st-quake': def(2.6, 2, (c, o) => {
    nz(c, o, { type: 'lowpass', brown: true, f0: 70, f1: 110, dur: 2.4, a: 0.3, g: 0.7 })
    osc(c, o, { f0: 38, dur: 2, a: 0.4, g: 0.35 })
    ;[0.2, 0.6, 1.1, 1.5].forEach((t) => nz(c, o, { t, f0: 1800, q: 2, dur: 0.1, g: 0.05 }))
  }),
  'st-calm': def(2, 1, (c, o) => {
    osc(c, o, { f0: 392, dur: 1.8, a: 0.05, g: 0.07, lp: 1500 })
    osc(c, o, { t: 0.15, f0: 587, dur: 1.6, a: 0.05, g: 0.05, lp: 1500 })
    osc(c, o, { t: 0.3, f0: 784, dur: 1.4, a: 0.05, g: 0.035, lp: 1500 })
    nz(c, o, { f0: 800, f1: 2000, dur: 1.2, a: 0.6, g: 0.03 })
  }),
  // ---- player-action consequences ----
  'act-sweep': def(0.9, 1, (c, o) => {
    nz(c, o, { f0: 2500, f1: 1500, q: 0.8, dur: 0.45, a: 0.1, g: 0.13 })
    nz(c, o, { t: 0.4, f0: 1500, f1: 2600, q: 0.8, dur: 0.45, a: 0.1, g: 0.12 })
  }),
  'act-door': def(1, 1, (c, o) => {
    osc(c, o, { f0: 70, dur: 0.25, g: 0.35 })
    nz(c, o, { f0: 600, q: 2, dur: 0.35, g: 0.14 })
    nz(c, o, { t: 0.3, f0: 2500, q: 5, dur: 0.03, g: 0.18 })
    osc(c, o, { t: 0.2, f0: 150, f1: 400, type: 'triangle', dur: 0.7, a: 0.2, g: 0.035, lp: 900 })
  }),
  'act-seal': def(0.8, 1, (c, o) => {
    nz(c, o, { type: 'highpass', f0: 3500, dur: 0.4, g: 0.13 })
    osc(c, o, { t: 0.35, f0: 100, f1: 60, dur: 0.18, g: 0.32 })
    nz(c, o, { t: 0.35, f0: 2400, q: 5, dur: 0.03, g: 0.15 })
  }),
  'act-pump': def(1.2, 1, (c, o) => {
    osc(c, o, { f0: 60, f1: 92, type: 'sawtooth', dur: 0.9, a: 0.1, g: 0.08, lp: 220 })
    nz(c, o, { f0: 400, q: 2, dur: 0.9, a: 0.3, g: 0.11 })
    osc(c, o, { t: 0.55, f0: 400, f1: 220, dur: 0.12, g: 0.05 })
  }),
  'act-power': def(1.4, 1, (c, o) => {
    nz(c, o, { f0: 2200, q: 5, dur: 0.03, g: 0.18 })
    osc(c, o, { f0: 55, f1: 180, type: 'sawtooth', dur: 1.2, a: 0.6, g: 0.11, lp: 500 })
    osc(c, o, { f0: 110, f1: 360, type: 'triangle', dur: 1.2, a: 0.6, g: 0.035, lp: 1200 })
    nz(c, o, { t: 0.9, f0: 4500, q: 6, dur: 0.1, g: 0.05 })
  }),
  'act-warm': def(1.4, 1, (c, o) => {
    osc(c, o, { f0: 110, f1: 130, type: 'triangle', dur: 1.3, a: 0.5, g: 0.06, lp: 400 })
    nz(c, o, { f0: 700, dur: 1.2, a: 0.5, g: 0.06 })
    ;[0, 0.12, 0.3].forEach((t) => nz(c, o, { t, f0: 3000, q: 6, dur: 0.02, g: 0.09 }))
  }),
  'act-grow': def(1, 1, (c, o) => {
    nz(c, o, { f0: 2200, f1: 3200, q: 2, dur: 0.6, a: 0.2, g: 0.045 })
    osc(c, o, { f0: 200, f1: 320, dur: 0.7, a: 0.3, g: 0.05 })
    osc(c, o, { t: 0.4, f0: 1300, f1: 800, dur: 0.1, g: 0.06 })
  }),
  'act-radio': def(0.8, 1, (c, o) => {
    nz(c, o, { type: 'highpass', f0: 2000, dur: 0.1, g: 0.09 })
    osc(c, o, { t: 0.15, f0: 880, type: 'triangle', dur: 0.1, g: 0.035, lp: 1800 })
    osc(c, o, { t: 0.3, f0: 1175, type: 'triangle', dur: 0.1, g: 0.03, lp: 1800 })
    nz(c, o, { t: 0.3, f0: 3000, dur: 0.2, g: 0.03 })
  }),
}

/** Which arrival stinger and action sound go with each event category. */
export const STINGER: Record<string, SfxId> = {
  solar: 'st-storm', radiation: 'st-storm', oxygen: 'st-leak', water: 'st-tank', power: 'st-power',
  heat: 'st-heat', comms: 'st-static', dust: 'st-grit', cold: 'st-frost', impact: 'st-impact',
  quake: 'st-quake', rover: 'st-grit', food: 'st-calm', morale: 'st-calm', ice: 'st-calm',
}
export const ACTION: Record<string, SfxId> = {
  dust: 'act-sweep', solar: 'act-door', radiation: 'act-door', oxygen: 'act-seal', impact: 'act-seal',
  water: 'act-pump', heat: 'act-pump', power: 'act-power', cold: 'act-warm', food: 'act-grow',
  comms: 'act-radio', quake: 'act-door', rover: 'act-pump', ice: 'act-pump', morale: 'act-warm',
}
