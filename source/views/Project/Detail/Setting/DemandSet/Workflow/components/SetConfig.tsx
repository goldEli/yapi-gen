/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prefer-destructuring */
/* eslint-disable max-lines */
/* eslint-disable no-lonely-if */
/* eslint-disable camelcase */
/* eslint-disable multiline-ternary */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable max-len */
import CommonModal from '@/components/CommonModal'
import IconFont from '@/components/IconFont'
import { useModel } from '@/models'
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
import { createRef, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ExamineItem from './ExamineItem'
import { arrayMoveImmutable } from 'array-move'
import {
  SortableContainer as sortableContainer,
  SortableElement as sortableElement,
  SortableHandle as sortableHandle,
} from 'react-sortable-hoc'

const LabelWrap = styled.div({
  color: '#323233',
  fontSize: 14,
  fontWeight: 400,
  width: 100,
})

const Wrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
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
    color: color || '#969799',
    border: `1px solid ${color || '#969799'}`,
  }),
)

const TextWrap = styled.div({
  fontSize: 12,
  color: '#969799',
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
    fontSize: 12,
    color: '#646566',
    marginRight: 8,
  },
  ({ active }) => ({
    transform: active ? 'rotate(-90deg)' : 'inherit',
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
  const { getWorkflowInfo, saveWorkflowConfig, getProjectMember, workList }
    = useModel('project')
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
  const [allMemberList, setAllMemberList] = useState<any>([])
  const [normalList, setNormalList] = useState([
    { id: new Date().getTime(), obj: {} },
  ])
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
          verify_users: arrOption?.filter((j: any) => k.verify_users?.some((i: any) => i === j.id)),
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

  useEffect(() => {
    if (props?.isVisible) {
      getMemberList()
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
    }
    if (isSwitch) {
      params.verify_type = radioValue
      if (radioValue === 1) {
        if (normalList?.filter((i: any) => !i.obj?.verify_users)?.length) {
          message.warning('审核人为必填')
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

    await saveWorkflowConfig(params)
    message.success('保存成功')
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
    if (row.tag) {
      arr.filter((i: any) => i.tag === row.tag)[0].default_value = [
        'select_checkbox',
        'checkbox',
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
          type === 'datetime' ? 'YYYY-MM-DD hh:mm:ss' : 'YYYY-MM-DD',
        )
        : value
    } else {
      arr.filter((i: any) => i.content === row.content)[0].default_value = [
        'date',
        'datetime',
      ].includes(type)
        ? moment(value).format(
          type === 'datetime' ? 'YYYY-MM-DD hh:mm:ss' : 'YYYY-MM-DD',
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
      ['select', 'select_checkbox', 'checkbox', ' radio'].includes(
        defaultObj?.type,
      )
    ) {
      child = (
        <Select
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
            ['users_name', 'users_copysend_name'].includes(row.content)
            && row.default_type === 2
              ? memberList
              : defaultObj?.options
          }
          mode={
            defaultObj?.type === 'select_checkbox' ? 'multiple' : ('' as any)
          }
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
      style={{ fontSize: 16, cursor: 'pointer', color: '#969799' }}
    />
  ))

  const SortableItem = sortableElement(
    (propsItem: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...propsItem} />
    ,
  )

  const SortableBody = sortableContainer(
    (propsItem: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...propsItem} />
    ,
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
      useDragHandle
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
            {record?.content === 'comment'
            || record.content === 'users_name'
              ? ''
              : <DragHandle />
            }
          </>
        )
      },
    },
    {
      title: '字段名称',
      width: 160,
      dataIndex: 'title',
      render: (text: any, record: any) => (
        <Select
          style={{ width: 148 }}
          showArrow
          showSearch
          optionFilterProp="label"
          onChange={value => onChangeName(value, record)}
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
      title: '默认值类型',
      width: 160,
      dataIndex: 'default_type',
      render: (text: any, record: any) => (
        <Select
          style={{ width: 148 }}
          showArrow
          showSearch
          value={text}
          optionFilterProp="value"
          onChange={value => onChangeValue(value, record)}
          options={
            record.content === 'comment'
              ? [{ label: '固定值', value: 2 }]
              : [
                  { label: '字段值', value: 1 },
                  { label: '固定值', value: 2 },
                ]
          }
        />
      ),
    },
    {
      title: '默认值/默认值字段',
      dataIndex: 'default_value',
      width: 170,
      render: (text: any, record: any) => <>{getTableCol(record)}</>,
    },
    {
      title: '是否必填',
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
      title: '操作',
      width: 60,
      dataIndex: 'action',
      render: (text: string, record: any) => {
        return (
          <>
            {record?.content === 'comment'
            || record.content === 'users_name'
              ? ''
              : (
                  <span
                    style={{ color: '#2877ff', cursor: 'pointer' }}
                    onClick={() => onDelRow(record)}
                  >
                删除
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
    setNormalList(normalList?.filter((i: any) => i.id !== id))
  }

  // 更新流转审核线并过滤人员下拉
  const onChangeList = (obj: any, id: any) => {
    normalList.filter((i: any) => i.id === id)[0].obj = obj
    if (obj.type === 'add') {
      setOptions(options?.filter((k: any) => k.id !== obj.id))
    } else {
      const checkObj = allMemberList?.filter((i: any) => i.id === obj.id)[0]
      setOptions([...options, ...[checkObj]])
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
      message.warning('审核人为必填')
      return
    }
    setNormalList([...normalList, ...[{ id: new Date().getTime(), obj: {} }]])
  }

  return (
    <CommonModal
      isVisible={props?.isVisible}
      title="配置流转附加字段及权限"
      onClose={onClose}
      onConfirm={onConfirm}
      width={784}
    >
      <div style={{ maxHeight: 544, overflowY: 'auto' }}>
        <ItemWrap style={{ marginTop: 8 }}>
          <LabelWrap>当前流转</LabelWrap>
          <ItemWrap>
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
            <Divider
              type="vertical"
              style={{ width: 48, height: 1, border: '1px dashed #D5D6D9' }}
            />
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
          </ItemWrap>
        </ItemWrap>
        <ItemWrap style={{ marginTop: 32 }}>
          <ItemWrap
            style={{ cursor: 'pointer' }}
            onClick={() => setIsShowPermission(!isShowPermission)}
          >
            <IconfontWrap type="tableDown" active={isShowPermission} />
            <span style={{ color: '#323233', fontSize: 14, fontWeight: 500 }}>
              流转操作权限
            </span>
          </ItemWrap>
        </ItemWrap>
        {isShowPermission && (
          <Form form={form}>
            <TextWrap>
              配置状态流转用户权限，只有有权限的用户才允许做此流转。如果为空则默认所有人有权限。
            </TextWrap>
            <ItemWrap style={{ marginTop: 16 }}>
              <LabelWrap>用户组</LabelWrap>
              <Form.Item noStyle name="roles">
                <Select
                  style={{ minWidth: 186 }}
                  showSearch
                  mode="multiple"
                  optionFilterProp="label"
                  getPopupContainer={node => node}
                  showArrow
                  options={info?.roles?.map((i: any) => ({
                    label: i.name,
                    value: i.id,
                  }))}
                />
              </Form.Item>
            </ItemWrap>
            <ItemWrap style={{ marginTop: 24 }}>
              <LabelWrap>人员字段</LabelWrap>
              <Form.Item noStyle name="user_fields">
                <Select
                  style={{ minWidth: 186 }}
                  showSearch
                  mode="multiple"
                  showArrow
                  optionFilterProp="label"
                  getPopupContainer={node => node}
                  options={info?.authUserFields?.map((i: any) => ({
                    label: i.title,
                    value: i.content,
                  }))}
                />
              </Form.Item>
            </ItemWrap>
            <ItemWrap style={{ marginTop: 24 }}>
              <LabelWrap>其他用户</LabelWrap>
              <Form.Item noStyle name="other_users">
                <Select
                  style={{ minWidth: 186 }}
                  showSearch
                  mode="multiple"
                  optionFilterProp="label"
                  showArrow
                  getPopupContainer={node => node}
                  options={memberList}
                  allowClear
                />
              </Form.Item>
            </ItemWrap>

            <ItemWrap style={{ marginTop: 24 }}>
              <LabelWrap>流转审核</LabelWrap>
              <Form.Item noStyle name="is_verify">
                <Switch
                  checked={isSwitch}
                  onChange={checked => onChangeSwitch(checked)}
                />
              </Form.Item>
            </ItemWrap>

            <TextWrap>开启审核后，需审核人同意后才可流转到下一状态</TextWrap>
            {isSwitch && (
              <Wrap>
                <Radio.Group
                  onChange={onRadioChange}
                  value={radioValue}
                  style={{ marginTop: 8 }}
                >
                  <Radio value={1}>固定审核流程</Radio>
                  <Radio value={2}>用户指定审核人</Radio>
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
                      />
                    ))}
                    <Timeline.Item>
                      <div
                        onClick={onAddExamine}
                        style={{
                          color: '#2877ff',
                          cursor: 'pointer',
                          width: 'fit-content',
                        }}
                      >
                        添加审核
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
            <span style={{ color: '#323233', fontSize: 14, fontWeight: 500 }}>
              流转填写字段
            </span>
          </ItemWrap>
        </ItemWrap>
        {isShowField && (
          <div>
            <TextWrap>
              配置状态流转过程中需要额外填写的字段，可以设置是否必填和默认值。
            </TextWrap>
            <Button
              style={{ background: '#F0F4FA', color: '#2877ff', marginTop: 16 }}
              icon={<IconFont type="plus" />}
              onClick={onClickAddField}
            >
              添加字段
            </Button>
            <Table
              pagination={false}
              dataSource={dataSource}
              columns={columns as any}
              rowKey="index"
              sticky
              style={{ marginTop: 16 }}
              components={{
                body: {
                  wrapper: DraggableContainer,
                  row: DraggableBodyRow,
                },
              }}
            />
            <TextWrap>
              注：拖动
              <IconFont
                type="move"
                style={{
                  fontSize: 14,
                }}
              />
              图标可以调整状态顺序哦。（状态的顺序会体现在流转时状态的展现和列表排序中。）
            </TextWrap>
          </div>
        )}
      </div>
    </CommonModal>
  )
}

export default SetConfig
