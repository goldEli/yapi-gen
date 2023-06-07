import { useEffect } from 'react'

const useShortcutC = (callback: any) => {
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 'c') {
        callback()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [callback])
}

export default useShortcutC
