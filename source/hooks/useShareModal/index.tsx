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
import { copyLink } from '@/tools'
import { getMessage } from '@/components/Message'

interface ShareModalProps {
  // 检查视图是否保存的 视图id
  id?: number
  // 修改后的视图的配置参数
  config?: object
  // 复制链接所需要的url
  url: string
  // 用于分享后展示的标题
  title: string
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
    const { id, url, title, config } = props
    const [needSave, setNeedSave] = useState(true)
    const [form] = Form.useForm()
    const [t] = useTranslation()
    const [fail, setFail] = useState(false)

    // 确认分享
    const confirm = async () => {
      const data = await form.validateFields()
      // 判断是人员还是邮箱
      const params: API.Sprint.ShareView.Params = {
        title,
        url,
        content: data.content,
      }
      if (data?.name?.id) {
        params.user_id = data.name.id
      } else {
        params.email = data.name
      }
      try {
        const result = await shareView(params)
        if (result && result.code === 0) {
          getMessage({
            msg: '分享成功',
            type: 'success',
          })
          await onOkRef.current?.()
          onClose()
        } else {
          getMessage({
            msg: result?.msg,
            type: 'error',
          })
        }
      } catch (error) {
        console.log(error)
      }
    }

    const onsubmit = () => {
      form.submit()
    }
    const setIsNeedSave = async () => {
      if (id) {
        const res = await checkUpdates({
          id,
          config,
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
      if (fail) {
        setFail(false)
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
            onValuesChange={(changedValues, allValues) => {
              const value = allValues.name
              if (
                changedValues.name &&
                ((typeof allValues === 'string' &&
                  !!value &&
                  EMAIL_REGEXP.test(value)) ||
                  (typeof value === 'object' && !!value))
              ) {
                setFail(false)
              } else if (
                notFirst.current &&
                !(
                  typeof allValues === 'string' &&
                  !!value &&
                  EMAIL_REGEXP.test(value)
                ) &&
                !(typeof value === 'object' && !!value)
              ) {
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
              name="content"
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
            copyLink(`${title}${url} `, '复制成功！', '复制失败！')
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
