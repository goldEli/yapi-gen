import React, { useEffect } from 'react'

const useMkeyDown = (callback: any) => {
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 'm') {
        callback()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [callback])
}

export default useMkeyDown
