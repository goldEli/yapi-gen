/**
 * 另存为视图  编辑视图弹窗
 */
import React from 'react'
import { Form, Input, InputNumber } from 'antd'
import { useTranslation } from 'react-i18next'
import CommonModal from '@/components/CommonModal'
import { useDispatch, useSelector } from '@store/index'
import {
  closeSaveAsViewModel,
  onOkEditColumnModel,
  onSaveAsViewModel,
} from '@store/kanbanConfig/kanbanConfig.thunk'

const LabelTitle = (props: any) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          fontFamily: 'SiYuanMedium',
          fontSize: '14px',
        }}
      >
        {props.title}
      </span>
    </div>
  )
}

interface EditColumnModalProps {}

const EditColumnModal: React.FC<EditColumnModalProps> = props => {
  const [form] = Form.useForm()
  const [t] = useTranslation()
  const { editColumnModelInfo } = useSelector(store => store.KanbanConfig)
  React.useEffect(() => {
    if (editColumnModelInfo.columnInfo) {
      form.setFieldsValue({
        name: editColumnModelInfo.columnInfo.name,
        max_num: editColumnModelInfo.columnInfo.max_num,
      })
      return
    }
  }, [editColumnModelInfo.columnInfo])
  const dispatch = useDispatch()

  const onClose = () => {
    dispatch(closeSaveAsViewModel())
  }

  const confirm = async () => {
    const data = await form.validateFields()
    if (!editColumnModelInfo.columnInfo) {
      return
    }
    dispatch(
      onOkEditColumnModel({
        ...editColumnModelInfo.columnInfo,
        ...data,
      }),
    )
  }

  const onsubmit = () => {
    form.submit()
  }

  return (
    <CommonModal
      width={528}
      title={'编辑列'}
      isVisible={editColumnModelInfo.visible}
      onClose={onClose}
      onConfirm={onsubmit}
      confirmText={'确认'}
    >
      <div
        style={{
          padding: '0 24px',
        }}
      >
        <Form
          form={form}
          onFinish={confirm}
          layout="vertical"
          onFinishFailed={() => {}}
        >
          <Form.Item
            rules={[{ required: true, message: '' }]}
            label={<LabelTitle title={'名称'} />}
            name="name"
          >
            <Input maxLength={30} placeholder="请输入列名称限30字" autoFocus />
          </Form.Item>
          {/* max_num */}
          <Form.Item
            rules={[{ required: true, message: '' }]}
            label={<LabelTitle title={'最大数量'} />}
            name="max_num"
          >
            <InputNumber min={0} defaultValue={1} />
          </Form.Item>
        </Form>
      </div>
    </CommonModal>
  )
}

export default EditColumnModal
