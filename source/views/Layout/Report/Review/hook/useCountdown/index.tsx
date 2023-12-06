import { useRef, useState } from 'react'

const useCountdown = () => {
  const [times, setTimes] = useState(0)
  const timer = useRef<any>()

  const start = (type: string) => {
    const now = Math.ceil(Date.now() / 1000)
    const last = Number(localStorage.getItem(`${type}_timer`) ?? 0)
    let time = last - now
    if (time > 0) {
      timer.current = setInterval(() => {
        localStorage.setItem(`${type}_timer`, String(now + time))
        if (time === 0) {
          clearInterval(timer.current)
        }
        setTimes(time)
        time -= 1
      }, 1000)
    }
  }

  const clearTimer = () => {
    setTimes(0)
    clearInterval(timer.current)
  }

  const setLocalTime = (type: string) => {
    const last = Math.ceil(Date.now() / 1000) + 60
    localStorage.setItem(`${type}_timer`, String(last))
  }

  return {
    times,
    start,
    setLocalTime,
    clearTimer,
  }
}

export default useCountdown
