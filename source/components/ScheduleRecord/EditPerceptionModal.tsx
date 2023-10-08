import { useEffect, useRef } from 'react'
import CommonModal from '../CommonModal'
import { Form, Input, InputNumber } from 'antd'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'

const ContentWrap = styled.div`
  padding: 16px 24px;
  .label {
    font-size: 14px;
    color: var(--neutral-n1-d1);
  }
`

interface EditPerceptionPropsType {
  visible: boolean
  onClose(): void
  onConfirm(val: any): any
  perception: string
  // 工时
  time: number
}

const EditPerceptionModal = (props: EditPerceptionPropsType) => {
  const [t]: any = useTranslation()
  const [form] = Form.useForm()
  const { visible, onClose, onConfirm, perception, time } = props

  const onConfirm1 = async () => {
    const formParams = form.getFieldsValue()
    const resultParams = {
      perception: formParams.perception,
      time: String(formParams.time) ? formParams.time * 60 * 60 : '',
    }
    if (
      resultParams.time !== props.time ||
      resultParams.perception !== props.perception
    ) {
      await onConfirm(resultParams)
    } else {
      form.resetFields()
      onClose()
    }
  }

  useEffect(() => {
    form.setFieldsValue({
      perception,
      time: Math.abs(Math.floor((time / 3600) * 100) / 100),
    })
  }, [perception, time])

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        const inputRef: any = document.querySelector('#total_task_time')
        inputRef?.focus()
        setTimeout(() => {
          inputRef?.setSelectionRange(-1, -1)
        }, 100)
      }, 100)
    }
  }, [visible])

  return (
    <CommonModal
      width={528}
      title={t('opinion')}
      isVisible={visible}
      onClose={() => {
        form.resetFields()
        onClose()
      }}
      onConfirm={onConfirm1}
    >
      <ContentWrap>
        <Form layout="vertical" autoComplete="off" form={form}>
          <Form.Item label={t('actualWorkingHours')} name="time">
            <InputNumber
              id="total_task_time"
              min={0.0}
              style={{ width: '100%' }}
              placeholder={t('actualWorkingHours')}
              step={0.01}
              precision={2}
            />
          </Form.Item>
          <Form.Item label={t('releaseNotes')} name="perception">
            <Input.TextArea
              spellCheck={false}
              showCount
              maxLength={600}
              autoSize={{ minRows: 10, maxRows: 10 }}
            />
          </Form.Item>
        </Form>
      </ContentWrap>
    </CommonModal>
  )
}
export default EditPerceptionModal
