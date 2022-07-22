import { Modal, Form, Input, Select, Space } from 'antd'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import PosterComponent from './PosterComponent'
import styled from '@emotion/styled'

const Footer = styled(Space)({
  height: 56,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
})

interface Props {
  visible: boolean
  onChangeVisible(): void
}

export default (props: Props) => {
  const [form] = Form.useForm()
  return (
    <Modal
      width={420}
      title="创建项目"
      visible={props.visible}
      footer={false}
      onCancel={props.onChangeVisible}
      bodyStyle={{ padding: '16px 24px 0' }}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="项目封面" required>
          <PosterComponent />
        </Form.Item>
        <Form.Item label="项目名称" required>
          <Input maxLength={30} placeholder="请输入项目名称" />
        </Form.Item>
        <Form.Item label="项目描述">
          <Input.TextArea
            maxLength={500}
            placeholder="请输入项目描述"
            autoSize={{ minRows: 3,
              maxRows: 5 }}
          />
        </Form.Item>
        <Form.Item label="公开/私有">
          <Select placeholder="请选择">
            <Select.Option>私有项目</Select.Option>
            <Select.Option>企业公开</Select.Option>
          </Select>
        </Form.Item>
      </Form>
      <Footer size={16}>
        <Button onClick={props.onChangeVisible}>取消</Button>
        <Button type="primary">确认</Button>
      </Footer>
    </Modal>
  )
}
