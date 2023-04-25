import React, { useEffect, useState } from 'react'
import { getStyleValue } from '../../utils'

// let timer: NodeJS.Timeout
const useMaxWidth = (className: string, delta: number) => {
  const [maxWidth, setMaxWidth] = useState(0)

  useEffect(() => {
    function handle() {
      const width = getWidth(className, delta)
      setMaxWidth(width)
    }
    handle()
    const dom = document.querySelector(className)
    const resize = new ResizeObserver(() => {
      // clearTimeout(timer)
      // timer = setTimeout(() => {
      handle()
      // }, 500)
    })
    dom && resize.observe(dom)
    return () => {
      resize?.disconnect?.()
    }
  }, [className, delta])

  return {
    maxWidth,
  }
}

const getWidth = (className: string, delta: number) => {
  const dom = document.querySelector(className)
  if (!dom) {
    return 0
  }
  const width = Math.floor(getStyleValue(dom, 'width')) - delta
  return width
}

export default useMaxWidth
