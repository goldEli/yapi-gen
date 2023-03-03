/* eslint-disable @typescript-eslint/naming-convention */
import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { useRef, useState } from 'react'
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
  // 传值位置
  const onDragStart = (ev: any) => {
    children.dragtype = 'add'
    ev.dataTransfer.setData('item', JSON.stringify(children))
  }
  const onDrag = (ev: any) => {
    const el: any = ref.current
    const rect = el.getBoundingClientRect()
    prevRectRef.current = rect
    // 计算最新 Top Left位置
    let latestTop = ev.clientY - startY
    let latestLeft = ev.clientX - startX
    if (latestTop > 0 || latestLeft > 0) {
      setTop(ev.pageY)
      setLeft(ev.pageX)
    }
  }
  const onDragEnd = () => {
    setTop(0)
    setLeft(0)
  }
  return (
    <Container
      ref={ref}
      draggable="true"
      onDragStart={event => onDragStart(event)}
      onDrag={(ev: any) => onDrag(ev)}
      onDragEnd={() => onDragEnd()}
      style={{
        top: `${top}px`,
        left: `${left}px`,
        position: top > 0 && left > 0 ? 'fixed' : 'relative',
        zIndex: 9999,
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
      {list?.map((child: any, i: number) => (
        <SliderList
          onUpdate={() => props.onUpdate()}
          onChangeTeam={(row: any) => props.onChangeTeam(row, child)}
          onChange={(item: any) => props.onChange(item)}
          key={child.label}
          index={i}
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
