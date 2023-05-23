import CommonModal from '@/components/CommonModal'
import CustomSelect from '@/components/CustomSelect'
import { css } from '@emotion/css'
import { DatePicker, Form, Input } from 'antd'

interface sprintProps {
  visible: boolean
  onClose(): void
}

const content = css`
  padding: 0px 24px;
  .head {
    font-size: 12px;
    font-family: MiSans-Regular, MiSans;
    font-weight: 400;
    color: var(--neutral-n3);
  }
`

const CompleteSprintModal = (props: sprintProps) => {
  const { visible, onClose } = props
  const [form] = Form.useForm()

  const onConfirm = async () => {
    const res = await form.validateFields()
  }

  return (
    <CommonModal
      title="完成冲刺"
      width={528}
      isVisible={visible}
      onClose={() => onClose()}
      onConfirm={onConfirm}
      confirmText="完成"
      children={
        <div className={content}>
          <div className="head">要开始此冲刺，至少需包含1个事务</div>
          <Form
            form={form}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            autoComplete="off"
          >
            <Form.Item
              label="冲刺名称"
              name="name"
              rules={[{ required: true, message: '请输入冲刺名称' }]}
            >
              <Input placeholder="新建的冲刺1" />
            </Form.Item>
            <Form.Item
              label="结束日期"
              name="time"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label="移动至"
              name="target"
              rules={[{ required: true }]}
            >
              <CustomSelect />
            </Form.Item>
          </Form>
        </div>
      }
    />
  )
}

export default CompleteSprintModal
