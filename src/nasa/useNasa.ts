import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchSolarSummary, type SolarSummary } from './donki'

export type NasaState =
  | { status: 'loading' }
  | { status: 'ok'; data: SolarSummary }
  | { status: 'error'; message: string }

export function useNasa() {
  const [state, setState] = useState<NasaState>({ status: 'loading' })
  const abort = useRef<AbortController | null>(null)

  const load = useCallback(() => {
    abort.current?.abort()
    const ctl = new AbortController()
    abort.current = ctl
    const timer = window.setTimeout(() => ctl.abort(), 9000)
    setState({ status: 'loading' })
    fetchSolarSummary(ctl.signal)
      .then((data) => { if (abort.current === ctl) setState({ status: 'ok', data }) })
      .catch((e: unknown) => {
        if (abort.current !== ctl) return
        const message = e instanceof Error && e.name !== 'AbortError' ? e.message : 'NASA took too long to answer.'
        setState({ status: 'error', message })
      })
      .finally(() => window.clearTimeout(timer))
  }, [])

  useEffect(() => {
    load()
    return () => abort.current?.abort()
  }, [load])

  return { state, reload: load }
}
