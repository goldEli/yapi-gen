import { getStyleValue } from '@/components/CalendarManager/utils'
import { css } from '@emotion/css'
import styled from '@emotion/styled'
import React, { useCallback, useRef, useState } from 'react'

export type TDirection = 'top' | 'bottom'
interface ResizerProps {
  onResize(direction: TDirection, movementX: number, movementY: number): void
  onFinish(direction: TDirection): void
  top: number
  height: number
  data: Model.Schedule.Info
}

const Top = styled.div`
  position: absolute;
  cursor: ns-resize;
  height: 4px;
  width: 100%;
  z-index: 2;
  left: 0;
  top: 0;
`

const Bottom = styled.div`
  position: absolute;
  cursor: ns-resize;
  width: 100%;
  height: 4px;
  z-index: 1;
  bottom: 0;
  left: 0;
`

const Resizer: React.FC<ResizerProps> = props => {
  const directionRef = useRef<TDirection>()
  const resizeTopBtnRef = useRef<HTMLDivElement>(null)
  const resizeBottomBtnRef = useRef<HTMLDivElement>(null)

  const handleMouseUp = useCallback(() => {
    if (!directionRef.current) return
    props.onFinish(directionRef.current)
  }, [props.onFinish])

  const handleMouseMove = (e: globalThis.MouseEvent) => {
    if (!directionRef.current) return
    // setMovementY(e.movementY)
    const resizeBottomBtn = resizeBottomBtnRef.current
    if (!resizeBottomBtn) {
      return
    }
    const topValue = getStyleValue(resizeBottomBtn, 'top')
    resizeBottomBtn.style.top = `${topValue + e.movementY}px`
    props.onResize(directionRef.current, e.movementX, e.movementY)
  }

  const onMouseup = () => {
    window.removeEventListener('mousemove', handleMouseMove)
    handleMouseUp()
  }
  const handleMouseDown = (d: TDirection) => {
    directionRef.current = d

    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', onMouseup)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', onMouseup)
  }

  return (
    <>
      <Top
        ref={resizeTopBtnRef}
        style={{
          top: props.top,
        }}
        onMouseDown={e => {
          e.stopPropagation()
          handleMouseDown('top')
        }}
      ></Top>
      <Bottom
        // id="resizeBottomBtn"
        ref={resizeBottomBtnRef}
        style={{
          top: props.top + props.height - 4,
        }}
        // ref={drag}
        onMouseDown={e => {
          e.stopPropagation()
          handleMouseDown('bottom')
        }}
      ></Bottom>
    </>
  )
}

export default Resizer
