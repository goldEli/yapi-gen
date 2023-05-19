/**
 * 另存为视图  编辑视图弹窗
 */
import React from 'react'
import { Form, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import { getMessage } from '@/components/Message'
import CommonModal from '@/components/CommonModal'
import { useDispatch, useSelector } from '@store/index'
import {
  closeSaveAsViewModel,
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

interface SaveAsViewModalProps {}

const SaveAsViewModal: React.FC<SaveAsViewModalProps> = props => {
  const [form] = Form.useForm()
  const [t] = useTranslation()
  const { saveAsViewModelInfo } = useSelector(store => store.KanbanConfig)
  React.useEffect(() => {
    if (saveAsViewModelInfo.viewItem) {
      form.setFieldsValue({
        name: saveAsViewModelInfo.viewItem.name,
      })
      return
    }
    form.setFieldsValue({
      name: '',
    })
  }, [saveAsViewModelInfo.viewItem])
  const dispatch = useDispatch()

  const onClose = () => {
    dispatch(closeSaveAsViewModel())
  }

  const confirm = async () => {
    const data = await form.validateFields()
    dispatch(
      onSaveAsViewModel({
        ...saveAsViewModelInfo.viewItem,
        value: data.name,
      }),
    )
  }

  const onsubmit = () => {
    form.submit()
  }

  const title = React.useMemo(() => {
    if (saveAsViewModelInfo.viewItem) {
      return '编辑视图'
    }
    return '另存为视图'
  }, [saveAsViewModelInfo.viewItem])

  return (
    <CommonModal
      width={528}
      title={title}
      isVisible={saveAsViewModelInfo.visible}
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
            <Input
              maxLength={30}
              placeholder="请输入实视图名称限30字"
              autoFocus
            />
          </Form.Item>
        </Form>
      </div>
    </CommonModal>
  )
}

export default SaveAsViewModal
