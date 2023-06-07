import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { CommentFooterWrap } from './style'
import { useTranslation } from 'react-i18next'
import { Form, Input, Space } from 'antd'
import CommonButton from '../CommonButton'
import { Editor, EditorRef } from '@xyfe/uikit'
import { uploadFileToKey } from '@/services/cos'
import { useSelector } from '@store/index'
import CommonUserAvatar from '../CommonUserAvatar'
import useMkeyDown from '@/hooks/useMkeyDown'

interface CommentFooterProps {
  placeholder: string
  onConfirm(value: any): void
  personList: any
  style?: any
  maxHeight?: string
  hasAvatar?: boolean
  onRef?: any
}

const CommentFooter = (props: CommentFooterProps) => {
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const [isReview, setIsReview] = useState(false)
  const [isCtrlPressed, setIsCtrlPressed] = useState(false)
  const editorRef = useRef<EditorRef>(null)
  const { userInfo } = useSelector(store => store.user)

  const onValidator = (rule: any, value: any) => {
    if (value === '<p><br></p>' || value === '<p></p>' || value.trim() === '') {
      return Promise.reject(
        new Error('The two passwords that you entered do not match!'),
      )
    }
    return Promise.resolve()
  }
  const handleShortcutEvent1 = () => {
    setIsReview(true)
  }

  useMkeyDown(handleShortcutEvent1)
  //   提交评论
  const onComment = async () => {
    const value = await form.validateFields()
    props.onConfirm(value)
  }
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.ctrlKey && event.key === 'Enter') {
        handleShortcutEvent()
      }
    }

    const handleKeyUp = (event: any) => {
      if (event.key === 'Control') {
        setIsCtrlPressed(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const handleShortcutEvent = () => {
    // 在此处理按下 Ctrl + 回车 触发的事件
    console.log('Ctrl + 回车 被按下')
    onComment()
  }
  // 富文本上传
  const uploadFile = (file: File, dom: any, key2?: any) => {
    const key = uploadFileToKey(
      file,
      file.name,
      `richEditorFiles_${new Date().getTime()}`,
      false,
      data => {
        if (key2 === 'copy') {
          dom.past(data.url)
        }
        dom?.notifyUploaded(data.key, data.url)
      },
    )
    return key
  }

  // 关闭评论
  const onCancel = () => {
    setIsReview(false)
    form.resetFields()
  }

  useImperativeHandle(props.onRef, () => {
    return {
      cancel: onCancel,
    }
  })

  return (
    <CommentFooterWrap isReview={isReview} style={{ ...props.style }}>
      {isReview ? (
        <>
          <div>
            <Form form={form}>
              <Form.Item
                name="info"
                rules={[
                  {
                    validateTrigger: ['onFinish', 'onBlur', 'onFocus'],
                    required: true,
                    message: (
                      <div
                        style={{
                          margin: '5px 0',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {t('report.list.noEmpty')}
                      </div>
                    ),
                    whitespace: true,
                    validator: onValidator,
                  },
                ]}
              >
                <Editor
                  at
                  ref={editorRef}
                  upload={uploadFile}
                  getSuggestions={() => props.personList}
                  maxHeight={props.maxHeight}
                />
              </Form.Item>
            </Form>
          </div>
          <div className="buttonBox">
            <Space>
              <CommonButton
                type="light"
                size="small"
                onClick={() => {
                  setIsReview(false)
                  form.resetFields()
                }}
                style={{ fontSize: 12 }}
              >
                {t('report.list.cancel')}
              </CommonButton>
              <CommonButton
                type="primary"
                size="small"
                style={{ fontSize: 12 }}
                onClick={onComment}
              >
                {t('common.comment')}
              </CommonButton>
            </Space>
          </div>
        </>
      ) : (
        <div style={{ gap: 12, display: 'flex', alignItems: 'center' }}>
          {props.hasAvatar && (
            <CommonUserAvatar size="large" avatar={userInfo.avatar} />
          )}
          <Input
            placeholder={props.placeholder}
            style={{ width: '100%' }}
            onFocus={() => {
              setIsReview(true)
              setTimeout(() => {
                editorRef.current?.focus()
              }, 50)
            }}
          />
        </div>
      )}
    </CommentFooterWrap>
  )
}

export default CommentFooter
