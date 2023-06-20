import React from 'react'
import useInputStatus from '../useInputStatus'

const useFKeyPress = (callback: any) => {
  const isInputFocused = useInputStatus()
  React.useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key === 'f') {
        if (!isInputFocused) {
          callback()
        }
      }
    }

    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [callback])
}

export default useFKeyPress
