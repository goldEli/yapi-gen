import CommonModal from '@/components/CommonModal'
import { createSprint } from '@/services/sprint'
import { css } from '@emotion/css'
import { Form, Input } from 'antd'
import moment from 'moment'
import { useRef } from 'react'
import ChooseDate from './ChooseDate'

interface sprintProps {
  type: 'create' | 'start' | 'edit'
  visible: boolean
  onClose(): void
  id: number
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
  const { type, visible, onClose, id } = props
  const [form] = Form.useForm()
  const initNumber = useRef(0)
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
    const value = await form.validateFields()
    if (type === 'create') {
      const result = await createSprint({
        project_id: id,
        name: value?.name,
        start_at: moment(value?.group?.date?.[0]).format('YYYY-MM-DD'),
        end_at: moment(value?.group?.date?.[1]).format('YYYY-MM-DD'),
        duration: {
          is_weekend: value?.group?.include,
          week_type: value?.group?.radio,
        },
      })
      if (result && result.code === 0) {
        onClose()
        initNumber.current = 0
      }
    }
  }

  const onValidator = (rule: any, value: any) => {
    if (!value || !value?.date) {
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
              name="group"
              initialValue={{ include: true, radio: 1, date: [] }}
              rules={[{ required: true, validator: onValidator }]}
            >
              <ChooseDate initNumber={initNumber} />
            </Form.Item>
            <Form.Item label="冲刺目标" name="info">
              <Input placeholder="请输入" />
            </Form.Item>
          </Form>
        </div>
      }
    />
  )
}

export default CreateSprintModal
