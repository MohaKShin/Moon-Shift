import { A, Backdrop, Beacon, Crew, Dots, Fan, Foreground, Gauge, Habitat, Panels, Pipe, Tank, Wash, WARM, WATER, show, type SceneProps } from './parts'

const Ping = ({ x, y, on, color = '#7BE0A4' }: { x: number; y: number; on: boolean; color?: string }) => (
  <g style={show(on)}><circle cx={x} cy={y} r="26" fill="none" stroke={color} strokeWidth="3" className="ping" /></g>
)

/** Moon dust on the solar panels */
export function DustScene({ pick }: SceneProps) {
  const clean = pick === 'a' || pick === 'b'
  const dust = pick === null ? 0.72 : pick === 'c' ? 0.88 : 0
  const nx = pick === 'a' ? 318 : pick === 'b' ? 450 : 560
  return (
    <>
      <Backdrop />
      <Habitat x={660} y={270} s={0.78} lit={1} />
      <Panels x={70} y={266} count={4} dust={dust} glint={clean} dark={pick === 'c'} />
      <Dots n={26} x={0} y={170} w={760} h={110} dx={170} dy={-18} dur={7} color="#d3bf98" size={[1, 2.8]} o={0.6} seed={3} on={!clean} />
      <Crew x={nx} y={290} accent={A.nova} flip={pick === 'a' || pick === 'b'} s={1.05}>
        {pick === 'a' && (
          <g transform="translate(-18 -52)"><g className="sweep"><line x1="0" y1="0" x2="-46" y2="-58" stroke="#c9ced8" strokeWidth="4" strokeLinecap="round" /><rect x="-64" y="-76" width="30" height="9" rx="3" fill="#FFB84D" transform="rotate(-38 -50 -70)" /></g></g>
        )}
        {pick === 'b' && <line x1="-20" y1="-48" x2="-58" y2="-62" stroke="#7a84a0" strokeWidth="5" strokeLinecap="round" />}
      </Crew>
      <Dots n={12} x={230} y={214} w={110} h={40} dx={50} dy={-40} dur={2.2} color="#d3bf98" size={[1.5, 3.2]} o={0.8} seed={9} on={pick === 'a'} />
      <Dots n={22} x={372} y={222} w={70} h={14} dx={-70} dy={34} dur={1.4} color={WATER} size={[1, 2]} o={0.9} seed={10} on={pick === 'b'} />
      <Crew x={610} y={296} accent={A.kai} s={0.95} delay={0.8} />
      <Foreground dust={clean ? 0.5 : 1.5} />
    </>
  )
}

/** Solar storm */
export function SolarScene({ pick }: SceneProps) {
  const inside = pick === 'a' || pick === 'b'
  return (
    <>
      <Backdrop earth={{ x: 700, y: 96, r: 34 }} sun={{ x: 92, y: 56, r: 46 }} />
      <Wash color="#ff7a3d" o={0.13} />
      <g className="spin-slow" style={{ transformOrigin: '92px 56px' }} stroke="#FFB84D" strokeWidth="3" strokeLinecap="round" opacity=".6">
        {Array.from({ length: 14 }, (_, i) => <line key={i} x1="92" y1="2" x2="92" y2={i % 2 ? -22 : -40} transform={`rotate(${i * (360 / 14)} 92 56)`} />)}
      </g>
      <Dots n={38} x={60} y={30} w={90} h={50} dx={640} dy={310} dur={3.2} color="#ffd27a" size={[1, 2.6]} o={0.9} seed={5} />
      <Dots n={16} x={80} y={20} w={80} h={60} dx={620} dy={300} dur={2.4} color="#ff8a6b" size={[1.5, 3]} o={0.8} seed={6} />
      <Panels x={60} y={268} count={2} />
      <Tank x={520} y={272} level={0.9} />
      <Tank x={568} y={272} level={0.9} />
      <g style={show(pick === 'a')}><ellipse cx="560" cy="226" rx="70" ry="66" fill="#5CE1E6" opacity=".14" className="breathe" /></g>
      <Habitat x={380} y={270} s={1.1} lit={pick === 'b' ? 0.4 : 1} lightColor={pick === 'a' ? '#aef3ff' : WARM} shield={pick === 'a' ? 1 : 0} door={inside} beacon={inside ? '#7BE0A4' : '#FF6B6B'} />
      <Crew x={inside ? 380 : 220} y={inside ? 270 : 292} accent={A.nova} hide={inside} />
      <Crew x={inside ? 380 : 270} y={inside ? 270 : 298} accent={A.kai} hide={inside} delay={0.5} />
      <Crew x={inside ? 380 : 315} y={inside ? 270 : 290} accent={A.zuri} hide={inside} delay={1} />
      <g style={show(pick === 'c')}><circle cx="270" cy="238" r="80" fill="#ff6b6b" opacity=".16" className="animate-flicker" /></g>
      <Foreground />
    </>
  )
}

/** Oxygen failure */
export function OxygenScene({ pick }: SceneProps) {
  const fixed = pick === 'a'
  return (
    <>
      <Backdrop />
      <Habitat x={290} y={270} s={1.15} lit={0.95} beacon={fixed ? '#7BE0A4' : '#FF6B6B'} />
      <Pipe d="M392 258 H500" color="#cfeaff" flow={fixed} />
      {/* life-support unit */}
      <g transform="translate(500 270)">
        <ellipse cx="70" cy="2" rx="86" ry="6" fill="#000" opacity=".28" />
        <rect x="0" y="-92" width="140" height="92" rx="8" fill="#2a3358" stroke="#8a92a8" strokeWidth="3" />
        <rect x="10" y="-82" width="120" height="14" rx="3" fill="#17204a" />
        {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={16 + i * 19} y="-80" width="12" height="10" rx="2" fill={fixed ? '#7BE0A4' : '#FF6B6B'} opacity=".7" className={fixed ? '' : 'animate-flicker'} style={{ animationDelay: `${i * 0.2}s` }} />)}
        <Fan x={44} y={-34} r={20} speed={fixed ? 'fast' : pick === null ? 'jam' : 'off'} />
        <Gauge x={106} y={-34} v={fixed ? 0.55 : 0.12} r={20} />
        <rect x="58" y="-110" width="24" height="18" rx="3" fill="#8a92a8" />
        <Beacon x={128} y={-104} color={fixed ? '#7BE0A4' : '#FF6B6B'} />
      </g>
      <Dots n={34} x={548} y={150} w={20} h={10} dx={-70} dy={-90} dur={3} color="#e8f6ff" size={[1.2, 3.2]} o={0.8} seed={21} on={pick === null} />
      <Dots n={12} x={548} y={150} w={20} h={10} dx={-40} dy={-70} dur={4.5} color="#e8f6ff" size={[1, 2.4]} o={0.6} seed={22} on={pick === 'b' || pick === 'c'} />
      <g style={show(pick === 'b')}>
        <g transform="translate(440 272)"><rect x="-12" y="-62" width="24" height="62" rx="10" fill="#ffb84d" stroke="#fff" strokeWidth="2" /><rect x="-6" y="-70" width="12" height="9" rx="2" fill="#8a92a8" /><circle cx="0" cy="-36" r="6" fill="#0f1738" stroke="#fff" /></g>
        <path d="M440 214 Q 440 190 500 196" fill="none" stroke="#e8f6ff" strokeWidth="3" />
      </g>
      <Ping x={570} y={236} on={fixed} />
      <Crew x={pick === 'c' ? 250 : 470} y={pick === 'c' ? 296 : 292} accent={A.nova} s={1.05}>
        <g style={show(pick !== 'c')}><path d="M18 -40 L68 -66 L68 -14z" fill={WARM} opacity=".22" /></g>
      </Crew>
      <Crew x={pick === 'c' ? 296 : 220} y={298} accent={A.kai} delay={0.7} s={0.95} />
      <Foreground />
    </>
  )
}

/** Water shortage */
export function WaterScene({ pick }: SceneProps) {
  const L = pick === null ? 0.12 : pick === 'a' ? 0.55 : pick === 'b' ? 0.82 : 0.3
  return (
    <>
      <Backdrop />
      <Habitat x={630} y={270} s={0.7} />
      <Tank x={80} y={278} level={L} w={44} h={104} warn={L < 0.3} />
      <Tank x={142} y={278} level={L * 0.9} w={44} h={104} warn={L < 0.3} />
      <Tank x={204} y={278} level={L * 0.8} w={44} h={104} warn={L < 0.3} />
      <Pipe d="M102 176 V150 H340" flow={pick === 'a'} />
      <Pipe d="M226 176 V150" flow={pick === 'a'} />
      {/* recycler */}
      <g transform="translate(310 278)">
        <ellipse cx="50" cy="2" rx="66" ry="6" fill="#000" opacity=".28" />
        <rect x="0" y="-98" width="100" height="98" rx="8" fill="#2a3358" stroke="#8a92a8" strokeWidth="3" />
        <circle cx="50" cy="-56" r="30" fill="#0f1738" stroke="#aab4d0" strokeWidth="3" />
        <g transform="translate(50 -56)"><g className={pick === 'a' ? 'spin-med' : ''} style={{ transformOrigin: '0 0' }}>{[0, 60, 120].map((r) => <rect key={r} x="-22" y="-3" width="44" height="6" rx="3" fill={WATER} opacity=".8" transform={`rotate(${r})`} />)}</g></g>
        <rect x="14" y="-18" width="72" height="8" rx="3" fill="#17204a" />
        <rect x="14" y="-18" width={pick === 'a' ? 60 : pick === null ? 8 : 24} height="8" rx="3" fill={WATER} style={{ transition: 'width 1.8s' }} />
      </g>
      <Dots n={10} x={96} y={150} w={8} h={4} dx={0} dy={96} dur={1.8} color={WATER} size={[1.2, 2.4]} o={0.9} seed={31} on={pick === null || pick === 'c'} />
      {/* rover heading for the ice crater */}
      <ellipse cx="730" cy="312" rx="48" ry="9" fill="#0d1330" opacity=".8" />
      <g style={{ transform: `translate(${pick === 'b' ? 270 : 0}px, 0)`, transition: 'transform 2.4s ease-in-out' }}>
        <g transform="translate(450 296)"><rect x="-26" y="-18" width="52" height="16" rx="6" fill="#dfe4f0" /><rect x="-14" y="-28" width="26" height="12" rx="5" fill="#9ab6ff" /><circle cx="-17" cy="-1" r="8" fill="#333b57" stroke="#8d96b0" strokeWidth="2" /><circle cx="17" cy="-1" r="8" fill="#333b57" stroke="#8d96b0" strokeWidth="2" /></g>
      </g>
      <g style={show(pick === 'b')}><g fill="#bfefff" className="animate-twinkle"><path d="M716 300l6-14 6 14z" /><path d="M730 304l5-10 5 10z" /></g></g>
      <Crew x={280} y={298} accent={A.zuri} flip s={1.05} />
      <Foreground />
    </>
  )
}

/** Night power failure */
export function PowerScene({ pick }: SceneProps) {
  const lit = pick === null ? 0.3 : pick === 'a' ? 0.5 : pick === 'b' ? 0.95 : 1
  const cells = pick === null || pick === 'c' ? 1 : pick === 'a' ? 3 : 5
  return (
    <>
      <Backdrop earth={{ x: 690, y: 90, r: 30 }} starBoost={1.3} />
      <Wash color="#02040c" o={0.42} />
      <Panels x={30} y={268} count={3} dark />
      <Habitat x={400} y={272} s={1.1} lit={lit} flicker={pick === null} beacon="#FF6B6B" />
      <Pipe d="M250 262 H318" color="#ffb84d" flow={pick !== null && pick !== 'c' ? true : false} />
      <Dots n={14} x={500} y={236} w={10} h={10} dx={26} dy={-34} dur={0.9} color="#ffb84d" size={[0.8, 1.8]} o={1} seed={41} on={pick === null} />
      <g transform="translate(492 274)"><rect x="-4" y="-44" width="30" height="44" rx="4" fill="#2a3358" stroke="#8a92a8" strokeWidth="2" /><rect x="2" y="-36" width="18" height="10" fill="#ff6b6b" className={pick === null ? 'animate-flicker' : ''} opacity={pick === null ? 1 : 0.2} /></g>
      {/* battery bank */}
      <g transform="translate(580 274)">
        <rect x="0" y="-70" width="110" height="70" rx="8" fill="#2a3358" stroke="#8a92a8" strokeWidth="3" />
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={10 + i * 19} y="-58" width="14" height="46" rx="3" fill={i < cells ? (pick === 'c' ? '#ff6b6b' : '#ffb84d') : '#17204a'} className={pick === 'c' && i < cells ? 'animate-flicker' : ''} style={{ transition: `fill 1s ease ${i * 0.25}s` }} />)}
      </g>
      <g style={show(pick === 'b')}>
        <g transform="translate(540 274)"><rect x="-12" y="-52" width="22" height="52" rx="10" fill="#d9e1f5" /><rect x="14" y="-52" width="22" height="52" rx="10" fill="#9fb2e8" /><rect x="-12" y="-24" width="48" height="6" fill="#ffb84d" /></g>
        <Dots n={10} x={540} y={212} w={26} h={6} dx={6} dy={-50} dur={2.6} color="#ffd9a0" size={[2, 4]} o={0.4} seed={42} />
      </g>
      <Crew x={330} y={300} accent={A.nova} s={0.95} />
      <Foreground />
    </>
  )
}

/** Garden trouble */
export function GardenScene({ pick }: SceneProps) {
  const ok = pick === 'a' || pick === 'b'
  return (
    <>
      <Backdrop />
      <Habitat x={680} y={270} s={0.62} />
      <g transform="translate(330 276)">
        <ellipse cx="30" cy="2" rx="190" ry="8" fill="#000" opacity=".3" />
        <path d="M-160 0Q-160 -130 0 -130Q160 -130 160 0z" fill="url(#es-glass)" stroke="#bfefff" strokeOpacity=".6" strokeWidth="3" />
        {[-100, -50, 0, 50, 100].map((x) => <path key={x} d={`M${x} -2Q${x * 0.9} -80 ${x * 0.3} -128`} fill="none" stroke="#bfefff" strokeOpacity=".28" />)}
        <rect x="-150" y="-14" width="300" height="14" fill="#5a4636" />
        {[-110, -66, -22, 22, 66, 110].map((x, i) => (
          <g key={x} transform={`translate(${x} -14)`}>
            <g style={{ transform: `rotate(${ok ? 0 : i % 2 ? 24 : -24}deg)`, transformOrigin: '0 0', transition: `transform 1.8s ease ${i * 0.15}s` }}>
              <path d="M0 0C0 -16 -3 -30 0 -50" stroke={ok ? '#4fa86b' : '#a89a3a'} strokeWidth="4" fill="none" strokeLinecap="round" style={{ transition: 'stroke 1.8s' }} />
              <ellipse cx="-11" cy="-36" rx="11" ry="5" fill={ok ? '#7BE0A4' : '#d9c34f'} transform="rotate(-24 -11 -36)" style={{ transition: 'fill 1.8s' }} />
              <ellipse cx="11" cy="-46" rx="11" ry="5" fill={ok ? '#7BE0A4' : '#d9c34f'} transform="rotate(24 11 -46)" style={{ transition: 'fill 1.8s' }} />
              <circle cx="0" cy="-52" r="4" fill={ok ? '#ff7a6b' : '#8a7a2a'} style={{ transition: 'fill 1.8s' }} />
            </g>
          </g>
        ))}
        {/* grow lights */}
        <rect x="-110" y="-104" width="220" height="8" rx="4" fill="#8a92a8" />
        <g style={show(pick === 'a')}><path d="M-104 -96L-150 -14H150L104 -96z" fill="#ff7ad9" opacity=".2" /><rect x="-104" y="-100" width="208" height="5" rx="2" fill="#ffb8f0" className="breathe" /></g>
        {/* irrigation */}
        <Pipe d="M-134 -76 H134" flow={pick === 'b'} w={4} />
        {[-100, -50, 0, 50, 100].map((x) => <circle key={x} cx={x} cy="-72" r="3" fill={pick === 'b' ? WATER : '#6d7691'} />)}
        <Dots n={22} x={-110} y={-70} w={220} h={4} dx={0} dy={54} dur={1.3} color={WATER} size={[1, 2]} o={0.9} seed={51} on={pick === 'b'} />
        <Beacon x={-140} y={-100} color="#FF6B6B" on={pick === null || pick === 'c'} />
      </g>
      <g style={show(pick === 'c')}>
        {[0, 1, 2].map((i) => <rect key={i} x={560 + i * 22} y={286 - i * 4} width="18" height="26" rx="3" fill="#cfd5e4" stroke="#8a92a8" />)}
      </g>
      <Crew x={pick === 'c' ? 540 : 130} y={296} accent={A.zuri} s={1.05} flip={pick !== 'c'} />
      <Foreground />
    </>
  )
}
