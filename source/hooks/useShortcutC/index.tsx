import { useEffect } from 'react'
import useInputStatus from '../useInputStatus'

const useShortcutC = (callback: any) => {
  const isInputFocused = useInputStatus()
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 'c') {
        if (!isInputFocused) {
          callback()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [callback])
}

export default useShortcutC
