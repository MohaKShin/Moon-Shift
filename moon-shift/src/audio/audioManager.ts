/**
 * Centralised audio. Everything starts only after unlock() is called from a user click.
 * Music: tries /audio/<file>.mp3 first; if the file is missing or can't be decoded,
 * it falls back to original music synthesised live with the Web Audio API.
 */
export type MusicId = 'menu' | 'gameplay' | 'emergency' | 'victory' | 'failure'
export type SfxId = 'click' | 'alert' | 'good' | 'bad' | 'success' | 'failed' | 'day'

export interface AudioSettings {
  music: number
  sfx: number
  muted: boolean
  unlocked: boolean
}

const MUSIC_FILES: Record<MusicId, string> = {
  menu: 'main-theme.mp3',
  gameplay: 'gameplay.mp3',
  emergency: 'emergency.mp3',
  victory: 'victory.mp3',
  failure: 'mission-failed.mp3',
}
const SFX_FILES: Partial<Record<SfxId, string>> = { click: 'button-click.mp3', alert: 'alert.mp3' }

const mtof = (m: number) => 440 * Math.pow(2, (m - 69) / 12)
const FADE = 2.2

interface Scene {
  gain: GainNode
  stop: () => void
}
type Builder = (ctx: AudioContext, out: GainNode, reverb: AudioNode) => () => void

class AudioManager {
  private ctx: AudioContext | null = null
  private master!: GainNode
  private musicBus!: GainNode
  private sfxBus!: GainNode
  private reverb!: ConvolverNode
  private current: (Scene & { id: MusicId }) | null = null
  private wanted: MusicId | null = null
  private token = 0
  private buffers = new Map<string, AudioBuffer | null>()
  private loading = new Map<string, Promise<AudioBuffer | null>>()
  private listeners = new Set<() => void>()
  private state: AudioSettings = { music: 0.6, sfx: 0.7, muted: false, unlocked: false }

  // ---- store api (for React) ----
  subscribe = (fn: () => void) => {
    this.listeners.add(fn)
    return () => { this.listeners.delete(fn) }
  }
  getSnapshot = () => this.state
  private set(patch: Partial<AudioSettings>) {
    this.state = { ...this.state, ...patch }
    this.listeners.forEach((l) => l())
    this.applyVolumes()
  }

  /** Must be called from a click/tap. Safe to call repeatedly. */
  unlock() {
    try {
      if (!this.ctx) {
        const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        if (!Ctor) return
        this.ctx = new Ctor()
        this.master = this.ctx.createGain()
        this.musicBus = this.ctx.createGain()
        this.sfxBus = this.ctx.createGain()
        this.musicBus.connect(this.master)
        this.sfxBus.connect(this.master)
        this.master.connect(this.ctx.destination)
        this.reverb = this.makeReverb(this.ctx)
        const wet = this.ctx.createGain()
        wet.gain.value = 0.55
        this.reverb.connect(wet)
        wet.connect(this.musicBus)
        Object.values(MUSIC_FILES).forEach((f) => void this.loadBuffer(f))
        Object.values(SFX_FILES).forEach((f) => f && void this.loadBuffer(f))
      }
      void this.ctx.resume()
      this.set({ unlocked: true })
      if (this.wanted) void this.startMusic(this.wanted)
    } catch {
      /* audio is optional: never break the game */
    }
  }

  setMusicVolume(v: number) { this.set({ music: Math.max(0, Math.min(1, v)) }) }
  setSfxVolume(v: number) { this.set({ sfx: Math.max(0, Math.min(1, v)) }) }
  toggleMute() { this.set({ muted: !this.state.muted }) }

  private applyVolumes() {
    if (!this.ctx) return
    const t = this.ctx.currentTime
    this.master.gain.setTargetAtTime(this.state.muted ? 0 : 1, t, 0.05)
    this.musicBus.gain.setTargetAtTime(this.state.music * 0.9, t, 0.05)
    this.sfxBus.gain.setTargetAtTime(this.state.sfx, t, 0.05)
  }

  // ---- music ----
  setMusic(id: MusicId) {
    this.wanted = id
    if (!this.ctx || !this.state.unlocked) return
    if (this.current?.id === id) return
    void this.startMusic(id)
  }

  private async startMusic(id: MusicId) {
    const ctx = this.ctx
    if (!ctx) return
    if (this.current?.id === id) return
    const my = ++this.token
    let buffer: AudioBuffer | null = null
    try { buffer = await this.loadBuffer(MUSIC_FILES[id]) } catch { buffer = null }
    if (my !== this.token || !this.ctx) return

    const gain = ctx.createGain()
    gain.gain.value = 0
    gain.connect(this.musicBus)
    let stop: () => void
    try {
      if (buffer) {
        const src = ctx.createBufferSource()
        src.buffer = buffer
        src.loop = id !== 'failure'
        src.connect(gain)
        src.start()
        stop = () => { try { src.stop() } catch { /* already stopped */ } }
      } else {
        stop = SYNTH[id](ctx, gain, this.reverb)
      }
    } catch {
      gain.disconnect()
      return
    }

    const t = ctx.currentTime
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(1, t + FADE)

    const old = this.current
    if (old) {
      old.gain.gain.cancelScheduledValues(t)
      old.gain.gain.setValueAtTime(old.gain.gain.value, t)
      old.gain.gain.linearRampToValueAtTime(0, t + FADE)
      window.setTimeout(() => { old.stop(); old.gain.disconnect() }, FADE * 1000 + 200)
    }
    this.current = { id, gain, stop }
  }

  stopMusic() {
    this.wanted = null
    this.token++
    const old = this.current
    this.current = null
    if (old && this.ctx) {
      const t = this.ctx.currentTime
      old.gain.gain.setValueAtTime(old.gain.gain.value, t)
      old.gain.gain.linearRampToValueAtTime(0, t + 1)
      window.setTimeout(() => { old.stop(); old.gain.disconnect() }, 1200)
    }
  }

  // ---- sfx ----
  async sfx(id: SfxId) {
    const ctx = this.ctx
    if (!ctx || !this.state.unlocked || this.state.muted) return
    try {
      const file = SFX_FILES[id]
      if (file) {
        const buf = await this.loadBuffer(file)
        if (buf) {
          const src = ctx.createBufferSource()
          src.buffer = buf
          src.connect(this.sfxBus)
          src.start()
          return
        }
      }
      SFX_SYNTH[id](ctx, this.sfxBus)
    } catch { /* ignore */ }
  }

  // ---- helpers ----
  private loadBuffer(file: string): Promise<AudioBuffer | null> {
    const cached = this.buffers.get(file)
    if (cached !== undefined) return Promise.resolve(cached)
    const existing = this.loading.get(file)
    if (existing) return existing
    const p = (async () => {
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}audio/${file}`)
        const type = res.headers.get('content-type') ?? ''
        if (!res.ok || type.includes('text/html')) return null
        const data = await res.arrayBuffer()
        if (!this.ctx) return null
        return await this.ctx.decodeAudioData(data)
      } catch {
        return null
      }
    })().then((b) => { this.buffers.set(file, b); return b })
    this.loading.set(file, p)
    return p
  }

  private makeReverb(ctx: AudioContext) {
    const len = ctx.sampleRate * 3
    const impulse = ctx.createBuffer(2, len, ctx.sampleRate)
    for (let c = 0; c < 2; c++) {
      const d = impulse.getChannelData(c)
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3)
    }
    const conv = ctx.createConvolver()
    conv.buffer = impulse
    return conv
  }
}

// ---------- synthesised music (original, generated live) ----------
function pad(
  ctx: AudioContext, out: AudioNode,
  o: { chords: number[][]; secs: number; wave: OscillatorType; cutoff: number; level: number },
) {
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = o.cutoff
  lp.Q.value = 0.6
  const bus = ctx.createGain()
  bus.gain.value = o.level
  lp.connect(bus)
  bus.connect(out)

  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  lfo.frequency.value = 0.07
  lfoGain.gain.value = o.cutoff * 0.35
  lfo.connect(lfoGain)
  lfoGain.connect(lp.frequency)
  lfo.start()

  const voices = o.chords[0].map((m) => {
    const oscs = [-7, 7].map((cents) => {
      const osc = ctx.createOscillator()
      osc.type = o.wave
      osc.frequency.value = mtof(m)
      osc.detune.value = cents
      const g = ctx.createGain()
      g.gain.value = 0.18
      osc.connect(g)
      g.connect(lp)
      osc.start()
      return osc
    })
    return oscs
  })

  let i = 0
  const timer = window.setInterval(() => {
    i = (i + 1) % o.chords.length
    const t = ctx.currentTime
    voices.forEach((oscs, v) => oscs.forEach((osc) => osc.frequency.setTargetAtTime(mtof(o.chords[i][v]), t, 1.6)))
  }, o.secs * 1000)

  return () => {
    window.clearInterval(timer)
    voices.flat().forEach((osc) => { try { osc.stop() } catch { /* noop */ } })
    try { lfo.stop() } catch { /* noop */ }
  }
}

function bell(ctx: AudioContext, out: AudioNode, reverb: AudioNode, midi: number, level = 0.18, dur = 3.2) {
  const t = ctx.currentTime
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(level, t + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  const a = ctx.createOscillator()
  const b = ctx.createOscillator()
  a.type = 'sine'; b.type = 'triangle'
  a.frequency.value = mtof(midi)
  b.frequency.value = mtof(midi) * 2
  const bg = ctx.createGain()
  bg.gain.value = 0.25
  a.connect(g); b.connect(bg); bg.connect(g)
  g.connect(out); g.connect(reverb)
  a.start(t); b.start(t); a.stop(t + dur + 0.1); b.stop(t + dur + 0.1)
}

function thump(ctx: AudioContext, out: AudioNode, freq: number, level: number, dur = 0.35) {
  const t = ctx.currentTime
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = 'sine'
  o.frequency.setValueAtTime(freq * 1.8, t)
  o.frequency.exponentialRampToValueAtTime(freq, t + 0.12)
  g.gain.setValueAtTime(level, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g); g.connect(out)
  o.start(t); o.stop(t + dur + 0.05)
}

const menu: Builder = (ctx, out, reverb) => {
  const stopPad = pad(ctx, out, {
    chords: [[50, 57, 62, 65], [46, 53, 62, 65], [43, 50, 58, 62], [45, 52, 60, 64]],
    secs: 9, wave: 'sine', cutoff: 1200, level: 0.7,
  })
  const scale = [62, 65, 67, 69, 72, 74, 77]
  let alive = true
  const play = () => {
    if (!alive) return
    bell(ctx, out, reverb, scale[Math.floor(Math.random() * scale.length)])
    window.setTimeout(play, 2400 + Math.random() * 3200)
  }
  window.setTimeout(play, 1200)
  return () => { alive = false; stopPad() }
}

const gameplay: Builder = (ctx, out) => {
  const stopPad = pad(ctx, out, {
    chords: [[48, 55, 59, 62], [45, 52, 57, 60], [41, 48, 55, 60], [43, 50, 55, 59]],
    secs: 12, wave: 'triangle', cutoff: 700, level: 0.6,
  })
  let n = 0
  const pulse = window.setInterval(() => {
    n++
    thump(ctx, out, 65, 0.05, 0.5)
    if (n % 4 === 2) thump(ctx, out, 98, 0.025, 0.3)
  }, 1000)
  return () => { window.clearInterval(pulse); stopPad() }
}

const emergency: Builder = (ctx, out) => {
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'; lp.frequency.value = 380
  const bus = ctx.createGain()
  bus.gain.value = 0.55
  lp.connect(bus); bus.connect(out)
  const oscs = [55, 58.3, 110.6].map((f, i) => {
    const o = ctx.createOscillator()
    o.type = i === 2 ? 'triangle' : 'sawtooth'
    o.frequency.value = f
    const g = ctx.createGain()
    g.gain.value = i === 2 ? 0.1 : 0.2
    o.connect(g); g.connect(lp)
    o.start()
    return o
  })
  const lfo = ctx.createOscillator()
  const lg = ctx.createGain()
  lfo.frequency.value = 0.12; lg.gain.value = 150
  lfo.connect(lg); lg.connect(lp.frequency); lfo.start()
  const tension = ctx.createOscillator()
  const tg = ctx.createGain()
  tension.type = 'sine'; tension.frequency.value = 466; tg.gain.value = 0.02
  tension.connect(tg); tg.connect(out); tension.start()
  const pulse = window.setInterval(() => thump(ctx, out, 60, 0.12, 0.3), 667)
  return () => {
    window.clearInterval(pulse)
    ;[...oscs, lfo, tension].forEach((o) => { try { o.stop() } catch { /* noop */ } })
  }
}

const victory: Builder = (ctx, out, reverb) => {
  const stopPad = pad(ctx, out, {
    chords: [[48, 55, 64, 67], [45, 57, 64, 69], [41, 53, 60, 65], [43, 55, 62, 67]],
    secs: 6, wave: 'triangle', cutoff: 1800, level: 0.7,
  })
  const arp = [72, 76, 79, 84, 79, 76]
  let i = 0
  const timer = window.setInterval(() => { bell(ctx, out, reverb, arp[i++ % arp.length], 0.16, 2.8) }, 900)
  return () => { window.clearInterval(timer); stopPad() }
}

const failure: Builder = (ctx, out) => {
  const t = ctx.currentTime
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.setValueAtTime(900, t)
  lp.frequency.exponentialRampToValueAtTime(70, t + 7)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.5, t)
  g.gain.exponentialRampToValueAtTime(0.001, t + 9)
  lp.connect(g); g.connect(out)
  const oscs = [110, 82.4].map((f) => {
    const o = ctx.createOscillator()
    o.type = 'sawtooth'
    o.frequency.setValueAtTime(f, t)
    o.frequency.exponentialRampToValueAtTime(f / 2.6, t + 7)
    const og = ctx.createGain()
    og.gain.value = 0.18
    o.connect(og); og.connect(lp)
    o.start(t); o.stop(t + 9.5)
    return o
  })
  return () => oscs.forEach((o) => { try { o.stop() } catch { /* noop */ } })
}

const SYNTH: Record<MusicId, Builder> = { menu, gameplay, emergency, victory, failure }

// ---------- synthesised sound effects ----------
function tone(ctx: AudioContext, out: AudioNode, f: number, start: number, dur: number, type: OscillatorType, level: number, slideTo?: number) {
  const t = ctx.currentTime + start
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = type
  o.frequency.setValueAtTime(f, t)
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(level, t + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g); g.connect(out)
  o.start(t); o.stop(t + dur + 0.05)
}

const SFX_SYNTH: Record<SfxId, (ctx: AudioContext, out: AudioNode) => void> = {
  click: (c, o) => tone(c, o, 720, 0, 0.09, 'sine', 0.25, 520),
  alert: (c, o) => { [0, 0.22, 0.44].forEach((d) => tone(c, o, 880, d, 0.14, 'square', 0.1)) },
  good: (c, o) => { [523, 659, 784].forEach((f, i) => tone(c, o, f, i * 0.09, 0.3, 'triangle', 0.2)) },
  bad: (c, o) => tone(c, o, 190, 0, 0.4, 'sawtooth', 0.14, 90),
  day: (c, o) => { tone(c, o, 392, 0, 0.35, 'sine', 0.2); tone(c, o, 523, 0.15, 0.5, 'sine', 0.2) },
  success: (c, o) => { [523, 659, 784, 1047].forEach((f, i) => tone(c, o, f, i * 0.14, 0.8, 'triangle', 0.18)) },
  failed: (c, o) => { [330, 262, 196].forEach((f, i) => tone(c, o, f, i * 0.25, 0.7, 'sine', 0.2)) },
}

export const audio = new AudioManager()
