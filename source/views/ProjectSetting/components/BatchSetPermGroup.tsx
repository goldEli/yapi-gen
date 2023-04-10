import { Form } from 'antd'
import CustomSelect from '@/components/CustomSelect'
import CommonModal from '@/components/CommonModal'
import { useEffect } from 'react'

const BatchSetPermGroup = (props: {
  isVisible: boolean
  onClose(): void
  onConfirm(roleId: string): void
  roleOptions?: number[]
}) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (!props.isVisible) {
      form.resetFields()
    }
  }, [props.isVisible])

  const onConfirm = () => {
    form.validateFields().then(res => {
      props.onConfirm(res.userGroupId)
    })
  }

  return (
    <CommonModal
      width={528}
      onClose={() => props.onClose()}
      title="批量配置权限"
      isVisible={props.isVisible}
      onConfirm={onConfirm}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ padding: '0 24px' }}
        autoComplete="off"
      >
        <Form.Item
          label="权限组"
          name="userGroupId"
          rules={[{ required: true, message: '请选择权限组' }]}
        >
          <CustomSelect
            placeholder="请选择"
            getPopupContainer={(node: any) => node}
            showSearch
            optionFilterProp="label"
            options={props?.roleOptions}
          />
        </Form.Item>
      </Form>
    </CommonModal>
  )
}

export default BatchSetPermGroup
