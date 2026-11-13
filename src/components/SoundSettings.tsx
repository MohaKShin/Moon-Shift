import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX, Music, Sparkles } from 'lucide-react'
import { audio } from '../audio/audioManager'
import { useAudioSettings } from '../audio/useAudio'

export function SoundSettings({ align = 'right' }: { align?: 'left' | 'right' }) {
  const s = useAudioSettings()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    window.addEventListener('keydown', onKey)
    window.addEventListener('mousedown', onDown)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('mousedown', onDown) }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Sound settings"
        className="flex h-11 items-center gap-2 rounded-full border border-white/20 bg-deep/80 px-4 font-display font-semibold backdrop-blur hover:border-earth"
      >
        {s.muted ? <VolumeX size={20} className="text-alarm" /> : <Volume2 size={20} className="text-earth" />}
        <span className="hidden sm:inline">Sound</span>
      </button>
      {open && (
        <div className={`absolute z-50 mt-2 w-72 rounded-2xl border border-white/15 bg-panel p-4 shadow-2xl ${align === 'right' ? 'right-0' : 'left-0'}`}>
          <button
            onClick={() => audio.toggleMute()}
            className="mb-3 flex w-full items-center justify-between rounded-xl bg-white/5 px-3 py-2 font-display font-semibold hover:bg-white/10"
          >
            {s.muted ? 'Sound is off' : 'Sound is on'}
            {s.muted ? <VolumeX size={20} className="text-alarm" /> : <Volume2 size={20} className="text-earth" />}
          </button>
          <label className="mb-1 flex items-center gap-2 text-sm font-bold"><Music size={16} className="text-earth" /> Music</label>
          <input aria-label="Music volume" type="range" min={0} max={100} value={Math.round(s.music * 100)}
            onChange={(e) => audio.setMusicVolume(+e.target.value / 100)} className="mb-3" />
          <label className="mb-1 flex items-center gap-2 text-sm font-bold"><Sparkles size={16} className="text-solar" /> Sound effects</label>
          <input aria-label="Sound effects volume" type="range" min={0} max={100} value={Math.round(s.sfx * 100)}
            onChange={(e) => audio.setSfxVolume(+e.target.value / 100)}
            onPointerUp={() => void audio.sfx('click')} />
          {!s.unlocked && <p className="mt-3 text-xs text-white/60">Sound starts when you press Start Mission.</p>}
        </div>
      )}
    </div>
  )
}
