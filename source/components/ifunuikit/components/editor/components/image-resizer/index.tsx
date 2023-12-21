/* eslint-disable @typescript-eslint/consistent-type-imports */
import { useRef, useState } from 'react'
import { ResizeHandle, ResizeHandlePlace, Wrap, Image } from './style'

type ImageResizerProps = {
  imageURL?: string
  onResize?(params: { width: number; height: number }): void
}

const ImageResizer = (props: ImageResizerProps) => {
  const startPointRef = useRef<{
    x: number
    y: number
    type: ResizeHandlePlace
    maxWidth: number
    maxHeight: number
    originWidth: number
    originHeight: number
    positionType: string
  }>()
  const resizerRef = useRef<HTMLDivElement>(null)
  const [movePoint, setMovePoint] = useState<{
    top?: number
    left?: number
    right?: number
    bottom?: number
    transform?: string
  }>()

  // 图片初始比例
  let initRatio = { x: 1, y: 1 }

  const onMouseMove = (event: MouseEvent) => {
    if (!startPointRef.current) {
      return
    }
    const newPoint = { x: event.clientX, y: event.clientY }

    // 判断是否拖拽的左侧点位
    const isDragLeft = ['left-top', 'left-bottom'].includes(
      startPointRef.current.positionType,
    )

    // 与拖拽点的距离
    const distances = {
      x: newPoint.x - startPointRef.current.x,
      y: newPoint.y - startPointRef.current.y,
    }

    const distanceX = isDragLeft ? -distances.x : distances.x

    // 计算比列
    const r = {
      x:
        (startPointRef.current.originWidth + distanceX) /
        startPointRef.current.originWidth,
      y:
        (startPointRef.current.originHeight + distances.y) /
        startPointRef.current.originHeight,
    }

    // 使用比例
    const endR =
      distanceX < 0 || distances.y < 0 ? Math.min(r.x, r.y) : Math.max(r.x, r.y)

    // const ratio;

    setMovePoint({
      transform: `scale(${endR})`,
    })

    initRatio = r
  }

  const onMouseUp = () => {
    const width = Math.floor(resizerRef.current!.offsetWidth)
    const height = Math.floor(resizerRef.current!.offsetHeight)

    setMovePoint({})

    const { x, y } = initRatio
    const dragendWidth = Math.floor(width * x)
    const dragendHeight = Math.floor(height * y)
    props.onResize?.({ width: dragendWidth, height: dragendHeight })

    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
    initRatio = { x: 1, y: 1 }
  }

  const onMouseDown = (event: React.MouseEvent, type: ResizeHandlePlace) => {
    startPointRef.current = {
      type,
      x: event.clientX,
      y: event.clientY,
      maxWidth: Math.floor(resizerRef.current!.offsetWidth),
      maxHeight: Math.floor(resizerRef.current!.offsetHeight),
      originWidth: Math.floor(resizerRef.current!.offsetWidth),
      originHeight: Math.floor(resizerRef.current!.offsetHeight),
      positionType: type,
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  return (
    <Wrap ref={resizerRef} style={movePoint}>
      <Image draggable data-drag-handle url={props.imageURL} />
      <ResizeHandle
        place="left-top"
        onMouseDown={event => onMouseDown(event, 'left-top')}
      />
      <ResizeHandle
        place="left-bottom"
        onMouseDown={event => onMouseDown(event, 'left-bottom')}
      />
      <ResizeHandle
        place="right-top"
        onMouseDown={event => onMouseDown(event, 'right-top')}
      />
      <ResizeHandle
        place="right-bottom"
        onMouseDown={event => onMouseDown(event, 'right-bottom')}
      />
    </Wrap>
  )
}

export default ImageResizer
