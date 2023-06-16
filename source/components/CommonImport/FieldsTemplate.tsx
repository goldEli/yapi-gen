/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/naming-convention */
// 需求主页-导出及导入字段选择

/* eslint-disable react/jsx-no-leaked-render */
import CommonModal from '@/components/CommonModal'
import CommonButton from '@/components/CommonButton'
import { Checkbox, Space, Divider, Row, Col, Collapse } from 'antd'
import IconFont from '@/components/IconFont'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import { ShowWrap } from '@/components/StyleCommon'
import { type CheckboxValueType } from 'antd/lib/checkbox/Group'
import {
  SortableContainer as sortableContainer,
  SortableElement as sortableElement,
  SortableHandle as sortableHandle,
} from 'react-sortable-hoc'
import { arrayMoveImmutable } from 'array-move'
import { ShowText } from '@/components/OptionalFeld'
import { css } from '@emotion/css'

const Wrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  height: 350,
  paddingRight: 4,
})
const text = css`
  color: rgba(150, 151, 153, 1);
  font-size: 12px;
`
const LeftWrap = styled.div({
  paddingLeft: '24px',
  height: 350,
  width: 'calc(100% - 227px)',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  '.ant-collapse > .ant-collapse-item > .ant-collapse-header': {
    padding: '16px 0px !important',
    paddingTop: '0px !important',
  },
  ' .ant-collapse-content > .ant-collapse-content-box': {
    padding: '0px !important',
  },
  '.ant-collapse > .ant-collapse-item > .ant-collapse-header .ant-collapse-arrow ':
    {
      color: 'rgba(150, 151, 153, 1) !important',
    },
})
const RightWrap = styled.div({
  height: 350,
  width: 227,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  paddingRight: 16,
})

const ItemWrap = styled.div({
  marginBottom: 24,
})

const LabelWrap = styled.div({
  color: 'var(--neutral-n3)',
  fontSize: 12,
  fontWeight: 400,
  marginBottom: 8,
})

const CheckedItem = styled.div<{ state?: any }>(
  {
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    height: 40,
    borderRadius: 4,
    padding: '  0 16px',
    cursor: 'pointer',
    'div: first-child': {
      width: '100%',
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '&: hover': {
      background: 'var(--hover-d1)',
      [ShowWrap.toString()]: {
        visibility: 'visible',
      },
    },
  },
  ({ state }) => ({
    color: state ? 'var(--neutral-n4)' : 'var(--neutral-n1-d2)',
  }),
)

const CheckedWrap = styled.div({
  maxHeight: 325,
  overflow: 'auto',
  paddingRight: 20,
})

const ModalFooter = styled(Space)({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  height: 80,
  padding: '0 24px',
})

const DragItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  div {
    display: flex;
    align-items: center;
  }
`

interface Props {
  visible: boolean
  title: string
  onClose(): void
  onConfirm(values: any): void
  interfaces: any
  // 1是更新，2是新建
  importState?: any
  // 是否是导出
  isExport: boolean
  // 导出按钮loading状态
  isSpin?: any
  // 导出按钮的文案
  exportText?: string
}

const SortContainer = sortableContainer<any>((props: any) => <div {...props} />)

// 拖拽元素
const SortItemLi = sortableElement<any>((props: any) => (
  <div helperClass="row-dragging" {...props} />
))

const DragHandle = sortableHandle((props: any) => <div {...props} />)

const FieldsTemplate = (props: Props) => {
  const {
    interfaces: { getExportFields, getLoadListFields },
    exportText,
  } = props
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const [checkList, setCheckList] = useState<CheckboxValueType[]>([])
  const [checkList2, setCheckList2] = useState<CheckboxValueType[]>([])
  const [checkList3, setCheckList3] = useState<CheckboxValueType[]>([])
  const [all, setAll] = useState<any[]>([])
  const [checkAll, setCheckAll] = useState(false)
  const [indeterminate, setIndeterminate] = useState(true)
  const [fields, setFields] = useState<any>({})

  const getList = async () => {
    const result = props?.isExport
      ? await getExportFields({ projectId })
      : await getLoadListFields({
          projectId,
          isUpdate: props?.importState,
        })
    const basicKeys = result?.baseFields?.map((k: any) => k.field)
    const otherKeys = result?.timeAndPersonFields?.map((k: any) => k.field)
    const customKeys = result?.customFields?.map((k: any) => k.field)
    if (props.isExport) {
      setCheckList(['name'])
    } else {
      setCheckList(props?.importState === 2 ? ['name', 'category'] : ['id'])
    }
    setCheckList(basicKeys || [])
    setCheckList2(otherKeys || [])
    setCheckList3(customKeys || [])
    setAll([...basicKeys, ...otherKeys, ...customKeys])
    setIndeterminate(false)
    setCheckAll(true)
    setFields(result)
  }

  useEffect(() => {
    if (props.visible) {
      getList()
    }
  }, [props.visible])

  const [t] = useTranslation()

  const onClose = () => {
    setAll([])
    props?.onClose()
  }
  const onSortEnd = ({ oldIndex, newIndex }: any) => {
    const arr = all.slice()

    if (props?.importState === 1) {
      arr.shift()
    }
    if (props?.isExport) {
      arr.shift()
    }
    if (props?.importState === 2) {
      arr.shift()
      arr.shift()
    }

    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(arr, oldIndex, newIndex).filter(
        (el: any) => !!el,
      )

      if (props?.importState === 2) {
        setAll(['name', 'category'].concat(newData))
      } else if (props?.importState === 1) {
        setAll(['id'].concat(newData))
      } else if (props.isExport) {
        setAll(['name'].concat(newData))
      }
    }
  }

  const onConfirm = async () => {
    const news = allList.map((i: any) => i.field)
    await props?.onConfirm(news)
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
    setIndeterminate(true)
  }

  // 获取右侧选择字段是否可删除
  const getItemState = (field: string) => {
    let resultVal: boolean
    if (props.isExport) {
      resultVal = ['name'].includes(field)
    } else {
      resultVal =
        props?.importState === 2
          ? ['name', 'category'].includes(field)
          : field === 'id'
    }
    return resultVal
  }

  const allList = useMemo(() => {
    const newArr = [...checkList, ...checkList2, ...checkList3]

    const arr2 = [
      ...(fields?.baseFields || []),
      ...(fields?.timeAndPersonFields || []),
      ...(fields?.customFields || []),
    ]
    const newList = all.filter((i: any) => {
      return newArr.includes(i)
    })
    const alls: any[] = []

    newList.forEach((i: any) => {
      const result = arr2.find(item => {
        return item.field === i
      })
      alls.push(result)
    })

    return alls
  }, [checkList, checkList2, checkList3, fields, all])

  const onIsCheckAll = (length: any) => {
    const allKeys = [
      ...(fields?.baseFields || []),
      ...(fields?.timeAndPersonFields || []),
      ...(fields?.customFields || []),
    ].length
    setCheckAll(allKeys === length)
    setIndeterminate(allKeys !== length)
  }

  const onChange = (list: CheckboxValueType[]) => {
    setCheckList(list)
    setAll([...list, ...checkList2, ...checkList3])
    const resArr = [...list, ...checkList2, ...checkList3]
    onIsCheckAll(resArr.length)
  }
  const onChange2 = (list: CheckboxValueType[]) => {
    setCheckList2(list)
    setAll([...checkList, ...list, ...checkList3])
    const resArr = [...checkList, ...list, ...checkList3]
    onIsCheckAll(resArr.length)
  }

  const onChange3 = (list: CheckboxValueType[]) => {
    setCheckList3(list)
    const resArr = [...checkList, ...checkList2, ...list]
    setAll([...checkList, ...checkList2, ...list])
    onIsCheckAll(resArr.length)
  }

  const onAllChecked = (e: any) => {
    const { checked } = e.target
    let checkNormal: any
    if (checked) {
      checkNormal = fields?.baseFields?.map((k: any) => k.field)
    } else if (props.isExport) {
      checkNormal = ['name']
    } else {
      checkNormal = props?.importState === 2 ? ['name', 'category'] : ['id']
    }

    setCheckList(checkNormal)
    setCheckList2(
      checked ? fields?.timeAndPersonFields?.map((k: any) => k.field) : [],
    )
    setCheckList3(checked ? fields?.customFields?.map((k: any) => k.field) : [])
    setIndeterminate(!checked)
    setCheckAll(checked)
  }

  // 折叠图标
  const expandIcon = (e: any) => {
    return (
      <IconFont
        type={e.isActive ? 'down' : 'right'}
        style={{ fontSize: 14, marginRight: 8 }}
      />
    )
  }

  return (
    <CommonModal
      title={props?.title}
      isVisible={props?.visible}
      width={784}
      confirmText={!props.isExport && (t('newlyAdd.downloadTemplate') as any)}
      onClose={onClose}
      onConfirm={onConfirm}
      hasFooter={
        props.isExport && (
          <ModalFooter size={16}>
            <CommonButton type="light" onClick={props?.onClose}>
              {t('common.cancel')}
            </CommonButton>
            <CommonButton onClick={onConfirm} type="primary">
              {exportText}
            </CommonButton>
          </ModalFooter>
        )
      }
    >
      <Wrap>
        <LeftWrap>
          <div style={{ marginBottom: 24, width: 'fit-content' }}>
            <Checkbox
              checked={checkAll}
              indeterminate={indeterminate}
              onClick={onAllChecked}
            >
              {t('newlyAdd.allChecked')}
            </Checkbox>
          </div>

          <Collapse
            defaultActiveKey={['1']}
            ghost
            expandIcon={e => expandIcon(e)}
          >
            <Collapse.Panel
              header={<div className={text}>{t('components.basicFiled')}</div>}
              key="1"
            >
              <ItemWrap>
                <Checkbox.Group
                  style={{
                    width: '100%',
                  }}
                  value={checkList}
                  onChange={onChange}
                >
                  <Row gutter={[0, 10]}>
                    {fields?.baseFields?.map((item: any) => (
                      <Col key={item.label} span={6}>
                        <Checkbox
                          disabled={getItemState(item.field)}
                          key={item.field}
                          value={item.field}
                        >
                          <ShowText names={item.name} />
                        </Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </ItemWrap>
            </Collapse.Panel>
            <Collapse.Panel
              header={
                <div className={text}>{t('components.personOrTime')}</div>
              }
              key="2"
            >
              <ItemWrap>
                <Checkbox.Group
                  style={{
                    width: '100%',
                  }}
                  value={checkList2}
                  onChange={onChange2}
                >
                  <Row gutter={[0, 10]}>
                    {fields?.timeAndPersonFields?.map((item: any) => (
                      <Col key={item.label} span={6}>
                        <Checkbox key={item.field} value={item.field}>
                          <ShowText names={item.name} />
                        </Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </ItemWrap>
            </Collapse.Panel>
            <Collapse.Panel
              header={<div className={text}>{t('newlyAdd.customFields')}</div>}
              key="3"
            >
              {fields?.customFields?.length ? (
                <ItemWrap>
                  <Checkbox.Group
                    style={{
                      width: '100%',
                    }}
                    value={checkList3}
                    onChange={onChange3}
                  >
                    <Row gutter={[0, 10]}>
                      {fields?.customFields?.map((item: any) => (
                        <Col key={item.label} span={6}>
                          <Checkbox key={item.field} value={item.field}>
                            <ShowText names={item.name} />
                          </Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                </ItemWrap>
              ) : null}
            </Collapse.Panel>
          </Collapse>
        </LeftWrap>
        <Divider
          type="vertical"
          style={{
            background: 'var(--neutral-n6-d1)',
            margin: '0 16px 0 4px',
            height: 350,
          }}
        />
        <RightWrap>
          <LabelWrap>{t('components.currentFiled')}</LabelWrap>
          <div>
            <CheckedWrap>
              {allList
                .filter((i: any) => getItemState(i.field))
                .map((item: any) => (
                  <CheckedItem
                    key={item.field}
                    state={getItemState(item.field)}
                  >
                    <IconFont
                      style={{
                        fontSize: 16,
                        marginRight: '8px',
                        color: 'var(--neutral-n4)',
                      }}
                      type="move"
                    />
                    <span>{item.name}</span>
                    {!getItemState(item.field) && (
                      <ShowWrap style={{ marginLeft: 'auto' }}>
                        <IconFont
                          style={{ fontSize: 12 }}
                          type="close"
                          onClick={() => del(item.field)}
                        />
                      </ShowWrap>
                    )}
                  </CheckedItem>
                ))}
            </CheckedWrap>
            <SortContainer
              helperClass="row-dragging"
              useDragHandle
              onSortEnd={(values: any) => onSortEnd(values)}
            >
              {allList
                .filter((i: any) => !getItemState(i.field))
                .map((item: any, idx: number) => {
                  return (
                    <SortItemLi
                      helperClass="row-dragging"
                      key={item.value}
                      index={idx}
                    >
                      <CheckedItem
                        key={item.field}
                        state={getItemState(item.field)}
                      >
                        <DragHandle>
                          <DragItem>
                            <div>
                              <IconFont
                                type="move"
                                style={{
                                  fontSize: 16,
                                  cursor: 'pointer',
                                  color: 'var(--neutral-n3)',
                                  marginRight: 12,
                                }}
                              />
                              <span>{item.name}</span>
                            </div>
                            {!getItemState(item.field) && (
                              <ShowWrap style={{ marginLeft: 'auto' }}>
                                <IconFont
                                  style={{
                                    fontSize: 16,
                                    color: 'var(--neutral-n2)',
                                  }}
                                  type="close"
                                  onClick={() => del(item.field)}
                                />
                              </ShowWrap>
                            )}
                          </DragItem>
                        </DragHandle>
                      </CheckedItem>
                    </SortItemLi>
                  )
                })}
            </SortContainer>
          </div>
        </RightWrap>
      </Wrap>
    </CommonModal>
  )
}

export default FieldsTemplate
