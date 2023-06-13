import CommonModal from '@/components/CommonModal'
import { FormWrap } from '../Style'
import { Form, Input } from 'antd'
import { useEffect } from 'react'

interface PropsType {
  titleType: { title: string; type: string } | undefined
  isVisible: boolean
  onConfirm: (value: string, type: string) => void
  onClose: () => void
  name: string
}

const ViewDialog = (props: PropsType) => {
  const [form] = Form.useForm()
  const onConfirm = async () => {
    await form.validateFields()
    const formValues = form.getFieldsValue()
    props.onConfirm(formValues.name, props.titleType?.type || 'add')
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
          label="名称"
          rules={[{ required: true, message: '请输入视图名称' }]}
        >
          <Input maxLength={30} placeholder="请输入视图名称限30字" />
        </Form.Item>
      </FormWrap>
    </CommonModal>
  )
}
export default ViewDialog
