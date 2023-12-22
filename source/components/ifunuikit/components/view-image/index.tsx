import { Button, Tooltip } from 'antd'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Icon from '../../assets/icons'
import styles from './style.module.css'
import { debounce, throttle } from 'lodash'
import styled from '@emotion/styled'

interface Props {
  url: string
}

const ToolBarBtn = styled(Icon)`
  font-size: 24px;
  color: #fff;
  cursor: pointer;
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`
const ToolBar = styled.div`
  position: absolute;
  bottom: 78px;
  left: 50%;
  transform: translateX(-50%);
  height: 64px;
  background: rgba(4, 4, 4, 0.6);
  border-radius: 16px 16px 16px 16px;
  padding: 7px 32px;
  /* bottom: 120px; */
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-start;
  backdrop-filter: blur(5px);
`

const Text = styled.span`
  color: #fff;
  user-select: none;
`

const ViewImage = (props: Props) => {
  const [scale, setScale] = useState(1)
  const [deg, setDeg] = useState(0)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const startPointRef = useRef<{
    x: number
    y: number
  }>()
  const [point, setPoint] = useState<{
    x: number
    y: number
  }>()

  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function func(e: Event) {
      if (!document.fullscreenElement) {
        setIsFullScreen(false)
      }
    }
    document.addEventListener('fullscreenchange', func)
    return () => {
      document.removeEventListener('fullscreenchange', func)
    }
  }, [])

  const onMove = throttle((event: MouseEvent) => {
    if (startPointRef.current) {
      setPoint({
        x: event.screenX - startPointRef.current.x,
        y: event.screenY - startPointRef.current.y,
      })
    }
  }, 50)
  const onMoveEnd = () => {
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onMoveEnd)
  }
  const onMoveStart = (event: React.MouseEvent) => {
    startPointRef.current = {
      x: event.screenX - (point?.x || 0),
      y: event.screenY - (point?.y || 0),
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onMoveEnd)
  }
  const onShrink = () =>
    setScale(oldScale => (oldScale - 0.1 < 0.1 ? 0.1 : oldScale - 0.1))
  const onGrow = () => setScale(oldScale => oldScale + 0.1)
  const onScale = (event: React.WheelEvent) => {
    if (event.deltaY < 0) {
      onGrow()
    } else {
      onShrink()
    }
  }
  const onRotate = () => setDeg(deg + 90)
  const onFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
      setIsFullScreen(false)
    } else if (wrapRef.current) {
      wrapRef.current.requestFullscreen()
      setIsFullScreen(true)
    }
  }
  const calcStyle = () => {
    return isFullScreen ? styles.white_text : ''
  }

  return (
    <div ref={wrapRef} className={styles.view_image}>
      <div className={styles.image_box}>
        <div
          className={styles.image_wrap}
          style={{
            transform: `translate(${point?.x || 0}px,${point?.y || 0}px)`,
          }}
        >
          <img
            className={styles.image}
            src={props.url}
            draggable={false}
            style={{
              transform: ` scale(${scale}) rotate(${deg}deg)`,
            }}
            alt=""
            title=""
            onMouseDown={onMoveStart}
            onWheel={onScale}
          />
        </div>
      </div>
      <ToolBar id="pop">
        <Tooltip
          placement="bottom"
          title="缩小"
          getPopupContainer={() =>
            document.getElementById('pop') as HTMLElement
          }
        >
          <ToolBarBtn type="shrink-2" onClick={onShrink} />
        </Tooltip>
        <Text className={calcStyle()}>{Math.round(scale * 100)}%</Text>
        <Tooltip
          placement="bottom"
          title="放大"
          getPopupContainer={() =>
            document.getElementById('pop') as HTMLElement
          }
        >
          <ToolBarBtn type="grow-2" onClick={onGrow} />
        </Tooltip>
        <Tooltip
          placement="bottom"
          title="旋转"
          getPopupContainer={() =>
            document.getElementById('pop') as HTMLElement
          }
        >
          <ToolBarBtn type="flush" onClick={onRotate} />
        </Tooltip>
        <Tooltip
          placement="bottom"
          title="全屏"
          getPopupContainer={() =>
            document.getElementById('pop') as HTMLElement
          }
        >
          <ToolBarBtn
            type={isFullScreen ? 'shrink' : 'grow'}
            onClick={onFullscreen}
          />
        </Tooltip>
      </ToolBar>
    </div>
  )
}

export default ViewImage
