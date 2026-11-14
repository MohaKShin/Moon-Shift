import type { CSSProperties, ReactNode } from 'react'
import { Astronaut, AstronautDefs } from '../Astronaut'

export interface SceneProps { pick: string | null; energy: number }
export const A = { nova: '#FFB84D', kai: '#5CE1E6', zuri: '#7BE0A4' }
export const WARM = '#FFE9A8'
export const WATER = '#4fc3ff'
export const show = (on: boolean, s = 1.2): CSSProperties => ({ opacity: on ? 1 : 0, transition: `opacity ${s}s ease` })

const rng = (seed: number) => {
  let s = (seed * 2654435761) % 2147483647 || 1
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

export function SceneDefs() {
  return (
    <>
      <AstronautDefs />
      <defs>
        <linearGradient id="es-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#03060f" /><stop offset=".65" stopColor="#0a1230" /><stop offset="1" stopColor="#1d2858" />
        </linearGradient>
        <radialGradient id="es-earth" cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#9be7ff" /><stop offset=".5" stopColor="#2b79d8" /><stop offset="1" stopColor="#0c2557" />
        </radialGradient>
        <linearGradient id="es-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B8BECC" /><stop offset="1" stopColor="#4b526a" />
        </linearGradient>
        <linearGradient id="es-far" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3c476e" /><stop offset="1" stopColor="#1b2347" /></linearGradient>
        <linearGradient id="es-mid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#59627f" /><stop offset="1" stopColor="#2a3358" /></linearGradient>
        <linearGradient id="es-hab" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f2f5fb" /><stop offset="1" stopColor="#8f9ab4" /></linearGradient>
        <linearGradient id="es-panel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3a63d6" /><stop offset="1" stopColor="#14275f" /></linearGradient>
        <linearGradient id="es-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#bfefff" stopOpacity=".34" /><stop offset="1" stopColor="#5CE1E6" stopOpacity=".08" /></linearGradient>
        <radialGradient id="es-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff6cf" /><stop offset=".35" stopColor="#ffb84d" stopOpacity=".6" /><stop offset="1" stopColor="#ff6b6b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="es-heat" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#ff6a3c" stopOpacity=".9" /><stop offset="1" stopColor="#ff6a3c" stopOpacity="0" /></radialGradient>
      </defs>
    </>
  )
}

/** Particles that drift along a vector. Fade in/out when `on` changes. */
export function Dots({ n, x, y, w, h, dx, dy, dur = 6, size = [1, 2.4], color = '#fff', o = 0.7, seed = 1, on = true }: {
  n: number; x: number; y: number; w: number; h: number; dx: number; dy: number
  dur?: number; size?: [number, number]; color?: string; o?: number; seed?: number; on?: boolean
}) {
  const r = rng(seed)
  return (
    <g style={show(on)} aria-hidden>
      {Array.from({ length: n }, (_, i) => {
        const rad = size[0] + r() * (size[1] - size[0])
        const d = dur * (0.7 + r() * 0.6)
        return (
          <circle key={i} cx={x + r() * w} cy={y + r() * h} r={rad} fill={color} className="pf"
            style={{ '--dx': `${dx}px`, '--dy': `${dy}px`, '--o': o, '--d': `${d}s`, animationDelay: `${-r() * d}s` } as CSSProperties} />
        )
      })}
    </g>
  )
}

export function Wash({ color, o }: { color: string; o: number }) {
  return <rect width="800" height="360" fill={color} style={{ opacity: o, transition: 'opacity 1.8s ease', pointerEvents: 'none' }} />
}

interface BackdropProps { earth?: { x: number; y: number; r: number } | false; sun?: { x: number; y: number; r: number }; starBoost?: number }

export function Backdrop({ earth = { x: 660, y: 82, r: 42 }, sun, starBoost = 1 }: BackdropProps) {
  const r = rng(11)
  const stars = Array.from({ length: 54 }, () => ({ x: r() * 800, y: r() * 215, s: 0.6 + r() * 1.5, d: r() * 4 }))
  const far = 'M0 232 L70 205 L150 226 L250 192 L350 228 L470 200 L570 226 L680 196 L800 230'
  const mid = 'M0 252 Q120 222 260 245 T520 240 T800 238'
  const gnd = 'M0 268 Q200 238 400 258 T800 250'
  return (
    <g>
      <rect width="800" height="360" fill="url(#es-sky)" />
      {stars.map((st, i) => (
        <circle key={i} cx={st.x} cy={st.y} r={st.s} fill="#fff" className="animate-twinkle" style={{ animationDelay: `${st.d}s`, opacity: 0.8 * starBoost }} />
      ))}
      {sun && (
        <g>
          <circle cx={sun.x} cy={sun.y} r={sun.r * 3} fill="url(#es-sun)" className="breathe" />
          <circle cx={sun.x} cy={sun.y} r={sun.r * 0.55} fill="#fff6cf" />
        </g>
      )}
      {earth && (
        <g>
          <clipPath id="es-eclip"><circle cx={earth.x} cy={earth.y} r={earth.r} /></clipPath>
          <circle cx={earth.x} cy={earth.y} r={earth.r * 1.35} fill="#5CE1E6" opacity=".09" />
          <circle cx={earth.x} cy={earth.y} r={earth.r} fill="url(#es-earth)" />
          <g clipPath="url(#es-eclip)">
            <g transform={`translate(${earth.x} ${earth.y}) scale(${earth.r / 44})`}>
              <path d="M-30-18c10-12 26-10 30 0s-8 18-4 28-18 14-26 2-8-20 0-30z" fill="#4ea56f" opacity=".85" />
              <path d="M13 14c10-6 22 0 22 10s-12 20-22 12-4-16 0-22z" fill="#4ea56f" opacity=".8" />
              <g className="drift-x" fill="none" stroke="#fff" strokeLinecap="round" opacity=".28">
                <path d="M-43 2c20 6 50-4 84 10" strokeWidth="6" /><path d="M-24-30c26-4 40 6 56 0" strokeWidth="5" />
              </g>
            </g>
          </g>
        </g>
      )}
      <path d={`${far} L800 300 L0 300z`} fill="url(#es-far)" />
      <path d={far} fill="none" stroke="#9fb0e0" strokeOpacity=".25" strokeWidth="1.5" />
      <path d={`${mid} L800 300 L0 300z`} fill="url(#es-mid)" />
      <path d={mid} fill="none" stroke="#c6d2f5" strokeOpacity=".22" strokeWidth="1.5" />
      <path d={`${gnd} L800 360 L0 360z`} fill="url(#es-ground)" />
      <path d={gnd} fill="none" stroke="#f1f5ff" strokeOpacity=".45" strokeWidth="1.8" />
      <g fill="#4b526a" opacity=".55">
        <ellipse cx="120" cy="306" rx="52" ry="9" /><ellipse cx="700" cy="310" rx="60" ry="10" /><ellipse cx="450" cy="332" rx="44" ry="7" />
      </g>
      <g fill="none" stroke="#e8edf9" strokeOpacity=".3" strokeWidth="1.2">
        <path d="M70 303q50 8 100 0" /><path d="M640 307q60 8 120 0" /><path d="M408 329q42 6 84 0" />
      </g>
    </g>
  )
}

export function Foreground({ dust = 1 }: { dust?: number }) {
  return (
    <g aria-hidden>
      <path d="M0 360V316Q30 298 70 311Q110 303 132 332L152 360z" fill="#141a36" />
      <path d="M800 360V322Q770 296 730 310Q690 306 668 340L650 360z" fill="#141a36" />
      <path d="M0 316Q30 298 70 311Q110 303 132 332" fill="none" stroke="#8fa0d0" strokeOpacity=".4" strokeWidth="1.5" />
      <path d="M800 322Q770 296 730 310Q690 306 668 340" fill="none" stroke="#8fa0d0" strokeOpacity=".4" strokeWidth="1.5" />
      <Dots n={Math.round(14 * dust)} x={0} y={252} w={780} h={100} dx={90} dy={-14} dur={9} size={[0.8, 1.8]} color="#e9eef9" o={0.32} seed={77} />
    </g>
  )
}

export function Habitat({ x, y, s = 1, lit = 1, lightColor = WARM, flicker = false, shield = 0, door = false, beacon = '#5CE1E6' }: {
  x: number; y: number; s?: number; lit?: number; lightColor?: string; flicker?: boolean; shield?: number; door?: boolean; beacon?: string
}) {
  const ls: CSSProperties = { opacity: lit, transition: 'opacity 2.2s ease, fill 1s ease' }
  const fl = flicker ? 'animate-flicker' : ''
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="34" cy="2" rx="120" ry="7" fill="#000" opacity=".3" />
      <rect x="-82" y="-42" width="164" height="42" rx="8" fill="url(#es-hab)" />
      <path d="M-62 -40a62 62 0 0 1 124 0z" fill="url(#es-hab)" />
      <path d="M-44 -42a44 44 0 0 1 88 0z" fill={lightColor} style={ls} className={fl} />
      {[-64, -34, 34, 64].map((cx) => <rect key={cx} x={cx - 7} y="-30" width="14" height="16" rx="5" fill={lightColor} style={ls} className={fl} />)}
      <rect x="-9" y="-28" width="18" height="28" rx="4" fill="#5b6483" />
      <rect x="-9" y="-28" width="18" height="28" rx="4" fill={lightColor} style={show(door, 0.6)} />
      <path d="M-82 -34v26M-60 -78q8-14 24-22" fill="none" stroke="#fff" strokeOpacity=".4" strokeWidth="2" strokeLinecap="round" />
      <line x1="0" y1="-102" x2="0" y2="-134" stroke="#9aa4bd" strokeWidth="3" />
      <circle cx="0" cy="-136" r="3.5" fill={beacon} className="animate-flicker" />
      <ellipse cx="0" cy="-30" rx="126" ry="112" fill="#5CE1E6" fillOpacity=".1" stroke="#5CE1E6" strokeWidth="3" className="shield-pulse" style={show(shield > 0)} />
    </g>
  )
}

export function Panels({ x, y, count = 3, dust = 0, glint = false, dark = false }: { x: number; y: number; count?: number; dust?: number; glint?: boolean; dark?: boolean }) {
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const px = x + i * 74
        const id = `es-pc-${px}-${y}`
        return (
          <g key={i} transform={`translate(${px} ${y})`}>
            <ellipse cx="38" cy="22" rx="38" ry="4" fill="#000" opacity=".25" />
            <rect x="24" y="0" width="5" height="22" fill="#8a92a8" />
            <g transform="skewX(-12)">
              <clipPath id={id}><rect x="-6" y="-36" width="62" height="40" rx="3" /></clipPath>
              <rect x="-6" y="-36" width="62" height="40" rx="3" fill={dark ? '#18214a' : 'url(#es-panel)'} stroke="#9ab6ff" strokeWidth="1.5" style={{ transition: 'fill 2s' }} />
              <path d="M15 -36V4M35 -36V4M-6 -23H56M-6 -10H56" stroke="#9ab6ff" strokeWidth="1" opacity=".55" />
              <rect x="-6" y="-36" width="62" height="40" rx="3" fill="#b8a98f" style={{ opacity: dust, transition: 'opacity 2.2s ease' }} />
              {glint && <g clipPath={`url(#${id})`}><rect className="glint" x="-8" y="-38" width="12" height="44" fill="#fff" style={{ animationDelay: `${i * 0.6}s` }} /></g>}
            </g>
          </g>
        )
      })}
    </g>
  )
}

export function Tank({ x, y, level, w = 38, h = 84, warn = false }: { x: number; y: number; level: number; w?: number; h?: number; warn?: boolean }) {
  const id = `es-tk-${x}-${y}`
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={w / 2 + 12} cy="2" rx={w * 0.75} ry="5" fill="#000" opacity=".28" />
      <clipPath id={id}><rect x="3" y={-h + 3} width={w - 6} height={h - 6} rx="9" /></clipPath>
      <rect x="0" y={-h} width={w} height={h} rx="11" fill="#17204a" stroke="#aab4d0" strokeWidth="2" />
      <g clipPath={`url(#${id})`}>
        <rect x="3" y={-h + 3} width={w - 6} height={h - 6} fill={WATER} opacity=".85"
          style={{ transformOrigin: '50% 100%', transformBox: 'fill-box', transform: `scaleY(${level})`, transition: 'transform 1.8s ease' }} />
      </g>
      <rect x="6" y={-h + 8} width="3" height={h - 24} rx="1.5" fill="#fff" opacity=".25" />
      {[0.25, 0.5, 0.75].map((t) => <line key={t} x1={w - 10} x2={w - 3} y1={-h * t} y2={-h * t} stroke="#e9eef9" opacity=".6" />)}
      <rect x={w * 0.3} y={-h - 8} width={w * 0.4} height="8" rx="2" fill="#8a92a8" />
      <circle cx={w / 2} cy={-h - 14} r="4" fill={warn ? '#FF6B6B' : '#7BE0A4'} className={warn ? 'animate-flicker' : ''} />
    </g>
  )
}

export function Pipe({ d, flow = false, color = WATER, w = 5 }: { d: string; flow?: boolean; color?: string; w?: number }) {
  return (
    <g fill="none" strokeLinecap="round">
      <path d={d} stroke="#7a84a0" strokeWidth={w + 2} />
      <path d={d} stroke="#2a3358" strokeWidth={w} />
      <path d={d} stroke={color} strokeWidth={w - 2} strokeDasharray="6 10" className="flow" style={show(flow, 0.9)} />
    </g>
  )
}

export function Beacon({ x, y, color, on = true }: { x: number; y: number; color: string; on?: boolean }) {
  return (
    <g style={show(on, 0.5)}>
      <circle cx={x} cy={y} r="11" fill={color} opacity=".25" className="animate-flicker" />
      <circle cx={x} cy={y} r="4" fill={color} className="animate-flicker" />
    </g>
  )
}

/** Signal arcs fanning out from (x,y), rotated by `rot` degrees. */
export function Waves({ x, y, rot = 0, ok }: { x: number; y: number; rot?: number; ok: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} fill="none" strokeLinecap="round" strokeWidth="3"
      stroke={ok ? '#5CE1E6' : '#FF6B6B'} strokeDasharray={ok ? undefined : '3 7'} style={{ transition: 'stroke 1s' }}>
      {[16, 30, 44].map((r, i) => (
        <path key={r} d={`M${-r * 0.7} ${-r * 0.7}A${r} ${r} 0 0 1 ${r * 0.7} ${-r * 0.7}`} className={ok ? 'wave' : 'animate-flicker'} style={{ animationDelay: `${i * 0.25}s` }} />
      ))}
    </g>
  )
}

export function Fan({ x, y, r = 18, speed }: { x: number; y: number; r?: number; speed: 'off' | 'jam' | 'med' | 'fast' }) {
  const cls = { off: '', jam: 'spin-jam', med: 'spin-med', fast: 'spin-fast' }[speed]
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r + 4} fill="#1b2347" stroke="#8a92a8" strokeWidth="3" />
      <g className={cls} style={{ transformOrigin: '0 0' }}>
        {[0, 90, 180, 270].map((a) => <ellipse key={a} cx="0" cy={-r * 0.5} rx={r * 0.26} ry={r * 0.5} fill="#cfd5e4" transform={`rotate(${a})`} />)}
      </g>
      <circle r="4" fill="#5b6483" />
    </g>
  )
}

export function Gauge({ x, y, v, r = 22 }: { x: number; y: number; v: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="#0f1738" stroke="#aab4d0" strokeWidth="3" />
      <path d={`M${-r * 0.7} ${r * 0.3}A${r * 0.74} ${r * 0.74} 0 0 1 ${r * 0.7} ${r * 0.3}`} fill="none" stroke="url(#es-heat)" strokeWidth="0" />
      <path d={`M${-r * 0.72} ${r * 0.2}A${r * 0.75} ${r * 0.75} 0 0 1 ${-r * 0.1} ${-r * 0.74}`} fill="none" stroke="#7BE0A4" strokeWidth="4" strokeLinecap="round" />
      <path d={`M${-r * 0.1} ${-r * 0.74}A${r * 0.75} ${r * 0.75} 0 0 1 ${r * 0.45} ${-r * 0.6}`} fill="none" stroke="#FFB84D" strokeWidth="4" strokeLinecap="round" />
      <path d={`M${r * 0.45} ${-r * 0.6}A${r * 0.75} ${r * 0.75} 0 0 1 ${r * 0.72} ${r * 0.2}`} fill="none" stroke="#FF6B6B" strokeWidth="4" strokeLinecap="round" />
      <line x1="0" y1="0" x2="0" y2={-r * 0.8} stroke="#fff" strokeWidth="3" strokeLinecap="round"
        style={{ transform: `rotate(${-70 + v * 140}deg)`, transformOrigin: '0 0', transition: 'transform 1.8s cubic-bezier(.3,1.4,.5,1)' }} />
      <circle r="3.5" fill="#fff" />
    </g>
  )
}

export function Crew({ x, y, accent, flip = false, s = 1, hide = false, cls = '', delay = 0, children }: {
  x: number; y: number; accent: string; flip?: boolean; s?: number; hide?: boolean; cls?: string; delay?: number; children?: ReactNode
}) {
  return (
    <g style={{ transform: `translate(${x}px, ${y}px)`, transition: `transform 2s cubic-bezier(.45,0,.2,1), opacity .6s ease ${hide ? 1.4 : 0}s`, opacity: hide ? 0 : 1 }}>
      <g className={cls}><Astronaut x={0} y={0} accent={accent} scale={s} flip={flip} delay={delay} /></g>
      {children}
    </g>
  )
}
