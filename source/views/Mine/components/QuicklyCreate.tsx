/* eslint-disable max-lines */
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
import { useTranslation } from 'react-i18next'
import RangePicker from '@/components/RangePicker'

const FormWrap = styled(Form)({
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

const PriorityWrap = styled.div<{ status: any }>({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  height: 26,
  padding: '0 6px',
  width: 'fit-content',
  borderRadius: 6,
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
    background: 'rgba(240, 244, 250, 1)',
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
  const [t, i18n] = useTranslation()
  const [form] = Form.useForm()
  const [html, setHtml] = useState('')
  const [prejectId, setPrejectId] = useState<any>()
  const [prejectList, setPrejectList] = useState<any>([])
  const [tagList, setTagList] = useState<any>([])
  const [iterateList, setIterateList] = useState<any>([])
  const [peopleList, setPeopleList] = useState<any>([])
  const [attachList, setAttachList] = useState<any>([])
  const [demandList, setDemandList] = useState<any>([])
  const [priorityDetail, setPriorityDetail] = useState<any>()
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
      self: 1,
      all: 1,
    })
    setPrejectList(res.data)
  }

  useEffect(() => {
    getPrejectName()
  }, [])

  const getList = async () => {
    const result = await getDemandList({ projectId: prejectId, all: 1 })
    const arr = result.map((i: any) => ({
      label: i.name,
      value: i.id,
    }))

    const result1 = await getTagList({ projectId: prejectId })

    const arr1 = result1?.map((i: any) => ({
      id: i.id,
      color: i.tag?.color,
      name: i.tag?.content,
    }))

    const result2 = await getIterateList({ projectId: prejectId, all: 1 })
    const arr2 = result2?.map((i: any) => ({
      label: i.name,
      value: i.id,
    }))

    const result3 = await getPeopleList({ projectId: prejectId, all: 1 })
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
    await form.validateFields()
    const formdata = form.getFieldsValue()

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
      message.success(t('common.createSuccess'))
      setAttachList([])
      setTagList([])
      setPriorityDetail({})

      if (!hasNext) {
        props.onChangeVisible()
      } else {
        form.resetFields()
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
        attachments: comResult.map((i: any) => i.url),
      })
      setAttachList(comResult)
    }
  }

  const onChangeTag = (result: any, type: string) => {
    if (type === 'add') {
      form.setFieldsValue({
        tag: [...form.getFieldValue('tag') || [], ...[result]],
      })
      setTagList([...tagList, ...[result]])
    } else {
      const arr = tagList
      const comResult = arr.filter(
        (i: any) => !(i.name === result.content && i.color === result.color),
      )
      form.setFieldsValue({
        tag: comResult,
      })
      setTagList(comResult)
    }
  }

  const onCancel = () => {
    props.onChangeVisible()
    form.resetFields()
    setAttachList([])
    setTagList([])
    setHtml('')
    setPriorityDetail({})
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
    message.warning(t('common.pleaseProject'))
  }

  const onChangePicker = (_values: any) => {
    form.setFieldsValue({
      times: _values,
    })
  }

  return (
    <Modal
      visible={props.visible}
      width={524}
      footer={false}
      title={t('mine.quickCreate')}
      onCancel={onCancel}
      bodyStyle={{ padding: '16px 24px' }}
      destroyOnClose
      maskClosable={false}
    >
      <FormWrap form={form} labelCol={{ span: i18n.language === 'zh' ? 4 : 6 }}>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="apartment" />
          <Form.Item
            label={t('common.chooseProject')}
            rules={[{ required: true, message: '' }]}
            name="projectId"
          >
            <Select
              onSelect={selectPrejectName}
              placeholder={t('common.searchProject')}
              allowClear
              showArrow
              onClear={clearProjectId}
              optionFilterProp="label"
              showSearch
              options={prejectList?.map((k: any) => ({
                label: k.name,
                value: k.id,
              }))}
            />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="apartment" />
          <Form.Item
            label={t('common.chooseType')}
            rules={[{ required: true, message: '' }]}
            required
            name="type"
          >
            <Select
              placeholder={t('common.selectType')}
              showArrow
              optionFilterProp="label"
            >
              <Select.Option value="need">{t('common.demand')}</Select.Option>
            </Select>
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="apartment" />
          <Form.Item
            rules={[{ required: true, message: '' }]}
            label={t('common.demandName')}
            required
            name="name"
          >
            <Input placeholder={t('common.pleaseDemandName')} />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="edit-square" />
          <Form.Item label={t('mine.demandInfo')} name="info">
            <Editor value={html} onChangeValue={setHtml} />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="id-card" />
          <Form.Item label={t('common.dealName')} name="users">
            <Select
              mode="multiple"
              placeholder={t('common.searchDeal')}
              allowClear
              disabled={!prejectId}
              options={peopleList}
              optionFilterProp="label"
              showSearch
            />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="carryout" />
          <Form.Item label={t('common.estimatedTime')} name="times">
            <RangePicker onChange={(_values: any) => onChangePicker(_values)} />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="apartment" />
          <Form.Item label={t('common.parentDemand')} name="parentId">
            <Select
              disabled={!prejectId}
              style={{ width: '100%' }}
              showArrow
              placeholder={t('common.pleaseParentDemand')}
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
          <Form.Item label={t('common.priority')} name="priority">
            {prejectId ? (
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
            )
              : '--'
            }
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="interation" />
          <Form.Item label={t('common.iterate')} name="iterate_id">
            <Select
              disabled={!prejectId}
              placeholder={t('common.pleaseSelect')}
              showSearch
              showArrow
              options={iterateList}
            />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="id-card" />
          <Form.Item label={t('common.copySend')} name="copysend">
            <Select
              mode="multiple"
              disabled={!prejectId}
              placeholder={t('common.pleaseSelect')}
              showSearch
              showArrow
              options={peopleList}
            />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="app-store-add" />
          <Form.Item label={t('common.tag')} name="tag">
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
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="attachment" />
          <Form.Item label={t('common.attachment')} name="attachments">
            {!prejectId ? (
              <AddWrap onClick={onAdd}>
                <IconFont type="plus" />
                <div>{t('common.add23')}</div>
              </AddWrap>
            ) : (
              <UploadAttach
                defaultList={attachList}
                onChangeAttachment={onChangeAttachment}
                addWrap={
                  <AddWrap>
                    <IconFont type="plus" />
                    <div>{t('common.add23')}</div>
                  </AddWrap>
                }
              />
            )}
          </Form.Item>
        </div>
      </FormWrap>
      <ModalFooter>
        <AddButtonWrap onClick={() => onSaveDemand(1)}>
          {t('common.finishCreate')}
        </AddButtonWrap>
        <Space size={16}>
          <Button onClick={onCancel}>{t('common.cancel')}</Button>
          <Button type="primary" onClick={() => onSaveDemand()}>
            {t('common.confirm2')}
          </Button>
        </Space>
      </ModalFooter>
    </Modal>
  )
  // eslint-disable-next-line max-lines
}

export default EditDemand
