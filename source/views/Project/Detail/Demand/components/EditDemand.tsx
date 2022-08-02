/* eslint-disable max-lines */
/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-empty-function */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Space,
  message,
  type InputRef,
} from 'antd'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { LevelContent } from '@/components/Level'
import PopConfirm from '@/components/Popconfirm'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import TagComponent from './TagComponent'
import UploadAttach from './UploadAttach'
import Editor from '@/components/Editor'
import { useEffect, useRef, useState } from 'react'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import moment from 'moment'

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

const PriorityWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  div: {
    color: '#323233',
    fontSize: 14,
    marginLeft: 8,
  },
  '.icon': {
    marginLeft: 8,
    visibility: 'hidden',
    fontSize: 16,
    color: '#2877ff',
  },
  '.priorityIcon': {
    fontSize: 16,
    svg: {
      margin: '0!important',
    },
  },
  '&: hover': {
    '.icon': {
      visibility: 'visible',
    },
  },
})

const ModalFooter = styled.div({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const AddButtonWrap = styled.div<{ isEdit?: boolean }>(
  {
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
  },
  ({ isEdit }) => ({
    visibility: isEdit ? 'hidden' : 'visible',
  }),
)

interface Props {
  visible: boolean
  onChangeVisible(): void
  id?: any
  isChild?: boolean
  onUpdate?(): void
  isIterateId?: any
  preId?: any
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
  const [attachList, setAttachList] = useState<any>([])
  const [tagList, setTagList] = useState<any>([])
  const [demandList, setDemandList] = useState<any>([])
  const [demandInfo, setDemandInfo] = useState<any>()
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id') || props.preId
  const demandId = searchParams.get('demandId')
  const { memberList, projectInfo } = useModel('project')
  const [priorityDetail, setPriorityDetail] = useState<any>({})
  const { addDemand, getDemandInfo, updateDemand, getDemandList }
    = useModel('demand')
  const { selectIterate } = useModel('iterate')
  const { userInfo } = useModel('user')
  const inputRef = useRef<InputRef>(null)

  const getList = async () => {
    const result = await getDemandList({ projectId, all: true })
    const arr = result.map((i: any) => ({
      label: i.name,
      value: i.id,
    }))
    setDemandList(arr)
  }

  useEffect(() => {
    getList()
  }, [])

  // useEffect(() => {
  //   if (props.visible && inputRef) {
  //     inputRef.current?.focus({
  //       cursor: 'end',
  //     })
  //   }
  // }, [props.visible, inputRef])

  useEffect(() => {
    if (props?.id) {
      getDemandInfo({ projectId, id: props?.id }).then(res => {
        setDemandInfo(res)
      })
    } else {
      form.resetFields()
    }
    getList()
  }, [props.id])

  useEffect(() => {
    if (demandInfo && props?.id) {
      form.setFieldsValue(demandInfo)
      setPriorityDetail(demandInfo.priority)
      setHtml(demandInfo.info)
      setAttachList(
        demandInfo?.attachment.map((i: any) => ({
          path: i.attachment.path,
          id: i.id,
        })),
      )
      if (demandInfo?.expectedStart) {
        form.setFieldsValue({
          times: [
            moment(demandInfo.expectedStart),
            moment(demandInfo.expectedEnd),
          ],
        })
      }
      form.setFieldsValue({
        copySendIds: demandInfo?.copySend?.map((i: any) => i.copysend.id),
        attachments: demandInfo?.attachment.map((i: any) => i.attachment.path),
        userIds: demandInfo?.user?.map((i: any) => i.user.id),
      })
    } else {
      form.resetFields()
    }
  }, [demandInfo])

  const onSaveDemand = async (hasNext?: number) => {
    await form.validateFields()
    const values = form.getFieldsValue()
    if (values.times && values.times[0]) {
      values.expectedStart = moment(values.times[0]).format('YYYY-MM-DD')
    }
    if (values.times && values.times[1]) {
      values.expectedEnd = moment(values.times[1]).format('YYYY-MM-DD')
    }

    values.info = html

    if (props.isChild) {
      values.parentId = demandId || demandInfo?.id
    }

    if (props.isIterateId) {
      values.iterateId = props.isIterateId
    }

    try {
      if (props.id) {
        await updateDemand({
          projectId,
          id: demandInfo.id,
          ...values,
        })
        message.success('编辑成功')
      } else {
        await addDemand({
          projectId,
          ...values,
        })
        message.success('创建成功')
      }
      form.resetFields()
      setAttachList([])
      setHtml('')
      props.onUpdate?.()
      if (!hasNext) {
        props.onChangeVisible()
      }
    } catch (error) {

      //
    }
  }

  const titleText = () => {
    if (props?.id) {
      return props.isChild ? '编辑子需求' : '编辑需求'
    }
    return props.isChild ? '创建子需求' : '创建需求'
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

  const onChangeTag = (result: any, type: string) => {
    if (type === 'add') {
      form.setFieldsValue({
        tagIds: [...form.getFieldValue('tagIds') || [], ...[result]],
      })
      setTagList([...tagList, ...[result]])
    } else {
      const arr = tagList
      const comResult = arr.filter(
        (i: any) => !(i.name === result.content && i.color === result.color),
      )
      form.setFieldsValue({
        tagIds: comResult,
      })
      setTagList(comResult)
    }
  }

  return (
    <Modal
      visible={props.visible}
      width={740}
      footer={false}
      title={titleText()}
      onCancel={onCancel}
      bodyStyle={{ padding: '16px 24px' }}
      destroyOnClose
    >
      <FormWrap form={form} labelCol={{ span: 5 }}>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="apartment" />
          <Form.Item
            label="需求名称"
            name="name"
            rules={[{ required: true, message: '' }]}
          >
            <Input
              ref={inputRef}
              placeholder="请输入需求名称"
              maxLength={100}
            />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="edit-square" />
          <Form.Item label="需求描述" name="info">
            <Editor value={html} onChangeValue={setHtml} />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="user" />
          <Form.Item label="处理人" name="userIds">
            <Select
              style={{ width: '100%' }}
              showArrow
              mode="multiple"
              showSearch
              placeholder="请选择处理人"
            >
              {memberList
                ?.filter((k: any) => k.name !== userInfo?.name)
                ?.map((i: any) => {
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
          <IconFont className="labelIcon" type="carryout" />
          <Form.Item label="预计时间" name="times">
            <DatePicker.RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="apartment" />
          <Form.Item label="父需求" name="parentId">
            <Select
              style={{ width: '100%' }}
              showArrow
              showSearch
              placeholder="请选择父需求"
              options={demandList}
            />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="carryout" />
          <Form.Item label="优先级" name="priority">
            <PopConfirm
              content={({ onHide }: { onHide(): void }) => {
                return (
                  <LevelContent
                    onHide={onHide}
                    record={{ project_id: projectId }}
                    onCurrentDetail={onCurrentDetail}
                  />
                )
              }}
            >
              <PriorityWrap>
                <IconFont
                  className="priorityIcon"
                  type={priorityDetail?.icon}
                  style={{
                    fontSize: 16,
                    color: priorityDetail?.color,
                  }}
                />
                <div>
                  <span>{priorityDetail?.content || '--'}</span>
                  <IconFont className="icon" type="down-icon" />
                </div>
              </PriorityWrap>
            </PopConfirm>
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="interation" />
          <Form.Item label="迭代" name="iterateId">
            <Select placeholder="请选择" showSearch showArrow>
              {selectIterate?.list
                ?.filter((k: any) => k.status === 1)
                ?.map((i: any) => {
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
          <IconFont className="labelIcon" type="id-card" />
          <Form.Item label="抄送人" name="copySendIds">
            <Select
              style={{ width: '100%' }}
              showArrow
              mode="multiple"
              showSearch
              placeholder="请选择抄送人"
            >
              {memberList?.map((i: any) => {
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
          <IconFont className="labelIcon" type="app-store-add" />
          <Form.Item label="标签" name="tagIds">
            <TagComponent
              defaultList={tagList}
              onChangeTag={onChangeTag}
              addWrap={
                <AddWrap hasDash>
                  <IconFont type="plus" />
                </AddWrap>
              }
            />
          </Form.Item>
        </div>
        <div
          style={{ display: 'flex' }}
          hidden={
            !projectInfo?.projectPermissions?.filter(
              (i: any) => i.name === '附件上传',
            ).length
          }
        >
          <IconFont className="labelIcon" type="attachment" />
          <Form.Item label="附件" name="attachments">
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
          </Form.Item>
        </div>
      </FormWrap>
      <ModalFooter>
        <AddButtonWrap isEdit={props?.id} onClick={() => onSaveDemand(1)}>
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
