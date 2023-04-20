import { RepeatModalCheck } from '@/components/CalendarManager/styles'
import CommonModal from '@/components/CommonModal'
import { useSelector } from '@store/index'
import {
  Checkbox,
  DatePicker,
  DatePickerProps,
  Form,
  InputNumber,
  Select,
} from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface RepeatModalProps {
  title: string
  isVisible: boolean
  onClose(): void
  currentRepeat: number
  onRepeatConfirm(form: any): void
  repeatParams?: any
}

const RepeatModal = (props: RepeatModalProps) => {
  const [t] = useTranslation()
  const { relateConfig } = useSelector(store => store.calendar)
  //  每多少重复
  const [repeat, setRepeat] = useState<number>(1)
  // 结束重复类型
  const [endType, setEndType] = useState(null)
  // 结束日期
  const [endDate, setEndDate] = useState<[string, string] | string>()
  // 结束次数
  const [number, setNumber] = useState<number>(1)
  // 选择周期
  const [chooseRepeat, setChooseRepeat] = useState<CheckboxValueType[]>([])
  // 选择周期
  const [resultDate, setResultDate] = useState<DatePickerProps['value']>()
  const unit = [
    t('calendarManager.day'),
    t('calendarManager.week'),
    t('calendarManager.month'),
    t('calendarManager.year'),
  ]

  const checkboxOptions = [
    { label: t('calendarManager.monday1'), value: 1 },
    { label: t('calendarManager.tuesday'), value: 2 },
    { label: t('calendarManager.wednesday'), value: 3 },
    { label: t('calendarManager.thursday'), value: 4 },
    { label: t('calendarManager.friday'), value: 5 },
    { label: t('calendarManager.saturday1'), value: 6 },
    { label: t('calendarManager.weekday'), value: 0 },
  ]

  const onClose = () => {
    setChooseRepeat([])
    setNumber(1)
    setEndDate('')
    setRepeat(1)
    setEndType(null)
    props.onClose()
  }

  // 修改日程时间
  const onChangeTime = (
    value: DatePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    setEndDate(dateString)
    setResultDate(value)
  }

  // 重复小弹窗确认事件
  const onRepeatConfirm = () => {
    const params = {
      repeat_interval: repeat,
      repeat_end_type: endType,
      repeat_end_date: endDate,
      repeat_end_num: number,
      repeat_choose: chooseRepeat,
    }
    props.onRepeatConfirm(params)
    onClose()
  }

  useEffect(() => {
    if (props.isVisible) {
      console.log(props.repeatParams)
      setNumber(props.repeatParams.params.repeat_end_num)
      setEndType(props.repeatParams.params.repeat_end_type)
      setEndDate(
        props.repeatParams.params.repeat_end_date === '0000-00-00'
          ? ''
          : props.repeatParams.params.repeat_end_date,
      )
      setRepeat(props.repeatParams.params.repeat_interval)
      setChooseRepeat(props.repeatParams.params.repeat_choose)
      setResultDate(
        props.repeatParams.params.repeat_end_date === '0000-00-00'
          ? null
          : moment(props.repeatParams.params.repeat_end_date),
      )
    }
  }, [props.isVisible])

  return (
    <CommonModal
      isVisible={props.isVisible}
      title={props.title}
      onClose={onClose}
      onConfirm={onRepeatConfirm}
    >
      <Form
        style={{ padding: '0 20px 0 24px' }}
        labelCol={{ span: 4 }}
        labelAlign="left"
      >
        <Form.Item
          label={t('calendarManager.every')}
          style={{ margin: props.currentRepeat === 2 ? '0 0 8px 0' : '' }}
        >
          <InputNumber
            style={{ width: 140, marginRight: 16 }}
            value={repeat}
            min={1}
            onChange={value => setRepeat(value || 1)}
          />
          {unit[props.currentRepeat - 1]}
          {t('calendarManager.repeat')}
        </Form.Item>
        {props.currentRepeat === 2 && (
          <RepeatModalCheck>
            <Checkbox.Group
              options={checkboxOptions}
              onChange={setChooseRepeat}
            />
          </RepeatModalCheck>
        )}
        <Form.Item label={t('calendarManager.end_repetition')}>
          <Select
            style={{ width: 140, marginRight: 16 }}
            options={relateConfig.schedule.repeat_end_types}
            value={endType}
            onChange={setEndType}
          />
          {endType === 1 && (
            <DatePicker
              value={resultDate as DatePickerProps['value']}
              onChange={onChangeTime}
              style={{ width: 140 }}
            />
          )}
          {endType === 2 && (
            <>
              <InputNumber
                style={{ width: 140, marginRight: 16 }}
                value={number}
                min={1}
                onChange={value => setNumber(value || 1)}
              />
              {t('calendarManager.after')}
            </>
          )}
        </Form.Item>
      </Form>
    </CommonModal>
  )
}

export default RepeatModal
