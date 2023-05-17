/**
 * 另存为视图  编辑视图弹窗
 */
import React from 'react'
import { Form, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import CommonModal from '@/components/CommonModal'
import { useDispatch, useSelector } from '@store/index'
import { closeShareModel } from '@store/sprintKanBan/sprintKanban.thunk'
import styled from '@emotion/styled'

interface SaveAsViewModalProps {}

const Tips = styled.div`
  font-size: 12px;
  line-height: 20px;
  color: var(--neutral-n3);
  margin-bottom: 24px;
`
const WarnTips = styled.div`
  width: 100%;
  height: 36px;
  box-sizing: border-box;
  padding-left: 16px;
  background-color: var(--function-tag4);
  display: flex;
  align-items: center;
  color: var(--neutral-n2);
  margin-bottom: 24px;
`

const SaveAsViewModal: React.FC<SaveAsViewModalProps> = props => {
  const [form] = Form.useForm()
  const [t] = useTranslation()
  const { shareModelInfo } = useSelector(store => store.sprintKanBan)
  const dispatch = useDispatch()

  const onClose = () => {
    dispatch(closeShareModel())
  }

  const confirm = async () => {
    const data = await form.validateFields()
    // dispatch(
    //   onSaveAsViewModel({
    //     ...shareModelInfo.viewItem,
    //     value: data.name,
    //   }),
    // )
  }

  const onsubmit = () => {
    form.submit()
  }

  // React.useEffect(() => {
  //   if (shareModelInfo.viewItem) {
  //     form.setFieldsValue({
  //       name: shareModelInfo.viewItem.value,
  //     })
  //     return
  //   }
  //   form.setFieldsValue({
  //     name: '',
  //   })
  // }, [shareModelInfo.viewItem])

  return (
    <CommonModal
      width={528}
      title={'分享'}
      isVisible={shareModelInfo.visible}
      onClose={onClose}
      onConfirm={onsubmit}
      confirmText={'确认'}
    >
      <div
        style={{
          padding: '0 24px',
        }}
      >
        <WarnTips>单前视图未保存，分享时将为您保存为“视图”</WarnTips>
        <Form
          form={form}
          onFinish={confirm}
          layout="vertical"
          onFinishFailed={() => {}}
        >
          <Form.Item
            style={{ marginBottom: '8px' }}
            rules={[{ required: true, message: '' }]}
            label={''}
            name="name"
          >
            <Input placeholder="请输入用户名或邮箱地址" autoFocus />
          </Form.Item>
          <Tips>接收人将会收到分享的站内消息</Tips>
          <Form.Item
            rules={[{ required: true, message: '' }]}
            label={''}
            name="message"
          >
            <Input.TextArea placeholder="添加消息" style={{ height: 148 }} />
          </Form.Item>
        </Form>
      </div>
    </CommonModal>
  )
}

export default SaveAsViewModal
