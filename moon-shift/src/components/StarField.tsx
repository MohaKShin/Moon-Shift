import { memo, useMemo } from 'react'

function rng(seed: number) {
  let s = seed
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646
}

export const StarField = memo(function StarField() {
  const stars = useMemo(() => {
    const r = rng(42)
    return Array.from({ length: 110 }, () => ({
      x: r() * 100, y: r() * 100, s: 1 + r() * 2.2, d: r() * 4, o: 0.3 + r() * 0.7,
    }))
  }, [])
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {stars.map((st, i) => (
        <span
          key={i}
          className="absolute animate-twinkle rounded-full bg-white"
          style={{ left: `${st.x}%`, top: `${st.y}%`, width: st.s, height: st.s, opacity: st.o, animationDelay: `${st.d}s` }}
        />
      ))}
    </div>
  )
})
