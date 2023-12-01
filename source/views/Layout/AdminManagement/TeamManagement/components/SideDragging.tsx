/* eslint-disable @typescript-eslint/naming-convention */
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { Dropdown, type MenuProps } from 'antd'
import { t } from 'i18next'
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
const SliderList = (props: any) => {
  const { index, onMove, listLength, active, childStyle, value } = props
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
      el.style.pointerEvents = 'none'
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
      el.style.pointerEvents = null
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
      // { once: true }
      document.addEventListener('mouseup', mouseUp)

      // 开始拖拽
      // setIsDragging(true)
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
          top: '0px',
        },
      ],
      200,
    )
  }, [index, isDragging])
  const items: MenuProps['items'] = [
    {
      key: 'edit',
      label: t('editorial_team') as string,
    },
    {
      key: 'del',
      label: t('disbanding_the_team') as string,
    },
  ]
  const onChangeTeam = (item: any) => {
    props.onChangeTeam(item.key)
  }
  return (
    <Container
      ref={ref}
      color={childStyle.color}
      bgColor={childStyle.hoverColor}
      onClick={props.onChange}
      style={{
        background: active ? childStyle.activeColor : '',
        width: '100%',
        display: 'flex',
        height: childStyle.height,
        transform: isDragging ? 'scale(1.01)' : 'scale(1)',
        top: `${top}px`,
        transition: 'transform .2s, box-shadow .2s',
        position: 'relative',
        zIndex: zIndex.toString(),
        borderRadius: 4,
      }}
    >
      <IconFontStyle type="move" className="icon" style={{ marginRight: 8 }} />
      <ListItemStyle
        style={{
          width: '80%',
          color: active ? childStyle.activeTextColor : childStyle.textColor,
        }}
      >
        {value?.logo_info?.path ? (
          <img
            src={value?.logo_info?.path}
            style={{
              width: 16,
              height: 16,
              marginRight: 8,
              borderRadius: '3px',
            }}
          />
        ) : (
          <IconFont
            type="team-8a8gio2p"
            style={{ fontSize: 16, color: ' #98ACE0', marginRight: 8 }}
          />
        )}

        <span
          style={{
            width: '90%',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            display: 'inline-block',
          }}
        >
          {value.name}
        </span>
      </ListItemStyle>
      <Dropdown
        menu={{ items, onClick: onChangeTeam }}
        trigger={['hover']}
        placement="bottomRight"
        overlayStyle={{
          width: 120,
          background: 'var(--neutral-white-d1)',
        }}
      >
        <IconFontStyle type="more" className="icon" />
      </Dropdown>
    </Container>
  )
}

const Sortable = (props: any) => {
  const { list, setList, childStyle } = props
  return (
    <div
      style={{ width: '100%', height: 'calc(100% - 120px)', overflow: 'auto' }}
    >
      {list?.map((child: any, i: number) => (
        <SliderList
          onChangeTeam={(row: any) => props.onChangeTeam(row, child)}
          onChange={() => props.onChange(child)}
          childStyle={childStyle}
          key={child.id}
          index={i}
          active={child.active}
          listLength={list.length}
          onMove={(prevIndex: any, nextIndex: any) => {
            const newList = [...list]
            newList.splice(nextIndex, 0, newList.splice(prevIndex, 1)[0])
            setList(newList)
            props.onChangeMove(newList)
          }}
          value={child}
        ></SliderList>
      ))}
    </div>
  )
}

export default Sortable
