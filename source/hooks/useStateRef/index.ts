import { useEffect, useRef } from 'react'

export const useStateRef = <T = any>(state: T) => {
  const stateRef = useRef(state)

  useEffect(() => {
    stateRef.current = state
  }, [state])
  return stateRef
}
