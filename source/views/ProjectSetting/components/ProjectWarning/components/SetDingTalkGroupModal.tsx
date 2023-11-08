import CommonModal from '@/components/CommonModal'
import { Form, Input } from 'antd'
import { DingTalkGroupModalWrap } from '../style'
import { useEffect } from 'react'
import { getMessage } from '@/components/Message'
import { useSelector } from '@store/index'

type SetDingTalkGroupModalProps = {
  isVisible: boolean
  onClose(): void
  onConfirm(value: any): void
}

const SetDingTalkGroupModal = (props: SetDingTalkGroupModalProps) => {
  const { isVisible, onClose, onConfirm } = props
  const [form] = Form.useForm()
  const { projectWarning } = useSelector(store => store.project)

  const onFinish = () => {
    const value = form.getFieldsValue()
    if (value.group_name && value.web_hook) {
      getMessage({
        type: 'success',
        msg: '设置成功',
      })
      onConfirm(value)
    } else if (!value.group_name && !value.web_hook) {
      onConfirm(value)
    } else if (!value.group_name && value.web_hook) {
      getMessage({
        type: 'warning',
        msg: '请填写群名称',
      })
    } else if (value.group_name && !value.web_hook) {
      getMessage({
        type: 'warning',
        msg: '请填写钉钉webhook地址',
      })
    }
  }

  useEffect(() => {
    if (isVisible) {
      form.setFieldsValue(
        projectWarning?.push_channel?.find?.((k: any) => k.type === 'ding')
          ?.other_config,
      )
    }
  }, [isVisible])
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
          <Form.Item label="群名称" name="group_name">
            <Input placeholder="请输入" maxLength={100} />
          </Form.Item>

          <Form.Item label="钉钉webhook地址" name="web_hook">
            <Input placeholder="请输入" />
          </Form.Item>
        </Form>
      </DingTalkGroupModalWrap>
    </CommonModal>
  )
}

export default SetDingTalkGroupModal
