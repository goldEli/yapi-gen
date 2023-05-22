import { useRef, useState } from 'react'
import { CommentFooter } from './style'
import { useTranslation } from 'react-i18next'
import { Form, Input, Space } from 'antd'
import CommonButton from '../CommonButton'
import { Editor, EditorRef } from '@xyfe/uikit'
import { uploadFileToKey } from '@/services/cos'

interface CommonCommentProps {
  placeholder: string
  onConfirm(value: any): void
  personList: any
  style?: any
  maxHeight?: string
}

const CommonComment = (props: CommonCommentProps) => {
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const [isReview, setIsReview] = useState(false)
  const editorRef = useRef<EditorRef>(null)

  const onValidator = (rule: any, value: any) => {
    if (value === '<p><br></p>' || value === '<p></p>' || value.trim() === '') {
      return Promise.reject(
        new Error('The two passwords that you entered do not match!'),
      )
    }
    return Promise.resolve()
  }

  //   提交评论
  const onComment = async () => {
    const value = await form.validateFields()
    props.onConfirm(value)
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

  return (
    <CommentFooter isReview={isReview} style={{ ...props.style }}>
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
        <Input
          placeholder={props.placeholder}
          onFocus={() => {
            setIsReview(true)
            setTimeout(() => {
              editorRef.current?.focus()
            }, 50)
          }}
        />
      )}
    </CommentFooter>
  )
}

export default CommonComment
