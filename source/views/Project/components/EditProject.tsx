import { Modal, Form, Input, Select, Space, message } from 'antd'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import PosterComponent from './PosterComponent'
import styled from '@emotion/styled'
import { useModel } from '@/models'

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
}

const EditProject = (props: Props) => {
  const [form] = Form.useForm()
  const { addProject, updateProject } = useModel('project')

  const onConfirm = async () => {
    try {
      if (props.details) {
        const data = form.getFieldsValue()
        data.id = props.details.id
        await updateProject(data)
        message.success('编辑成功')
      } else {
        await addProject(form.getFieldsValue())
        message.success('创建成功')
      }
      form.resetFields()
      props.onChangeVisible()
    } catch (error) {

      //
    }
  }

  const onChangePoster = (value: string) => {
    form.setFieldsValue({
      cover: value,
    })
  }

  return (
    <Modal
      width={420}
      title={props.details ? '编辑项目' : '创建项目'}
      visible={props.visible}
      footer={false}
      onCancel={props.onChangeVisible}
      bodyStyle={{ padding: '16px 24px 0' }}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item label="项目封面" required name="cover">
          <PosterComponent
            value={props.details ? props.details.cover : ''}
            onChangeValue={cover => onChangePoster(cover)}
          />
        </Form.Item>
        <Form.Item label="项目名称" required name="name">
          <Input maxLength={30} placeholder="请输入项目名称" />
        </Form.Item>
        <Form.Item label="项目描述" name="info">
          <Input.TextArea
            maxLength={500}
            placeholder="请输入项目描述"
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </Form.Item>
        <Form.Item label="公开/私有" name="isPublic">
          <Select placeholder="请选择">
            <Select.Option value={2}>私有项目</Select.Option>
            <Select.Option value={1}>企业公开</Select.Option>
          </Select>
        </Form.Item>
      </Form>
      <Footer size={16}>
        <Button onClick={props.onChangeVisible}>取消</Button>
        <Button type="primary" onClick={onConfirm}>
          确认
        </Button>
      </Footer>
    </Modal>
  )
}

export default EditProject
