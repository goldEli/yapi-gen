// 编辑迭代

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import { Form, Input, message } from 'antd'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import Editor from '@/components/Editor'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import RangePicker from '@/components/RangePicker'
import { getParamsData } from '@/tools'
import CommonModal from '@/components/CommonModal'

const FormWrap = styled(Form)({
  paddingTop: 2,
  '.anticon': {
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
        content: "'*'",
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

interface Props {
  visible: boolean
  onChangeVisible(): void
  id?: any
  onUpdate?(val: boolean): void
}

const EditIteration = (props: Props) => {
  const [t, i18n] = useTranslation()
  const [form] = Form.useForm()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const [html, setHtml] = useState('')
  const projectId = paramsData.id
  const {
    addIterate,
    updateIterate,
    getIterateInfo,
    iterateInfo,
    setIsUpdateList,
  } = useModel('iterate')
  const { setIsRefreshIterateList } = useModel('project')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (props.id) {
      getIterateInfo({ projectId, id: props.id })
    }
  }, [props.id])

  useEffect(() => {
    if (props.id && iterateInfo) {
      setHtml(iterateInfo?.info)
      form.setFieldsValue({
        iterationName: iterateInfo.name,
      })
      if (iterateInfo?.createdTime || iterateInfo?.startTime) {
        form.setFieldsValue({
          time: [
            moment(iterateInfo.createdTime || iterateInfo?.startTime || 0),
            moment(iterateInfo.endTime || 1893427200),
          ],
        })
      }
    }
  }, [iterateInfo])

  const onConfirm = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    values.info = html
    try {
      if (props?.id) {
        await updateIterate({
          projectId,
          id: props?.id,
          ...values,
        })
        message.success(t('common.editSuccess'))
      } else {
        await addIterate({
          projectId,
          ...values,
        })
        message.success(t('common.createSuccess'))
      }
      props.onChangeVisible()
      props.onUpdate?.(true)
      setIsRefreshIterateList(true)
      if (props.id) {
        getIterateInfo({ projectId, id: props.id })
      }
      setIsUpdateList(true)
      setTimeout(() => {
        form.resetFields()
      }, 100)
    } catch (error) {
      //
    }
  }

  const onCancel = () => {
    props.onChangeVisible()
    form.resetFields()
  }

  const onChangePicker = (_values: any) => {
    form.setFieldsValue({
      time: _values,
    })
  }

  useEffect(() => {
    if (props.visible) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 200)
    }
  }, [props.visible])

  return (
    <CommonModal
      isVisible={props.visible}
      width={784}
      title={props?.id ? t('project.editIterate') : t('common.createIterate')}
      onClose={onCancel}
      onConfirm={onConfirm}
    >
      <div
        style={{
          height: '60vh',
          overflow: 'auto',
          padding: '0 20px 0 2px',
        }}
      >
        <FormWrap
          layout="vertical"
          form={form}
          labelCol={{ span: i18n.language === 'zh' ? 4 : 6 }}
          initialValues={iterateInfo}
        >
          <Form.Item
            label={t('common.iterateName')}
            rules={[{ required: true, message: '' }]}
            name="iterationName"
          >
            <Input
              autoComplete="off"
              maxLength={50}
              ref={inputRef as any}
              autoFocus
              placeholder={t('mark.level')}
            />
          </Form.Item>
          <Form.Item
            label={t('project.iterateTime')}
            rules={[{ required: true, message: '' }]}
            name="time"
          >
            <RangePicker
              isShowQuick={false}
              dateValue={form.getFieldValue('time')}
              onChange={(_values: any) => onChangePicker(_values)}
            />
          </Form.Item>
          <Form.Item label={t('project.iterateTarget')}>
            <Editor value={html} onChangeValue={setHtml} />
          </Form.Item>
        </FormWrap>
      </div>
    </CommonModal>
  )
}

export default EditIteration
