import { useEffect, useRef, useState } from 'react'
import CommonModal from '../CommonModal'
import { useTranslation } from 'react-i18next'
import { ProgressContentWrap, ShowProgress } from './style'
import { CloseWrap, SliderWrap } from '../StyleCommon'
import { Form, Input, InputNumber, Tooltip } from 'antd'
import UploadAttach from '../UploadAttach'
import { getScheduleDetails, updateStorySchedule } from '@/services/demand'
import { updateTransactionSchedule } from '@/services/affairs'
import { updateFlawSchedule } from '@/services/flaw'
import { getMessage } from '../Message'
import CommonIconFont from '../CommonIconFont'
import { Label, LabelWrap } from '../DemandDetailDrawer/style'

interface ProgressPropsType {
  type?: 'transaction' | 'demand' | 'flaw'
  visible: boolean
  onClose(): void
  id?: number
  project_id: number
  onConfirm?(): void
}

const UpdateProgressModal = (props: ProgressPropsType) => {
  const [t]: any = useTranslation()
  const [form] = Form.useForm()
  const [inputValue, setInputValue] = useState(0)
  const [data, setData] = useState<any>(null)

  const { type, visible, onClose, id, project_id, onConfirm } = props

  const getData = async () => {
    const result = await getScheduleDetails({
      id,
      project_id,
    })
    setData(result)
    if (result) {
      setInputValue(result?.schedule ?? 0)
    }
  }
  const close = () => {
    onClose()
    form.resetFields()
  }

  useEffect(() => {
    if (visible) {
      getData()
    }
  }, [id, project_id, visible])

  const onChange = (newValue: number) => {
    if (String(newValue).includes('.')) {
      return
    }
    if (newValue < data?.schedule) {
      getMessage({
        type: 'warning',
        msg: t(
          'theProgressThisTimeNeedsToBeGreaterThanTheLastPleaseFillInAgain',
        ),
      })
      return
    }
    setInputValue(newValue)
  }
  // 选择附件逻辑处理
  const onChangeAttachment = (result: any) => {
    const arr = result.map((i: any) => {
      return {
        name: i.name,
        url: i.url,
        size: i.size,
        ext: i.ext,
        ctime: i.ctime,
      }
    })

    form.setFieldsValue({
      attachment: arr,
    })
  }
  const confirm = async () => {
    const value = await form.validateFields()
    if (myRef?.current?.getAttachState() > 0) {
      getMessage({
        type: 'warning',
        msg: t('theFileIsBeingPleaseWait'),
      })
      return
    }
    const params = {
      user_id: data?.user_id,
      project_id,
      story_id: id,
      schedule: inputValue,
      ...value,
      total_task_time: value.total_task_time * 3600,
    }
    let res = null
    if (type === 'demand') {
      res = await updateStorySchedule(params)
    } else if (type === 'transaction') {
      res = await updateTransactionSchedule(params)
    } else if (type === 'flaw') {
      res = await updateFlawSchedule(params)
    }
    if (res) {
      getMessage({
        type: 'success',
        msg: t('updateCompleted'),
      })
      close()
      onConfirm?.()
    }
  }
  const myRef = useRef<any>(null)

  return (
    <CommonModal
      width={640}
      title={t('updateProgress')}
      isVisible={visible}
      onClose={close}
      onConfirm={confirm}
      confirmText={t('renew')}
    >
      <ProgressContentWrap>
        <div className="tips">
          {t('itIsRecommendedNotToGoBelowTheCurrentProgress')}
        </div>
        <ShowProgress>
          <span>
            {t('currentProgress')} {data?.schedule ?? 0}%
          </span>
          <span className="processor">{t('handler')}</span>
          <span className="username">
            {data?.user_name ? data?.user_name : '--'}
          </span>
        </ShowProgress>
        <div className="progressBox">
          <div>
            {t('progressOfTheDay')}（{data?.last_at ? data?.last_at : '--'}）
          </div>
          <div className="progress">
            <SliderWrap
              value={inputValue}
              className="slider"
              onChange={onChange}
              tooltip={{ formatter: (val: any) => `${val}%` }}
            />
            <span style={{ marginLeft: 8 }}>{inputValue}%</span>
          </div>
        </div>
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item
            label={t('actualWorkingHours')}
            name="total_task_time"
            rules={[
              {
                required: true,
                message: t('pleaseEnterActualWorkingHours'),
              },
            ]}
          >
            <InputNumber
              min={0.0}
              style={{ width: '100%' }}
              placeholder={t('actualWorkingHours')}
              step={0.01}
            />
          </Form.Item>
          <Form.Item label={t('releaseNotes')} name="remark">
            <Input.TextArea
              maxLength={600}
              autoSize={{ minRows: 5, maxRows: 5 }}
              placeholder={t('common.pleaseEnter')}
            />
          </Form.Item>
          <Form.Item
            className="info_item_tab_label"
            label={
              <LabelWrap
                style={{
                  justifyContent: 'space-between',
                  display: 'flex',
                  width: '100%',
                }}
              >
                <Label>{t('common.attachment')}</Label>
                <Tooltip title={t('addAttachments')}>
                  <CloseWrap
                    style={{ marginLeft: 'auto' }}
                    width={32}
                    height={32}
                  >
                    <CommonIconFont
                      type="plus"
                      size={20}
                      color="var(--neutral-n2)"
                      onClick={() => {
                        myRef.current?.handleUpload()
                      }}
                    />
                  </CloseWrap>
                </Tooltip>
              </LabelWrap>
            }
            name="attachment"
          >
            <UploadAttach
              ref={myRef}
              power
              onChangeAttachment={(res: any) => {
                onChangeAttachment(res)
              }}
            />
          </Form.Item>
        </Form>
      </ProgressContentWrap>
    </CommonModal>
  )
}

export default UpdateProgressModal
