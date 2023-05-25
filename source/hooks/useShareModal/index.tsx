/**
 * 另存为视图  编辑视图弹窗
 */
import React, { useRef, useState } from 'react'
import { Form, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import CommonModal from '@/components/CommonModal'
import IconFont from '@/components/IconFont'
import { CopyButton, ModalContentBox, Tips, WarnTips } from './styled'

interface ShareModalProps {}

interface Options {
  onOk: () => Promise<any>
}

const useShareModal = () => {
  const [visible, setVisible] = useState(false)
  const onClose = () => {
    setVisible(false)
  }

  const onOkRef = useRef<Options['onOk'] | null>(null)

  const open = (options: Options) => {
    onOkRef.current = options.onOk
    setVisible(true)
  }

  const ShareModal: React.FC<ShareModalProps> = props => {
    const [form] = Form.useForm()
    const [t] = useTranslation()

    const confirm = async () => {
      const data = await form.validateFields()
      await onOkRef.current?.()
      onClose()
    }

    const onsubmit = () => {
      form.submit()
    }

    return (
      <CommonModal
        width={528}
        title={'分享'}
        isVisible={visible}
        onClose={onClose}
        onConfirm={onsubmit}
        confirmText={'确认'}
      >
        <ModalContentBox>
          <WarnTips>单前视图未保存，分享时将为您保存为“视图”</WarnTips>
          <Form
            form={form}
            onFinish={confirm}
            layout="vertical"
            onFinishFailed={() => {}}
          >
            <Form.Item
              style={{ marginBottom: '8px' }}
              rules={[{ required: true, message: '' }]}
              label={''}
              name="name"
            >
              <Input placeholder="请输入用户名或邮箱地址" autoFocus />
            </Form.Item>
            <Tips>接收人将会收到分享的站内消息</Tips>
            <Form.Item
              rules={[{ required: true, message: '' }]}
              label={''}
              name="message"
            >
              <Input.TextArea placeholder="添加消息" style={{ height: 148 }} />
            </Form.Item>
          </Form>
        </ModalContentBox>
        <CopyButton>
          <IconFont type="link" />
          <span>复制链接</span>
        </CopyButton>
      </CommonModal>
    )
  }

  return {
    ShareModal,
    open,
  }
}

export default useShareModal
