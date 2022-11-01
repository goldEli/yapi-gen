/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable complexity */
import styled from '@emotion/styled'
import { Form, Input, message, Select } from 'antd'
import { useRef, useState, useEffect, useImperativeHandle } from 'react'
import {
  AddWrap,
  FormWrapDemand,
  ProgressWrapUpload,
} from '@/components/StyleCommon'
import { useTranslation } from 'react-i18next'
import Editor from '@/components/Editor'
import UploadAttach from '@/views/Project/Detail/Demand/components/UploadAttach'
import TagComponent from '@/views/Project/Detail/Demand/components/TagComponent'
import IconFont from '@/components/IconFont'
import { useModel } from '@/models'

const LeftWrap = styled.div({
  height: '100%',
  overflow: 'auto',
  width: 'calc(100% - 410px)',
})

interface ChildrenProps {
  uploadStatus: any
  percentVal: any
  percentShow: any
}

const Children = (props: ChildrenProps) => {
  return (
    <ProgressWrapUpload
      status={props.uploadStatus}
      percent={props.percentVal}
      size="small"
      style={{ display: props.percentShow ? 'block' : 'none' }}
    />
  )
}
interface Props {
  isQuickCreate: any
  projectId: any
  projectList: any
  demandInfo: any
  onRefLeft: any
  onChangeProject(type: any, value?: any): void
}

const EditLeft = (props: Props) => {
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const { projectInfo } = useModel('project')
  const { percentShow, percentVal, uploadStatus } = useModel('demand')
  const leftDom = useRef<HTMLInputElement>(null)
  const inputRefDom = useRef<HTMLInputElement>(null)
  const [isShow, setIsShow] = useState(false)
  const [attachList, setAttachList] = useState<any>([])
  const [tagList, setTagList] = useState<any>([])
  const [html, setHtml] = useState('')

  const onAdd = () => {
    message.warning(t('common.pleaseProject'))
  }

  const onBottom = () => {
    const dom: any = leftDom?.current
    dom.scrollTop = dom.scrollHeight
  }

  const onChangeAttachment = (result: any, type: string) => {
    if (type === 'add') {
      result.path = result.url
      form.setFieldsValue({
        attachments: [
          ...(form.getFieldValue('attachments') || []),
          ...[result.url],
        ],
      })
      setAttachList([...attachList, ...[result]])
    } else {
      const arr = attachList
      const comResult = arr.filter((i: any) => i.id !== result.uid)
      form.setFieldsValue({
        attachments: comResult.map((i: any) => i.path),
      })
      setAttachList(comResult)
    }
  }

  const onChangeTag = (result: any, type: string) => {
    if (type === 'add') {
      form.setFieldsValue({
        tagIds: [...(form.getFieldValue('tagIds') || []), ...[result]],
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

  const onReset = () => {
    setTimeout(() => {
      form.resetFields()
    }, 100)
    setAttachList([])
    setTagList([])
    setHtml('')
  }

  const onConfirm = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    return values
  }

  const onCleared = () => {
    if (props.isQuickCreate) {
      form.resetFields()
      form.setFieldsValue({
        projectId: props.projectId,
        type: 'need',
      })
    }
    setTimeout(() => {
      inputRefDom.current?.focus()
    }, 150)
  }

  useEffect(() => {
    if (props.demandInfo) {
      form.setFieldsValue(props.demandInfo)
      setHtml(props.demandInfo?.info)
      setAttachList(
        props.demandInfo?.attachment.map((i: any) => ({
          path: i.attachment.path,
          id: i.id,
        })),
      )
      setTagList(
        props.demandInfo?.tag?.map((i: any) => ({
          id: i.id,
          color: i.tag?.color,
          name: i.tag?.content,
        })),
      )
    } else {
      form.resetFields()
    }
    setTimeout(() => {
      inputRefDom.current?.focus()
    }, 100)
  }, [props.demandInfo])

  useImperativeHandle(props.onRefLeft, () => {
    return {
      reset: onReset,
      confirm: onConfirm,
      cleared: onCleared,
    }
  })

  return (
    <LeftWrap ref={leftDom}>
      <FormWrapDemand layout="vertical" form={form}>
        {props?.isQuickCreate && (
          <div style={{ display: 'flex' }}>
            <Form.Item
              label={
                <div style={{ fontWeight: 'bold' }}>
                  {t('common.createProject')}
                </div>
              }
              name="projectId"
              style={{ marginRight: 24 }}
              rules={[{ required: true, message: '' }]}
            >
              <Select
                onSelect={(value: any) => props.onChangeProject(1, value)}
                placeholder={t('common.searchProject')}
                allowClear
                showArrow
                onClear={() => props.onChangeProject(2)}
                optionFilterProp="label"
                getPopupContainer={node => node}
                showSearch
                options={props.projectList?.map((k: any) => ({
                  label: k.name,
                  value: k.id,
                }))}
              />
            </Form.Item>
            <Form.Item
              label={
                <div style={{ fontWeight: 'bold' }}>{t('mine.createType')}</div>
              }
              name="type"
              rules={[{ required: true, message: '' }]}
            >
              <Select
                placeholder={t('common.selectType')}
                showArrow
                optionFilterProp="label"
                getPopupContainer={node => node}
              >
                <Select.Option value="need">{t('common.demand')}</Select.Option>
              </Select>
            </Form.Item>
          </div>
        )}
        <Form.Item
          label={
            <div style={{ fontWeight: 'bold' }}>{t('common.demandName')}</div>
          }
          name="name"
          rules={[{ required: true, message: '' }]}
        >
          <Input
            autoComplete="off"
            ref={inputRefDom as any}
            placeholder={t('common.pleaseDemandName')}
            maxLength={100}
            autoFocus
          />
        </Form.Item>
        <Form.Item
          label={
            <div style={{ fontWeight: 'bold' }}>{t('mine.demandInfo')}</div>
          }
          name="info"
        >
          <Editor height={360} />
        </Form.Item>
        {props.projectId && (
          <Form.Item
            label={<div style={{ fontWeight: 'bold' }}>{t('common.tag')}</div>}
            name="tagIds"
          >
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
        )}
        {props.projectId && (
          <Form.Item
            label={
              <div style={{ fontWeight: 'bold' }}>{t('common.attachment')}</div>
            }
            name="attachments"
          >
            {projectInfo?.projectPermissions?.filter(
              (i: any) => i.name === '附件上传',
            ).length ? (
              <UploadAttach
                child={
                  isShow ? (
                    <Children
                      percentShow={percentShow}
                      uploadStatus={uploadStatus}
                      percentVal={percentVal}
                    />
                  ) : (
                    ''
                  )
                }
                onChangeShow={setIsShow}
                defaultList={attachList}
                onChangeAttachment={onChangeAttachment}
                onBottom={onBottom}
                addWrap={
                  <AddWrap hasColor>
                    <IconFont type="plus" />
                    <div>{t('common.add23')}</div>
                  </AddWrap>
                }
              />
            ) : (
              <AddWrap onClick={onAdd} hasColor>
                <IconFont type="plus" />
                <div>{t('common.add23')}</div>
              </AddWrap>
            )}
          </Form.Item>
        )}
      </FormWrapDemand>
    </LeftWrap>
  )
}

export default EditLeft
