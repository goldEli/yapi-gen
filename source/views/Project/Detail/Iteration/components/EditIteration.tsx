import { Modal, Form, Input, DatePicker, Space } from 'antd'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import Editor from '@/components/Editor'

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
}

export default (props: Props) => {
  const [form] = Form.useForm()
  return (
    <Modal
      visible={props.visible}
      width={740}
      footer={false}
      title="创建迭代"
      onCancel={props.onChangeVisible}
      bodyStyle={{ padding: '16px 24px' }}
    >
      <FormWrap form={form} labelCol={{ span: 5 }}>
        <div style={{ display: 'flex' }}>
          <IconFont type="interation" />
          <Form.Item label="迭代名称" required>
            <Input placeholder="请输入产品简称+计划发布版本号" />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont type="carryout" />
          <Form.Item label="迭代时间" required>
            <DatePicker.RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont type="detail" />
          <Form.Item label="迭代目标">
            <Editor />
          </Form.Item>
        </div>
      </FormWrap>
      <ModalFooter size={16}>
        <Button>取消</Button>
        <Button type="primary">确认</Button>
      </ModalFooter>
    </Modal>
  )
}
