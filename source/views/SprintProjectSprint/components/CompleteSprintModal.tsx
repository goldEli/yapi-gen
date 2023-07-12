import CommonModal from '@/components/CommonModal'
import CustomSelect from '@/components/CustomSelect'
import { getMessage } from '@/components/Message'
import { completeSprint, getMoveTo, getSprintDetail } from '@/services/sprint'
import { css } from '@emotion/css'
import { useDispatch, useSelector } from '@store/index'
import { setSprintRefresh } from '@store/sprint'
import { DatePicker, Form, Input } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'

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

const CompleteSprintModal = (props: sprintProps) => {
  const { visible, onClose, id, projectId } = props
  const [form] = Form.useForm()
  const { rightSprintList } = useSelector(store => store.sprint)
  const [targetId, setTargetId] = useState(id)
  const dispatch = useDispatch()
  const [list, setList] = useState<any>([])
  const [t]: any = useTranslation()

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
          msg: t('sprint.completeSprint'),
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
    if (visible) {
      setTargetId(id)
    }
  }, [id, visible])

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
      getSprintInfo()
    }
  }, [visible, targetId])

  // 获取冲刺详情
  const getSprintInfo = async () => {
    const result: any = await getSprintDetail({
      project_id: projectId,
      id: targetId,
    })
    if (result && result.code === 0 && result.data) {
      form.setFieldsValue({
        current: targetId,
        finish_at: moment(result.data.end_at),
      })
    } else {
      getMessage({
        msg: result?.message,
        type: 'error',
      })
    }
  }

  return (
    <CommonModal
      title={t('sprint.completeSprint')}
      width={528}
      isVisible={visible}
      onClose={() => onClear(false)}
      onConfirm={onConfirm}
      confirmText={t('sprint.finish')}
      children={
        <div className={content}>
          <div className="head">{t('sprint.pleaseChooseSprint')}</div>
          <Form
            form={form}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            autoComplete="off"
          >
            <CustomWrap>
              <Form.Item
                label={t('sprint.current')}
                name="current"
                rules={[
                  { required: true, message: t('sprint.pleaseChooseSprint') },
                ]}
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
                label={t('sprint.endDate')}
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
              <Form.Item label={t('sprint.result')} name="result">
                <Input.TextArea
                  maxLength={300}
                  autoSize={{ minRows: 5, maxRows: 5 }}
                  placeholder={t('common.pleaseEnter')}
                />
              </Form.Item>
              <div className="head">{t('sprint.removeTo')}</div>
              <Form.Item
                label={t('sprint.moveTo')}
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
            </CustomWrap>
          </Form>
        </div>
      }
    />
  )
}

export default CompleteSprintModal
