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
import styled from '@emotion/styled'
import { getProjectInfoValues } from '@/services/project'
import { setProjectInfoValues } from '@store/project'

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
    font-family: SiYuanRegular;
    font-weight: 400;
    color: var(--neutral-n3);
  }
`
const CustomWrap = styled.div`
  .ant-form-item-label > label {
    height: 22px;
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
      return t('sprint.createSprint')
    }
    if (val === 'edit') {
      return t('sprint.editSprint')
    }
    if (val === 'start') {
      return t('sprint.startSprint')
    }
    if (val === 'update') {
      return t('sprint.updateSprint')
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
  // 更新事务页面的冲刺数据
  const updateSprintList = async () => {
    const [projectInfoData] = await Promise.all([
      getProjectInfoValues({ projectId }),
    ])

    dispatch(setProjectInfoValues(projectInfoData))
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
            msg: t('common.createSuccess'),
            type: 'success',
          })
          updateSprintList()
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
                  ? t('common.editSuccess')
                  : type === 'update'
                  ? t('sprint.updateSuccess')
                  : t('sprint.startSuccess'),
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
            okText: t('common.confirm2'),
            children: <div>{t('sprint.warning')}</div>,
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
      return Promise.reject(new Error(t('sprint.pleaseChooseTime')))
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
            ? t('sprint.start')
            : type === 'create'
            ? t('sprint.create')
            : type === 'update'
            ? t('sprint.update')
            : // eslint-disable-next-line no-undefined
              t('sprint.edit')
        }
        children={
          <div className={content}>
            <div className="head">{t('sprint.tips')}</div>
            <Form
              form={form}
              name="basic"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              autoComplete="off"
            >
              <CustomWrap>
                <Form.Item
                  label={t('sprint.sprintName')}
                  name="name"
                  rules={[{ required: true, message: t('sprint.pleaseInput') }]}
                >
                  <Input
                    ref={inputRef}
                    placeholder={t('sprint.newSprint1')}
                    maxLength={50}
                  />
                </Form.Item>

                <Form.Item
                  label={t('sprint.duration')}
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

                <Form.Item label={t('sprint.sprintTarget')} name="info">
                  <Input.TextArea
                    maxLength={300}
                    autoSize={{ minRows: 1, maxRows: 5 }}
                    placeholder={t('common.pleaseEnter')}
                  />
                </Form.Item>
              </CustomWrap>
            </Form>
          </div>
        }
      />
      <DeleteConfirmModal />
    </>
  )
}

export default CreateSprintModal
