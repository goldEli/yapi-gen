import React, { useEffect } from 'react'
import CommonModal from '@/components/CommonModal'
import { Form, Input, InputNumber } from 'antd'
const { TextArea } = Input
import { FormWrap } from '../style'
import useProjectId from '../hooks/useProjectId'
import { addDepartment, editDepartment } from '@/services/department'
interface IProps {
  isVisible: boolean
  onClose?(): void
  onConfirm?(): void
  rowData?: any
}
const AddDepartmentModal = (props: IProps) => {
  const { isVisible, onClose, onConfirm, rowData } = props
  const { projectId } = useProjectId()
  const [form] = Form.useForm()
  const onFinish = async () => {
    const method = rowData ? editDepartment : addDepartment
    await form.validateFields()
    const params = {
      ...form.getFieldsValue(),
      project_id: projectId,
      id: rowData?.id ?? '',
    }
    if (!rowData) {
      delete params.id
    }
    const res = await method(params)
    form.resetFields()
    onConfirm && onConfirm()
    console.log('values:', form.getFieldsValue(), res)
  }
  useEffect(() => {
    if (rowData) {
      form.setFieldsValue(rowData)
      return
    }

    form.resetFields()
  }, [rowData])
  return (
    <CommonModal
      isVisible={isVisible}
      title={rowData ? '编辑部门' : '创建部门'}
      onClose={onClose}
      width={528}
      onConfirm={onFinish}
    >
      <FormWrap
        onFinish={onFinish}
        onFinishFailed={() => {}}
        autoComplete="off"
        layout="vertical"
        form={form}
      >
        <Form.Item
          label="部门名称"
          name="name"
          rules={[{ required: true, message: '请输入部门名称' }]}
        >
          <Input placeholder="请输入部门名称" />
        </Form.Item>
        <Form.Item
          label="排序"
          name="sort"
          rules={[{ required: true, message: '请输入序号' }]}
        >
          <InputNumber type="number" width="400" min={1} />
        </Form.Item>
        <Form.Item label="部门简介" name="description">
          <TextArea
            rows={2}
            placeholder="请输入部门简介最多200字"
            maxLength={200}
          />
        </Form.Item>
      </FormWrap>
    </CommonModal>
  )
}
export default AddDepartmentModal
