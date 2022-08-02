/* eslint-disable multiline-ternary */
/* eslint-disable no-negated-condition */
/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-empty-function */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import { Modal, Form, Input, DatePicker, Select, Space, message } from 'antd'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { LevelContent } from '@/components/Level'
import PopConfirm from '@/components/Popconfirm'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import Editor from '@/components/Editor'
import { useEffect, useState } from 'react'
import { useModel } from '@/models'
import moment from 'moment'
import UploadAttach from '@/views/Project/Detail/Demand/components/UploadAttach'
import TagComponent from '@/views/Project/Detail/Demand/components/TagComponent'

const FormWrap = styled(Form)({
  height: 600,
  overflowY: 'auto',
  overflowX: 'hidden',
  '.labelIcon': {
    display: 'flex',
    alignItems: 'flex-start',
    svg: {
      fontSize: 16,
      color: '#969799',
      margin: '3px 8px 0 0',
    },
  },
  '.ant-form-item-label': {
    '> label::after': {
      display: 'none',
    },
    '> label': {
      display: 'flex',
      alignItems: 'flex-start',
    },
    '.ant-form-item-required:not(.ant-form-item-required-mark-optional)::after':
      {
        display: 'inline-block',
        color: '#ff4d4f',
        fontSize: 14,
        content: '\'*\'',
      },
    '> label::before': {
      display: 'none!important',
    },
  },
  '.ant-form-item': {
    width: '100%',
  },
  '.ant-form-item-control-input': {
    minHeight: 'inherit',
  },
})

const PriorityWrap = styled.div<{ status: any }>(
  {
    display: 'flex',
    alignItems: 'center',
    div: {
      color: '#323233',
      fontSize: 14,
      marginLeft: 8,
    },
    '.anticon': {
      fontSize: 16,
      svg: {
        margin: '0!important',
      },
    },
  },
  ({ status }) => ({
    cursor: String(status ? 'poister' : 'not-allowed'),
    pointerEvents: status ? 'auto' : 'none',
  }),
)

const ModalFooter = styled.div({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const AddButtonWrap = styled.div({
  height: 32,
  boxSizing: 'border-box',
  borderRadius: 6,
  border: '1px solid #2877FF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#2877FF',
  padding: '0 16px',
  cursor: 'pointer',
})

interface Props {
  visible: boolean
  onChangeVisible(): void
  id?: any
  isChild?: boolean
  onUpdate?(): void
  isIterateId?: any
}

const AddWrap = styled.div<{ hasColor?: boolean; hasDash?: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
    height: 26,
    boxSizing: 'border-box',
    cursor: 'pointer',
    borderRadius: 4,
    width: 'fit-content',
    '.anticon': {
      fontSize: 16,
      alignItems: 'center',
      svg: {
        margin: 0,
      },
    },
    div: {
      fontSize: 14,
      fontWeight: 400,
    },
  },
  ({ hasColor, hasDash }) => ({
    padding: hasColor || hasDash ? '0 4px' : 0,
    color: hasColor ? '#2877FF' : '#969799',
    border: hasColor
      ? '1px solid #2877FF'
      : hasDash
        ? '1px dashed #969799'
        : '1px solid white',
    '.anticon > svg': {
      color: hasColor ? '#2877FF' : '#969799',
    },
    '.anticon ': {
      marginRight: hasDash ? 0 : 4,
    },
  }),
)

const EditDemand = (props: Props) => {
  const [form] = Form.useForm()
  const [html, setHtml] = useState('')
  const [prejectId, setPrejectId] = useState<any>()
  const [prejectList, setPrejectList] = useState<any>([])
  const [tagList, setTagList] = useState<any>([])
  const [iterateList, setIterateList] = useState<any>([])
  const [peopleList, setPeopleList] = useState<any>([])
  const [attachList, setAttachList] = useState<any>([])
  const [demandList, setDemandList] = useState<any>([])
  const [priorityDetail, setPriorityDetail] = useState<any>({
    icon: 'middle',
    color: '#2F7EFD',
    content: '中',
    id: 646,
  })
  const { getDemandList } = useModel('demand')
  const { getProjectInfo } = useModel('project')

  const {
    getProjectList,
    getTagList,
    getIterateList,
    getPeopleList,
    addQuicklyCreate,
  } = useModel('mine')

  const getPrejectName = async () => {
    const res = await getProjectList({
      self: true,
      all: true,
    })
    setPrejectList(res.data)
  }

  useEffect(() => {
    getPrejectName()
  }, [])

  const getList = async () => {
    const result = await getDemandList({ projectId: prejectId, all: true })
    const arr = result.map((i: any) => ({
      label: i.name,
      value: i.id,
    }))

    const result1 = await getTagList({ projectId: prejectId })

    const arr1 = result1?.map((i: any) => ({
      label: i.content,
      value: i.id,
    }))

    const result2 = await getIterateList({ projectId: prejectId, all: true })
    const arr2 = result2?.map((i: any) => ({
      label: i.name,
      value: i.id,
    }))

    const result3 = await getPeopleList({ projectId: prejectId, all: true })
    const arr3 = result3.map((i: any) => ({
      label: i.name,
      value: i.id,
    }))

    setTagList(arr1)
    setIterateList(arr2)
    setPeopleList(arr3)
    setDemandList(arr)
  }

  useEffect(() => {
    if (prejectId) {
      getList()
    }
  }, [prejectId])

  const onSaveDemand = async (hasNext?: number) => {
    const formdata = await form.validateFields()
    if (formdata.times && formdata.times[0]) {
      formdata.expectedStart = moment(formdata.times[0]).format('YYYY-MM-DD')
    }
    if (formdata.times && formdata.times[1]) {
      formdata.expectedEnd = moment(formdata.times[1]).format('YYYY-MM-DD')
    }
    const values = JSON.parse(JSON.stringify(formdata))
    values.info = html
    const data = {
      projectId: values.projectId,
      name: values.name,
      info: values.info,
      expectedStart: values.expectedStart,
      expectedEnd: values.expectedEnd,
      iterate_id: values.iterate_id,
      parentId: values.parentId,
      priority: values.priority,
      users: values.users,
      copysend: values.copysend,
      tag: values.tag,
      attachments: values.attachments,
    }
    const res = await addQuicklyCreate(data)
    if (res.code === 0) {
      message.success('创建成功')
      if (hasNext) {
        form.resetFields()
      } else {
        props.onChangeVisible()
      }
    }
  }

  const onCurrentDetail = (item: any) => {
    setPriorityDetail(item)
    form.setFieldsValue({
      priority: item.id,
    })
  }

  const onChangeAttachment = (result: any, type: string) => {
    if (type === 'add') {
      result.path = result.url
      form.setFieldsValue({
        attachments: [
          ...form.getFieldValue('attachments') || [],
          ...[result.url],
        ],
      })
      setAttachList([...attachList, ...[result]])
    } else {
      const arr = attachList
      const comResult = arr.filter((i: any) => i.id !== result.uid)
      form.setFieldsValue({
        attachments: comResult,
      })
      setAttachList(comResult)
    }
  }

  const onCancel = () => {
    props.onChangeVisible()
    form.resetFields()
  }
  const selectPrejectName = (value: any) => {
    setPrejectId(value)
    getProjectInfo({ projectId: value })
  }
  const clearProjectId = () => {
    setPrejectId('')
    form.resetFields()
  }

  const onAdd = () => {
    message.warning('请选择项目')
  }

  return (
    <Modal
      visible={props.visible}
      width={740}
      footer={false}
      title="快速创建"
      onCancel={onCancel}
      bodyStyle={{ padding: '16px 24px' }}
      destroyOnClose
    >
      <FormWrap form={form} labelCol={{ span: 5 }}>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="apartment" />
          <Form.Item label="创建项目" required name="projectId">
            <Select
              onSelect={selectPrejectName}
              placeholder="请选择"
              allowClear
              showArrow
              onClear={clearProjectId}
            >
              {prejectList?.map((i: any) => {
                return (
                  <Select.Option key={i.id} value={i.id}>
                    {i.name}
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="apartment" />
          <Form.Item label="创建类型" required name="type">
            <Select placeholder="请选择" showArrow>
              <Select.Option value="need">需求</Select.Option>
            </Select>
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="apartment" />
          <Form.Item label="需求名称" required name="name">
            <Input placeholder="请输入需求名称" />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="edit-square" />
          <Form.Item label="需求描述" name="info">
            <Editor value={html} onChangeValue={setHtml} />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="id-card" />
          <Form.Item label="处理人" name="users">
            <Select
              mode="multiple"
              disabled={!prejectId}
              placeholder="请选择"
              showArrow
              options={peopleList}
            />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="carryout" />
          <Form.Item label="预计时间" name="times">
            <DatePicker.RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="parent_id" />
          <Form.Item label="父需求" name="parentId">
            <Select
              disabled={!prejectId}
              style={{ width: '100%' }}
              showArrow
              placeholder="请选择父需求"
              options={demandList}
            />
          </Form.Item>
        </div>
        <div
          style={{
            display: 'flex',
          }}
        >
          <IconFont className="labelIcon" type="carryout" />
          <Form.Item label="优先级" name="priority">
            <PopConfirm
              content={({ onHide }: { onHide(): void }) => {
                return (
                  <LevelContent
                    onHide={onHide}
                    record={{ project_id: prejectId }}
                    onCurrentDetail={onCurrentDetail}
                  />
                )
              }}
            >
              <PriorityWrap status={prejectId}>
                <IconFont
                  type={priorityDetail?.icon}
                  style={{
                    fontSize: 16,
                    color: priorityDetail?.color,
                  }}
                />
                <div>{priorityDetail?.content}</div>
              </PriorityWrap>
            </PopConfirm>
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="interation" />
          <Form.Item label="迭代" name="iterate_id">
            <Select
              disabled={!prejectId}
              placeholder="请选择"
              showSearch
              showArrow
              options={iterateList}
            />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="id-card" />
          <Form.Item label="抄送人" name="copysend">
            <Select
              mode="multiple"
              disabled={!prejectId}
              placeholder="请选择"
              showSearch
              showArrow
              options={peopleList}
            />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="app-store-add" />
          <Form.Item label="标签" name="tag">
            <TagComponent
              addWrap={
                <AddWrap hasDash>
                  <IconFont type="plus" />
                </AddWrap>
              }
            />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="attachment" />
          <Form.Item label="附件" name="attachments">
            {!prejectId ? (
              <AddWrap onClick={onAdd}>
                <IconFont type="plus" />
                <div>添加</div>
              </AddWrap>
            ) : (
              <UploadAttach
                defaultList={attachList}
                onChangeAttachment={onChangeAttachment}
                addWrap={
                  <AddWrap>
                    <IconFont type="plus" />
                    <div>添加</div>
                  </AddWrap>
                }
              />
            )}
          </Form.Item>
        </div>
      </FormWrap>
      <ModalFooter>
        <AddButtonWrap onClick={() => onSaveDemand(1)}>
          完成并创建下一个
        </AddButtonWrap>
        <Space size={16}>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={() => onSaveDemand()}>
            确认
          </Button>
        </Space>
      </ModalFooter>
    </Modal>
  )
}

export default EditDemand
