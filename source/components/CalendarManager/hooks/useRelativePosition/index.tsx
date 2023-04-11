import { useEffect, useState } from 'react'

const useRelativePosition = (self: string, container: string) => {
  const [position, setPosition] = useState<{ x: number; y: number }>()

  useEffect(() => {
    if (!self) {
      return
    }
    const selfDom = document.getElementById(self)
    const containerDom = document.querySelector(container)
    if (!selfDom || !containerDom) {
      return
    }
    const selfRect = selfDom.getBoundingClientRect()
    const containerRect = containerDom.getBoundingClientRect()
    const delta = {
      x: selfRect.x - containerRect.x,
      y: selfRect.y - containerRect.y,
    }
    setPosition(delta)
  }, [self, container])

  return { position }
}

export default useRelativePosition
