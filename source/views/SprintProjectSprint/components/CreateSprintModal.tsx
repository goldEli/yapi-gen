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
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ChooseDate from './ChooseDate'
import useAltSKeyPress from '@/hooks/useAltSKeyPress/useAltSKeyPress'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'

interface sprintProps {
  type: 'create' | 'start' | 'edit' | 'update'
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
  const { DeleteConfirmModal, open } = useDeleteConfirmModal()
  const inputRef = useRef<any>(null)
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
    onClose()
    if (isFresh) {
      dispatch(setSprintRefresh(1))
    }
    setTimeout(() => {
      form.resetFields()
    }, 500)
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
            is_weekend: value?.group?.include ? 1 : 2,
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
      if (type === 'edit' || type === 'start' || type === 'update') {
        // 先判断更改的时间是否在事务的时间范围内
        const updateSprint = async () => {
          const result: any = await updateSprintInfo({
            id: editId as any,
            project_id: projectId,
            name: value?.name,
            start_at: moment(value?.group?.date?.[0]).format('YYYY-MM-DD'),
            end_at: moment(value?.group?.date?.[1]).format('YYYY-MM-DD'),
            duration: {
              is_weekend: value?.group?.include ? 1 : 2,
              week_type: value?.group?.radio,
            },
            info: value?.info,
          })
          if (result && result.code === 0) {
            getMessage({
              msg:
                type === 'edit'
                  ? '编辑成功'
                  : type === 'update'
                  ? '更新成功'
                  : '开始成功',
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
        if (
          ((moment(value?.group?.date?.[0]).isSame(
            editData?.between_date?.[0],
          ) ||
            moment(value?.group?.date?.[0]).isBefore(
              editData?.between_date?.[0],
            )) &&
            (moment(value?.group?.date?.[1]).isSame(
              editData?.between_date?.[1],
            ) ||
              moment(value?.group?.date?.[1]).isAfter(
                editData?.between_date?.[1],
              ))) ||
          editData?.between_date?.every((i: any) => !i)
        ) {
          updateSprint()
        } else {
          open({
            title: getTitle(type),
            okText:
              (type === 'edit' || type === 'start') &&
              editData?.status === 4 &&
              editData?.story_count
                ? '开始'
                : type === 'update'
                ? '更新'
                : // eslint-disable-next-line no-undefined
                  '编辑',
            children: (
              <div>子事务超出设置的冲刺日期范围，建议调整冲刺或事务日期</div>
            ),
            onConfirm: updateSprint,
          })
        }
      }
    } catch (error) {
      // console.log(error)
    }
  }

  const onValidator = (rule: any, value: any) => {
    if ((!value || !value?.date) && initNumber.current !== 1) {
      return Promise.reject(new Error('请选择持续时间'))
    }
    initNumber.current++
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
            date: result.data.start_at
              ? [moment(result.data.start_at), moment(result.data.end_at)]
              : null,
            include: result.data.duration?.is_weekend === 1,
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
      // console.log(error)
    }
  }

  useEffect(() => {
    if (
      editId &&
      (type === 'edit' || type === 'start' || type === 'update') &&
      visible
    ) {
      getSprintInfo()
    }
  }, [editId, visible])
  const handleAltSKeyPress = useCallback(() => {
    // console.log('ALT+S键被按下')
    onConfirm()
    // 在这里执行你想要触发的事件
  }, [])

  useEffect(() => {
    console.log(1322222222222)

    if (visible) {
      setTimeout(() => {
        inputRef?.current?.focus?.()
      }, 500)
    }
  }, [visible])

  useAltSKeyPress(handleAltSKeyPress)

  return (
    <>
      <CommonModal
        title={getTitle(type)}
        width={528}
        isVisible={visible}
        onClose={() => onClear(false)}
        onConfirm={onConfirm}
        confirmText={
          (type === 'edit' || type === 'start') &&
          editData?.status === 4 &&
          editData?.story_count
            ? '开始'
            : type === 'create'
            ? '新建'
            : type === 'update'
            ? '更新'
            : // eslint-disable-next-line no-undefined
              '编辑'
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
                <Input
                  ref={inputRef}
                  placeholder="新建的冲刺1"
                  maxLength={50}
                />
              </Form.Item>
              <Form.Item
                label="持续时间"
                name="group"
                // eslint-disable-next-line no-undefined
                initialValue={{
                  include: true,
                  radio: 0,
                }}
                rules={[{ required: true, validator: onValidator }]}
              >
                <ChooseDate initNumber={initNumber} />
              </Form.Item>
              <Form.Item label="冲刺目标" name="info">
                <Input.TextArea
                  maxLength={300}
                  autoSize={{ minRows: 1, maxRows: 5 }}
                  placeholder="请输入"
                />
              </Form.Item>
            </Form>
          </div>
        }
      />
      <DeleteConfirmModal />
    </>
  )
}

export default CreateSprintModal
