import { motion } from 'framer-motion'
import { Astronaut, AstronautDefs } from './Astronaut'

export type SceneMood = 'calm' | 'storm' | 'danger'

interface Props {
  energy?: number
  mood?: SceneMood
  dust?: boolean
  crewHappy?: boolean
  className?: string
  hero?: boolean
}

const CREW = [
  { name: 'Nova', accent: '#FFB84D', x: 250, y: 262 },
  { name: 'Kai', accent: '#5CE1E6', x: 560, y: 276 },
  { name: 'Zuri', accent: '#7BE0A4', x: 610, y: 262 },
]

export function LunarScene({ energy = 100, mood = 'calm', dust = false, className = '', hero = false }: Props) {
  const lit = energy > 50 ? '#FFE9A8' : energy > 25 ? '#C9A85C' : '#6b4a3a'
  const dim = energy <= 25
  return (
    <svg
      viewBox="0 0 800 340"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      role="img"
      aria-label="A small lunar outpost with solar panels, three astronauts and Earth in the sky"
    >
      <AstronautDefs />
      <defs>
        <radialGradient id="earth" cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#9be7ff" />
          <stop offset=".5" stopColor="#2b79d8" />
          <stop offset="1" stopColor="#0c2557" />
        </radialGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B8BECC" />
          <stop offset="1" stopColor="#5d647a" />
        </linearGradient>
        <linearGradient id="far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a4468" />
          <stop offset="1" stopColor="#1c2447" />
        </linearGradient>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff3c4" stopOpacity="1" />
          <stop offset=".35" stopColor="#ffb84d" stopOpacity=".55" />
          <stop offset="1" stopColor="#ff6b6b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dome" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f2f5fb" />
          <stop offset="1" stopColor="#9aa4bd" />
        </linearGradient>
        <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2f58c9" />
          <stop offset="1" stopColor="#14275f" />
        </linearGradient>
        <clipPath id="earthClip"><circle cx="655" cy="78" r="46" /></clipPath>
      </defs>

      {/* Sun glow (grows during a storm) */}
      <motion.circle
        cx="90" cy="40" fill="url(#sunGlow)"
        initial={false}
        animate={{ r: mood === 'storm' ? 150 : 40, opacity: mood === 'storm' ? 1 : 0.55 }}
        transition={{ duration: 1.2 }}
      />
      {mood === 'storm' && (
        <g stroke="#FFB84D" strokeWidth="2" strokeLinecap="round" opacity=".7">
          {Array.from({ length: 14 }, (_, i) => (
            <line key={i} x1={40 + i * 55} y1={-10 - (i % 3) * 14} x2={60 + i * 55} y2={40 + (i % 4) * 26}
              className="animate-flicker" style={{ animationDelay: `${i * 0.13}s` }} />
          ))}
        </g>
      )}

      {/* Earth */}
      <circle cx="655" cy="78" r="56" fill="#5CE1E6" opacity=".10" />
      <circle cx="655" cy="78" r="46" fill="url(#earth)" />
      <g clipPath="url(#earthClip)">
        <path d="M625 60c10-12 26-10 30 0s-8 18-4 28-18 14-26 2-8-20 0-30z" fill="#4ea56f" opacity=".85" />
        <path d="M668 92c10-6 22 0 22 10s-12 20-22 12-4-16 0-22z" fill="#4ea56f" opacity=".8" />
        <path d="M612 80c20 6 50-4 84 10" stroke="#fff" strokeWidth="6" opacity=".25" fill="none" strokeLinecap="round" />
        <path d="M630 48c26-4 40 6 56 0" stroke="#fff" strokeWidth="5" opacity=".25" fill="none" strokeLinecap="round" />
      </g>

      {/* Far ridge + ground */}
      <path d="M0 215 L90 190 L170 212 L260 182 L360 214 L470 186 L560 210 L660 184 L800 214 L800 340 L0 340z" fill="url(#far)" />
      <path d="M0 262 Q200 224 400 250 T800 240 L800 340 L0 340z" fill="url(#ground)" />
      <g fill="#7b8299" opacity=".55">
        <ellipse cx="120" cy="300" rx="46" ry="9" /><ellipse cx="700" cy="304" rx="56" ry="10" />
        <ellipse cx="470" cy="322" rx="38" ry="7" /><ellipse cx="60" cy="256" rx="22" ry="5" />
      </g>

      {/* Solar panel stands */}
      {[ { x: 80, y: 250 }, { x: 150, y: 262 } ].map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y})`}>
          <rect x="22" y="0" width="5" height="22" fill="#8a92a8" />
          <g transform="skewX(-12)">
            <rect x="-6" y="-34" width="62" height="38" rx="3" fill="url(#panel)" stroke="#9ab6ff" strokeWidth="1.5" />
            <path d="M15 -34V4M35 -34V4M-6 -21H56M-6 -9H56" stroke="#9ab6ff" strokeWidth="1" opacity=".6" />
            {dust && <rect x="-6" y="-34" width="62" height="38" rx="3" fill="#b8a98f" opacity=".6" />}
          </g>
        </g>
      ))}

      {/* Habitat */}
      <g>
        <rect x="318" y="228" width="164" height="42" rx="8" fill="url(#dome)" />
        <path d="M338 232a62 62 0 0 1 124 0z" fill="url(#dome)" transform="translate(0 -2)" />
        <path d="M356 230a44 44 0 0 1 88 0z" fill={lit} opacity={dim ? 0.55 : 0.9} className={dim ? 'animate-flicker' : ''} transform="translate(0 -2)" />
        {[336, 366, 424, 454].map((cx) => (
          <rect key={cx} x={cx - 7} y="240" width="14" height="16" rx="5" fill={lit} opacity={dim ? 0.5 : 0.95} className={dim ? 'animate-flicker' : ''} />
        ))}
        <rect x="392" y="244" width="16" height="26" rx="3" fill="#6d7691" />
        <rect x="482" y="246" width="60" height="22" rx="8" fill="#cfd5e4" />
        <rect x="502" y="252" width="22" height="10" rx="4" fill={lit} opacity={dim ? 0.5 : 0.9} />
        <line x1="400" y1="166" x2="400" y2="132" stroke="#9aa4bd" strokeWidth="3" />
        <path d="M384 128q16 16 32 0" fill="none" stroke="#e9edf6" strokeWidth="4" strokeLinecap="round" />
        <circle cx="400" cy="127" r="3.5" fill={mood === 'danger' ? '#FF6B6B' : '#5CE1E6'} className="animate-flicker" />
      </g>

      {/* Rover */}
      <g transform="translate(690 288)">
        <rect x="-26" y="-18" width="52" height="16" rx="6" fill="#dfe4f0" />
        <rect x="-14" y="-28" width="26" height="12" rx="5" fill="#9ab6ff" />
        {[-17, 17].map((cx) => <circle key={cx} cx={cx} cy="-1" r="8" fill="#333b57" stroke="#8d96b0" strokeWidth="2" />)}
      </g>

      {/* Crew */}
      {CREW.map((c, i) => (
        <Astronaut key={c.name} x={c.x} y={c.y} accent={c.accent} delay={i * 0.6} scale={hero ? 1.15 : 1} flip={i === 0} />
      ))}

      {/* Moon dust glints */}
      <g fill="#fff" opacity=".35">
        {Array.from({ length: 12 }, (_, i) => (
          <circle key={i} cx={30 + i * 66} cy={300 + (i % 3) * 12} r="1.6" />
        ))}
      </g>

      {/* Storm tint */}
      {mood === 'storm' && <rect width="800" height="340" fill="#ff6b3d" opacity=".10" />}
    </svg>
  )
}
