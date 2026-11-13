import { useSyncExternalStore } from 'react'
import { audio } from './audioManager'

export function useAudioSettings() {
  return useSyncExternalStore(audio.subscribe, audio.getSnapshot)
}
