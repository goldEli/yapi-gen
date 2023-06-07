import { useEffect } from 'react'

const useShortcutCtrlEnter = (callback: any) => {
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.ctrlKey && event.key === 'Enter') {
        callback()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [callback])
}

export default useShortcutCtrlEnter
