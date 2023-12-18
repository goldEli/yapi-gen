import React, { useEffect } from 'react'
import CommonModal from '@/components/CommonModal'
import { Form, Input, InputNumber, Switch } from 'antd'
const { TextArea } = Input
import { FormWrap } from '../style'
import useProjectId from '../hooks/useProjectId'
import { addPosition, editPosition } from '@/services/department'
interface IProps {
  isVisible: boolean
  onClose?(): void
  onConfirm?(): void
  rowData?: any
}
const AddPositionModal = (props: IProps) => {
  const { isVisible, onClose, onConfirm, rowData } = props
  const { projectId } = useProjectId()
  const [form] = Form.useForm()
  const onFinish = async () => {
    const method = rowData ? editPosition : addPosition
    await form.validateFields()
    const formParams = form.getFieldsValue()
    const params = {
      ...form.getFieldsValue(),
      project_id: projectId,
      id: rowData?.id ?? '',
      status: formParams.status ? 1 : 2,
    }
    if (!rowData) {
      delete params.id
    }
    const res = await method(params)
    form.resetFields()
    onConfirm && onConfirm()
  }
  useEffect(() => {
    if (rowData) {
      form.setFieldsValue({
        ...rowData,
        status: rowData.status === 1,
      })
      return
    }

    form.resetFields()
  }, [rowData])
  return (
    <CommonModal
      isVisible={isVisible}
      title={rowData ? '编辑职位' : '创建职位'}
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
          label="职位名称"
          name="name"
          rules={[{ required: true, message: '请输入职位名称' }]}
        >
          <Input placeholder="请输入职位名称" />
        </Form.Item>
        <Form.Item
          label="排序"
          name="sort"
          rules={[{ required: true, message: '请输入序号' }]}
        >
          <InputNumber type="number" width="400" min={1} />
        </Form.Item>
        <Form.Item label="职位简介" name="description">
          <TextArea
            rows={2}
            placeholder="请输入职位简介最多200字"
            maxLength={200}
          />
        </Form.Item>
        <Form.Item label="职位状态" name="status" valuePropName="checked">
          <Switch></Switch>
        </Form.Item>
      </FormWrap>
    </CommonModal>
  )
}
export default AddPositionModal
