/* eslint-disable @typescript-eslint/naming-convention */
import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { useRef, useState } from 'react'
import DeleteConfirm from '@/components/DeleteConfirm'
import { deleteStoryConfigField } from '@/services/project'
import { message } from 'antd'
import { useSelector } from '@store/index'
const Container = styled.div`
  border-radius: 8px;
  background-color: var(--neutral-n8);
  margin-bottom: 8px;
  &:hover {
    cursor: pointer;
  }
`
const SearchItemList = styled.div`
  width: 352px;
  height: 44px;
  border-radius: 8px;
  background-color: var(--neutral-n8);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  font-size: 14px;
  margin-bottom: 8px;
  .delIcon {
    display: none;
  }
  &:hover {
    cursor: pointer;
    background-color: var(--white-d6);
    box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
    .delIcon {
      display: block;
    }
  }
`

const SliderList = (props: any) => {
  const { children } = props
  const [top, setTop] = useState(0)
  const [left, setLeft] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [delItem, setDelItem] = useState<any>()
  const { projectInfo } = useSelector(store => store.project)
  const ref: any = useRef()
  const prevRectRef = useRef(null)
  let startY = 0
  let startX = 0
  const onDragStart = (ev: any) => {
    children.dragtype = 'edit'
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
  // 删除
  const delConfig = async () => {
    await deleteStoryConfigField({
      id: delItem?.id,
      projectId: projectInfo.id,
    })
    message.success('删除成功')
    setIsVisible(false)
    props.onUpdate()
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
      <SearchItemList>
        <div>
          <CommonIconFont
            type="interation"
            size={19}
            color="var(--neutral-n1-d1)"
          />
          <span style={{ marginLeft: '8px' }}>{children.title}</span>
        </div>
        <div
          className="delIcon"
          onClick={() => {
            setIsVisible(true), setDelItem(children)
          }}
        >
          {children?.is_customize === 1 && (
            <CommonIconFont type="delete" size={19} color="var(--primary-d2)" />
          )}
        </div>
      </SearchItemList>
      <DeleteConfirm
        isVisible={isVisible}
        onChangeVisible={() => setIsVisible(false)}
        onConfirm={() => delConfig()}
      />
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
