import React, { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'

interface ControlScrollPlaneProps {}
const planeWidth = 124 - 16
const planeHeight = 64 - 16
const columnWidth = 302
const columnGap = 16
const ControlScrollPlaneBox = styled.div<{ gap: number }>`
  width: 124px;
  height: 64px;
  background: var(--neutral-white-d7);
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  border-radius: 6px 6px 6px 6px;
  opacity: 1;
  position: absolute;
  right: 16px;
  bottom: 16px;
  padding: 8px;
  box-sizing: border-box;
  display: flex;
  gap: ${props => props.gap + 'px'};
`

const WindowArea = styled.div<{
  width: number
  height: number
  left: number
  top: number
}>`
  width: ${props => props.width + 'px'};
  height: ${props => props.height + 'px'};
  border: 1px solid var(--primary-d1);
  box-sizing: border-box;
  position: absolute;
  left: ${props => props.left + 'px'};
  top: ${props => props.top + 'px'};
  cursor: pointer;
`

const Strip = styled.div<{ width: number }>`
  width: ${props => props.width + 'px'};
  height: 100%;
  background-color: var(--neutral-n7);
`

const useControlScrollPlane = (columnNum: number) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const childRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

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
      observer.observe(containerRef.current)
    }
    return () => {
      observer.disconnect()
    }
  }, [])
  console.log({ width, height, childWidth, childHeight })
  const widthRatio = planeWidth / childWidth
  const windowHeight = planeHeight * (height / childHeight)
  const windowWidth = planeWidth * (width / childWidth)
  const ControlScrollPlane: React.FC<ControlScrollPlaneProps> = props => {
    return (
      <ControlScrollPlaneBox gap={widthRatio * columnGap}>
        <WindowArea
          width={windowWidth}
          height={windowHeight}
          left={8}
          top={8}
        />
        {Array(columnNum ?? 0)
          .fill(0)
          .map((_, idx) => {
            return <Strip key={idx} width={columnWidth * widthRatio} />
          })}
      </ControlScrollPlaneBox>
    )
  }
  return {
    ControlScrollPlane,
    containerRef,
    childRef,
  }
}

export default useControlScrollPlane
