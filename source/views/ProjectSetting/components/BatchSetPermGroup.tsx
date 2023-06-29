import { Form } from 'antd'
import CustomSelect from '@/components/CustomSelect'
import CommonModal from '@/components/CommonModal'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getRoleList } from '@/services/staff'
import { getProjectPermission } from '@/services/project'
const BatchSetPermGroup = (props: {
  isVisible: boolean
  onClose(): void
  onConfirm(roleId: string): void
  // 项目设置进来时状态为true,需要项目ID
  projectState: boolean
  projectId?: number
}) => {
  const [form] = Form.useForm()
  const [t] = useTranslation()
  const [roleOptions, setRoleOptions] = useState<any>([])
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
  useEffect(() => {
    props.isVisible && getRoleListApi(props.projectState)
  }, [props.isVisible])
  // 后台管理的接口与项目设置的接口不同
  const getRoleListApi = async (state: boolean) => {
    let data = null
    if (state) {
      const res = await getProjectPermission({ projectId: props.projectId })
      data = res.list.map((el: any) => ({ label: el.name, value: el.id }))
    } else {
      const res = await getRoleList()
      data = res.data.map((el: any) => ({ label: el.name, value: el.id }))
    }
    setRoleOptions(data)
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
        style={{ padding: '8px 24px' }}
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
            options={roleOptions}
          />
        </Form.Item>
      </Form>
    </CommonModal>
  )
}

export default BatchSetPermGroup
