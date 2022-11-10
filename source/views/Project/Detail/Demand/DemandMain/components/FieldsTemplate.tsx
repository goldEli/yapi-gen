/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable multiline-ternary */
import CommonModal from '@/components/CommonModal'
import { Checkbox, Space, Divider } from 'antd'
import IconFont from '@/components/IconFont'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import { useModel } from '@/models'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import { ShowWrap } from '@/components/StyleCommon'
import { type CheckboxValueType } from 'antd/lib/checkbox/Group'

const Wrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  height: 350,
})

const LeftWrap = styled.div({
  height: 350,
  width: 'calc(100% - 227px)',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
})
const RightWrap = styled.div({
  height: 350,
  width: 227,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
})

const ItemWrap = styled.div({
  marginBottom: 24,
})

const LabelWrap = styled.div({
  color: '#969799',
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
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '&: hover': {
      background: ' rgba(240, 244, 250, 1)',
      [ShowWrap.toString()]: {
        visibility: 'visible',
      },
    },
  },
  ({ state }) => ({
    color: state ? '#BBBDBF' : '#323233',
  }),
)

const CheckedWrap = styled.div({
  maxHeight: 325,
  overflow: 'auto',
  paddingRight: 20,
})

interface Props {
  visible: boolean
  title: string
  onClose(): void
  onConfirm(values: any): void

  // 1是更新，2是新建
  importState?: any
  // 是否是导出
  isExport: boolean
}

const FieldsTemplate = (props: Props) => {
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { getLoadListFields, getExportFields } = useModel('demand')
  const [checkList, setCheckList] = useState<CheckboxValueType[]>([])
  const [checkList2, setCheckList2] = useState<CheckboxValueType[]>([])
  const [checkList3, setCheckList3] = useState<CheckboxValueType[]>([])
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
    setIndeterminate(false)
    setCheckAll(true)
    setFields(result)
  }

  useEffect(() => {
    getList()
  }, [])

  const [t] = useTranslation()

  const onClose = () => {
    props?.onClose()
  }

  const onConfirm = () => {
    props?.onConfirm([...checkList, ...checkList2, ...checkList3])
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
      resultVal = field === 'name'
    } else {
      resultVal =
        props?.importState === 2
          ? ['name', 'category'].includes(field)
          : field === 'id'
    }
    return resultVal
  }

  const allList = useMemo(() => {
    const arr = [...checkList, ...checkList2, ...checkList3]
    const arr2 = [
      ...(fields?.baseFields || []),
      ...(fields?.timeAndPersonFields || []),
      ...(fields?.customFields || []),
    ]
    const all = arr2.reduce((res: { name: string; field: string }[], item) => {
      if (arr.includes(item.field)) {
        res.push(item)
      }
      return res
    }, [])

    return (
      <CheckedWrap>
        {all.map((item: any) => (
          <CheckedItem key={item.field} state={getItemState(item.field)}>
            <IconFont
              style={{ fontSize: 12, marginRight: '8px', color: '#969799' }}
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
    )
  }, [checkList, checkList2, checkList3, fields])

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
    const resArr = [...list, ...checkList2, ...checkList3]
    onIsCheckAll(resArr.length)
  }
  const onChange2 = (list: CheckboxValueType[]) => {
    setCheckList2(list)
    const resArr = [...checkList, ...list, ...checkList3]
    onIsCheckAll(resArr.length)
  }

  const onChange3 = (list: CheckboxValueType[]) => {
    setCheckList3(list)
    const resArr = [...checkList, ...checkList2, ...list]
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

  return (
    <CommonModal
      title={props?.title}
      isVisible={props?.visible}
      width={784}
      confirmText={
        props.isExport
          ? t('newlyAdd.exportDemand')
          : t('newlyAdd.downloadTemplate')
      }
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <Wrap>
        <LeftWrap>
          <Checkbox
            checked={checkAll}
            indeterminate={indeterminate}
            style={{ marginBottom: 24, width: 'fit-content' }}
            onClick={onAllChecked}
          >
            {t('newlyAdd.allChecked')}
          </Checkbox>
          <ItemWrap>
            <LabelWrap>{t('components.basicFiled')}</LabelWrap>
            <Checkbox.Group value={checkList} onChange={onChange}>
              <Space style={{ flexWrap: 'wrap' }}>
                {fields?.baseFields?.map((item: any) => (
                  <Checkbox
                    disabled={getItemState(item.field)}
                    key={item.field}
                    value={item.field}
                  >
                    {item.name}
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </ItemWrap>
          <ItemWrap>
            <LabelWrap>{t('components.personOrTime')}</LabelWrap>
            <Checkbox.Group value={checkList2} onChange={onChange2}>
              <Space style={{ flexWrap: 'wrap' }}>
                {fields?.timeAndPersonFields?.map((item: any) => (
                  <Checkbox key={item.field} value={item.field}>
                    {item.name}
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </ItemWrap>
          {fields?.customFields?.length ? (
            <ItemWrap>
              <LabelWrap>{t('newlyAdd.customFields')}</LabelWrap>
              <Checkbox.Group value={checkList3} onChange={onChange3}>
                <Space style={{ flexWrap: 'wrap' }}>
                  {fields?.customFields?.map((item: any) => (
                    <Checkbox key={item.field} value={item.field}>
                      {item.name}
                    </Checkbox>
                  ))}
                </Space>
              </Checkbox.Group>
            </ItemWrap>
          ) : null}
        </LeftWrap>
        <Divider
          type="vertical"
          style={{ background: '#EBEDF0', margin: '0 16px 0 4px', height: 350 }}
        />
        <RightWrap>
          <LabelWrap>{t('components.currentFiled')}</LabelWrap>
          {allList}
        </RightWrap>
      </Wrap>
    </CommonModal>
  )
}

export default FieldsTemplate
