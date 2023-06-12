import React from 'react'

const useFKeyPress = (callback: any) => {
  React.useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key === 'f') {
        callback()
      }
    }

    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [callback])
}

export default useFKeyPress
