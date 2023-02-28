/* eslint-disable @typescript-eslint/naming-convention */
import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { resourceUsage } from 'process'
import React, { useEffect, useLayoutEffect } from 'react'
const Container = styled.div`
  margin-bottom: 8px;
  &:hover {
    cursor: pointer;
  }
`
const ItemList = styled.div`
  min-width: 352px;
  height: 44px;
  border-radius: 8px;
  background-color: var(--neutral-n8);
  display: flex;
  align-items: center;
  padding: 0 24px;
  font-size: 14px;
`

const SliderList = (props: any) => {
  const { children, index, onMove, listLength } = props
  const [left, setLeft] = React.useState(0)
  const [isDragging, setIsDragging] = React.useState(false)
  const [zIndex, setZIndex] = React.useState(0)
  const ref: any = React.useRef()
  const indexRef = React.useRef(index)
  const onMoveRef = React.useRef(onMove)
  const listLengthRef = React.useRef(listLength)
  const prevRectRef = React.useRef(null)
  const animationRef: any = React.useRef(null)
  useEffect(() => {
    // 始终保持最新状态 Ref 引用
    indexRef.current = index
    onMoveRef.current = onMove
    listLengthRef.current = listLength
  }, [index, onMove, listLength])
  useEffect(() => {
    const el: any = ref.current
    // 存储起始鼠标位置
    let delayedSetZIndexTimeoutId: any = null
    const mouseMove = (ev: any) => {
      ev.preventDefault()
      // 获取元素 Rect 并更新 Ref
      const rect = el.getBoundingClientRect()
      prevRectRef.current = rect
      // 计算最新 left 位置
      let latestTop = 0
      // 检查是否需要更新元素位置
      if (rect.width && indexRef.current < listLengthRef.current - 1) {
        latestTop = 200
        // 开始位置也要更新
      } else if (latestTop < +rect.width && indexRef.current > 0) {
        return
      }
      setLeft(latestTop)
    }
    const mouseUp = (ev: any) => {
      ev.preventDefault()
      document.removeEventListener('mousemove', mouseMove)
      // 重置 left
      setLeft(0)
      // 结束拖拽
      setIsDragging(false)
      delayedSetZIndexTimeoutId = setTimeout(() => {
        // 延迟设置 zIndex，不然一结束拖拽该元素就会被盖到其他元素下面
        setZIndex(999)
      }, 200)
    }
    const mouseDown = (ev: any) => {
      ev.preventDefault()
      clearTimeout(delayedSetZIndexTimeoutId)
      // 注册事件
      document.addEventListener('mousemove', mouseMove)
      document.addEventListener('mouseup', mouseUp, { once: true })
      // 开始拖拽
      setIsDragging(true)
      setZIndex(1)
    }
    el.addEventListener('mousedown', mouseDown)
  }, [])
  useLayoutEffect(() => {
    const el: any = ref.current
    if (isDragging) {
      // 拖拽中的元素不计算
      return
    }
    if (prevRectRef.current === null) {
      // 元素第一次渲染
      prevRectRef.current = el.getBoundingClientRect()
      return
    }
    if (animationRef.current) {
      const animation = animationRef.current
      if (animation.playState === 'running') {
        // Cancel previous animation
        animation.cancel()
      }
    }
    // FLIP: First
    const prevRect: any = prevRectRef.current
    // FLIP: Last
    const latestRect = el.getBoundingClientRect()
    const deltaY = latestRect.y - prevRect.y
    prevRectRef.current = latestRect
    if (deltaY === 0) {
      return
    }
    // FLIP: Invert and Play
    animationRef.current = el.animate(
      [
        {
          right: `${-deltaY}px`,
        },
        {
          right: `0px`,
        },
      ],
      200,
    )
  }, [index, isDragging])
  return (
    <Container
      ref={ref}
      onClick={() => props.onChange(children)}
      style={{
        right: `${left}px`,
        transition: 'transform .2s, box-shadow .2s',
        position: 'relative',
        zIndex: zIndex.toString(),
      }}
    >
      <ItemList>
        <CommonIconFont
          type="interation"
          size={19}
          color="var(--neutral-n1-d1)"
        />
        <span style={{ marginLeft: '8px' }}>{children.label}</span>
      </ItemList>
    </Container>
  )
}

const Sortable = (props: any) => {
  const { list, setList } = props
  return (
    <div>
      {list.map((child: any, i: number) => (
        <SliderList
          onChangeTeam={(row: any) => props.onChangeTeam(row, child)}
          onChange={(item: any) => props.onChange(item)}
          key={child.label}
          index={i}
          listLength={list.length}
          onMove={(prevIndex: any, nextIndex: any) => {
            const newList = [...list]
            newList.splice(nextIndex, 0, newList.splice(prevIndex, 1)[0])
            setList(newList)
          }}
        >
          {child}
        </SliderList>
      ))}
    </div>
  )
}
export default Sortable
