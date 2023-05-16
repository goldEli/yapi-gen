import UploadAttach from '@/components/UploadAttach'
import { Form, Input } from 'antd'
import { createRef, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { AddWrap } from '@/components/StyleCommon'
import { Editor } from '@xyfe/uikit'
import { useDispatch, useSelector } from '@store/index'
import { changeRestScroll } from '@store/scroll'
import { getIdsForAt, removeNull } from '@/tools'
import { getMessage } from '@/components/Message'
import CommonModal from '@/components/CommonModal'
import IconFont from '@/components/IconFont'

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

  const onClose = () => {
    // props.editClose()
  }

  const confirm = async () => {
    await form.validateFields()
    getMessage({ msg: '保存成功!', type: 'success' })
  }

  const onsubmit = () => {
    form.submit()
  }
  return (
    <CommonModal
      width={528}
      title={'另存为视图'}
      isVisible={true}
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
