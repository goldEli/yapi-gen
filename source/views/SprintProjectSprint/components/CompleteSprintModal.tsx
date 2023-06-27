import CommonModal from '@/components/CommonModal'
import CustomSelect from '@/components/CustomSelect'
import { getMessage } from '@/components/Message'
import { completeSprint, getMoveTo } from '@/services/sprint'
import { css } from '@emotion/css'
import { useDispatch, useSelector } from '@store/index'
import { setSprintRefresh } from '@store/sprint'
import { DatePicker, Form, Input } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'

interface sprintProps {
  visible: boolean
  id: number
  projectId: number
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
  const { visible, onClose, id, projectId } = props
  const [form] = Form.useForm()
  const { rightSprintList } = useSelector(store => store.sprint)
  const [targetId, setTargetId] = useState(id)
  const dispatch = useDispatch()
  const [list, setList] = useState<any>([])

  const onClear = (isFresh?: boolean) => {
    form.setFieldsValue({
      // eslint-disable-next-line no-undefined
      result: undefined,
      // eslint-disable-next-line no-undefined
      move_target: undefined,
    })
    onClose()
    if (isFresh) {
      dispatch(setSprintRefresh(1))
    }
  }

  const onConfirm = async () => {
    const value = await form.validateFields()
    try {
      const result: any = await completeSprint({
        id: value.current,
        project_id: projectId,
        finish_at: moment(value.finish_at).format('YYYY-MM-DD'),
        result: value.result,
        move_target: value.move_target,
      })
      if (result && result.code === 0) {
        getMessage({
          msg: '完成冲刺',
          type: 'success',
        })
        onClear(true)
      } else {
        getMessage({
          msg: result?.message,
          type: 'error',
        })
      }
    } catch (error) {
      // console.log(error)
    }
  }

  useEffect(() => {
    setTargetId(id)
  }, [id])

  const getMoveToList = async () => {
    const result = await getMoveTo({
      project_id: projectId,
      iterate_id: targetId,
    })
    if (result) {
      setList(result)
    }
  }

  useEffect(() => {
    if (visible) {
      getMoveToList()
    }
  }, [visible, targetId])

  useEffect(() => {
    form.setFieldsValue({
      current: targetId,
      finish_at: moment(
        rightSprintList.find((k: any) => k.id === targetId)?.end_at,
      ),
    })
  }, [targetId])

  return (
    <CommonModal
      title="完成冲刺"
      width={528}
      isVisible={visible}
      onClose={() => onClear(false)}
      onConfirm={onConfirm}
      confirmText="完成"
      children={
        <div className={content}>
          <div className="head">请选择要完成的冲刺</div>
          <Form
            form={form}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            autoComplete="off"
          >
            <Form.Item
              label="当前"
              name="current"
              rules={[{ required: true, message: '请输入冲刺名称' }]}
            >
              <CustomSelect
                options={rightSprintList
                  .filter((k: any) => k.id !== -1 && k.status === 1)
                  .map((item: any) => ({
                    label: item.name,
                    value: item.id,
                    key: item.id,
                  }))}
                onChange={(value: number) => {
                  setTargetId(value)
                }}
              />
            </Form.Item>
            <Form.Item
              label="结束日期"
              name="finish_at"
              rules={[{ required: true }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                disabledDate={current => {
                  return (
                    current &&
                    current <
                      moment(
                        rightSprintList.find((k: any) => k.id === targetId)
                          ?.start_at,
                      ).startOf('day')
                  )
                }}
              />
            </Form.Item>
            <Form.Item label="结果" name="result">
              <Input.TextArea
                showCount
                maxLength={300}
                autoSize={{ minRows: 1, maxRows: 5 }}
                placeholder="请输入"
              />
            </Form.Item>
            <div className="head">未完成的事务移动至</div>
            <Form.Item
              label="移动至"
              name="move_target"
              rules={[{ required: true }]}
            >
              <CustomSelect
                options={list.map((item: any) => ({
                  label: item.name,
                  value: item.id,
                  key: item.id,
                }))}
              />
            </Form.Item>
          </Form>
        </div>
      }
    />
  )
}

export default CompleteSprintModal
