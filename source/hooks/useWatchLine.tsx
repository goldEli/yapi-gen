// 监听当前是否联网
import { useEffect, useState } from 'react'

const useWatchLine = () => {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine)

  const updateNetwork = () => {
    setIsOnline(window.navigator.onLine)
  }

  useEffect(() => {
    window.addEventListener('offline', updateNetwork)

    window.addEventListener('online', updateNetwork)

    return () => {
      window.removeEventListener('offline', updateNetwork)

      window.removeEventListener('online', updateNetwork)
    }
  })

  return isOnline
}

export default useWatchLine
