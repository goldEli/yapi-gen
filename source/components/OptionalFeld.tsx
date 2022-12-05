/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-shadow */
// 可配置的表格字段弹窗

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Checkbox, Col, Collapse, Divider, Row, Space, Tooltip } from 'antd'
import IconFont from '@/components/IconFont'
import { css } from '@emotion/css'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'

const CheckboxGroup = Checkbox.Group
import styled from '@emotion/styled'
import { ShowWrap } from './StyleCommon'
import { useTranslation } from 'react-i18next'
import CommonModal from './CommonModal'
import {
  SortableContainer as sortableContainer,
  SortableElement as sortableElement,
  SortableHandle as sortableHandle,
} from 'react-sortable-hoc'
import { arrayMoveImmutable } from 'array-move'

const text = css`
  color: rgba(150, 151, 153, 1);
  font-size: 12px;
  /* margin-bottom: 8px; */
`
const CheckedItem = styled.div({
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  height: 40,
  borderRadius: 4,
  padding: '  0 16px',
  '&: hover': {
    background: ' rgba(240, 244, 250, 1)',
    [ShowWrap.toString()]: {
      visibility: 'visible',
    },
  },
})
const Wrap = styled.div`
  display: flex;
`
const Left = styled.div`
  width: 624px;
  height: 350px;
  overflow: scroll;
`
const Right = styled.div`
  box-sizing: border-box;
  padding: 0 16px 0 0px;
  width: 240px;
  height: 350px;
  overflow: scroll;
`
const ItemWrap = styled.div`
  margin-bottom: 24px;
`
type OptionalFeldProps = {
  plainOptions: {
    labelTxt: string
    label: string
    value: string
    is_default_display?: number
  }[]
  plainOptions2: {
    labelTxt: string
    label: string
    value: string
    is_default_display?: number
  }[]
  plainOptions3?: {
    labelTxt: string
    label: string
    value: string
    is_default_display?: number
  }[]
  checkList: CheckboxValueType[]
  allTitleList?: CheckboxValueType[]
  checkList2: CheckboxValueType[]
  checkList3?: CheckboxValueType[]
  getCheckList(
    checkList: CheckboxValueType[],
    checkList2: CheckboxValueType[],
    checkList3?: CheckboxValueType[],
    allList?: CheckboxValueType[],
  ): void
  onClose(): void
  isVisible: boolean
}
const DragHandle = sortableHandle(() => (
  <IconFont
    type="move"
    style={{
      fontSize: 16,
      cursor: 'pointer',
      color: '#969799',
      marginRight: 12,
    }}
  />
))

const SortContainer = sortableContainer<any>((props: any) => <div {...props} />)

// 拖拽元素
const SortItemLi = sortableElement<any>((props: any) => (
  <div helperClass="row-dragging" {...props} />
))

export const ShowText = (props: any) => {
  const [show, setShow] = useState(false)
  const ele = useRef<any>(null)
  const checkWidth = () => {
    setShow(ele.current.scrollWidth > ele.current.offsetWidth)
  }

  useEffect(() => {
    checkWidth()
  }, [])

  return (
    <Tooltip placement="top" title={show ? props.names : ''}>
      <span
        ref={ele}
        style={{
          whiteSpace: 'nowrap',
          width: '84px',
          overflow: 'hidden',
          textOverflow: ' ellipsis',
          display: 'block',
          height: '100%',
        }}
      >
        {props.names}
      </span>
    </Tooltip>
  )
}

export const OptionalFeld = (props: OptionalFeldProps) => {
  const [t] = useTranslation()
  const { plainOptions, plainOptions2 } = props
  const plainOptions3 = props?.plainOptions3 || []
  const [all, setAll] = useState<any>(props.allTitleList)
  const [checkList, setCheckList] = useState<CheckboxValueType[]>(
    props.checkList,
  )
  const [checkList2, setCheckList2] = useState<CheckboxValueType[]>(
    props.checkList2,
  )
  const [checkList3, setCheckList3] = useState<CheckboxValueType[]>(
    props?.checkList3 || [],
  )
  const onChange = (list: CheckboxValueType[]) => {
    setCheckList(list)

    setAll([...list, ...checkList2, ...checkList3])
  }
  const onChange2 = (list: CheckboxValueType[]) => {
    setCheckList2(list)
    setAll([...checkList, ...list, ...checkList3])
  }

  const onChange3 = (list: CheckboxValueType[]) => {
    setCheckList3(list)
    setAll([...checkList, ...checkList2, ...list])
  }

  function del(value: string) {
    if (checkList.includes(value)) {
      const arr = checkList.filter(value1 => value1 !== value)
      setCheckList([...arr])
    } else if (checkList2.includes(value)) {
      const arr2 = checkList2.filter(value1 => value1 !== value)
      setCheckList2([...arr2])
    } else {
      const arr3 = checkList3.filter(value1 => value1 !== value)
      setCheckList3([...arr3])
    }
  }

  const handleOk = () => {
    const news = allList.map((i: any) => i.value)

    props.getCheckList(checkList, checkList2, checkList3, news)
    props.onClose()
  }
  const onSortEnd = ({ oldIndex, newIndex }: any) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(
        all.slice(),
        oldIndex,
        newIndex,
      ).filter((el: any) => !!el)

      setAll(newData)
    }
  }

  const allList = useMemo(() => {
    const newArr = [...checkList, ...checkList2, ...checkList3]
    const arr2 = [...plainOptions, ...plainOptions2, ...plainOptions3]

    const newList = all.filter((i: any) => {
      if (newArr.includes(i)) {
        return i
      }
    })

    const alls: any[] = []

    newList.forEach((i: any) => {
      const result = arr2.find(item => {
        return item.value === i
      })
      alls.push(result)
    })

    return alls
  }, [
    all,
    checkList,
    checkList2,
    checkList3,
    plainOptions,
    plainOptions2,
    plainOptions3,
  ])

  return (
    <CommonModal
      isVisible={props.isVisible}
      width={784}
      title={t('components.showFiled')}
      onClose={props.onClose}
      onConfirm={handleOk}
    >
      <Wrap>
        <Left>
          <Collapse defaultActiveKey={['1']} ghost>
            <Collapse.Panel
              header={<div className={text}>{t('components.basicFiled')}</div>}
              key="1"
            >
              <ItemWrap>
                <CheckboxGroup value={checkList} onChange={onChange}>
                  <Row gutter={[0, 10]}>
                    {plainOptions.map(item => (
                      <Col key={item.labelTxt} span={6}>
                        <Checkbox
                          disabled={item.value === 'name'}
                          value={item.value}
                        >
                          <ShowText names={item.labelTxt} />
                        </Checkbox>
                      </Col>
                    ))}
                  </Row>
                </CheckboxGroup>
              </ItemWrap>
            </Collapse.Panel>
            <Collapse.Panel
              header={
                <div className={text}>{t('components.personOrTime')}</div>
              }
              key="2"
            >
              <ItemWrap>
                <CheckboxGroup value={checkList2} onChange={onChange2}>
                  <Row gutter={[0, 10]}>
                    {plainOptions2.map(item => (
                      <Col key={item.labelTxt} span={6}>
                        <Checkbox value={item.value}>
                          <ShowText names={item.labelTxt} />
                        </Checkbox>
                      </Col>
                    ))}
                  </Row>
                </CheckboxGroup>
              </ItemWrap>
            </Collapse.Panel>
            <Collapse.Panel
              header={<div className={text}>{t('newlyAdd.customFields')}</div>}
              key="3"
            >
              {plainOptions3?.length > 0 && (
                <ItemWrap>
                  <CheckboxGroup value={checkList3} onChange={onChange3}>
                    <Row gutter={[0, 10]}>
                      {plainOptions3?.map(item => (
                        <Col key={item.label} span={6}>
                          <Checkbox value={item.value}>
                            <ShowText names={item.label} />
                          </Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </CheckboxGroup>
                </ItemWrap>
              )}
            </Collapse.Panel>
          </Collapse>
        </Left>
        <Divider
          type="vertical"
          style={{ background: '#EBEDF0', margin: '0 16px 0 4px', height: 350 }}
        />
        <Right>
          <div className={text}>{t('components.currentFiled')}</div>
          <SortContainer
            helperClass="row-dragging"
            useDragHandle
            onSortEnd={(values: any) => onSortEnd(values)}
          >
            {allList.map((item: any, idx: number) => (
              <SortItemLi
                helperClass="row-dragging"
                key={item.value}
                index={idx}
              >
                <CheckedItem key={item.value}>
                  <DragHandle />
                  <span>{item.labelTxt}</span>
                  {item.value !== 'name' && (
                    <ShowWrap style={{ marginLeft: 'auto' }}>
                      <IconFont
                        style={{ fontSize: 12 }}
                        type="close"
                        onClick={() => del(item.value)}
                      />
                    </ShowWrap>
                  )}
                </CheckedItem>
              </SortItemLi>
            ))}
          </SortContainer>
        </Right>
      </Wrap>
    </CommonModal>
  )
}
