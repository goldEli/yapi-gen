/**
 * 滚动快捷控制面板
 * 1. 面板展示容器缩略图
 * 2. 面板方块拖动控制容易滚动条快捷滚动
 */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { DraggableData } from 'react-rnd'
import { DraggableEvent } from 'react-draggable'
import { Content, ControlScrollPlaneBox, Strip, WindowArea } from './styled'

interface ControlScrollPlaneProps {}

// 面板缩略图宽度
const planeWidth = 124 - 16
const planeHeight = 64 - 16
// 容器中列的宽度
const columnWidth = 302
const columnGap = 16

const useControlScrollPlane = (columnNum: number) => {
  // 需要控制滚动条的容器
  const containerRef = useRef<HTMLDivElement>(null)
  // 容器可视区域宽高
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  // 容易滚动区域宽高
  const [childWidth, setChildWidth] = useState(0)
  const [childHeight, setChildHeight] = useState(0)

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      if (containerRef.current) {
        const { width, height } = entries[0].contentRect
        setWidth(width)
        setHeight(height)
        const { scrollWidth, scrollHeight } = containerRef.current
        setChildWidth(scrollWidth)
        setChildHeight(scrollHeight)
      }
    })

    if (containerRef.current) {
      // 监听容易宽高变化
      observer.observe(containerRef.current)
    }
    return () => {
      observer.disconnect()
    }
  }, [])
  // 缩略图与容器宽高比列
  const widthRatio = planeWidth / childWidth
  const heightRatio = planeHeight / childHeight

  // 缩略的可视宽高
  const windowHeight = planeHeight * (height / childHeight)
  const windowWidth = planeWidth * (width / childWidth)

  const ControlScrollPlane: React.FC<ControlScrollPlaneProps> = props => {
    // 缩略内容展示
    const thumbnailContent = useMemo(() => {
      return Array(columnNum ?? 0)
        .fill(0)
        .map((_, idx) => {
          return <Strip key={idx} width={columnWidth * widthRatio} />
        })
    }, [columnNum, columnWidth, widthRatio])

    return (
      <ControlScrollPlaneBox>
        <Content gap={widthRatio * columnGap} className="controlScrollPlaneBox">
          <WindowArea
            size={{
              width: windowWidth,
              height: windowHeight,
            }}
            bounds=".controlScrollPlaneBox"
            enableResizing={false}
            position={{
              x: 0,
              y: 0,
            }}
            onDrag={(e: DraggableEvent, data: DraggableData) => {
              e.stopPropagation()
              const { y, x } = data
              containerRef.current?.scrollTo(x / widthRatio, y / heightRatio)
            }}
          />
          {thumbnailContent}
        </Content>
      </ControlScrollPlaneBox>
    )
  }
  return {
    ControlScrollPlane,
    containerRef,
  }
}

export default useControlScrollPlane
