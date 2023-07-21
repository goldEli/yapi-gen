/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-handler-names */
/* eslint-disable complexity */
/* eslint-disable no-constant-binary-expression */
import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import { Checkbox, Tooltip } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
const Box = styled.div`
  /* transition: 0.3s; */
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
  width: 99%;
  background-color: var(--primary-d1);
`
const Container = styled.div`
  position: relative;
  height: 72px;
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
  flex: 1;
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
const Sortable = (props: any) => {
  const [t] = useTranslation()
  const { list } = props
  const { option } = useSelector(store => store.category)
  const [current, setCurrent] = useState<any>(null)
  const [endIndex, setEndIndex] = useState<any>(null)
  const ref: any = useRef()
  const container: any = useRef()
  const [dragItem, setDragItem] = useState<any>()
  let timer: any = null
  const optionFields = [
    {
      label: t('newlyAdd.lineText'),
      value: '1',
      type: 'text',
      icon: 'text-alone',
    },
    {
      label: t('newlyAdd.moreLineText'),
      value: '2',
      type: 'textarea',
      icon: 'text-more',
    },
    {
      label: t('newlyAdd.radioDropdown'),
      value: '3',
      type: 'select',
      icon: 'select-alone',
    },
    {
      label: t('newlyAdd.multiDropdown'),
      value: '4',
      type: 'select_checkbox',
      icon: 'select-more',
    },
    { label: t('newlyAdd.time'), value: '7', type: 'date', icon: 'calendar' },
    { label: t('newlyAdd.number'), value: '8', type: 'number', icon: 'number' },
    {
      label: t('version2.personRadio'),
      value: '9',
      type: 'user_select',
      icon: 'user-alone',
    },
    {
      label: t('version2.personCheckbox'),
      value: '10',
      type: 'user_select_checkbox',
      icon: 'user-more',
    },
    {
      label: t('confirm_that_it_is_checked'),
      value: '11',
      type: 'single_checkbox',
      icon: 'check-circle',
    },
  ]
  // 拖动传值
  const onDragStart = (ev: any, index: number, item: any) => {
    localStorage.className = ref?.current?.className
    const moveItem = {
      ...item,
      dragtype: 'move',
    }
    ev.dataTransfer.setData('DragItem', JSON.stringify(moveItem))
    setCurrent(index)
    const imgDom = document.createElement('div')
    document.body.appendChild(imgDom)
    // ev.dataTransfer.setDragImage(imgDom, 0, 0)
  }
  // 去重
  const fitlerDataList = (data: any) => {
    let obj: any = {}
    let set: any = data?.reduce((cur: any, next: any) => {
      obj[next.storyId] ? '' : (obj[next.storyId] = true && cur.push(next))
      return cur
    }, [])
    return set
  }
  // 拖动排序
  const onDragEnd = (e: any, index: number, child: any) => {
    if (endIndex !== index) {
      let _list: any = [...props.list]
      _list[endIndex] = props.list[current]
      _list[current] = props.list[endIndex]
      // 使用的key值用来筛选
      const data = _list.filter((el: any) => el?.title)
      props.onChangeMove(fitlerDataList(data))
    }
    setEndIndex(null)
    setCurrent(null)
    setDragItem(null)
  }
  // 接触到就触发
  const onDragEnter = (e: any, index: number, child: any) => {
    setEndIndex(index)
    setDragItem(child)
    setTimeout(() => {
      setDragItem(null)
    }, 500)
  }
  // 它是350毫秒就会触发
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
  useEffect(() => {
    return () => {
      clearTimeout(timer)
      localStorage.className = ''
    }
  }, [])
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
            key={child?.storyId}
            className={props.positionType + '_' + props.positionType}
            onDragOver={allowDrop}
            onDrop={event => onDrop(event, i)}
          >
            <Container
              ref={container}
              id="container"
              // style={{
              //   transition:
              //     dragItem?.storyId === child?.storyId ? 'all .1s' : '',
              //   transform:
              //     dragItem?.storyId === child?.storyId
              //       ? 'translateY(20px)'
              //       : 'translateY(0)',
              // }}
              key={child?.storyId}
              draggable="true"
              onDragStart={(ev: any) => onDragStart(ev, i, child)}
              onDragEnter={e => onDragEnter(e, i, child)}
              onDragOver={e => onDragOver(e)}
              onDragEnd={e => onDragEnd(e, i, child)}
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
                                child?.fieldContent?.attr === item.type ||
                                item.type === child.attr,
                            )?.icon
                          }
                          size={24}
                          color="var(--neutral-n2-d2)"
                        />
                      </IconBox>
                      <ListMsg
                        style={{ display: 'flex', flexDirection: 'column' }}
                      >
                        <div>{child?.title}</div>
                        {option?.find(
                          (item: any) =>
                            child?.fieldContent?.attr === item.type,
                        )?.label ? (
                          <div>
                            {t(
                              option?.find(
                                (item: any) =>
                                  child?.fieldContent?.attr === item.type,
                              )?.label,
                            )}
                          </div>
                        ) : (
                          <div>--</div>
                        )}
                      </ListMsg>
                      <div
                        style={{ flex: 1, height: '40px', lineHeight: '40px' }}
                      >
                        {
                          optionFields.find(ele => ele.type === child.attr)
                            ?.label
                        }
                      </div>
                      <div
                        style={{ flex: 1, height: '40px', lineHeight: '40px' }}
                      >
                        {child?.isCustomize === 2
                          ? t('sprintProject.systemField')
                          : t('sprintProject.customField')}
                      </div>
                    </div>
                    <RightOperate>
                      {child?.content === 'users_name' ||
                      child?.content === 'user_name' ||
                      child?.content === 'finish_at' ||
                      child?.content === 'created_at' ||
                      child?.content === 'schedule' ||
                      child?.content === 'priority' ? (
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
                        child?.content === 'created_at' ||
                        child?.content === 'priority' ? (
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
                  <div
                    style={{ display: 'flex', width: '100%', height: '40px' }}
                  >
                    <IconBox>
                      <CommonIconFont
                        type={
                          option.find(
                            (item: any) =>
                              child?.fieldContent?.attr === item.type ||
                              item.type === child.attr,
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
                              (child?.fieldContent?.attr ||
                                child?.field_content?.attr) === item.type,
                          )?.label,
                        )}
                      </div>
                    </ListMsg>
                    <div
                      style={{ flex: 1, height: '40px', lineHeight: '40px' }}
                    >
                      {
                        optionFields.find(
                          ele =>
                            ele.type === child.attr ||
                            child?.fieldContent?.attr,
                        )?.label
                      }
                    </div>
                    <div
                      style={{ flex: 1, height: '40px', lineHeight: '40px' }}
                    >
                      {child?.is_customize === 2
                        ? t('sprintProject.systemField')
                        : t('sprintProject.customField')}
                    </div>
                  </div>
                  <RightOperate>
                    <Checkbox
                      disabled={
                        child?.fieldContent?.attr === 'single_checkbox'
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
            {/* {dragItem?.storyId}---
            {child?.storyId} */}
            <Box
              style={{
                display: dragItem?.storyId === child?.storyId ? 'flex' : 'none',
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
