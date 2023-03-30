/* eslint-disable @typescript-eslint/naming-convention */
import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { useRef, useState } from 'react'
import DeleteConfirm from '@/components/DeleteConfirm'
import { deleteStoryConfigField } from '@/services/project'
import { message } from 'antd'
import { useSelector } from '@store/index'
import IconFont from '@/components/IconFont'
import { useTranslation } from 'react-i18next'
import { throttle } from 'lodash'

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
      color: var(--neutral-n2);
    }
  }
`
const ItemList = styled.div`
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
`
const IconFontStyle = styled(IconFont)({
  color: 'var(--neutral-n2)',
  fontSize: 19,
  '&:hover': {
    color: 'var(--primary-d2)',
  },
})
const SliderList = (props: any) => {
  const [t] = useTranslation()
  const { children } = props
  const [top, setTop] = useState(0)
  const [left, setLeft] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [delItem, setDelItem] = useState<any>()
  const { projectInfo } = useSelector(store => store.project)
  const ref: any = useRef()
  const prevRectRef = useRef(null)
  const { option } = useSelector(store => store.category)
  let startY = 0
  let startX = 0
  const [dragItem, setDragItem] = useState<any>()
  const onDragStart = (ev: any) => {
    const obj = { ...children, dragtype: 'edit' }
    setDragItem(obj)
    ev.dataTransfer.setData('item', JSON.stringify(obj))
    const imgDom = document.createElement('div')
    // ev.target.style.opacity = 0.3
    document.body.appendChild(imgDom)
    ev.dataTransfer.setDragImage(imgDom, 0, 0)
  }
  const onDrag = throttle(e => {
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
    // document
    //   .getElementById('father')!
    //   .scrollTo({ top: e.pageY, behavior: 'smooth' })
  }, 10)

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
    message.success(t('common.deleteSuccess'))
    setIsVisible(false)
    props.onUpdate()
  }
  const allowDrop = (ev: any) => {
    ev.preventDefault()
  }
  return (
    <>
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
            zIndex: top > 0 && left > 0 ? 90 : 9,
          }}
          onDragOver={allowDrop}
          draggable="true"
        >
          <ItemList>
            <div>
              <CommonIconFont
                type={
                  option?.find(
                    (item: any) => dragItem?.field_content?.attr === item.type,
                  )?.icon
                }
                size={19}
                color="var(--neutral-n1-d1)"
              />
              <span style={{ marginLeft: '8px' }}>{dragItem.title}</span>
            </div>
            <div className="delIcon">
              {dragItem?.is_customize === 1 && <IconFontStyle type="delete" />}
            </div>
          </ItemList>
        </Container>
      ) : null}
      <Container
        ref={ref}
        draggable="true"
        onDragOver={allowDrop}
        onDragStart={event => onDragStart(event)}
        onDrag={onDrag}
        onDragEnd={() => onDragEnd()}
      >
        <SearchItemList>
          <div>
            <CommonIconFont
              type={
                option?.find(
                  (item: any) => children?.field_content?.attr === item.type,
                )?.icon
              }
              size={19}
              color="var(--neutral-n1-d1)"
            />
            <span style={{ marginLeft: '8px' }}>{children.title}</span>
          </div>
          <div
            className="delIcon"
            onClick={e => {
              e.stopPropagation(), setIsVisible(true), setDelItem(children)
            }}
          >
            {children?.is_customize === 1 && <IconFontStyle type="delete" />}
          </div>
        </SearchItemList>
        <DeleteConfirm
          isVisible={isVisible}
          onChangeVisible={() => setIsVisible(false)}
          onConfirm={() => delConfig()}
        />
      </Container>
    </>
  )
}

const Sortable = (props: any) => {
  const { list, setList } = props
  return (
    <div>
      {list?.map((child: any, i: number) => (
        <SliderList
          onDrag={(ev: any) => props.onDrag(ev, i)}
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
