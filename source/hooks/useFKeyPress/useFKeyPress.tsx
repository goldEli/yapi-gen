import React from 'react'
import useInputStatus from '../useInputStatus'

const useFKeyPress = (callback: any) => {
  const isInputFocused = useInputStatus()
  console.log(isInputFocused, '聚焦状态')

  React.useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key === 'f') {
        event.preventDefault()
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
