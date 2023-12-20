import React, { useState, useEffect, ReactNode, useRef } from 'react'
import { useImageViewerStore } from './useImageViewerStore'

interface DragProps {
  children: ReactNode
}

const Drag: React.FC<DragProps> = ({ children }) => {
  const domRef = useRef<HTMLDivElement>(null)
  const { open } = useImageViewerStore()

  const handleMouseDown = (event: React.MouseEvent) => {
    // firstMove = true
    // event.preventDefault()
    // setIsDragging(true)
    // const { x, y } = getDistance(event)
    // setPosition({ x: event.clientX - x, y: event.clientY - y })
    const drag = domRef?.current as HTMLDivElement

    const x = event.clientX - drag.offsetLeft
    const y = event.clientY - drag.offsetTop
    // if (typeof drag.setCapture !== 'undefined') {
    //   drag.setCapture()
    // }
    document.onmousemove = function (e: MouseEvent) {
      console.log('move')
      e.preventDefault()
      let moveX = e.clientX - x
      let moveY = e.clientY - y
      if (moveX < 0) {
        moveX = 0
      } else if (moveX > window.innerWidth - drag.offsetWidth) {
        moveX = window.innerWidth - drag.offsetWidth
      }
      if (moveY < 0) {
        moveY = 0
      } else if (moveY > window.innerHeight - drag.offsetHeight) {
        moveY = window.innerHeight - drag.offsetHeight
      }
      drag.style.left = moveX + 'px'
      drag.style.top = moveY + 'px'
    }
    document.onmouseup = function (e) {
      // 多次点击会注册多次事件造成内存泄漏
      document.onmousemove = null
      document.onmouseup = null
    }
  }

  useEffect(() => {
    const drag = domRef?.current
    if (!open || !drag) {
      return
    }

    const rect = drag.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const bWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth
    const bHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight
    // const
    drag.style.left = `${bWidth / 2 - width / 2}px`
    drag.style.top = `${bHeight / 2 - height / 2}px`
  }, [open])

  return (
    <div
      style={{ position: 'fixed' }}
      ref={domRef}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  )
}

export default Drag
