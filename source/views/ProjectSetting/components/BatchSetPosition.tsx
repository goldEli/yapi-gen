import { Form } from 'antd'
import CustomSelect from '@/components/CustomSelect'
import CommonModal from '@/components/CommonModal'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getRoleList } from '@/services/staff'
import { getProjectPermission } from '@/services/project'
import { useSelector } from '@store/index'
const BatchSetPosition = (props: {
  isVisible: boolean
  onClose(): void
  onConfirm(roleId: string): void
  // 项目设置进来时状态为true,需要项目ID
  projectState: boolean
  projectId?: number
}) => {
  const [form] = Form.useForm()
  const [t] = useTranslation()
  const { positionList = [] } = useSelector(store => store.user)
  useEffect(() => {
    if (!props.isVisible) {
      form.resetFields()
    }
  }, [props.isVisible])

  const onConfirm = async () => {
    await form.validateFields()
    await props.onConfirm(form.getFieldsValue().id)
  }
  useEffect(() => {}, [props.isVisible])

  return (
    <CommonModal
      width={528}
      onClose={() => props.onClose()}
      title="批量修改职位"
      isVisible={props.isVisible}
      onConfirm={onConfirm}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ padding: '8px 24px' }}
        autoComplete="off"
      >
        <Form.Item
          label="职位"
          name="id"
          rules={[
            { required: true, message: String(t('project.pleasePermission')) },
          ]}
        >
          <CustomSelect
            placeholder={t('common.pleaseSelect')}
            getPopupContainer={(node: any) => node}
            showSearch
            optionFilterProp="label"
            options={positionList.map((item: any) => ({
              ...item,
              label: item.name,
              value: item.id,
            }))}
          />
        </Form.Item>
      </Form>
    </CommonModal>
  )
}

export default BatchSetPosition
