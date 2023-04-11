import { RepeatModalCheck } from '@/components/CalendarManager/styles'
import CommonModal from '@/components/CommonModal'
import { useSelector } from '@store/index'
import {
  Checkbox,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  InputNumber,
  Select,
} from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { RangePickerProps } from 'antd/lib/date-picker'
import { useState } from 'react'

interface RepeatModalProps {
  title: string
  isVisible: boolean
  onClose(): void
  currentRepeat: number
  onRepeatConfirm(form: any): void
}

const RepeatModal = (props: RepeatModalProps) => {
  const { relateConfig } = useSelector(store => store.calendar)
  //  每多少重复
  const [repeat, setRepeat] = useState<number>(1)
  // 结束重复类型
  const [endType, setEndType] = useState(0)
  // 结束日期
  const [endDate, setEndDate] = useState<[string, string] | string>()
  // 结束次数
  const [number, setNumber] = useState<number>(1)
  // 选择周期
  const [chooseRepeat, setChooseRepeat] = useState<CheckboxValueType[]>([])
  // 当月共有多少天
  const [currentDate, setCurrentDate] = useState([])
  // 当年共有多少月
  const [currentMonth, setCurrentMonth] = useState([])
  const unit = ['天', '周', '月', '年']

  const checkboxOptions = [
    { label: '周一', value: 1 },
    { label: '周二', value: 2 },
    { label: '周三', value: 3 },
    { label: '周四', value: 4 },
    { label: '周五', value: 5 },
    { label: '周六', value: 6 },
    { label: '周日', value: 0 },
  ]

  const onClose = () => {
    setChooseRepeat([])
    setNumber(1)
    setEndDate('')
    setRepeat(1)
    setEndType(0)
    props.onClose()
  }

  // 修改日程时间
  const onChangeTime = (
    _value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    setEndDate(dateString)
  }

  // 重复小弹窗确认事件
  const onRepeatConfirm = () => {
    const params = {
      repeat_interval: repeat,
      repeat_end_type: endType,
      repeat_end_date: endDate,
      repeat_end_num: number,
      repeat_choose: chooseRepeat,
      repeat_start: '',
      repeat_end: '',
    }
    props.onRepeatConfirm(params)
    onClose()
  }

  console.log()

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
          label="每"
          style={{ margin: props.currentRepeat === 2 ? '0 0 8px 0' : '' }}
        >
          <InputNumber
            style={{ width: 140, marginRight: 16 }}
            value={repeat}
            min={1}
            onChange={value => setRepeat(value || 1)}
          />
          {unit[props.currentRepeat - 1]}重复
        </Form.Item>
        {props.currentRepeat === 2 && (
          <RepeatModalCheck>
            <Checkbox.Group
              options={checkboxOptions}
              onChange={setChooseRepeat}
            />
          </RepeatModalCheck>
        )}
        {[3, 4].includes(props.currentRepeat) && (
          <Form.Item label="从">
            <Select
              style={{ width: 140, marginRight: 16 }}
              value={endType}
              onChange={setEndType}
            />
            -
            <Select
              style={{ width: 140, marginLeft: 16 }}
              value={endType}
              onChange={setEndType}
            />
          </Form.Item>
        )}
        <Form.Item label="结束重复">
          <Select
            style={{ width: 140, marginRight: 16 }}
            options={relateConfig.schedule.repeat_end_types}
            value={endType}
            onChange={setEndType}
          />
          {endType === 1 && (
            <DatePicker onChange={onChangeTime} style={{ width: 140 }} />
          )}
          {endType === 2 && (
            <>
              <InputNumber
                style={{ width: 140, marginRight: 16 }}
                value={number}
                min={1}
                onChange={value => setNumber(value || 1)}
              />
              次后
            </>
          )}
        </Form.Item>
      </Form>
    </CommonModal>
  )
}

export default RepeatModal
