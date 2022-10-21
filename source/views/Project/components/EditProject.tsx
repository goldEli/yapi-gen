/* eslint-disable require-unicode-regexp */
/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Form, Input, Select, Space, message } from 'antd'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import PosterComponent from './PosterComponent'
import styled from '@emotion/styled'
import { useModel } from '@/models'
import { useEffect, useRef } from 'react'
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
  const inputRefDom = useRef<HTMLInputElement>(null)

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
      cover: value[0],
    })
  }

  useEffect(() => {
    if (props.details?.id) {
      form.setFieldsValue(props?.details)
    } else {
      form.resetFields()
    }
    setTimeout(() => {
      inputRefDom.current?.focus()
    }, 100)
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
      keyboard={false}
      wrapClassName="vertical-center-modal"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label={t('project.projectPoster')}
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
          rules={[
            { required: true, message: '' },
            {
              // eslint-disable-next-line prefer-regex-literals
              pattern: new RegExp(
                /^[\u4e00-\u9fa5_a-zA-Z0-9_(_（_)_）_,_，_:_：_—_\-_/_\n]+$/,
                'g',
              ),
              message: t('mark.waring'),
            },
          ]}
          name="name"
        >
          <Input
            allowClear
            ref={inputRefDom as any}
            autoComplete="off"
            maxLength={30}
            placeholder={t('common.pleaseProjectName')}
            autoFocus
          />
        </Form.Item>
        <Form.Item
          label={t('project.projectInfo')}
          name="info"
          rules={[{ required: true, message: '' }]}
        >
          <Input.TextArea
            maxLength={500}
            showCount
            placeholder={t('project.pleaseProjectInfo')}
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </Form.Item>
        <Form.Item label={t('project.isPublic')} name="isPublic">
          <Select placeholder={t('project.pleaseSelect')} defaultValue={[2]}>
            <Select.Option value={2}>
              {t('common.privateProject')}
            </Select.Option>
            <Select.Option value={1}>{t('project.companyOpen')}</Select.Option>
          </Select>
        </Form.Item>
      </Form>
      <Footer size={16}>
        <Button onClick={props.onChangeVisible}>{t('common.cancel')}</Button>
        <Button type="primary" onClick={onConfirm}>
          {t('common.confirm')}
        </Button>
      </Footer>
    </Modal>
  )
}

export default EditProject
