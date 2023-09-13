import CommonModal from '@/components/CommonModal'
import { FormWrap } from '../Style'
import { Form, Input } from 'antd'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
interface PropsType {
  titleType: { title: string; type: string } | undefined
  isVisible: boolean
  onConfirm: (value: string, type: string) => void
  onClose: () => void
  name: string
}

const ViewDialog = (props: PropsType) => {
  const [form] = Form.useForm()
  const [t] = useTranslation()
  const onConfirm = async () => {
    await form.validateFields()
    const formValues = form.getFieldsValue()
    await props.onConfirm(formValues.name, props.titleType?.type || 'add')
  }
  useEffect(() => {
    if (props.isVisible) {
      form.setFieldsValue({ name: props.name })
    }
  }, [props.isVisible])
  return (
    <CommonModal
      isVisible={props.isVisible}
      title={props.titleType?.title}
      onClose={() => props.onClose()}
      onConfirm={onConfirm}
    >
      <FormWrap form={form} layout="vertical" style={{ padding: '0 24px' }}>
        <Form.Item
          name="name"
          label={t('name1')}
          rules={[
            {
              required: true,
              message: t('please_enter_a_view_name_limited_to_20_words'),
            },
          ]}
        >
          <Input
            maxLength={20}
            placeholder={t('please_enter_a_view_name_limited_to_20_words')}
          />
        </Form.Item>
      </FormWrap>
    </CommonModal>
  )
}
export default ViewDialog
