/* eslint-disable complexity */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import { Modal, Form, Input, DatePicker, Space, message } from 'antd'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import Editor from '@/components/Editor'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import moment from 'moment'

const FormWrap = styled(Form)({
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

const ModalFooter = styled(Space)({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
})

interface Props {
  visible: boolean
  onChangeVisible(): void
  id?: any
  onUpdate?(val: boolean): void
}

const EditIteration = (props: Props) => {
  const [form] = Form.useForm()
  const [searchParams] = useSearchParams()
  const [html, setHtml] = useState('')
  const projectId = searchParams.get('id')
  const { addIterate, updateIterate, getIterateInfo, iterateInfo }
    = useModel('iterate')

  useEffect(() => {
    if (props.id) {
      getIterateInfo({ projectId, id: props.id })
    }
  }, [props.id])

  useEffect(() => {
    if (props.id && iterateInfo) {
      setHtml(iterateInfo?.info)
      form.setFieldsValue({ iterationName: iterateInfo.name })
      if (iterateInfo?.createdTime || iterateInfo?.startTime) {
        form.setFieldsValue({
          time: [
            moment(iterateInfo.createdTime || iterateInfo?.startTime),
            moment(iterateInfo.endTime),
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
        message.success('编辑成功')
      } else {
        await addIterate({
          projectId,
          ...values,
        })
        message.success('创建成功')
      }
      props.onChangeVisible()
      props.onUpdate?.(true)
      setHtml('')

      // form.resetFields()
    } catch (error) {

      //
    }
  }

  const onCancel = () => {
    props.onChangeVisible()
    form.resetFields()
    setHtml('')
  }

  return (
    <Modal
      visible={props.visible}
      width={740}
      footer={false}
      title={props?.id ? '编辑迭代' : '创建迭代'}
      onCancel={onCancel}
      bodyStyle={{ padding: '16px 24px' }}
      destroyOnClose
      maskClosable={false}
    >
      <FormWrap form={form} labelCol={{ span: 3 }} initialValues={iterateInfo}>
        <div style={{ display: 'flex' }}>
          <IconFont type="interation" />
          <Form.Item
            label="迭代名称"
            rules={[{ required: true, message: '' }]}
            name="iterationName"
          >
            <Input
              maxLength={100}
              placeholder="请输入产品简称+计划发布版本号"
            />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont type="carryout" />
          <Form.Item
            label="迭代时间"
            rules={[{ required: true, message: '' }]}
            name="time"
          >
            <DatePicker.RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont type="detail" />
          <Form.Item label="迭代目标">
            <Editor value={html} onChangeValue={setHtml} />
          </Form.Item>
        </div>
      </FormWrap>
      <ModalFooter size={16}>
        <Button onClick={onCancel}>取消</Button>
        <Button type="primary" onClick={onConfirm}>
          确认
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default EditIteration
