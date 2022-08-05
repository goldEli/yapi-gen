/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Form, Input, Select, Space, message } from 'antd'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import PosterComponent from './PosterComponent'
import styled from '@emotion/styled'
import { useModel } from '@/models'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const Footer = styled(Space)({
  height: 56,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
})

interface Props {
  visible: boolean
  onChangeVisible(): void
  details?: any
  onUpdate?(): void
}

const EditProject = (props: Props) => {
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const { addProject, updateProject } = useModel('project')

  const onConfirm = async () => {
    await form.validateFields()
    try {
      if (props.details?.id) {
        const data = form.getFieldsValue()
        data.id = props.details?.id
        await updateProject(data)
        message.success(t('common.editSuccess'))
      } else {
        if (!form.getFieldValue('isPublic')) {
          form.setFieldsValue({
            isPublic: 2,
          })
        }
        await addProject(form.getFieldsValue())
        message.success(t('common.createSuccess'))
      }
      props.onChangeVisible()
      props.onUpdate?.()
    } catch (error) {

      //
    }
  }

  const onChangePoster = (value: string) => {
    form.setFieldsValue({
      cover: value,
    })
  }

  useEffect(() => {
    if (props.details?.id) {
      form.setFieldsValue(props?.details)
    } else {
      form.resetFields()
    }
  }, [props.details])

  return (
    <Modal
      width={420}
      title={
        props.details?.id ? t('project.editProject') : t('common.createProject')
      }
      visible={props.visible}
      footer={false}
      onCancel={props.onChangeVisible}
      bodyStyle={{ padding: '16px 24px 0' }}
      destroyOnClose
      maskClosable={false}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="项目封面"
          rules={[{ required: true, message: '' }]}
          name="cover"
        >
          <PosterComponent
            value={props.details?.id ? props.details?.cover : ''}
            onChangeValue={cover => onChangePoster(cover)}
          />
        </Form.Item>
        <Form.Item
          label={t('common.projectName')}
          rules={[{ required: true, message: '' }]}
          name="name"
        >
          <Input maxLength={30} placeholder="请输入项目名称" />
        </Form.Item>
        <Form.Item
          label="项目描述"
          name="info"
          rules={[{ required: true, message: '' }]}
        >
          <Input.TextArea
            maxLength={500}
            placeholder="请输入项目描述"
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </Form.Item>
        <Form.Item label="公开/私有" name="isPublic">
          <Select placeholder="请选择" defaultValue={[2]}>
            <Select.Option value={2}>私有项目</Select.Option>
            <Select.Option value={1}>企业公开</Select.Option>
          </Select>
        </Form.Item>
      </Form>
      <Footer size={16}>
        <Button onClick={props.onChangeVisible}>{t('common.cancel')}</Button>
        <Button type="primary" onClick={onConfirm}>
          确认
        </Button>
      </Footer>
    </Modal>
  )
}

export default EditProject
