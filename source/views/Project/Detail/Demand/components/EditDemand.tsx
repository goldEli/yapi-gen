/* eslint-disable @typescript-eslint/indent */
/* eslint-disable multiline-ternary */
/* eslint-disable no-negated-condition */
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
import { useTranslation } from 'react-i18next'

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
  const [t] = useTranslation()
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
  const inputRef = useRef<InputRef>(null)
  const [parentList, setParentList] = useState<any>([])

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
    setParentList(
      props.isChild
        ? demandList?.filter((k: any) => k.value !== props?.id)
        : demandList,
    )
  }, [props.isChild])

  const getCommonUser = (arr: any) => {
    let res: any[] = []
    if (arr.length) {
      res = memberList?.filter((i: any) => !arr.find((k: any) => k.id !== i.id))
    }
    return res.length ? res.map((i: any) => i.id) : []
  }

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
      setTagList(
        demandInfo?.tag?.map((i: any) => ({
          id: i.id,
          color: i.tag?.color,
          name: i.tag?.content,
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

      const parentArr = props.isChild
        ? demandList?.filter((k: any) => k.value !== props?.id)
        : demandList

      form.setFieldsValue({
        copySendIds: getCommonUser(
          demandInfo?.copySend?.map((i: any) => i.copysend),
        ),
        attachments: demandInfo?.attachment.map((i: any) => i.attachment.path),
        userIds: getCommonUser(demandInfo?.user?.map((i: any) => i.user)),
      })
      if (
        selectIterate?.list?.filter((i: any) => i.id === demandInfo?.iterateId)
          .length
      ) {
        form.setFieldsValue({
          iterateId: demandInfo?.iterateId,
        })
      }
      if (
        parentArr?.filter((i: any) => i.value === demandInfo?.parentId).length
      ) {
        form.setFieldsValue({
          parentId: demandInfo?.parentId,
        })
      }
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

    if (values.priority?.id) {
      values.priority = values.priority?.id
    }

    try {
      if (props.id) {
        await updateDemand({
          projectId,
          id: demandInfo.id,
          ...values,
        })
        message.success(t('common.editSuccess'))
      } else {
        await addDemand({
          projectId,
          ...values,
        })
        message.success(t('common.createSuccess'))
      }
      setAttachList([])
      setTagList([])
      setHtml('')
      setPriorityDetail({})
      props.onUpdate?.()
      if (!hasNext) {
        props.onChangeVisible()
      } else {
        form.resetFields()
      }
    } catch (error) {

      //
    }
  }

  const titleText = () => {
    if (props?.id) {
      return props.isChild
        ? t('project.editChildDemand')
        : t('project.editDemand')
    }
    return props.isChild
      ? t('common.createChildDemand')
      : t('common.createDemand')
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
    setAttachList([])
    setTagList([])
    setHtml('')
    setPriorityDetail({})
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

  const onAdd = () => {
    message.warning(t('common.pleaseProject'))
  }

  return (
    <Modal
      visible={props.visible}
      width={740}
      footer={false}
      title={titleText()}
      onCancel={onCancel}
      bodyStyle={{ padding: '16px 24px', position: 'relative' }}
      destroyOnClose
      maskClosable={false}
    >
      <FormWrap form={form} labelCol={{ span: 3 }}>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="apartment" />
          <Form.Item
            label={t('common.demandName')}
            name="name"
            rules={[{ required: true, message: '' }]}
          >
            <Input
              ref={inputRef}
              placeholder={t('common.pleaseDemandName')}
              maxLength={100}
            />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="edit-square" />
          <Form.Item label={t('mine.demandInfo')} name="info">
            <Editor value={html} onChangeValue={setHtml} />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="user" />
          <Form.Item label={t('common.dealName')} name="userIds">
            <Select
              style={{ width: '100%' }}
              showArrow
              mode="multiple"
              showSearch
              placeholder={t('common.pleaseChooseDeal')}
              getPopupContainer={node => node}
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
          <IconFont className="labelIcon" type="carryout" />
          <Form.Item label={t('common.estimatedTime')} name="times">
            <DatePicker.RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="apartment" />
          <Form.Item label={t('common.parentDemand')} name="parentId">
            <Select
              style={{ width: '100%' }}
              showArrow
              showSearch
              placeholder={t('common.pleaseParentDemand')}
              options={parentList}
              getPopupContainer={node => node}
              optionFilterProp="label"
            />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="carryout" />
          <Form.Item label={t('common.priority')} name="priority">
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
          <Form.Item label={t('common.iterate')} name="iterateId">
            <Select
              placeholder={t('common.pleaseSelect')}
              showSearch
              showArrow
              getPopupContainer={node => node}
            >
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
          <Form.Item label={t('common.copySend')} name="copySendIds">
            <Select
              style={{ width: '100%' }}
              showArrow
              mode="multiple"
              showSearch
              placeholder={t('common.pleaseChooseCopySend')}
              getPopupContainer={node => node}
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
          <Form.Item label={t('common.tag')} name="tagIds">
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
            {!projectInfo?.projectPermissions?.filter(
              (i: any) => i.name === '附件上传',
            ).length ? (
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
        <AddButtonWrap isEdit={props?.id} onClick={() => onSaveDemand(1)}>
          {t('common.finishToAdd')}
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
}

export default EditDemand
