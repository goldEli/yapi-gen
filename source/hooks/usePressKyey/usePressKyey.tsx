import React from 'react'

const usePressKyey = (targetKey: string, callback: any) => {
  React.useEffect(() => {
    const handleKeyPress = (event: any) => {
      console.log(event.key)

      if (event.key === targetKey) {
        callback()
      }
    }

    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [targetKey, callback])
}

export default usePressKyey
