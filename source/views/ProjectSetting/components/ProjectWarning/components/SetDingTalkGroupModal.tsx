import CommonModal from '@/components/CommonModal'
import { Form, Input } from 'antd'
import { DingTalkGroupModalWrap } from '../style'
import { useEffect, useRef } from 'react'
import { getMessage } from '@/components/Message'
import { useSelector } from '@store/index'
import { useTranslation } from 'react-i18next'
type SetDingTalkGroupModalProps = {
  isVisible: boolean
  onClose(): void
  onConfirm(value: any): void
}

const SetDingTalkGroupModal = (props: SetDingTalkGroupModalProps) => {
  const { isVisible, onClose, onConfirm } = props
  const [form] = Form.useForm()
  const { projectWarning } = useSelector(store => store.project)
  const inputRef = useRef<any>()
  const [t] = useTranslation()
  const onFinish = () => {
    const value = form.getFieldsValue()
    if (value.group_name && value.web_hook) {
      getMessage({
        type: 'success',
        msg: t('setupSuccessful'),
      })
      onConfirm(value)
    } else if (!value.group_name && !value.web_hook) {
      onConfirm(value)
    } else if (!value.group_name && value.web_hook) {
      getMessage({
        type: 'warning',
        msg: t('pleaseFillInTheGroupName'),
      })
    } else if (value.group_name && !value.web_hook) {
      getMessage({
        type: 'warning',
        msg: t('pleaseFillInTheDingtalkWebhookAddress'),
      })
    }
  }

  useEffect(() => {
    if (isVisible) {
      form.setFieldsValue(
        projectWarning?.push_channel?.find?.((k: any) => k.type === 'ding')
          ?.other_config,
      )
      setTimeout(() => {
        inputRef?.current?.focus?.()
      }, 200)
    }
  }, [isVisible])
  return (
    <CommonModal
      width={528}
      title={t('setUpARiskWarningReceivingGroup')}
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
          <Form.Item label={t('groupName')} name="group_name">
            <Input
              ref={inputRef}
              placeholder={t('pleaseEnter')}
              maxLength={100}
            />
          </Form.Item>

          <Form.Item label={t('dingtalkWebhookAddress')} name="web_hook">
            <Input placeholder={t('pleaseEnter')} />
          </Form.Item>
        </Form>
      </DingTalkGroupModalWrap>
    </CommonModal>
  )
}

export default SetDingTalkGroupModal
