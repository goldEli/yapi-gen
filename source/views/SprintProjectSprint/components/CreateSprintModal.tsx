import CommonModal from '@/components/CommonModal'
import { getMessage } from '@/components/Message'
import {
  createSprint,
  getSprintDetail,
  updateSprintInfo,
} from '@/services/sprint'
import { css } from '@emotion/css'
import { useDispatch } from '@store/index'
import { setSprintRefresh } from '@store/sprint'
import { Form, Input } from 'antd'
import moment from 'moment'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ChooseDate from './ChooseDate'

interface sprintProps {
  type: 'create' | 'start' | 'edit'
  visible: boolean
  onClose(): void
  projectId: number
  editId?: number
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
  const { type, visible, onClose, projectId, editId } = props
  const [t]: any = useTranslation()
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const [editData, setEditData] = useState<any>(null)
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

  const onClear = (isFresh?: boolean) => {
    initNumber.current = 0
    form.resetFields()
    onClose()
    if (isFresh) {
      dispatch(setSprintRefresh(1))
    }
  }

  const onConfirm = async () => {
    const value = await form.validateFields()
    try {
      if (type === 'create') {
        const result: any = await createSprint({
          project_id: projectId,
          name: value?.name,
          start_at: moment(value?.group?.date?.[0]).format('YYYY-MM-DD'),
          end_at: moment(value?.group?.date?.[1]).format('YYYY-MM-DD'),
          duration: {
            is_weekend: value?.group?.include,
            week_type: value?.group?.radio,
          },
          info: value?.info,
        })

        if (result && result.code === 0) {
          getMessage({
            msg: '创建成功',
            type: 'success',
          })
          onClear(true)
        } else {
          getMessage({
            msg: result?.message,
            type: 'error',
          })
        }
      }
      if (type === 'edit' || type === 'start') {
        const result: any = await updateSprintInfo({
          id: editId as any,
          project_id: projectId,
          name: value?.name,
          start_at: moment(value?.group?.date?.[0]).format('YYYY-MM-DD'),
          end_at: moment(value?.group?.date?.[1]).format('YYYY-MM-DD'),
          duration: {
            is_weekend: value?.group?.include,
            week_type: value?.group?.radio,
          },
          info: value?.info,
        })
        if (result && result.code === 0) {
          getMessage({
            msg: type === 'edit' ? '编辑成功' : '开始成功',
            type: 'success',
          })
          onClear(true)
        } else {
          getMessage({
            msg: result?.message,
            type: 'error',
          })
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const onValidator = (rule: any, value: any) => {
    if (!value || !value?.date) {
      return Promise.reject(new Error('请选择持续时间'))
    }
    return Promise.resolve()
  }

  // 获取冲刺详情
  const getSprintInfo = async () => {
    try {
      const result: any = await getSprintDetail({
        project_id: projectId,
        id: editId as any,
      })
      if (result && result.code === 0 && result.data) {
        form.setFieldsValue({
          name: result.data.name,
          info: result.data.info,
          group: {
            date: [moment(result.data.start_at), moment(result.data.end_at)],
            include: result.data.duration?.is_weekend,
            radio: result.data.duration?.week_type,
          },
        })
        setEditData(result.data)
      } else {
        getMessage({
          msg: result?.message,
          type: 'error',
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (editId && (type === 'edit' || type === 'start') && visible) {
      getSprintInfo()
    }
  }, [editId, visible])

  return (
    <CommonModal
      title={getTitle(type)}
      width={528}
      isVisible={visible}
      onClose={() => onClear(false)}
      onConfirm={onConfirm}
      confirmText={
        (type === 'edit' || type === 'start') &&
        editData?.status === 4 &&
        editData?.story_count &&
        '开始'
      }
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
              <Input placeholder="新建的冲刺1" maxLength={50} />
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
              <Input.TextArea
                showCount
                maxLength={300}
                autoSize={{ minRows: 1, maxRows: 5 }}
                placeholder="请输入"
              />
            </Form.Item>
          </Form>
        </div>
      }
    />
  )
}

export default CreateSprintModal
