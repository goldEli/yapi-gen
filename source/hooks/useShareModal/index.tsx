/**
 * 另存为视图  编辑视图弹窗
 */

import React, { useEffect, useRef, useState } from 'react'
import { Form, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import CommonModal from '@/components/CommonModal'
import IconFont from '@/components/IconFont'
import SearchInput from './SearchInput'
import { CopyButton, ModalContentBox, Tips, WarnTips } from './styled'
import { shareView, checkUpdates } from '@/services/sprint'
import { EMAIL_REGEXP } from '@/constants'

interface ShareModalProps {
  id?: number
  copyLink(): void
}

interface Options {
  onOk(): Promise<any>
}

const useShareModal = () => {
  const [visible, setVisible] = useState(false)
  const notFirst = useRef(false)
  const onClose = () => {
    setVisible(false)
    notFirst.current = false
  }

  const onOkRef = useRef<Options['onOk'] | null>(null)

  const open = (options: Options) => {
    onOkRef.current = options.onOk
    setVisible(true)
  }

  const ShareModal: React.FC<ShareModalProps> = props => {
    const { id, copyLink } = props
    const [needSave, setNeedSave] = useState(false)
    const [form] = Form.useForm()
    const [t] = useTranslation()
    const [fail, setFail] = useState(false)
    const confirm = async () => {
      const data = await form.validateFields()
      console.log(data, 'data')

      // todo 待调试
      // shareView()
      await onOkRef.current?.()
      onClose()
    }

    const onsubmit = () => {
      form.submit()
    }
    const setIsNeedSave = async () => {
      if (id) {
        const res = await checkUpdates({
          id: id,
          config: {},
        })
        // todo 待调试
        setNeedSave(true)
      }
    }
    useEffect(() => {
      if (id) {
        setIsNeedSave()
      }
    }, [id])

    const onValidator = (rule: any, value: any) => {
      if (
        !(typeof value === 'string' && !!value && EMAIL_REGEXP.test(value)) &&
        !(typeof value === 'object' && !!value) &&
        notFirst.current
      ) {
        return Promise.reject(new Error('请输入正确的用户名或邮箱'))
      }
      return Promise.resolve()
    }

    return (
      <CommonModal
        width={528}
        title="分享"
        isVisible={visible}
        onClose={onClose}
        onConfirm={onsubmit}
        confirmText="确认"
      >
        <ModalContentBox>
          {needSave ? (
            <WarnTips>单前视图未保存，分享时将为您保存为“视图”</WarnTips>
          ) : null}
          <Form
            form={form}
            onFinish={confirm}
            layout="vertical"
            onFinishFailed={({ values }) => {
              if (!values.name) {
                setFail(true)
              }
            }}
            onValuesChange={changedValues => {
              if (changedValues.name) {
                setFail(false)
              } else if (notFirst.current) {
                setFail(true)
              }
            }}
          >
            <Form.Item
              style={{ marginBottom: '8px' }}
              rules={[
                {
                  required: true,
                  validator: onValidator,
                },
              ]}
              label=""
              name="name"
            >
              <SearchInput
                placeholder="请输入用户名或邮箱地址(必填)"
                fail={fail}
                changeFirstState={() => {
                  notFirst.current = true
                }}
                setFail={setFail}
              />
            </Form.Item>
            <Tips>接收人将会收到分享的站内消息</Tips>
            <Form.Item
              rules={[{ required: true, message: '请输入消息' }]}
              label=""
              name="message"
            >
              <Input.TextArea
                placeholder="添加消息(必填)"
                style={{ height: 148 }}
              />
            </Form.Item>
          </Form>
        </ModalContentBox>
        <CopyButton
          onClick={() => {
            copyLink()
          }}
        >
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
