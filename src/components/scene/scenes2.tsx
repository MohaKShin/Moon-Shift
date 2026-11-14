import { A, Backdrop, Crew, Dots, Fan, Foreground, Gauge, Habitat, Panels, Pipe, Tank, Wash, WATER, show, type SceneProps } from './parts'

const Ping = ({ x, y, on, color = '#7BE0A4' }: { x: number; y: number; on: boolean; color?: string }) => (
  <g style={show(on)}><circle cx={x} cy={y} r="26" fill="none" stroke={color} strokeWidth="3" className="ping" /></g>
)

/** Equipment overheating */
export function HeatScene({ pick }: SceneProps) {
  const heat = pick === null ? 0.9 : pick === 'a' ? 0.25 : pick === 'b' ? 0.35 : 0.08
  return (
    <>
      <Backdrop />
      <Habitat x={680} y={270} s={0.62} />
      <g style={{ opacity: heat, transition: 'opacity 2s' }}><ellipse cx="320" cy="200" rx="170" ry="120" fill="url(#es-heat)" /></g>
      <g transform="translate(260 278)">
        <ellipse cx="60" cy="2" rx="90" ry="7" fill="#000" opacity=".3" />
        <rect x="0" y="-122" width="130" height="122" rx="8" fill="#2a3358" stroke="#8a92a8" strokeWidth="3" />
        {[0, 1, 2, 3].map((i) => <rect key={i} x="12" y={-108 + i * 22} width="106" height="14" rx="3" fill="#17204a" />)}
        {[0, 1, 2, 3].map((i) => <circle key={i} cx="106" cy={-101 + i * 22} r="3.5" fill={pick === 'c' ? '#3a4468' : heat > 0.5 ? '#FF6B6B' : '#7BE0A4'} className={heat > 0.5 ? 'animate-flicker' : ''} />)}
        <Fan x={65} y={-142} r={16} speed={pick === 'a' ? 'fast' : pick === 'b' ? 'med' : pick === 'c' ? 'off' : 'jam'} />
        <rect x="0" y="-122" width="130" height="122" rx="8" fill="#000" style={{ opacity: pick === 'c' ? 0.45 : 0, transition: 'opacity 1.6s' }} />
      </g>
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d="M0 0q5-8 0-16t0-16" fill="none" stroke="#ff9a6b" strokeWidth="3" strokeLinecap="round" className="heat" style={{ transform: `translate(${285 + i * 28}px, 150px)`, animationDelay: `${i * 0.6}s`, opacity: heat > 0.5 ? 1 : 0 }} />
      ))}
      {/* radiator */}
      <g transform="translate(470 278)">
        {Array.from({ length: 8 }, (_, i) => <rect key={i} x={i * 14} y="-84" width="8" height="84" rx="2" fill={pick === null ? '#ff8a5c' : pick === 'c' ? '#6d7691' : '#7aa8ff'} style={{ transition: `fill 2s ease ${i * 0.15}s` }} />)}
      </g>
      <Pipe d="M390 236 H470" color="#ff9a6b" flow={pick === 'a'} />
      <Pipe d="M390 262 H470" color="#7aa8ff" flow={pick === 'a'} />
      <Dots n={16} x={290} y={150} w={80} h={20} dx={10} dy={-80} dur={2.4} color="#fff" size={[3, 6]} o={0.35} seed={61} on={pick === 'b'} />
      <Dots n={18} x={300} y={140} w={60} h={4} dx={0} dy={70} dur={1.2} color={WATER} size={[1, 2]} o={0.9} seed={62} on={pick === 'b'} />
      <Gauge x={190} y={200} v={heat} r={26} />
      <Crew x={214} y={296} accent={A.nova} s={1.05} />
      <Foreground />
    </>
  )
}

/** Communication failure */
export function CommsScene({ pick }: SceneProps) {
  const ok = pick === 'a' || pick === 'b'
  const ang = pick === 'a' ? 38 : -34
  return (
    <>
      <Backdrop earth={{ x: 620, y: 96, r: 64 }} />
      <Habitat x={520} y={272} s={0.7} lit={1} />
      <Pipe d="M470 262 H300" color="#ffb84d" flow={ok} w={4} />
      {/* dish */}
      <g transform="translate(250 276)">
        <ellipse cx="14" cy="2" rx="40" ry="5" fill="#000" opacity=".3" />
        <path d="M-8 0H8L4-56H-4z" fill="#8a92a8" />
        <g transform="translate(0 -56)">
          <g style={{ transform: `rotate(${ang}deg)`, transformOrigin: '0 0', transition: 'transform 2.2s cubic-bezier(.4,0,.2,1)' }}>
            <path d="M-40 -2A40 22 0 0 0 40 -2z" fill="#e3e8f5" stroke="#9aa4bd" strokeWidth="2" />
            <line x1="0" y1="-2" x2="0" y2="-34" stroke="#9aa4bd" strokeWidth="3" />
            <circle cx="0" cy="-36" r="4" fill={ok ? '#5CE1E6' : '#FF6B6B'} className="animate-flicker" />
          </g>
        </g>
      </g>
      <path d="M268 200 Q 430 120 560 100" fill="none" strokeLinecap="round" strokeWidth="4" stroke={ok ? '#5CE1E6' : '#FF6B6B'}
        strokeDasharray={ok ? '8 12' : '3 14'} className={ok ? 'flow' : 'animate-flicker'} opacity={pick === 'b' ? 0.55 : 0.9} style={{ transition: 'stroke 1s' }} />
      <g style={show(!ok)}><path d="M410 150l16 16m0-16l-16 16" stroke="#FF6B6B" strokeWidth="4" strokeLinecap="round" className="animate-flicker" /></g>
      <Dots n={10} x={242} y={190} w={16} h={10} dx={14} dy={-28} dur={0.9} color="#ffb84d" size={[0.8, 1.6]} o={1} seed={71} on={pick === null} />
      <g style={show(pick === 'b')}><g transform="translate(400 288)"><rect x="-18" y="-20" width="36" height="20" rx="4" fill="#2a3358" stroke="#8a92a8" strokeWidth="2" /><line x1="8" y1="-20" x2="14" y2="-60" stroke="#cfd5e4" strokeWidth="2" /><circle cx="14" cy="-62" r="3" fill="#ffb84d" className="animate-flicker" /></g></g>
      <Crew x={pick === 'a' ? 300 : pick === 'b' ? 360 : 340} y={pick === 'c' ? 300 : 292} accent={A.nova} flip={pick === 'a'} s={pick === 'c' ? 0.9 : 1.05} />
      <Foreground />
    </>
  )
}

/** Temperature regulation: freezing */
export function ColdScene({ pick }: SceneProps) {
  const frost = pick === 'a' ? 0 : pick === 'b' ? 0.4 : 1
  const mercury = pick === null ? 0.12 : pick === 'a' ? 0.85 : pick === 'b' ? 0.6 : 0.3
  const warm = pick === 'a' || pick === 'b'
  const crystals = Array.from({ length: 16 }, (_, i) => { const a = Math.PI + (i / 15) * Math.PI; return { x: Math.cos(a) * (62 + (i % 3) * 3), y: -42 + Math.sin(a) * (62 + (i % 3) * 3), s: 5 + (i % 4) * 2 } })
  return (
    <>
      <Backdrop />
      <Wash color="#3b6bff" o={warm ? 0.04 : 0.15} />
      <Habitat x={360} y={272} s={1.2} lit={warm ? 1 : 0.7} />
      <g transform="translate(360 272) scale(1.2)" style={{ opacity: frost, transition: 'opacity 2.4s' }} stroke="#e8f8ff" strokeWidth="1.6" strokeLinecap="round">
        {crystals.map((c, i) => <g key={i} transform={`translate(${c.x} ${c.y})`} className="animate-twinkle" style={{ animationDelay: `${i * 0.25}s` }}><path d={`M${-c.s} 0H${c.s}M0 ${-c.s}V${c.s}M${-c.s * 0.7} ${-c.s * 0.7}L${c.s * 0.7} ${c.s * 0.7}M${c.s * 0.7} ${-c.s * 0.7}L${-c.s * 0.7} ${c.s * 0.7}`} /></g>)}
        {[-64, -34, 34, 64].map((x) => <rect key={x} x={x - 8} y="-31" width="16" height="18" rx="5" fill="#e8f8ff" fillOpacity=".35" stroke="none" />)}
      </g>
      <Pipe d="M268 262 H460 Q 470 262 470 252" color="#ffb84d" flow={pick === 'b'} />
      {/* heater */}
      <g transform="translate(560 274)">
        <rect x="0" y="-60" width="70" height="60" rx="6" fill="#2a3358" stroke="#8a92a8" strokeWidth="3" />
        <path d="M12-44h46l-46 12h46l-46 12h46l-46 12h46" fill="none" strokeWidth="4" strokeLinecap="round" style={{ stroke: pick === 'a' ? '#ff8a3c' : '#4a5580', transition: 'stroke 1.6s' }} />
      </g>
      {[0, 1, 2].map((i) => <path key={i} d="M0 0q5-8 0-16t0-16" fill="none" stroke="#ffb070" strokeWidth="3" strokeLinecap="round" className="heat" style={{ transform: `translate(${575 + i * 20}px, 206px)`, animationDelay: `${i * 0.7}s`, opacity: pick === 'a' ? 1 : 0 }} />)}
      {/* thermometer */}
      <g transform="translate(150 276)">
        <rect x="-8" y="-116" width="16" height="106" rx="8" fill="#0f1738" stroke="#aab4d0" strokeWidth="3" />
        <rect x="-4" y="-112" width="8" height="98" rx="4" fill={mercury > 0.5 ? '#ff6b6b' : '#6aa8ff'} style={{ transformOrigin: '50% 100%', transformBox: 'fill-box', transform: `scaleY(${mercury})`, transition: 'transform 2s ease, fill 1.5s' }} />
        <circle cy="0" r="13" fill={mercury > 0.5 ? '#ff6b6b' : '#6aa8ff'} stroke="#aab4d0" strokeWidth="3" />
      </g>
      <Dots n={10} x={220} y={226} w={40} h={20} dx={-30} dy={-26} dur={2.6} color="#fff" size={[2, 4]} o={0.4} seed={81} on={!warm} />
      <Crew x={236} y={296} accent={A.nova} cls={pick === 'c' || pick === null ? 'shiver' : ''}>
        <rect x="-12" y="-46" width="24" height="7" rx="3" fill="#ff6b6b" style={show(pick === 'c')} />
      </Crew>
      <Crew x={300} y={300} accent={A.kai} s={0.95} cls={pick === 'c' || pick === null ? 'shiver' : ''} delay={0.4} />
      <Foreground />
    </>
  )
}

/** Micrometeoroid hit */
export function ImpactScene({ pick }: SceneProps) {
  const leak = pick === null || pick === 'c'
  return (
    <>
      <Backdrop />
      <g style={show(pick === null, 0.8)}><line x1="120" y1="20" x2="190" y2="58" stroke="#fff" strokeWidth="3" strokeLinecap="round" className="streak" /></g>
      <Habitat x={350} y={272} s={1.25} beacon="#FF6B6B" />
      {/* jagged hole + patch */}
      <path d="M368 148l8-6 6 8 8-3-3 10 6 6-10 2-4 9-7-8-9 3 4-9z" fill="#0a0e22" stroke="#ff6b6b" strokeWidth="1.5" />
      <g style={show(pick === 'a', 1)}><rect x="352" y="138" width="40" height="30" rx="4" fill="#ffd34d" stroke="#222" strokeWidth="2" /><path d="M356 168l12-30M368 168l12-30M380 168l12-30" stroke="#222" strokeWidth="5" /></g>
      <Dots n={30} x={366} y={146} w={18} h={8} dx={30} dy={-110} dur={2.8} color="#e8f6ff" size={[1.2, 3]} o={0.8} seed={91} on={pick === null} />
      <Dots n={12} x={366} y={146} w={18} h={8} dx={20} dy={-70} dur={3.8} color="#e8f6ff" size={[1, 2.2]} o={0.6} seed={92} on={pick === 'c'} />
      <Dots n={10} x={300} y={110} w={140} h={50} dx={40} dy={-30} dur={5} color="#9aa3b8" size={[2, 4]} o={0.8} seed={93} on={pick === null} />
      <Dots n={20} x={366} y={146} w={14} h={8} dx={20} dy={-26} dur={0.7} color="#ffd27a" size={[0.8, 2]} o={1} seed={94} on={pick === 'c'} />
      {/* bulkhead door for B */}
      <g style={show(pick === 'b')}><rect x="404" y="228" width="12" height="44" rx="2" fill="#ff6b6b" /><circle cx="410" cy="250" r="4" fill="#fff" className="animate-flicker" /></g>
      <g transform="translate(470 276)"><rect x="0" y="-38" width="54" height="38" rx="5" fill="#2a3358" stroke="#8a92a8" strokeWidth="2" /><rect x="6" y="-30" width="42" height="8" rx="2" fill={leak ? '#FF6B6B' : '#7BE0A4'} opacity=".6" /></g>
      <Crew x={leak && pick === 'c' ? 330 : 280} y={296} accent={A.nova} s={1.05} />
      <Crew x={228} y={300} accent={A.zuri} s={0.95} delay={0.6} />
      <Foreground />
    </>
  )
}

/** Moonquake */
export function QuakeScene({ pick }: SceneProps) {
  const quake = pick === null
  const leaking = pick === null || pick === 'b'
  return (
    <>
      <Backdrop />
      <g className={quake ? 'shake' : ''}>
        <Habitat x={250} y={272} s={1} />
        <Tank x={560} y={276} level={0.8} w={44} h={100} />
        <Pipe d="M580 262 H400" flow={!leaking && pick === 'a'} />
        <rect x="470" y="256" width="18" height="12" fill="#0b1030" />
        <circle cx="478" cy="268" r="3" fill="#6d7691" />
        <path d="M430 288l14 10-10 8 16 12M520 300l-12 14 14 10" fill="none" stroke="#0d1330" strokeWidth="3" strokeLinecap="round" />
      </g>
      <Dots n={14} x={474} y={266} w={6} h={4} dx={0} dy={28} dur={1.2} color={WATER} size={[1.2, 2.2]} o={0.9} seed={101} on={leaking} />
      <ellipse cx="478" cy="296" rx={pick === 'b' ? 48 : leaking ? 22 : pick === 'c' ? 10 : 0} ry="5" fill={WATER} opacity=".6" style={{ transition: 'all 2.4s ease' }} />
      <Dots n={18} x={180} y={150} w={140} h={20} dx={0} dy={110} dur={2.4} color="#bdb39b" size={[0.8, 2]} o={0.6} seed={102} on={quake} />
      <g style={show(pick === 'c')}><g transform="translate(440 262)"><circle r="12" fill="none" stroke="#FF6B6B" strokeWidth="4" /><path d="M-12 0H12M0-12V12" stroke="#FF6B6B" strokeWidth="3" /></g></g>
      <Ping x={478} y={266} on={pick === 'a'} />
      <Crew x={pick === 'a' ? 440 : 360} y={296} accent={A.nova} s={1.05} flip={pick === 'a'}>
        {pick === 'a' && <g transform="translate(-16 -44)"><g className="sweep"><rect x="-4" y="-26" width="6" height="28" rx="3" fill="#c9ced8" /><circle cx="-1" cy="-28" r="6" fill="none" stroke="#c9ced8" strokeWidth="4" /></g></g>}
      </Crew>
      <Foreground />
    </>
  )
}

/** Radiation shield */
export function ShieldScene({ pick }: SceneProps) {
  const dose = pick === null ? 0.7 : pick === 'a' ? 0.12 : pick === 'b' ? 0.28 : 0.92
  return (
    <>
      <Backdrop earth={{ x: 690, y: 76, r: 34 }} sun={{ x: 70, y: 50, r: 30 }} />
      <g style={{ opacity: pick === 'a' || pick === 'b' ? 0.35 : 1, transition: 'opacity 2s' }}>
        <Dots n={30} x={40} y={20} w={100} h={60} dx={560} dy={290} dur={3} color="#d9a8ff" size={[1, 2.4]} o={0.9} seed={111} />
        <Dots n={16} x={40} y={20} w={100} h={60} dx={540} dy={280} dur={2.2} color="#ffe27a" size={[1, 2]} o={0.9} seed={112} />
      </g>
      <Habitat x={420} y={272} s={1.15} />
      <g transform="translate(420 272) scale(1.15)" style={{ transformOrigin: '0 0', transform: `translate(420px,272px) scale(1.15, ${pick === 'a' ? 1.15 : 0.001})`, transition: 'transform 2.4s ease' }}>
        <path d="M-96 0Q-96 -78 -46 -102Q0 -128 46 -102Q96 -78 96 0z" fill="#8e93a6" stroke="#c7cbdb" strokeWidth="2" />
        {[[-50, -70], [10, -100], [60, -60], [-20, -40]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="8" fill="#6d7390" />)}
      </g>
      <g style={{ transformOrigin: '50% 100%', transformBox: 'fill-box', transform: `scaleY(${pick === 'b' ? 1 : 0})`, transition: 'transform 2s ease' }}>
        {[0, 1, 2].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={248 + c * 24} y={214 + r * 20} width="22" height="18" rx="8" fill="#4fc3ff" fillOpacity=".7" stroke="#bfefff" strokeWidth="1.5" />))}
      </g>
      <Gauge x={730} y={190} v={dose} r={26} />
      <Crew x={pick === 'c' ? 600 : 200} y={298} accent={A.nova} s={1.05}>
        <g style={show(pick === 'c')}><circle cy="-40" r="34" fill="#ff6b6b" opacity=".2" className="animate-flicker" /></g>
      </Crew>
      <Crew x={pick === 'a' ? 330 : pick === 'c' ? 650 : 160} y={300} accent={A.kai} s={0.95} delay={0.5} flip={pick === 'a'}>
        {pick === 'a' && <g transform="translate(-14 -44)"><g className="sweep"><line x1="0" y1="0" x2="-30" y2="26" stroke="#c9ced8" strokeWidth="4" strokeLinecap="round" /></g></g>}
      </Crew>
      <Foreground />
    </>
  )
}

/** Homesick crew */
export function HomesickScene({ pick }: SceneProps) {
  return (
    <>
      <Backdrop earth={{ x: 600, y: 104, r: 58 }} starBoost={1.2} />
      <Wash color="#0a1230" o={0.15} />
      <Habitat x={150} y={272} s={0.85} lit={1} />
      <Dots n={14} x={200} y={150} w={400} h={110} dx={10} dy={-40} dur={9} color="#ffe9a8" size={[1, 2.2]} o={0.5} seed={121} />
      {/* movie screen */}
      <g style={show(pick === 'a')}>
        <g transform="translate(470 274)"><line x1="12" y1="0" x2="12" y2="-30" stroke="#8a92a8" strokeWidth="3" /><line x1="118" y1="0" x2="118" y2="-30" stroke="#8a92a8" strokeWidth="3" /><rect x="0" y="-110" width="130" height="80" rx="4" fill="#7fb6ff" className="tv" stroke="#cfd5e4" strokeWidth="4" /></g>
        <path d="M360 270L470 190L470 250z" fill="#bfd8ff" opacity=".12" />
      </g>
      {/* video call */}
      <g style={show(pick === 'b')}>
        <g transform="translate(480 276)"><path d="M0 0L14-44M40 0L26-44" stroke="#8a92a8" strokeWidth="3" /><rect x="-18" y="-100" width="76" height="58" rx="6" fill="#0f1738" stroke="#cfd5e4" strokeWidth="3" /><circle cx="6" cy="-72" r="10" fill="#ffb8c8" /><circle cx="34" cy="-72" r="10" fill="#b9ffd6" /><path d="M0-58q6 8 12 0M28-58q6 8 12 0" fill="none" stroke="#fff" strokeWidth="2" /></g>
        <path d="M500 170Q 560 130 590 112" fill="none" stroke="#5CE1E6" strokeWidth="3" strokeDasharray="6 10" className="flow" />
      </g>
      <Crew x={pick === 'c' ? 380 : 270} y={294} accent={A.nova} flip={pick !== 'c'} />
      <Crew x={pick === 'c' ? 430 : 320} y={300} accent={A.kai} flip={pick !== 'c'} s={0.95} delay={0.5} />
      <Crew x={pick === 'c' ? 330 : 370} y={296} accent={A.zuri} flip={pick !== 'c'} delay={1} />
      <g style={show(pick === 'c')}><g transform="translate(560 292)"><rect x="-22" y="-16" width="44" height="16" rx="3" fill="#ffb84d" /><rect x="-8" y="-22" width="16" height="6" rx="2" fill="#8a92a8" /></g></g>
      <Foreground />
    </>
  )
}

/** Rover stuck */
export function RoverScene({ pick }: SceneProps) {
  const moved = pick === 'a' || pick === 'b'
  const dx = pick === 'a' ? 120 : pick === 'b' ? 90 : 0
  return (
    <>
      <Backdrop />
      <Habitat x={680} y={272} s={0.75} />
      <ellipse cx="400" cy="304" rx="64" ry="10" fill="#8f8570" opacity=".7" />
      <ellipse cx="400" cy="306" rx="46" ry="6" fill="#4b4636" opacity=".8" />
      <g style={{ transform: `translate(${dx}px, ${moved ? -8 : 0}px) rotate(${moved ? 0 : -9}deg)`, transformOrigin: '420px 296px', transition: 'transform 2.6s ease-in-out' }}>
        <g transform="translate(420 296)">
          <rect x="-48" y="-26" width="96" height="20" rx="7" fill="#dfe4f0" />
          <rect x="-4" y="-44" width="34" height="18" rx="6" fill="#9ab6ff" />
          {[-30, 0, 30].map((x) => <g key={x} transform={`translate(${x} -2)`}><circle r="11" fill="#333b57" stroke="#8d96b0" strokeWidth="2.5" /><g className="spin-med" style={{ transformOrigin: '0 0', animationDuration: moved ? '1.4s' : '0.5s' }}><path d="M-8 0H8M0-8V8" stroke="#8d96b0" strokeWidth="2" /></g></g>)}
          {[0, 1].map((i) => <rect key={i} x={-44 + i * 22} y={-46 - (i ? 8 : 0)} width="20" height={20 + (i ? 8 : 0)} rx="3" fill="#bfefff" stroke="#fff" strokeWidth="1.5" style={{ transformOrigin: '50% 100%', transformBox: 'fill-box', transform: `scaleY(${pick === 'c' ? 0.55 : 1})`, transition: 'transform 3s' }} />)}
        </g>
      </g>
      <Dots n={22} x={364} y={284} w={40} h={14} dx={-40} dy={-34} dur={1.1} color="#cdbb92" size={[1.5, 3.4]} o={0.7} seed={131} on={!moved} />
      <Dots n={14} x={360} y={240} w={60} h={10} dx={0} dy={-60} dur={3} color="#bfefff" size={[2, 4]} o={0.4} seed={132} on={pick === 'c'} />
      <g style={show(pick === 'a')}><circle cx="610" cy="262" r="12" fill="#8a92a8" stroke="#cfd5e4" strokeWidth="3" /><line x1="598" y1="262" x2="540" y2="268" stroke="#ffb84d" strokeWidth="3" strokeDasharray="6 8" className="flow" /></g>
      <Crew x={pick === 'b' ? 330 + dx : 250} y={298} accent={A.nova} s={1.05} cls={pick === 'b' ? 'shiver' : ''} />
      <Crew x={pick === 'b' ? 360 + dx : 220} y={304} accent={A.kai} s={0.95} delay={0.5} cls={pick === 'b' ? 'shiver' : ''} />
      <Foreground />
    </>
  )
}

/** Sunny day */
export function SunnyScene({ pick }: SceneProps) {
  const cells = pick === 'a' ? 5 : 3
  return (
    <>
      <Backdrop earth={{ x: 700, y: 110, r: 34 }} sun={{ x: 110, y: 60, r: 52 }} starBoost={0.5} />
      <Wash color="#fff1c0" o={0.07} />
      <g fill="#fff" opacity=".18"><circle cx="220" cy="110" r="14" /><circle cx="320" cy="160" r="24" /><circle cx="430" cy="215" r="10" /></g>
      <Panels x={40} y={268} count={5} glint />
      <Habitat x={640} y={272} s={0.85} />
      <Pipe d="M388 262 H560" color="#ffb84d" flow={pick === 'a'} />
      <g transform="translate(410 274)"><rect x="0" y="-58" width="90" height="58" rx="7" fill="#2a3358" stroke="#8a92a8" strokeWidth="3" />{[0, 1, 2, 3, 4].map((i) => <rect key={i} x={8 + i * 15} y="-48" width="10" height="38" rx="3" fill={i < cells ? '#ffb84d' : '#17204a'} style={{ transition: `fill .8s ease ${i * 0.3}s` }} />)}</g>
      <g style={show(pick === 'b')}><g transform="translate(300 274)"><rect x="0" y="-52" width="70" height="52" rx="6" fill="#2a3358" stroke="#8a92a8" strokeWidth="3" /><circle cx="35" cy="-26" r="16" fill="#0f1738" stroke="#aab4d0" strokeWidth="2" /><g transform="translate(35 -26)"><g className="spin-med" style={{ transformOrigin: '0 0' }}><rect x="-12" y="-2" width="24" height="4" rx="2" fill={WATER} /></g></g></g>
        <Dots n={10} x={310} y={236} w={50} h={4} dx={0} dy={34} dur={1.4} color={WATER} size={[1, 2]} o={0.9} seed={141} /></g>
      <Crew x={300} y={300} accent={A.nova} cls={pick === 'c' ? 'jump' : ''} />
      <Crew x={350} y={304} accent={A.kai} s={0.95} cls={pick === 'c' ? 'jump' : ''} delay={0.4} />
      <Crew x={400} y={300} accent={A.zuri} cls={pick === 'c' ? 'jump' : ''} delay={0.8} />
      <Foreground />
    </>
  )
}

/** Ice discovery */
export function IceScene({ pick }: SceneProps) {
  const shrink = pick === 'a' ? 0.6 : 1
  return (
    <>
      <Backdrop />
      <Habitat x={700} y={272} s={0.55} />
      <ellipse cx="400" cy="304" rx="200" ry="40" fill="#8f96ab" />
      <ellipse cx="400" cy="310" rx="176" ry="32" fill="#0b1030" />
      <ellipse cx="400" cy="306" rx="130" ry="24" fill="#5CE1E6" opacity=".12" className="breathe" />
      <g style={{ transformOrigin: '50% 100%', transformBox: 'fill-box', transform: `scale(${shrink})`, transition: 'transform 3s ease' }}>
        {[[360, 312, 26, 44], [398, 316, 34, 62], [440, 312, 24, 40], [418, 306, 20, 32]].map(([x, y, w, h], i) => (
          <g key={i} className="animate-twinkle" style={{ animationDelay: `${i * 0.5}s` }}>
            <path d={`M${x - w / 2} ${y}L${x - w / 4} ${y - h}L${x + w / 4} ${y - h * 0.8}L${x + w / 2} ${y}z`} fill="#bfefff" stroke="#fff" strokeWidth="1.5" />
            <path d={`M${x - w / 4} ${y - h}L${x} ${y}`} stroke="#fff" strokeOpacity=".7" />
          </g>
        ))}
      </g>
      <g style={show(pick === 'a')}>
        <path d="M376 210L440 210L470 300L346 300z" fill="#ffb070" opacity=".15" /><rect x="368" y="204" width="80" height="10" rx="4" fill="#ffb84d" className="breathe" />
        <Dots n={14} x={380} y={230} w={50} h={10} dx={30} dy={80} dur={1.6} color={WATER} size={[1, 2]} o={0.9} seed={151} />
      </g>
      <g style={show(pick === 'b')}><g className="scan"><rect x="397" y="226" width="3" height="84" fill="#5CE1E6" opacity=".8" /></g><rect x="330" y="226" width="140" height="84" fill="#5CE1E6" opacity=".08" /></g>
      <g style={show(pick === 'c')}><g transform="translate(590 296)"><rect x="0" y="-36" width="56" height="36" rx="5" fill="#cfd5e4" stroke="#8a92a8" strokeWidth="2" /><rect x="6" y="-30" width="44" height="6" rx="2" fill="#5CE1E6" opacity=".7" /></g></g>
      <g transform="translate(170 296)"><rect x="-26" y="-18" width="52" height="16" rx="6" fill="#dfe4f0" /><rect x="-14" y="-28" width="26" height="12" rx="5" fill="#9ab6ff" /><circle cx="-17" cy="-1" r="8" fill="#333b57" stroke="#8d96b0" strokeWidth="2" /><circle cx="17" cy="-1" r="8" fill="#333b57" stroke="#8d96b0" strokeWidth="2" /></g>
      <Crew x={pick === 'c' ? 540 : 290} y={284} accent={A.kai} s={1} flip={pick !== 'c'} />
      <Crew x={236} y={300} accent={A.zuri} s={0.95} delay={0.6} />
      <Foreground />
    </>
  )
}
