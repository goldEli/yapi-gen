/* eslint-disable react/jsx-handler-names */
import { Form } from 'antd'
import CommonModal from '@/components/CommonModal'
import Editor from '@/components/Editor'
import ChoosePeople from './ChoosePeople'
import RelatedNeed from './RelatedNeed'

export const LabelTitle = (props: any) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        margin: '24px 0 8px 0',
      }}
    >
      <div
        style={{
          width: '3px',
          height: '16px',

          background: '#2877FF',
          display: 'inline-block',
          marginRight: '8px',
        }}
      />
      <span
        style={{
          fontWeight: 'bold',
          fontSize: '18px',
        }}
      >
        {props.title}
      </span>
    </div>
  )
}

const WhiteDay = (props: any) => {
  const [form] = Form.useForm()

  const confirm = async () => {
    const data: any = await form.validateFields()

    props.editConfirm(data)
    form.resetFields()
  }
  const close = () => {
    form.resetFields()
    props.editClose()
  }
  return (
    <CommonModal
      width={784}
      title={props.visibleEditText}
      isVisible={props.visibleEdit}
      onClose={close}
      onConfirm={confirm}
      confirmText="提交"
    >
      <div>
        <Form form={form} layout="vertical">
          <Form.Item label={<LabelTitle title="今日完成工作" />} name="info">
            <Editor height={240} />
          </Form.Item>
          <Form.Item label={<LabelTitle title="明日计划工作" />} name="info2">
            <Editor height={240} />
          </Form.Item>
          <Form.Item label={<LabelTitle title="抄送人" />} name="people">
            <ChoosePeople />
          </Form.Item>
          <Form.Item label={<LabelTitle title="关联需求" />} name="needs">
            <RelatedNeed />
          </Form.Item>
        </Form>
      </div>
    </CommonModal>
  )
}

export default WhiteDay
