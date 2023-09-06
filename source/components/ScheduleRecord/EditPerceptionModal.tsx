import { useEffect } from 'react'
import CommonModal from '../CommonModal'
import { Form, Input } from 'antd'
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
}

const EditPerceptionModal = (props: EditPerceptionPropsType) => {
  const [t]: any = useTranslation()
  const [form] = Form.useForm()
  const { visible, onClose, onConfirm, perception } = props

  const onConfirm1 = async () => {
    await onConfirm(form.getFieldValue('perception'))
  }

  useEffect(() => {
    form.setFieldsValue({
      perception,
    })
  }, [perception])

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
          <Form.Item label={t('releaseNotes')} name="perception">
            <Input.TextArea
              maxLength={600}
              autoSize={{ minRows: 5, maxRows: 5 }}
            />
          </Form.Item>
        </Form>
      </ContentWrap>
    </CommonModal>
  )
}
export default EditPerceptionModal
