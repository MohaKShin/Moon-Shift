interface Props {
  x: number
  y: number
  scale?: number
  accent: string
  delay?: number
  flip?: boolean
}

/** A friendly little SVG astronaut. Feet sit at (x, y). */
export function Astronaut({ x, y, scale = 1, accent, delay = 0, flip }: Props) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      <ellipse cx="0" cy="1" rx="17" ry="4" fill="#000" opacity=".3" />
      <g className="animate-bob" style={{ animationDelay: `${delay}s`, transformBox: 'fill-box' }}>
        <rect x="-19" y="-44" width="11" height="28" rx="5" fill="#9AA3B8" />
        <rect x="-11" y="-14" width="9" height="14" rx="4" fill="#E9EDF6" />
        <rect x="2" y="-14" width="9" height="14" rx="4" fill="#E9EDF6" />
        <rect x="-13" y="-46" width="26" height="36" rx="11" fill="#F4F6FB" />
        <rect x="-6" y="-34" width="12" height="8" rx="3" fill={accent} />
        <circle cx="0" cy="-56" r="15" fill="#F4F6FB" />
        <ellipse cx="2.5" cy="-56" rx="10" ry="8" fill="url(#visor)" />
        <ellipse cx="-0.5" cy="-59" rx="3" ry="1.8" fill="#fff" opacity=".7" />
        <rect x="13" y="-42" width="7" height="16" rx="3.5" fill="#F4F6FB" transform="rotate(-18 16 -42)" />
      </g>
    </g>
  )
}

export function AstronautDefs() {
  return (
    <defs>
      <linearGradient id="visor" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#5CE1E6" />
        <stop offset="1" stopColor="#1b3a8a" />
      </linearGradient>
    </defs>
  )
}
