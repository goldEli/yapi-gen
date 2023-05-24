import CommonModal from '@/components/CommonModal'
import { css } from '@emotion/css'
import { Form, Input } from 'antd'
import ChooseDate from './ChooseDate'

interface sprintProps {
  type: 'create' | 'start' | 'edit'
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

const CreateSprintModal = (props: sprintProps) => {
  const { type, visible, onClose } = props
  const [form] = Form.useForm()
  const getTitle = (val: string) => {
    if (val === 'create') {
      return '新建冲刺'
    }
    if (val === 'edit') {
      return '编辑冲刺'
    }
    if (val === 'start') {
      return '开始冲刺'
    }
    if (val === 'update') {
      return '更新冲刺'
    }
    return ''
  }

  const onConfirm = async () => {
    const res = await form.validateFields()
  }

  const onValidator = (rule: any, value: any) => {
    if (!value || !value.date) {
      return Promise.reject(new Error('请选择持续时间'))
    }
    return Promise.resolve()
  }

  return (
    <CommonModal
      title={getTitle(type)}
      width={528}
      isVisible={visible}
      onClose={() => onClose()}
      onConfirm={onConfirm}
      children={
        <div className={content}>
          <div className="head">要开始此冲刺，至少需包含1个事务</div>
          <Form
            form={form}
            name="basic"
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
              label="持续时间"
              name="date"
              initialValue={{ include: true, radio: 1 }}
              rules={[{ required: true, validator: onValidator }]}
            >
              <ChooseDate />
            </Form.Item>
            <Form.Item label="冲刺目标" name="target">
              <Input placeholder="请输入" />
            </Form.Item>
          </Form>
        </div>
      }
    />
  )
}

export default CreateSprintModal
