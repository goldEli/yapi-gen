/* eslint-disable @typescript-eslint/naming-convention */
import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { throttle } from 'lodash'
import { useEffect, useRef, useState } from 'react'

const Container = styled.div`
  border-radius: 8px;
  background-color: var(--neutral-n8);
  margin-bottom: 8px;
  &:hover {
    cursor: pointer;
  }
`

const ItemList = styled.div`
  width: 352px;
  height: 44px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  font-size: 14px;
  margin-bottom: 8px;
`

const SliderList = (props: any) => {
  const { children } = props
  const [top, setTop] = useState(0)
  const [left, setLeft] = useState(0)
  const ref: any = useRef()
  const prevRectRef = useRef(null)
  let startY = 0
  let startX = 0
  const [dragItem, setDragItem] = useState<any>()
  // 传值位置
  const onDragStart = (ev: any) => {
    const obj = { ...children, dragtype: 'add' }
    setDragItem(obj)
    ev.dataTransfer.setData('item', JSON.stringify(obj))
    const imgDom = document.createElement('div')
    //创建一个图像并且使用它作为拖动图像
    document.body.appendChild(imgDom)
    ev.dataTransfer.setDragImage(imgDom, 0, 0)
  }
  const onDrag = (e: any) => {
    console.log(111)
    localStorage.className = ''
    const el: any = ref.current
    const rect = el.getBoundingClientRect()
    prevRectRef.current = rect
    // 计算最新 Top Left位置
    let latestTop = e.clientY - startY
    let latestLeft = e.clientX - startX
    if (latestTop > 0 || latestLeft > 0) {
      setTop(e.pageY)
      setLeft(e.pageX)
    }
    if (e.pageY >= window.screen?.availHeight - 300) {
      document
        .getElementById('father')!
        .scrollTo({ top: e.pageY, behavior: 'smooth' })
    } else if (e.pageY <= Number(localStorage.topTitleTop)) {
      document
        .getElementById('father')!
        .scrollTo({ top: Number(0), behavior: 'smooth' })
    }
  }
  const onDragEnd = () => {
    console.log('end')
    setTop(0)
    setLeft(0)
  }

  const allowDrop = (ev: any) => {
    ev.preventDefault()
    setTop(0)
    setLeft(0)
  }
  return (
    <div draggable="false">
      {top > 0 ? (
        <Container
          style={{
            top: `${top}px`,
            left: `${left}px`,
            width: '352px',
            height: '44px',
            background: 'var(--neutral-white-d6)',
            boxShadow: '0px 0px 15px 6px rgba(0,0,0,0.12)',
            position: top > 0 && left > 0 ? 'fixed' : 'relative',
            zIndex: top > 0 && left > 0 ? 990 : 9,
          }}
          onDragOver={allowDrop}
          onDragEnd={() => onDragEnd()}
          draggable="true"
        >
          <ItemList>
            <CommonIconFont
              type={dragItem?.icon}
              size={18}
              color="var(--neutral-n1-d1)"
            />
            <span style={{ marginLeft: '8px' }}>{dragItem.label}</span>
          </ItemList>
        </Container>
      ) : null}
      <Container
        ref={ref}
        draggable="true"
        onDragStart={event => onDragStart(event)}
        onDrag={onDrag}
        onDragOver={allowDrop}
        onDragEnd={() => onDragEnd()}
      >
        <ItemList>
          <CommonIconFont
            type={children?.icon}
            size={18}
            color="var(--neutral-n1-d1)"
          />
          <span style={{ marginLeft: '8px' }}>{children.label}</span>
        </ItemList>
      </Container>
    </div>
  )
}

const Sortable = (props: any) => {
  const { list } = props
  return (
    <div>
      {list?.map((child: any, i: number) => (
        <SliderList key={child.label} index={i}>
          {child}
        </SliderList>
      ))}
    </div>
  )
}
export default Sortable
