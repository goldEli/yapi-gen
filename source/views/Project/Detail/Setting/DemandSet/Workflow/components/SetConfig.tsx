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
} from 'antd'
import { createRef, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ExamineItem from './ExamineItem'

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

const normalObj = {
  can_delete: 2,
  content: '',
  default_type: 1,
  default_value: { title: '', content: '' },
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
  const [normalList, setNormalList] = useState([
    { id: new Date().getTime(), obj: {} },
  ])
  const [checkedUser, setCheckedUser] = useState<any>([])
  const [form] = Form.useForm()
  const [dataSource, setDataSource] = useState<any>([])
  const [fieldAll, setFieldAll] = useState<any>([])

  const getMemberList = async () => {
    const result = await getProjectMember({
      projectId: paramsData.id,
      all: true,
    })
    setMemberList(result)
  }

  const getInfo = async () => {
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
    })
    setIsSwitch(result?.is_verify === 1)
    setDataSource(result?.fields)
    setFieldAll(
      result?.fieldAll?.map((i: any) => ({
        label: i.title,
        value: i.content,
        fixed_type: i.fixed_type,
        field_type: i.field_type,
      })),
    )

    // setNormalList()
    // setCheckedUser()
  }

  useEffect(() => {
    if (props?.isVisible) {
      getInfo()
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
    ChildRef?.current?.reset()
  }

  const onClose = () => {
    props?.onClose()
    onReset()
  }

  const onConfirm = () => {
    const obj = form.getFieldsValue()
    obj.verify = {
      verify_type: radioValue,
    }
    if (radioValue === 1) {
      obj.verify.process = normalList?.map((i: any) => i.obj)
    }
  }

  const onGetList = (text: any, row: any) => {
    const arr: any = {}
    if (row.default_type === 1) {
      if (
        row.content === 'user_name'
        || row.content === 'users_copysend_name'
        || row.content === 'users_name'
      ) {
        arr.options = fieldAll
          ?.filter((i: any) => i.value === 'users_copysend_name')[0]
          ?.field_type?.map((k: any) => ({ label: k.title, value: k.content }))
      } else if (row.content?.includes('expected_')) {
        arr.options = fieldAll
          ?.filter((i: any) => i.value === 'expected_end_at')[0]
          ?.field_type?.map((k: any) => ({ label: k.title, value: k.content }))
      } else {
        arr.options = fieldAll
          ?.filter((i: any) => i.value === text.content)[0]
          ?.field_type?.map((k: any) => ({ label: k.title, value: k.content }))
      }
    } else {
      if (
        row.content === 'user_name'
        || row.content === 'users_copysend_name'
        || row.content === 'users_name'
      ) {
        arr.options = memberList?.map((i: any) => ({
          label: i.name,
          value: i.id,
        }))
      } else if (row.content === 'priority' || row.content === 'tag') {
        arr.options = fieldAll
          ?.filter((i: any) => i.value === row.content)[0]
          ?.fixed_type.list?.map((k: any) => ({
            label: k.content,
            value: k.id,
          }))
        if (row.content === 'tag') {
          arr.mode = 'multiple'
        }
      } else {
        arr.options = fieldAll
          ?.filter((i: any) => i.value === text.content)[0]
          ?.fixed_type.list?.map((k: any) => ({
            label: k.name,
            value: k.id,
          }))
      }
    }
    return arr
  }

  const onChangeValue = (val: any, row: any) => {
    const arr = JSON.parse(JSON.stringify(dataSource))
    arr.filter((i: any) => i.content === row.content)[0].default_type = val
    setDataSource(arr)
  }

  const onChangeName = (val: any, row: any) => {
    const arr = JSON.parse(JSON.stringify(dataSource))
    arr.filter((i: any) => i.content === row.content)[0].title
      = fieldAll?.filter((k: any) => k.value === val)[0]?.label
    arr.filter((i: any) => i.content === row.content)[0].content
      = fieldAll?.filter((k: any) => k.value === val)[0]?.value
    setDataSource(arr)
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
              : <IconFont type="move" />
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
          options={fieldAll?.filter((i: any) => ({
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
      render: (text: any, record: any) => (
        <>
          {record.content === 'comment' && record.default_type === 2
            ? <Input />
            : record.content.includes('expected_')
            && record.default_type === 2
              ? <DatePicker />
              : (
                  <Select
                    style={{ width: 148 }}
                    showArrow
                    showSearch
                    value={text}
                    optionFilterProp="value"
                    {...onGetList(text, record)}
                  />
                )}
        </>
      ),
    },
    {
      title: '是否必填',
      width: 100,
      dataIndex: 'is_must',
      align: 'center',
      render: (text: any, record: any) => <Checkbox checked={record.is_must === 1} />
      ,
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
              : <span style={{ color: '#2877ff', cursor: 'pointer' }}>删除</span>
            }
          </>
        )
      },
    },
  ]

  const onRadioChange = (e: any) => {
    setRadioValue(e.target.value)
  }

  const onChangeSwitch = (checked: boolean) => {
    setIsSwitch(checked)
    setNormalList([{ id: new Date().getTime(), obj: {} }])
    form.setFieldsValue({
      is_verify: checked,
    })
  }

  const onDel = (id: any) => {
    setNormalList(normalList?.filter((i: any) => i.id !== id))
  }

  const onChangeList = (obj: any, id: any) => {
    normalList.filter((i: any) => i.id === id)[0].obj = obj
    setCheckedUser([...checkedUser, ...obj.verify_users])
  }

  const onClickAddField = () => {
    const arr = JSON.parse(JSON.stringify(dataSource))
    setDataSource(arr.slice(0, -1).concat([normalObj].concat(arr.slice(-1))))
  }

  return (
    <CommonModal
      isVisible={props?.isVisible}
      title="配置流转附加字段及权限"
      onClose={onClose}
      onConfirm={onConfirm}
      width={784}
    >
      <div style={{ maxHeight: 584, overflowY: 'auto' }}>
        <ItemWrap style={{ marginTop: 8 }}>
          <LabelWrap>当前流转</LabelWrap>
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
              style={{ width: 48, height: 1, border: '1px dashed #D5D6D9' }}
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
                  style={{ width: 186 }}
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
                  style={{ width: 186 }}
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
                  style={{ width: 186 }}
                  showSearch
                  mode="multiple"
                  optionFilterProp="label"
                  showArrow
                  getPopupContainer={node => node}
                  options={memberList?.map((i: any) => ({
                    label: i.name,
                    value: i.id,
                  }))}
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
                        info={info}
                        onDel={() => onDel(i.id)}
                        onChangeList={arr => onChangeList(arr, i.id)}
                        checkedUser={checkedUser}
                      />
                    ))}
                    <Timeline.Item>
                      <div
                        onClick={() => setNormalList([
                          ...normalList,
                          ...[{ id: new Date().getTime(), obj: {} }],
                        ])
                        }
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
              rowKey="content"
              sticky
              style={{ marginTop: 16 }}
            />
            <TextWrap>
              注：拖动图标可以调整状态顺序哦。（状态的顺序会体现在流转时状态的展现和列表排序中。）
            </TextWrap>
          </div>
        )}
      </div>
    </CommonModal>
  )
}

export default SetConfig
