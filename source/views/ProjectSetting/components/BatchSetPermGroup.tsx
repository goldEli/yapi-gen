import { Form } from 'antd'
import CustomSelect from '@/components/CustomSelect'
import CommonModal from '@/components/CommonModal'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const BatchSetPermGroup = (props: {
  isVisible: boolean
  onClose(): void
  onConfirm(roleId: string): void
  roleOptions?: number[]
}) => {
  const [form] = Form.useForm()
  const [t] = useTranslation()

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
      title={t('common.batchConfigPermission')}
      isVisible={props.isVisible}
      onConfirm={onConfirm}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ padding: '8px 24px', height: 156 }}
        autoComplete="off"
      >
        <Form.Item
          label={t('common.permissionGroup')}
          name="userGroupId"
          rules={[
            { required: true, message: String(t('project.pleasePermission')) },
          ]}
        >
          <CustomSelect
            placeholder={t('common.pleaseSelect')}
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
