import React from 'react'
import useInputStatus from '../useInputStatus'

const usePressKyey = (targetKey: string, callback: any) => {
  const isInputFocused = useInputStatus()
  React.useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key === targetKey) {
        if (!isInputFocused) {
          callback()
        }
      }
    }

    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [targetKey, callback])
}

export default usePressKyey
