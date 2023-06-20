import React, { useEffect } from 'react'
import useInputStatus from '../useInputStatus'

const useMkeyDown = (callback: any) => {
  const isInputFocused = useInputStatus()
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 'm') {
        console.log(isInputFocused, '聚焦状态')

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
