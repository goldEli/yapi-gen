import React from 'react'

const useAltSKeyPress = (callback: any) => {
  React.useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.altKey && event.key === 's') {
        callback()
      }
    }

    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [callback])
}

export default useAltSKeyPress
