import CommonModal from '@/components/CommonModal'
import { Form, Input } from 'antd'
import { DingTalkGroupModalWrap } from '../style'

type SetDingTalkGroupModalProps = {
  isVisible: boolean
  onClose(): void
  onConfirm(): void
}

const SetDingTalkGroupModal = (props: SetDingTalkGroupModalProps) => {
  const { isVisible, onClose, onConfirm } = props
  const [form] = Form.useForm()

  const onFinish = async () => {
    const value = await form.validateFields()
  }
  return (
    <CommonModal
      width={528}
      title="设置风险预警接收群"
      isVisible={isVisible}
      onClose={onClose}
      onConfirm={onFinish}
    >
      <DingTalkGroupModalWrap>
        <Form
          form={form}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          autoComplete="off"
        >
          <Form.Item
            label="群名称"
            name="username"
            validateFirst
            rules={[
              { required: true, message: '请输入' },
              {
                validator(_, value) {
                  if (value?.trim()) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('请输入'))
                },
              },
            ]}
          >
            <Input placeholder="请输入" maxLength={100} />
          </Form.Item>

          <Form.Item
            label="钉钉webhook地址"
            name="password"
            validateFirst
            rules={[
              { required: true, message: '请输入' },
              {
                validator(_, value) {
                  if (value?.trim()) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('请输入'))
                },
              },
            ]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
        </Form>
      </DingTalkGroupModalWrap>
    </CommonModal>
  )
}

export default SetDingTalkGroupModal
