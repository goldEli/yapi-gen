/* eslint-disable complexity */
// 需求设置-流转弹窗

/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prefer-destructuring */
/* eslint-disable max-lines */
/* eslint-disable no-lonely-if */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable max-len */
import CommonModal from '@/components/CommonModal'
import IconFont from '@/components/IconFont'
import { getParamsData } from '@/tools'
import styled from '@emotion/styled'
import {
  Table,
  Select,
  Radio,
  Checkbox,
  Timeline,
  Divider,
  Switch,
  Button,
  Form,
  Input,
  DatePicker,
  InputNumber,
  message,
} from 'antd'
import moment from 'moment'
import { createRef, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ExamineItem from './ExamineItem'
import { arrayMoveImmutable } from 'array-move'
import {
  SortableContainer as sortableContainer,
  SortableElement as sortableElement,
  SortableHandle as sortableHandle,
} from 'react-sortable-hoc'
import { useTranslation } from 'react-i18next'
import { getStaffList } from '@/services/staff'
import {
  getProjectMember,
  getWorkflowInfo,
  saveWorkflowConfig,
} from '@/services/project'
import { useSelector } from '@store/index'
import CustomSelect from '@/components/CustomSelect'
import CommonButton from '@/components/CommonButton'
import { getMessage } from '@/components/Message'
import MoreSelect from '@/components/MoreSelect'

const TableWrapTop = styled(Table)({
  '.ant-table-cell': {
    padding: 0,
  },
  '.ant-table-tbody .ant-table-row:nth-child(odd) td': {
    backgroundColor: 'var(--neutral-white-d2)',
  },
})

const TableWrap = styled(Table)({
  '.ant-table-cell': {
    padding: 0,
  },
})

const TableWrapBottom = styled(Table)({
  '.ant-table-cell': {
    padding: 0,
  },
})

const LabelWrap = styled.div({
  color: 'var(--neutral-n1-d1)',
  fontSize: 14,
  fontWeight: 400,
  width: 100,
})

const Wrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  padding: '0 24px',
})

const ItemWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
})

const StatusWrap = styled.div<{ color?: string }>(
  {
    borderRadius: 6,
    background: 'white',
    height: 28,
    lineHeight: '28px',
    padding: '0 12px',
  },
  ({ color }) => ({
    color: color || 'var(--neutral-n3)',
    border: `1px solid ${color || 'var(--neutral-n3)'}`,
  }),
)

const TextWrap = styled.div({
  fontSize: 12,
  color: 'var(--neutral-n3)',
  fontWeight: 400,
  display: 'flex',
  alignItems: 'center',
})

const TimelineWrap = styled(Timeline)({
  marginTop: 16,
  '.ant-timeline-item-last > .ant-timeline-item-content': {
    minHeight: 'auto',
  },
  '.ant-timeline-item-last': {
    paddingBottom: 0,
  },
})

const IconfontWrap = styled(IconFont)<{ active?: boolean }>(
  {
    fontSize: 10,
    color: 'var(--neutral-n3)',
    marginRight: 8,
  },
  ({ active }) => ({
    transform: active ? 'rotate(0deg)' : 'rotate(-90deg)',
  }),
)

interface Props {
  isVisible: boolean
  onClose(): void
  item: any
}

const normalObj: any = {
  can_delete: 2,
  content: '',
  default_type: 1,
  default_value: '',
  is_must: 2,
  title: '',
}

const SetConfig = (props: Props) => {
  const [t, i18n] = useTranslation()
  const modalBody = useRef<any>(null)
  const { workList } = useSelector(store => store.project)
  const [isShowPermission, setIsShowPermission] = useState(true)
  const [isSwitch, setIsSwitch] = useState(false)
  const [isShowField, setIsShowField] = useState(true)
  const [radioValue, setRadioValue] = useState(1)
  const ChildRef: any = createRef()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { categoryItem } = paramsData
  const [info, setInfo] = useState<any>({})
  const [memberList, setMemberList] = useState<any>([])
  const [staffList, setStaffList] = useState<any>([])
  const [allMemberList, setAllMemberList] = useState<any>([])
  const [normalList, setNormalList] = useState([
    { id: new Date().getTime(), obj: {} },
  ])
  const [circulationName, setCirculationName] = useState('')
  const [form] = Form.useForm()
  const [dataSource, setDataSource] = useState<any>([])
  const [options, setOptions] = useState<any>([])

  const getInfo = async (arrOption: any) => {
    const result = await getWorkflowInfo({
      projectId: paramsData.id,
      categoryId: categoryItem?.id,
      fromId: props?.item?.id,
      toId: props?.item?.toId,
    })
    setCirculationName(result.name)
    setInfo(result)
    form.setFieldsValue(result)
    form.setFieldsValue({
      roles: result?.auth.roles,
      other_users: result?.auth.other_users,
      user_fields: result?.auth.user_fields,
      is_verify: result?.is_verify === 1,
    })
    setIsSwitch(result?.is_verify === 1)
    setDataSource(result?.fields)
    setRadioValue(result?.verify?.verify_type || 1)
    if (result?.verify?.verify_type === 1) {
      let checkedList: any = []
      const arr = result?.verify?.process?.map((k: any, index: any) => ({
        id: new Date().getTime() + index * 11,
        obj: {
          operator: k.operator,
          verify_users: arrOption?.filter((j: any) =>
            k.verify_users?.some((i: any) => i === j.id),
          ),
        },
      }))
      setNormalList(arr)
      result?.verify?.process?.forEach((element: any) => {
        checkedList = [...checkedList, ...element.verify_users]
      })
      setOptions(
        arrOption?.filter(
          (j: any) => !checkedList?.some((i: any) => i === j.id),
        ),
      )
    }
  }

  const getMemberList = async () => {
    const result = await getProjectMember({
      projectId: paramsData.id,
      all: true,
    })
    setMemberList(result?.map((k: any) => ({ label: k.name, value: k.id })))
    setOptions(result)
    setAllMemberList(result)
    getInfo(result)
  }

  const getStaffData = async () => {
    const response = await getStaffList({ all: 1 })
    setStaffList(response)
  }

  useEffect(() => {
    if (props?.isVisible) {
      getMemberList()
      getStaffData()
    }
  }, [props?.isVisible])

  const onReset = () => {
    setRadioValue(1)
    setIsShowField(true)
    setIsSwitch(false)
    setIsShowPermission(true)
    setInfo({})
    setNormalList([])
    setOptions([])
    ChildRef?.current?.reset()
  }

  const onClose = () => {
    props?.onClose()
    onReset()
  }

  // 提交
  const onConfirm = async () => {
    const obj = form.getFieldsValue()
    const params: any = {
      projectId: paramsData.id,
      categoryId: categoryItem?.id,
      fromId: props?.item?.id,
      toId: props?.item?.toId,
      isVerify: obj.is_verify ? 1 : 2,
      auth: {
        roles: obj.roles,
        other_users: obj.other_users,
        user_fields: obj.user_fields,
      },
      fields: dataSource,
      name: circulationName,
    }
    if (isSwitch) {
      params.verify_type = radioValue
      if (radioValue === 1) {
        if (
          normalList?.filter(
            (i: any) => i.obj.verify_users && i.obj.verify_users?.length > 0,
          )?.length !== normalList?.length
        ) {
          getMessage({ msg: t('newlyAdd.needExaminePerson'), type: 'warning' })
          return
        }
        params.process = normalList
          ?.map((i: any) => i.obj)
          ?.map((k: any) => ({
            operator: k.operator,
            verify_users: k.verify_users?.map((j: any) => j.id),
          }))
      }
    }

    if (dataSource?.filter((k: any) => !k.content)?.length) {
      getMessage({ msg: t('newlyAdd.needFields'), type: 'warning' })
      return
    }

    if (
      dataSource?.filter(
        (k: any) => k.content && k.default_type === 1 && !k.default_value,
      )?.length
    ) {
      getMessage({ msg: t('newlyAdd.needNormal'), type: 'warning' })
      return
    }
    await saveWorkflowConfig(params)
    getMessage({ msg: t('common.saveSuccess') as string, type: 'success' })
    onClose()
    setDataSource([])
  }

  // 修改默认值类型
  const onChangeValue = (val: any, row: any) => {
    const arr = JSON.parse(JSON.stringify(dataSource))
    let obj: any = {}
    if (row.tag) {
      obj = arr.filter((i: any) => i.tag === row.tag)[0]
    } else {
      obj = arr.filter((i: any) => i.content === row.content)[0]
    }
    obj.default_value = row.default_type === val ? row.default_value : ''
    obj.default_type = val
    setDataSource(arr)
  }

  // 修改字段名称
  const onChangeName = (val: any, row: any) => {
    const arr = JSON.parse(JSON.stringify(dataSource))
    let obj: any = {}
    if (row.tag) {
      obj = arr.filter((i: any) => i.tag === row.tag)[0]
    } else {
      obj = arr.filter((i: any) => i.content === row.content)[0]
    }
    obj.title = info?.fieldAll?.filter((k: any) => k.value === val)[0]?.label
    obj.content = info?.fieldAll?.filter((k: any) => k.value === val)[0]?.value
    obj.default_value = ''
    if (String(obj.content).includes('custom_')) {
      obj.is_customize = 1
    } else {
      obj.is_customize = 2
    }

    setDataSource(arr)
  }

  // 修改默认值、默认值字段 --- 点选||多选
  const onChangeSelect = (value: any, row: any, obj: any) => {
    const arr = JSON.parse(JSON.stringify(dataSource))
    // 新添加的
    if (row.tag) {
      arr.filter((i: any) => i.tag === row.tag)[0].default_value = [
        'select_checkbox',
        'checkbox',
        'user_select_checkbox',
        'user_select',
      ].includes(obj.type)
        ? value
        : {
            title: obj?.options?.filter((k: any) => k.value === value)[0]
              ?.label,
            content: value,
          }
    } else {
      arr.filter((i: any) => i.content === row.content)[0].default_value = [
        'select_checkbox',
        'checkbox',
        'user_select_checkbox',
        'user_select',
      ].includes(obj.type)
        ? value
        : {
            title: obj?.options?.filter((k: any) => k.value === value)[0]
              ?.label,
            content: value,
          }
    }
    setDataSource(arr)
  }

  // 修改默认值、默认值字段 --- 文本
  const onChangeText = (value: any, row: any, type?: any) => {
    const arr = JSON.parse(JSON.stringify(dataSource))
    if (row.tag) {
      arr.filter((i: any) => i.tag === row.tag)[0].default_value = [
        'date',
        'datetime',
      ].includes(type)
        ? moment(value).format(
            type === 'datetime' ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD',
          )
        : value
    } else {
      arr.filter((i: any) => i.content === row.content)[0].default_value = [
        'date',
        'datetime',
      ].includes(type)
        ? moment(value).format(
            type === 'datetime' ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD',
          )
        : value
    }
    setDataSource(arr)
  }

  // 获取默认值/默认值字段 控件
  const getTableCol = (row: any) => {
    const filterObj = info?.fieldAll?.filter(
      (i: any) => i.value === row.content,
    )[0]
    const defaultObj = filterObj?.defaultValueFields[row.default_type]
    let child: any
    if (
      ['select', 'select_checkbox', 'checkbox', 'radio'].includes(
        defaultObj?.type,
      )
    ) {
      child = (
        <MoreSelect
          border
          style={{ width: 148 }}
          showArrow
          showSearch
          optionFilterProp="label"
          value={
            Array.isArray(row.default_value)
              ? row.default_value
              : row.default_value?.title
          }
          options={
            ['users_name', 'users_copysend_name'].includes(row.content) &&
            row.default_type === 2
              ? row.content === 'users_name'
                ? memberList
                : staffList
              : defaultObj?.options
          }
          more={!['checkbox', 'select_checkbox'].includes(defaultObj?.type)}
          onChange={(value: any) => onChangeSelect(value, row, defaultObj)}
        />
      )
    } else if (
      ['user_select_checkbox', 'user_select'].includes(defaultObj?.type)
    ) {
      const optionsType = info?.fieldAll?.filter(
        (i: any) => i.value === row.content,
      )?.[0]?.contentType[0]
      const optionValues =
        optionsType === 'projectMember' ? memberList : staffList
      child = (
        <MoreSelect
          border
          style={{ width: 148 }}
          showArrow
          showSearch
          optionFilterProp="label"
          value={
            defaultObj?.type === 'user_select_checkbox'
              ? row.default_value?.length > 0
                ? row.default_value
                : []
              : row.default_value
          }
          options={row.default_type === 2 ? optionValues : defaultObj?.options}
          more={defaultObj?.type !== 'user_select_checkbox'}
          onChange={(value: any) => onChangeSelect(value, row, defaultObj)}
        />
      )
    } else if (['textarea'].includes(defaultObj?.type)) {
      child = (
        <Input.TextArea
          style={{ width: 148 }}
          defaultValue={row.default_value}
          onBlur={e => onChangeText(e.target.value, row)}
        />
      )
    } else if (['date', 'datetime'].includes(defaultObj?.type)) {
      child = (
        <DatePicker
          style={{ width: 148 }}
          value={row.default_value ? moment(row.default_value) : ('' as any)}
          onChange={date => onChangeText(date, row, defaultObj.type)}
          showTime={defaultObj?.type === 'datetime'}
        />
      )
    } else if (['integer', 'number'].includes(defaultObj?.type)) {
      child = (
        <InputNumber
          style={{ width: 148 }}
          defaultValue={row.default_value}
          onBlur={value => onChangeText(value, row)}
        />
      )
    } else {
      child = (
        <Input
          style={{ width: 148 }}
          defaultValue={row.default_value}
          onBlur={e => onChangeText(e.target.value, row)}
        />
      )
    }

    return child
  }

  // 修改必填项
  const onChangeCheck = (e: any, row: any) => {
    const arr = JSON.parse(JSON.stringify(dataSource))
    if (row.tag) {
      arr.filter((i: any) => i.tag === row.tag)[0].is_must = e.target.checked
        ? 1
        : 2
    } else {
      arr.filter((i: any) => i.content === row.content)[0].is_must = e.target
        .checked
        ? 1
        : 2
    }
    setDataSource(arr)
  }

  // 删除行
  const onDelRow = (row: any) => {
    let arr = JSON.parse(JSON.stringify(dataSource))
    if (row.tag) {
      arr = arr.filter((k: any) => k.tag !== row.tag)
    } else {
      arr = arr.filter((k: any) => k.content !== row.content)
    }
    setDataSource(arr)
  }

  const DragHandle = sortableHandle(() => (
    <IconFont
      type="move"
      style={{
        fontSize: 16,
        cursor: 'pointer',
        color: 'var(--neutral-n3)',
        padding: '0 16px',
      }}
    />
  ))

  const SortableItem = sortableElement(
    (propsItem: React.HTMLAttributes<HTMLTableRowElement>) => (
      <tr {...propsItem} />
    ),
  )

  const SortableBody = sortableContainer(
    (propsItem: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <tbody {...propsItem} />
    ),
  )

  const onSortEnd = ({ oldIndex, newIndex }: any) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(
        dataSource?.slice(),
        oldIndex,
        newIndex,
      ).filter((el: any) => !!el)
      setDataSource(newData)
    }
  }

  const DraggableContainer = (propsItem: any) => (
    <SortableBody
      helperContainer={modalBody.current}
      useDragHandle
      helperClass="row-dragging"
      disableAutoscroll
      onSortEnd={onSortEnd}
      {...propsItem}
    />
  )

  const DraggableBodyRow: React.FC<any> = ({ ...restProps }) => {
    const index = dataSource?.findIndex(
      (x: any) => x.index === restProps['data-row-key'],
    )
    return <SortableItem index={index} {...restProps} />
  }

  const columns = [
    {
      title: '',
      dataIndex: 'name',
      width: 30,
      render: (text: string, record: any) => {
        return (
          <>
            {record?.content === 'comment' ||
            record.content === 'users_name' ? (
              <div style={{ width: 48 }} />
            ) : (
              <DragHandle />
            )}
          </>
        )
      },
    },
    {
      title: t('newlyAdd.fieldsName'),
      width: i18n.language === 'zh' ? 180 : 160,
      dataIndex: 'title',
      render: (text: any, record: any) => (
        <CustomSelect
          style={{ width: 148 }}
          showArrow
          showSearch
          optionFilterProp="label"
          onChange={(value: any) => onChangeName(value, record)}
          value={text}
          disabled={
            record?.content === 'comment' || record?.content === 'users_name'
          }
          options={info?.fieldAll
            ?.filter(
              (k: any) => !dataSource?.some((j: any) => k.value === j.content),
            )
            ?.filter((i: any) => ({
              label: i.title,
              value: i.content,
            }))}
        />
      ),
    },
    {
      title: t('newlyAdd.normalType'),
      width: i18n.language === 'zh' ? 180 : 160,
      dataIndex: 'default_type',
      render: (text: any, record: any) => (
        <CustomSelect
          style={{ width: 148 }}
          showArrow
          showSearch
          value={text}
          optionFilterProp="value"
          onChange={(value: any) => onChangeValue(value, record)}
          options={
            record.content === 'comment'
              ? [{ label: t('newlyAdd.fixedValue'), value: 2 }]
              : [
                  { label: t('newlyAdd.fieldsValue'), value: 1 },
                  { label: t('newlyAdd.fixedValue'), value: 2 },
                ]
          }
        />
      ),
    },
    {
      title: t('newlyAdd.normalValueOrFields'),
      dataIndex: 'default_value',
      width: i18n.language === 'zh' ? 170 : 220,
      render: (text: any, record: any) => <>{getTableCol(record)}</>,
    },
    {
      title: t('newlyAdd.isNeed'),
      width: 100,
      dataIndex: 'is_must',
      align: 'center',
      render: (text: any, record: any) => (
        <Checkbox
          onChange={e => onChangeCheck(e, record)}
          checked={record.is_must === 1}
        />
      ),
    },
    {
      title: t('newlyAdd.operation'),
      width: 60,
      dataIndex: 'action',
      render: (text: string, record: any) => {
        return (
          <>
            {record?.content === 'comment' ||
            record.content === 'users_name' ? (
              ''
            ) : (
              <span
                style={{ color: 'var(--primary-d2)', cursor: 'pointer' }}
                onClick={() => onDelRow(record)}
              >
                {t('common.del')}
              </span>
            )}
          </>
        )
      },
    },
  ]

  // 流转审核下的类型
  const onRadioChange = (e: any) => {
    setRadioValue(e.target.value)
    setNormalList([{ id: new Date().getTime(), obj: {} }])
  }

  // 是否开启流转审核
  const onChangeSwitch = (checked: boolean) => {
    setIsSwitch(checked)
    setNormalList([{ id: new Date().getTime(), obj: {} }])
    form.setFieldsValue({
      is_verify: checked,
    })
  }

  // 删除流转审核线
  const onDel = (id: any) => {
    const current: any = normalList?.filter((i: any) => i.id === id)[0]?.obj
    if (current?.verify_users?.length) {
      setOptions([...options, ...(current?.verify_users || [])])
    }

    setNormalList(normalList?.filter((i: any) => i.id !== id))
  }

  // 更新流转审核线并过滤人员下拉
  const onChangeList = (obj: any, id: any) => {
    if (obj.type === 'add') {
      normalList.filter((i: any) => i.id === id)[0].obj = obj
      setOptions(options?.filter((k: any) => k.id !== obj.id))
    } else if (obj.type === 'del') {
      normalList.filter((i: any) => i.id === id)[0].obj = obj
      const checkObj = allMemberList?.filter((i: any) => i.id === obj.id)[0]
      setOptions([...options, ...[checkObj]])
    } else {
      const resultObj: any = normalList.filter((i: any) => i.id === id)[0].obj
      resultObj.operator = obj.operator
    }
  }

  // 点击添加字段
  const onClickAddField = () => {
    const arr = JSON.parse(JSON.stringify(dataSource))
    normalObj.tag = new Date().getTime()
    normalObj.index = new Date().getTime()
    setDataSource(arr.slice(0, -1).concat([normalObj].concat(arr.slice(-1))))
  }

  const onAddExamine = () => {
    const lastItem: any = normalList[normalList?.length - 1]
    if (!lastItem?.obj?.verify_users?.length) {
      getMessage({ msg: t('newlyAdd.needExaminePerson'), type: 'warning' })
      return
    }
    setNormalList([...normalList, ...[{ id: new Date().getTime(), obj: {} }]])
  }

  return (
    <CommonModal
      isVisible={props?.isVisible}
      title={t('newlyAdd.setReviewAndPermission')}
      onClose={onClose}
      onConfirm={onConfirm}
      width={820}
      confirmText={t('newlyAdd.submit')}
    >
      <div style={{ height: 544, overflowY: 'auto', padding: '0 16px 0 24px' }}>
        <ItemWrap style={{ marginTop: 8 }}>
          <LabelWrap>{t('other.name')}</LabelWrap>
          <Input
            style={{ width: 184 }}
            value={circulationName}
            onChange={e => {
              setCirculationName(e.target.value)
            }}
            maxLength={20}
          ></Input>
        </ItemWrap>
        <ItemWrap style={{ marginTop: 24 }}>
          <LabelWrap>{t('newlyAdd.currentReview')}</LabelWrap>
          <ItemWrap>
            <StatusWrap
              color={
                workList?.list?.filter((i: any) => i.id === props?.item?.id)[0]
                  ?.color
              }
            >
              {
                workList?.list?.filter((i: any) => i.id === props?.item?.id)[0]
                  ?.name
              }
            </StatusWrap>
            <Divider
              type="vertical"
              style={{
                width: 48,
                height: 1,
                border: '1px dashed var(--neutral-n4)',
              }}
            />
            <StatusWrap
              color={
                workList?.list?.filter(
                  (i: any) => i.id === props?.item?.toId,
                )[0]?.color
              }
            >
              {
                workList?.list?.filter(
                  (i: any) => i.id === props?.item?.toId,
                )[0]?.name
              }
            </StatusWrap>
          </ItemWrap>
        </ItemWrap>
        <ItemWrap style={{ marginTop: 32 }}>
          <ItemWrap
            style={{ cursor: 'pointer' }}
            onClick={() => setIsShowPermission(!isShowPermission)}
          >
            <IconfontWrap type="tableDown" active={isShowPermission} />
            <span
              style={{
                color: 'var(--neutral-n1-d1)',
                fontSize: 14,
                fontFamily: 'SiYuanMedium',
              }}
            >
              {t('newlyAdd.reviewPermission')}
            </span>
          </ItemWrap>
        </ItemWrap>
        {isShowPermission && (
          <Form form={form}>
            <div style={{ paddingLeft: 20 }}>
              <TextWrap>{t('newlyAdd.setPermissionText')}</TextWrap>
              <ItemWrap style={{ marginTop: 16 }}>
                <LabelWrap>{t('setting.userGroup')}</LabelWrap>
                <Form.Item noStyle name="roles">
                  <MoreSelect
                    border
                    style={{ minWidth: 186 }}
                    showSearch
                    optionFilterProp="label"
                    getPopupContainer={(node: any) => node}
                    showArrow
                    options={info?.roles?.map((i: any) => ({
                      label: i.name,
                      value: i.id,
                    }))}
                  />
                </Form.Item>
              </ItemWrap>
              <ItemWrap style={{ marginTop: 24 }}>
                <LabelWrap>{t('newlyAdd.userFields')}</LabelWrap>
                <Form.Item noStyle name="user_fields">
                  <MoreSelect
                    border
                    style={{ minWidth: 186 }}
                    showSearch
                    showArrow
                    optionFilterProp="label"
                    getPopupContainer={(node: any) => node}
                    options={info?.authUserFields?.map((i: any) => ({
                      label: i.title,
                      value: i.content,
                    }))}
                  />
                </Form.Item>
              </ItemWrap>
              <ItemWrap style={{ marginTop: 24 }}>
                <LabelWrap>{t('newlyAdd.otherUser')}</LabelWrap>
                <Form.Item noStyle name="other_users">
                  <MoreSelect
                    border
                    style={{ minWidth: 186 }}
                    showSearch
                    optionFilterProp="label"
                    showArrow
                    getPopupContainer={(node: any) => node}
                    options={memberList}
                    allowClear
                  />
                </Form.Item>
              </ItemWrap>

              <ItemWrap style={{ marginTop: 24 }}>
                <LabelWrap>{t('newlyAdd.reviewExamine')}</LabelWrap>
                <Form.Item noStyle name="is_verify">
                  <Switch
                    checked={isSwitch}
                    onChange={checked => onChangeSwitch(checked)}
                  />
                </Form.Item>
              </ItemWrap>
              <TextWrap>{t('newlyAdd.openExamineCanTo')}</TextWrap>
            </div>

            {isSwitch && (
              <Wrap>
                <Radio.Group
                  onChange={onRadioChange}
                  value={radioValue}
                  style={{ marginTop: 8 }}
                >
                  <Radio value={1}>{t('newlyAdd.fixedExamine')}</Radio>
                  <Radio value={2}>{t('newlyAdd.userAppoint')}</Radio>
                </Radio.Group>
                {radioValue === 1 ? (
                  <TimelineWrap>
                    {normalList?.map((i: any) => (
                      <ExamineItem
                        key={i.id}
                        onRef={ChildRef}
                        onDel={() => onDel(i.id)}
                        onChangeList={arr => onChangeList(arr, i.id)}
                        options={options}
                        item={i}
                        len={normalList?.length}
                      />
                    ))}
                    <Timeline.Item>
                      <div
                        onClick={onAddExamine}
                        style={{
                          color: 'var(--primary-d2)',
                          cursor: 'pointer',
                          width: 'fit-content',
                        }}
                      >
                        {t('newlyAdd.addExamine')}
                      </div>
                    </Timeline.Item>
                  </TimelineWrap>
                ) : null}
              </Wrap>
            )}
          </Form>
        )}
        <ItemWrap style={{ marginTop: 32 }}>
          <ItemWrap
            style={{ cursor: 'pointer' }}
            onClick={() => setIsShowField(!isShowField)}
          >
            <IconfontWrap type="tableDown" active={isShowField} />
            <span
              style={{
                color: 'var(--neutral-n1-d1)',
                fontSize: 14,
                fontFamily: 'SiYuanMedium',
              }}
            >
              {t('newlyAdd.reviewFields')}
            </span>
          </ItemWrap>
        </ItemWrap>
        {isShowField && (
          <div>
            <TextWrap style={{ paddingLeft: 20 }}>
              {t('newlyAdd.reviewFieldsText')}
            </TextWrap>

            <CommonButton
              style={{
                marginTop: 16,
                marginLeft: 20,
              }}
              type="light"
              onClick={onClickAddField}
            >
              <IconFont type="plus" /> {t('newlyAdd.addFields')}
            </CommonButton>
            <TableWrapTop
              pagination={false}
              dataSource={dataSource?.filter(
                (i: any) => i.content === 'users_name',
              )}
              columns={columns as any}
              rowKey="index"
              style={{ marginTop: 16 }}
            />
            {dataSource?.filter(
              (i: any) => i.content !== 'users_name' && i.content !== 'comment',
            )?.length > 0 && (
              <TableWrap
                pagination={false}
                dataSource={dataSource?.filter(
                  (i: any) =>
                    i.content !== 'users_name' && i.content !== 'comment',
                )}
                columns={columns as any}
                rowKey="index"
                showHeader={false}
                components={{
                  body: {
                    wrapper: DraggableContainer,
                    row: DraggableBodyRow,
                  },
                }}
              />
            )}
            <TableWrapBottom
              pagination={false}
              dataSource={dataSource?.filter(
                (i: any) => i.content === 'comment',
              )}
              columns={columns as any}
              rowKey="index"
              showHeader={false}
            />
            <TextWrap style={{ marginTop: 8 }}>
              <span style={{ wordBreak: 'break-word' }}>
                {t('newlyAdd.dragSort')}
                <IconFont
                  type="move"
                  style={{
                    fontSize: 14,
                  }}
                />
                {t('newlyAdd.textSort')}
              </span>
            </TextWrap>
          </div>
        )}
      </div>
    </CommonModal>
  )
}

export default SetConfig
