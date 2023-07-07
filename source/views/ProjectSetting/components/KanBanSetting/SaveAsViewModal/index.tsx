/**
 * 另存为视图  编辑视图弹窗
 */
import React, { useRef } from 'react'
import { Form, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import CommonModal from '@/components/CommonModal'
import { useDispatch, useSelector } from '@store/index'
import {
  closeSaveAsViewModel,
  onSaveAsViewModel,
} from '@store/kanbanConfig/kanbanConfig.thunk'
import useProjectId from '../hooks/useProjectId'
import { getMessage } from '@/components/Message'

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
  const { saveAsViewModelInfo, viewList } = useSelector(
    store => store.KanbanConfig,
  )
  const inputRef = useRef<any>()
  React.useEffect(() => {
    if (saveAsViewModelInfo.visible) {
      setTimeout(() => {
        inputRef.current?.focus?.()
      }, 500)
    }
  }, [saveAsViewModelInfo.visible])

  React.useEffect(() => {
    if (saveAsViewModelInfo?.viewItem?.id) {
      form.setFieldsValue({
        name: saveAsViewModelInfo.viewItem.name,
      })
      return
    }
    form.setFieldsValue({
      name: '',
    })
  }, [saveAsViewModelInfo])
  const dispatch = useDispatch()

  const onClose = () => {
    dispatch(closeSaveAsViewModel())
  }
  const { projectId } = useProjectId()

  const confirm = async () => {
    const data = await form.validateFields()
    if (viewList?.some(item => item.name === data.name)) {
      getMessage({ type: 'error', msg: '列与状态名称已存在' })
      return
    }
    dispatch(
      onSaveAsViewModel({
        // ...saveAsViewModelInfo.viewItem,
        id: saveAsViewModelInfo.viewItem?.id ?? 0,
        name: data.name as string,
        project_id: projectId,
        isSaveAs: saveAsViewModelInfo.isSaveAs,
      }),
    )
  }

  const onsubmit = () => {
    form.submit()
  }

  const title = React.useMemo(() => {
    if (saveAsViewModelInfo.title) {
      return saveAsViewModelInfo.title
    }
    if (saveAsViewModelInfo.viewItem) {
      return t('edit_view')
    }
    return t('save_as_view')
  }, [saveAsViewModelInfo])

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
            label={t('name1')}
            name="name"
          >
            <Input
              maxLength={30}
              placeholder={t(
                'please_enter_the_real_view_name_limit_30_characters',
              )}
              ref={inputRef}
            />
          </Form.Item>
        </Form>
      </div>
    </CommonModal>
  )
}

export default SaveAsViewModal
