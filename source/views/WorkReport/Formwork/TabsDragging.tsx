/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-handler-names */
/* eslint-disable complexity */
/* eslint-disable no-constant-binary-expression */
import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import { Checkbox } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { setEditSave } from '@store/formWork'
const Box = styled.div`
  padding-left: 24px;
  transition: 0.3s;
  display: flex;
  align-items: center;
`
const Circle = styled.div`
  width: 10px;
  height: 10px;
  background-color: var(--neutral-white-d1);
  border-radius: 50%;
  border: 2px solid var(--primary-d1);
`
const Line = styled.div`
  height: 2px;
  width: 97%;
  background-color: var(--primary-d1);
`
const Container = styled.div`
  position: relative;
  height: 72px;
  margin: 0 24px;
  &:hover {
    cursor: pointer;
  }
`
const IconBox = styled.div`
  width: 40px;
  height: 40px;
  background-color: var(--neutral-n6-d1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
`
const ItemList = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  height: 64px;
  background: var(--hover-d2);
  padding: 0 16px;
  border-radius: 6px;
  justify-content: space-between;
  z-index: 5;
  transition: all 0.3s;
  position: relative;
  &:hover {
    background: var(--neutral-white-d6);
    box-shadow: 0px 0px 9px 3px rgba(0, 0, 0, 0.03);
  }
`
const ListMsg = styled.div`
  div:nth-child(1) {
    font-size: 14px;
    color: var(--neutral-n1-d1);
  }
  div:nth-child(2) {
    font-size: 12px;
    color: var(--neutral-n3);
  }
`
const RightOperate = styled.div`
  position: absolute;
  right: 24px;
  font-size: 14px;
`
const Text = styled.span`
  color: var(--neutral-n4);
  margin-left: 8px;
  margin-right: 24px;
`
const DelBtn = styled.span`
  min-width: 20px;
  display: inline-block;
  color: var(--primary-d1);
  margin: 0;
  padding: 0;
  &:hover {
    cursor: pointer;
  }
`
const DelBtnText = styled.span`
  display: inline-block;
  min-width: 20px;
  color: var(--neutral-n4);
  margin: 0;
  padding: 0;
`

const Sortable = (props: any) => {
  const [t] = useTranslation()
  const { list } = props
  const { option } = useSelector(store => store.formWork)
  const [current, setCurrent] = useState<any>(null)
  const [endIndex, setEndIndex] = useState<any>(null)
  const ref: any = useRef()
  const container: any = useRef()
  const [dragItem, setDragItem] = useState<any>()
  let timer: any = null
  const dispatch = useDispatch()
  // 拖动传值
  const onDragStart = (ev: any, index: number, item: any) => {
    dispatch(setEditSave(false))
    localStorage.className = ref?.current?.className
    const moveItem = {
      ...item,
      dragtype: 'move',
    }
    ev.dataTransfer.setData('item', JSON.stringify(moveItem))
    setCurrent(index)
    const imgDom = document.createElement('div')
    document.body.appendChild(imgDom)
    // ev.dataTransfer.setDragImage(imgDom, 0, 0)
  }
  // 拖动排序
  const onDragEnd = (e: any, index: number) => {
    setDragItem(null)
    if (endIndex !== index) {
      let _list: any = [...props.list]
      _list[endIndex] = props.list[current]
      _list[current] = props.list[endIndex]
      // 使用的key值用来筛选
      props.onChangeMove(_list)
    }
    setEndIndex(null)
    setCurrent(null)
  }

  const onDragOver = (e: any) => {
    if (e.pageY >= window.screen?.availHeight - 300) {
      document
        .getElementById('father')!
        .scrollTo({ top: e.pageY, behavior: 'smooth' })
    } else if (e.pageY < Number(localStorage.topTitleTop)) {
      document
        .getElementById('father')!
        .scrollTo({ top: Number(0), behavior: 'smooth' })
    }
  }
  // 接触到就触发
  const onDragEnter = (e: any, index: number, child: any) => {
    setEndIndex(index)
    setDragItem(child)
    setTimeout(() => {
      setDragItem(null)
    }, 500)
  }
  const allowDrop = (ev: any) => {
    ev.preventDefault()
  }
  // 右边拖动到左边触发
  const onDrop = (ev: any, index: number) => {
    ev.preventDefault()
    ev.stopPropagation()
    props.onDrop(ev, index)
  }
  useEffect(() => {
    return () => {
      clearTimeout(timer)
    }
  }, [])
  const getType = (type: number) => {
    switch (type) {
      case 1:
        return t('formWork.text1')
      case 2:
        return t('formWork.tab2')
      case 3:
        return t('formWork.text2')
      default:
        return t('formWork.tab3')
    }
  }
  return (
    <div
      draggable="false"
      onDragOver={event => {
        event.preventDefault(), event.stopPropagation()
      }}
    >
      {list?.length >= 1 &&
        list?.map((child: any, i: number) => (
          <div
            ref={ref}
            draggable="false"
            key={child?.id}
            onDragOver={allowDrop}
            onDrop={event => onDrop(event, i)}
          >
            <Container
              ref={container}
              id="container"
              style={{
                transition: dragItem?.name === child?.name ? 'all .1s' : '',
                transform:
                  dragItem?.name === child?.name
                    ? 'translateY(20px)'
                    : 'translateY(0)',
              }}
              key={child?.name}
              draggable="true"
              onDragStart={(ev: any) => onDragStart(ev, i, child)}
              onDragEnter={e => onDragEnter(e, i, child)}
              onDragOver={e => onDragOver(e)}
              onDragEnd={e => onDragEnd(e, i)}
              onClick={(event: any) => {
                event.preventDefault(),
                  child.type !== 1 && child.type != 4 && props.onClick(i, child)
              }}
            >
              <ItemList>
                <div style={{ display: 'flex' }}>
                  <IconBox>
                    <CommonIconFont
                      type={
                        option.find((item: any) => child?.type === item.type)
                          ?.icon
                      }
                      size={24}
                      color="var(--neutral-n1-d1)"
                    />
                  </IconBox>
                  <ListMsg>
                    <div>{child?.name}</div>
                    <div>{getType(child.type)}</div>
                  </ListMsg>
                </div>
                <RightOperate>
                  <Checkbox
                    disabled={child.type === 1 ? true : false}
                    checked={child?.is_required === 1 ? true : false}
                    onClick={(e: any) => {
                      e.stopPropagation(),
                        props.onChangeChecked(e.target.checked, child)
                    }}
                  />
                  <Text>{t('must')}</Text>
                  {child.type === 1 ? (
                    <DelBtnText> {t('p2.delete')}</DelBtnText>
                  ) : (
                    <DelBtn
                      onClick={(event: any) => {
                        event.stopPropagation()
                        props.onDelete(child)
                      }}
                    >
                      {t('p2.delete')}
                    </DelBtn>
                  )}
                </RightOperate>
              </ItemList>
            </Container>
            <Box
              style={{
                display: dragItem?.name === child?.name ? 'flex' : 'none',
              }}
            >
              <Circle />
              <Line />
            </Box>
          </div>
        ))}
    </div>
  )
}
export default Sortable
