/* eslint-disable @typescript-eslint/naming-convention */
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { Dropdown, MenuProps } from 'antd'
import React, { useEffect, useLayoutEffect } from 'react'
const Container = styled.div<{ color?: string; bgColor?: string }>(
  {
    display: 'flex',
    padding: '0 16px',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ({ color, bgColor }) => ({
    color,
    '&:hover': {
      cursor: 'pointer',
      background: bgColor,
    },
    '&:hover .icon': {
      opacity: 1,
    },
  }),
)
const ListItemStyle = styled.div`
  width: 108px;
  font-size: var(--font14);
  font-weight: 400;
  color: var(--neutral-n1-d1);
  display: flex;
  align-items: center;
`
const IconFontStyle = styled(IconFont)`
  opacity: 0;
  font-size: 16px;
  color: var(--neutral-n3);
  &:hover {
    cursor: pointer;
    color: var(--primary-d2);
  }
`
const DropdownContainer = styled(Dropdown)`
  .ant-dropdown-menu {
    background: var(--neutral-white-d2);
    min-width: 120px;
    height: 72px;
    font-size: var(--font14);
    font-weight: 400;
    color: var(--neutral-n2);
  }
  .ant-dropdown-menu-item-active {
    background-color: var(--hover-d3);
    color: var(--neutral-n1-d1);
  }
`

const SliderList = (props: any) => {
  const { children, index, onMove, listLength, active, childStyle } = props
  const [top, setTop] = React.useState(0)
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
    let startY = 0
    let delayedSetZIndexTimeoutId: any = null
    const mouseMove = (ev: any) => {
      ev.preventDefault()
      // 获取元素 Rect 并更新 Ref
      const rect = el.getBoundingClientRect()
      prevRectRef.current = rect
      // 计算最新 Top 位置
      let latestTop = ev.clientY - startY
      // 检查是否需要更新元素位置
      if (
        latestTop > rect.height &&
        indexRef.current < listLengthRef.current - 1
      ) {
        // move down
        // 通知父组件修改列表
        onMoveRef.current(indexRef.current, indexRef.current + 1)
        // 因为 DOM 位置被改变了，需要同步计算最新位置
        // 可以理解为计算出来的值就是元素发生交换后，松开鼠标再按住鼠标时相关变量的值。
        // 可以试着注释掉这行看看会发生什么，就能理解了（会闪一下）
        latestTop -= rect.height
        // 开始位置也要更新
        startY += rect.height
      } else if (latestTop < -rect.height && indexRef.current > 0) {
        // move up
        onMoveRef.current(indexRef.current, indexRef.current - 1)
        latestTop += rect.height
        startY -= rect.height
      }
      setTop(latestTop)
    }
    const mouseUp = (ev: any) => {
      ev.preventDefault()
      document.removeEventListener('mousemove', mouseMove)
      // 重置 Top
      setTop(0)
      // 结束拖拽
      setIsDragging(false)
      delayedSetZIndexTimeoutId = setTimeout(() => {
        // 延迟设置 zIndex，不然一结束拖拽该元素就会被盖到其他元素下面
        setZIndex(0)
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
      // 记录开始位置
      startY = ev.clientY
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
    // 如果有动画正在运行则取消，防止拖动速度过快有鬼畜效果
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
          top: `${-deltaY}px`,
        },
        {
          top: `0px`,
        },
      ],
      200,
    )
  }, [index, isDragging])
  const items: MenuProps['items'] = [
    {
      key: 'edit',
      label: '编辑团队',
    },
    {
      key: 'del',
      label: '删除团队',
    },
  ]
  const onTapWrite = (item: any) => {
    return 123
  }
  return (
    <Container
      ref={ref}
      color={childStyle.color}
      bgColor={childStyle.hoverColor}
      onClick={() => props.onChange(children)}
      style={{
        background: active ? childStyle.activeColor : '',
        width: childStyle.width,
        height: childStyle.height,
        transform: isDragging ? `scale(1.01)` : `scale(1)`,
        top: `${top}px`,
        transition: 'transform .2s, box-shadow .2s',
        position: 'relative',
        zIndex: zIndex.toString(),
      }}
    >
      <IconFontStyle type="move" className="icon" />
      <ListItemStyle>
        <IconFont
          type="team-8a8gio2p"
          style={{ fontSize: 16, color: ' #98ACE0', marginRight: 8 }}
        />
        {children}
      </ListItemStyle>
      <DropdownContainer
        menu={{ items, onClick: onTapWrite }}
        trigger={['click']}
        placement="bottomRight"
        overlayStyle={{ width: 120 }}
      >
        <IconFontStyle type="more" className="icon" />
      </DropdownContainer>
    </Container>
  )
}

const Sortable = (props: any) => {
  const { list, setList, childStyle } = props
  return (
    <div>
      {list.map((child: any, i: number) => (
        <SliderList
          onChange={(item: any) => props.onChange(item)}
          childStyle={childStyle}
          key={child.key}
          index={i}
          active={child.active}
          listLength={list.length}
          onMove={(prevIndex: any, nextIndex: any) => {
            const newList = [...list]
            newList.splice(nextIndex, 0, newList.splice(prevIndex, 1)[0])
            setList(newList)
          }}
        >
          {child.children}
        </SliderList>
      ))}
    </div>
  )
}
export default Sortable