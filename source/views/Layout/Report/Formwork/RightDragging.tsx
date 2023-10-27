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
  // width: 352px;
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
    width: 352px;
    cursor: pointer;
    background-color: var(--neutral--white-d6);
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
  const ref: any = useRef()
  const prevRectRef = useRef(null)
  let startY = 0
  let startX = 0
  const [dragItem, setDragItem] = useState<any>()
  const onDragStart = (ev: any) => {
    const obj = { ...children, dragtype: 'add' }
    setDragItem(obj)
    ev.dataTransfer.setData('item', JSON.stringify(obj))
    const imgDom = document.createElement('div')
    document.body.appendChild(imgDom)
    ev.dataTransfer.setDragImage(imgDom, 0, 0)
    localStorage.className = ''
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
    if (e.pageY >= window.screen?.availHeight - 300) {
      document
        .getElementById('father')!
        .scrollTo({ top: e.pageY, behavior: 'smooth' })
    } else if (e.pageY <= Number(localStorage.topTitleTop)) {
      document
        .getElementById('father')!
        .scrollTo({ top: Number(0), behavior: 'smooth' })
    }
  }, 10)

  const onDragEnd = () => {
    setTop(0)
    setLeft(0)
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
                type={dragItem.icon}
                size={19}
                color="var(--neutral-n1-d1)"
              />
              <span style={{ marginLeft: '8px' }}>{dragItem.title}</span>
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
              type={children.icon}
              size={19}
              color="var(--neutral-n1-d1)"
            />
            <span style={{ marginLeft: '8px' }}>{children.title}</span>
          </div>
        </SearchItemList>
      </Container>
    </>
  )
}

const Sortable = () => {
  const [t] = useTranslation()
  const option = [
    {
      type: 3,
      title: t('formWork.tab1'),
      icon: 'text',
    },
    {
      type: 2,
      title: t('formWork.tab2'),
      icon: 'attachment',
    },
    {
      type: 4,
      title: t('formWork.tab3'),
      icon: 'horizontal',
    },
  ]
  return (
    <div>
      {option?.map((child: any, i: number) => (
        <SliderList key={child.label} index={i}>
          {child}
        </SliderList>
      ))}
    </div>
  )
}
export default Sortable
