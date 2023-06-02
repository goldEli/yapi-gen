/**
 * 另存为视图  编辑视图弹窗
 */
import React from 'react'
import { Form, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import CommonModal from '@/components/CommonModal'
import { useDispatch, useSelector } from '@store/index'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import useI18n from '@/hooks/useI18n'
import { closeShareModel } from '@store/kanBan/kanBan.thunk'

interface ShareModalProps {}

const Tips = styled.div`
  font-size: 12px;
  line-height: 20px;
  color: var(--neutral-n3);
  margin-bottom: 24px;
`
const WarnTips = styled.div`
  width: 100%;
  height: 36px;
  box-sizing: border-box;
  padding-left: 16px;
  background-color: var(--function-tag4);
  display: flex;
  align-items: center;
  color: var(--neutral-n2);
  margin-bottom: 24px;
`

const CopyButton = styled.div`
  width: 112px;
  height: 32px;
  border-radius: 6px 6px 6px 6px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  align-items: center;
  color: var(--auxiliary-text-t2-d1);
  position: absolute;
  bottom: 24px;
  left: 0px;
  cursor: pointer;
`

const ModalContentBox = styled.div`
  padding: 0 24px;
`

const ShareModal: React.FC<ShareModalProps> = props => {
  const [form] = Form.useForm()
  const { t } = useI18n()
  const { shareModelInfo } = useSelector(store => store.kanBan)
  const dispatch = useDispatch()

  const onClose = () => {
    dispatch(closeShareModel())
  }

  const confirm = async () => {
    const data = await form.validateFields()
    // dispatch(
    //   onSaveAsViewModel({
    //     ...shareModelInfo.viewItem,
    //     value: data.name,
    //   }),
    // )
  }

  const onsubmit = () => {
    form.submit()
  }

  return (
    <CommonModal
      width={528}
      title={t('share')}
      isVisible={shareModelInfo.visible}
      onClose={onClose}
      onConfirm={onsubmit}
      confirmText={t('confirm')}
    >
      <ModalContentBox>
        <WarnTips>{t('saveTips')}</WarnTips>
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
            <Input
              placeholder={t('please_enter_a_username_or_email_address')}
              autoFocus
            />
          </Form.Item>
          <Tips>{t('the_recipient_will_receive_the_shared_site_message')}</Tips>
          <Form.Item
            rules={[{ required: true, message: '' }]}
            label={''}
            name="message"
          >
            <Input.TextArea
              placeholder={t('add_message')}
              style={{ height: 148 }}
            />
          </Form.Item>
        </Form>
      </ModalContentBox>
      <CopyButton>
        <IconFont type="link" />
        <span>{t('copy_Link')}</span>
      </CopyButton>
    </CommonModal>
  )
}

export default ShareModal
