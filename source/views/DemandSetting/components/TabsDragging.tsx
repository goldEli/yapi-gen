/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-handler-names */
/* eslint-disable complexity */
import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import { Checkbox, Tooltip } from 'antd'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { throttle } from 'lodash'

const Container = styled.div`
  margin-bottom: 8px;
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
const ItemList1 = styled.div`
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 16px;
  border-radius: 6px;
  justify-content: space-between;
  z-index: 5;
  transition: all 0.3s;
  position: relative;
  background: var(--neutral-white-d6);
  box-shadow: 0px 0px 9px 3px rgba(0, 0, 0, 0.03);
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
  color: var(--neutral-n3);
  margin: 0;
  padding: 0;
`
const Empty = styled.div`
  width: 100%;
  height: 300px;
`
const Sortable = (props: any) => {
  const [t] = useTranslation()
  const { list } = props
  const { option } = useSelector(store => store.category)
  const [current, setCurrent] = useState<any>(null)
  const [endIndex, setEndIndex] = useState<any>(null)
  const ref: any = useRef()
  const container: any = useRef()
  let startY = 0
  let startX = 0
  const [top, setTop] = useState(0)
  const [left, setLeft] = useState(0)
  const [width, setWidth] = useState(0)
  const [dragItem, setDragItem] = useState<any>()
  // 拖动传值
  const onDragStart = (ev: any, index: number, item: any) => {
    setWidth(container.current.getBoundingClientRect().width)
    localStorage.className = ref?.current?.className
    const moveItem = {
      ...item,
      dragtype: 'move',
    }
    setDragItem(moveItem)
    ev.dataTransfer.setData('DragItem', JSON.stringify(moveItem))
    setCurrent(index)
    const imgDom = document.createElement('div')
    document.body.appendChild(imgDom)
    ev.dataTransfer.setDragImage(imgDom, 0, 0)
  }
  // 拖动排序
  const onDragEnd = (e: any, index: number) => {
    if (endIndex !== index) {
      let _list: any = [...props.list]
      _list[endIndex] = props.list[current]
      _list[current] = props.list[endIndex]
      // 使用的key值用来筛选
      props.onChangeMove(_list.filter((el: any) => el?.title))
    }
    setEndIndex(null)
    setCurrent(null)
    setTop(0)
    setLeft(0)
  }
  const onDragOver = (index: number) => {
    setEndIndex(index)
  }
  const allowDrop = (ev: any) => {
    ev.preventDefault()
  }
  // 父级拖动
  const onDrop = (ev: any, index: number) => {
    const drapClassName = ref?.current?.className
    ev.preventDefault()
    ev.stopPropagation()
    // 判断是否在同一块区域拖动
    if (localStorage.className === drapClassName) {
      return
    } else {
      props.onDrop(ev, index)
      localStorage.className = ''
    }
  }
  // 空白区域拖动
  const onDrop2 = (event: any) => {
    event.preventDefault()
    const drapClassName = ref?.current?.className
    if (localStorage.className === drapClassName) {
      props.onDrop(event, -2)
      localStorage.className = ''
      return
    }
    if (list.length < 1) {
      props.onDrop(event, 0)
    } else {
      props.onDrop(event, -1)
    }
    localStorage.className = ''
  }
  // item拖动滚动条移动
  const onItemDrag = throttle(e => {
    const el: any = ref.current
    // 计算最新 Top Left位置
    let latestTop = e.clientY - startY
    let latestLeft = e.clientX - startX
    if (latestTop > 0 || latestLeft > 0) {
      setTop(e.pageY)
      setLeft(e.pageX)
    }
    document
      .getElementById('father')!
      .scrollTo({ top: e.pageY, behavior: 'smooth' })
  }, 10)

  return (
    <div
      draggable="false"
      onDragOver={event => {
        event.preventDefault(), event.stopPropagation()
      }}
    >
      {top > 0 ? (
        <ItemList1
          style={{
            top: `${top}px`,
            width: width,
            height: '64px',
            position: top > 0 && left > 0 ? 'fixed' : 'relative',
            zIndex: top > 0 && left > 0 ? 90 : 9,
          }}
          onDragOver={allowDrop}
          draggable="true"
        >
          <div style={{ display: 'flex', width: '100%' }}>
            <IconBox>
              <CommonIconFont
                type={
                  option?.find(
                    (item: any) => dragItem?.fieldContent?.attr === item.type,
                  )?.icon
                }
                size={24}
                color="var(--neutral-n2-d2)"
              />
            </IconBox>
            <ListMsg>
              <div>{dragItem?.title}</div>
              <div>
                {t(
                  option?.find(
                    (item: any) => dragItem?.fieldContent?.attr === item.type,
                  )?.label,
                )}
              </div>
            </ListMsg>
          </div>
          <RightOperate>
            {dragItem?.content === 'users_name' ||
            dragItem?.content === 'user_name' ||
            dragItem?.content === 'finish_at' ||
            dragItem?.content === 'created_at' ||
            dragItem?.content === 'schedule' ? (
              <Checkbox disabled={true} />
            ) : (
              <Checkbox checked={dragItem?.isRequired === 1 ? true : false} />
            )}

            <Text>{t('must')}</Text>
            <>
              {dragItem?.content === 'users_name' ||
              dragItem?.content === 'user_name' ||
              dragItem?.content === 'finish_at' ||
              dragItem?.content === 'created_at' ? (
                <DelBtnText> {t('p2.delete')}</DelBtnText>
              ) : (
                <DelBtn>{t('p2.delete')}</DelBtn>
              )}
            </>
          </RightOperate>
        </ItemList1>
      ) : null}
      {list?.length >= 1 &&
        list?.map((child: any, i: number) => (
          <div
            ref={ref}
            key={child?.storyId}
            className={props.positionType + '_' + props.positionType}
            onDragOver={allowDrop}
            onDrop={event => onDrop(event, i)}
          >
            <Container
              ref={container}
              id="container"
              key={child?.storyId}
              draggable="true"
              onDragStart={(ev: any) => onDragStart(ev, i, child)}
              onDragOver={() => onDragOver(i)}
              onDragEnd={e => onDragEnd(e, i)}
              onDrag={onItemDrag}
              onClick={() => child?.isCustomize != 2 && props.onClick(i, child)}
            >
              {child?.isCustomize === 2 ? (
                <Tooltip
                  placement="topRight"
                  title={t('system_fields_are_not_editable')}
                >
                  <ItemList>
                    <div style={{ display: 'flex', width: '100%' }}>
                      <IconBox>
                        <CommonIconFont
                          type={
                            option?.find(
                              (item: any) =>
                                child?.fieldContent?.attr === item.type,
                            )?.icon
                          }
                          size={24}
                          color="var(--neutral-n2-d2)"
                        />
                      </IconBox>
                      <ListMsg>
                        <div>{child?.title}</div>
                        <div>
                          {t(
                            option?.find(
                              (item: any) =>
                                child?.fieldContent?.attr === item.type,
                            )?.label,
                          )}
                        </div>
                      </ListMsg>
                    </div>
                    <RightOperate>
                      {child?.content === 'users_name' ||
                      child?.content === 'user_name' ||
                      child?.content === 'finish_at' ||
                      child?.content === 'created_at' ||
                      child?.content === 'schedule' ? (
                        <Checkbox disabled={true} />
                      ) : (
                        <Checkbox
                          checked={child?.isRequired === 1 ? true : false}
                          onClick={(e: any) => {
                            e.stopPropagation()
                            props.onChangeChecked(e.target.checked, child)
                          }}
                        />
                      )}

                      <Text>{t('must')}</Text>
                      <>
                        {child?.content === 'users_name' ||
                        child?.content === 'user_name' ||
                        child?.content === 'finish_at' ||
                        child?.content === 'created_at' ? (
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
                      </>
                    </RightOperate>
                  </ItemList>
                </Tooltip>
              ) : (
                <ItemList>
                  <div style={{ display: 'flex' }}>
                    <IconBox>
                      <CommonIconFont
                        type={
                          option.find(
                            (item: any) =>
                              child?.fieldContent?.attr === item.type,
                          )?.icon
                        }
                        size={24}
                        color="var(--neutral-n1-d1)"
                      />
                    </IconBox>
                    <ListMsg>
                      <div>{child?.title}</div>
                      <div>
                        {t(
                          option.find(
                            (item: any) =>
                              child?.fieldContent?.attr === item.type,
                          )?.label,
                        )}
                      </div>
                    </ListMsg>
                  </div>
                  <RightOperate>
                    <Checkbox
                      disabled={
                        child?.fieldContent.attr === 'single_checkbox'
                          ? true
                          : false
                      }
                      checked={child?.isRequired === 1 ? true : false}
                      onClick={(e: any) => {
                        e.stopPropagation(),
                          props.onChangeChecked(e.target.checked, child)
                      }}
                    />
                    <Text>{t('must')}</Text>
                    <DelBtn
                      onClick={(event: any) => {
                        event.stopPropagation()
                        props.onDelete(child)
                      }}
                    >
                      {t('p2.delete')}
                    </DelBtn>
                  </RightOperate>
                </ItemList>
              )}
            </Container>
          </div>
        ))}
      {props.state === 2 && (
        <Empty
          ref={ref}
          className={props.positionType + '_' + props.positionType}
          onDragOver={allowDrop}
          onDrop={(event: any) => {
            onDrop2(event)
          }}
        />
      )}
    </div>
  )
}
export default Sortable
