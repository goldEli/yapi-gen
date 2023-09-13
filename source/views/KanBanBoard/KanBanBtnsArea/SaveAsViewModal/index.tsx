/**
 * 另存为视图  编辑视图弹窗
 */
import React from 'react'
import { Form, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import CommonModal from '@/components/CommonModal'
import { useDispatch, useSelector } from '@store/index'
import {
  closeSaveAsViewModel,
  onSaveAsViewModel,
} from '@store/kanBan/kanBan.thunk'

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
  const { saveAsViewModelInfo } = useSelector(store => store.kanBan)
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
      return t('edit_view')
    }
    if (saveAsViewModelInfo.isCreate) {
      return t('create_view')
    }
    return t('save_as_view')
  }, [saveAsViewModelInfo])

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

  return (
    <CommonModal
      width={528}
      title={title}
      isVisible={saveAsViewModelInfo.visible}
      onClose={onClose}
      onConfirm={onsubmit}
      confirmText={t('confirm')}
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
            label={<LabelTitle title={t('name1')} />}
            name="name"
          >
            <Input
              maxLength={30}
              placeholder={t(
                'please_enter_the_real_view_name_limit_30_characters',
              )}
              autoFocus
            />
          </Form.Item>
        </Form>
      </div>
    </CommonModal>
  )
}

export default SaveAsViewModal
