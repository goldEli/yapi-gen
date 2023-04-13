/* eslint-disable react/jsx-handler-names */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable new-cap */
/* eslint-disable require-unicode-regexp */
/* eslint-disable no-negated-condition */
/* eslint-disable complexity */
import { Checkbox, Switch, Form, Dropdown, DatePicker, message } from 'antd'
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import CommonIconFont from '@/components/CommonIconFont'
import Picker from './Picker'
import { setFillingRequirements, setErr } from '@store/formWork'
import { useDispatch, useSelector } from '@store/index'
import moment from 'moment'
import { DelButton } from '@/components/StyleCommon'
import { setProjectInfoValues } from '@store/project'
const Text = styled.div`
  color: var(--neutral-n1-d1);
  font-size: 14px;
`
const BtnStyle = styled.div``
const RowStyle = styled.div`
  display: flex;
  align-items: center;
`
interface SupScopeType {
  // 显示的数据不同
  type: string
  value?: string
  onChange?(val: string | number): void
}
const dayData: any = [
  {
    label: '前一日',
    key: 1,
  },
  {
    label: '前二日',
    key: 2,
  },
  {
    label: '前三日',
    key: 3,
  },
  {
    label: '前四日',
    key: 4,
  },
  {
    label: '前五日',
    key: 5,
  },
  {
    label: '前六日',
    key: 6,
  },
  {
    label: '前七日',
    key: 7,
  },
  {
    label: '无限制',
    key: 0,
  },
]
const weekData: any = [
  {
    label: '前一周',
    key: 1,
  },
  {
    label: '前二周',
    key: 2,
  },
  {
    label: '前三周',
    key: 4,
  },
  {
    label: '无限止',
    key: 0,
  },
]
const monthData: any = [
  {
    label: '前一月',
    key: 1,
  },
  {
    label: '无限止',
    key: 0,
  },
]
interface Item {
  label: string
  key: string
}
const DatePicker1 = (props: any) => {
  const onChange = (e: any, dateString: string) => {
    props.datePickValue(dateString)
    var T = new Date(dateString)
    props.onChange(T.getTime() / 1000)
  }
  return (
    <DatePicker
      onChange={(date: any, dateString: string) => {
        onChange(date, dateString)
      }}
      value={moment(props.value)}
      showTime
    />
  )
}
const SupScope = (props: SupScopeType) => {
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState<Array<Item>>()
  const [label, setLabel] = useState('')
  // 每天 day ,每周 week , 每月 month , 不重复doNot
  useEffect(() => {
    // switch (props.type) {
    //   case 'day':
    //     setItems(dayData)
    //     if (props.value) {
    //       // const item: any = dayData?.find((el: any) => el.key == props.value)
    //       // props.onChange?.(item?.key)
    //       // setLabel(item?.label)
    //     } else {
    //       props.onChange?.(dayData[0].key)
    //       setLabel(dayData[0].label)
    //     }
    //     break
    //   case 'week':
    //     setItems(weekData)
    //     if (props.value) {
    //       // const item = weekData?.find((el: any) => el.key == props.value)
    //       // props.onChange?.(item?.key)
    //       // setLabel(item?.label)
    //     } else {
    //       props.onChange?.(weekData[0].key)
    //       setLabel(weekData[0].label)
    //     }
    //     break
    //   case 'month':
    //     setItems(monthData)
    //     if (props.value) {
    //       // const item = monthData?.find((el: any) => el.key == props.value)
    //       // props.onChange?.(item?.key)
    //       // setLabel(item?.label)
    //     } else {
    //       props.onChange?.(monthData[0].key)
    //       setLabel(monthData[0].label)
    //     }
    //     break
    // }
    // onOpenChange({ key: props.value ? props.value : 1 })
    // console.log(props.value, 'props.value')
    // if (props.type === 'day') {
    //   setItems(dayData)
    //   if (props.value) {
    //     const item: any = dayData?.find((el: any) => el.key == props.value)
    //     props.onChange?.(item?.key)
    //     setLabel(item?.label)
    //   } else {
    //     props.onChange?.(dayData[0].key)
    //     setLabel(dayData[0].label)
    //   }
    // }
  }, [props.value])
  const onOpenChange = (e: { key: any }) => {
    props.onChange?.(e.key)
    switch (props.type) {
      case 'day':
        setLabel(
          dayData.find((el: { key: number }) => el.key === e.key)?.label || '',
        )
        break
      case 'week':
        setLabel(
          weekData.find((el: { key: number }) => el.key === e.key)?.label || '',
        )
        break
      case 'month':
        setLabel(
          monthData.find((el: { key: number }) => el.key === e.key)?.label ||
            '',
        )
        break
    }
    setIsOpen(false)
  }
  return (
    <RowStyle>
      <Text>补交范围:</Text>
      <Dropdown
        placement="bottomLeft"
        open={isOpen}
        trigger={['click']}
        menu={{ items, onClick: onOpenChange }}
        overlayStyle={{
          width: 120,
          background: 'var(--neutral-white-d1)',
        }}
      >
        <BtnStyle
          onClick={e => {
            setIsOpen(!isOpen)
          }}
        >
          {label}
          <CommonIconFont
            type={isOpen ? 'up' : 'down'}
            size={14}
            color="var(--primary-d2)"
          />
        </BtnStyle>
      </Dropdown>
    </RowStyle>
  )
}
interface ValueType {
  label: string
  key: number
  value: boolean
}
interface CheckBoxGroupType {
  onChange?(val: Array<ValueType>): void
  value?: any
}
// 选择周几
const CheckBoxGroup = (props: CheckBoxGroupType) => {
  const { aWeekDataList } = useSelector(store => store.formWork)
  // console.log(props.value, 'ooo')
  // useEffect(() => {
  //   if (!props.value) {
  //     props.onChange?.(aWeekDataList)
  //   } else {
  //     props.onChange?.(props.value)
  //   }
  // }, [])
  const onChange = (value: boolean, el1: { value: boolean; key: number }) => {
    const filterVal = props?.value.map(
      (item: { value: boolean; key: number }) => ({
        ...item,
        value: el1.key === item.key ? value : item.value,
      }),
    )
    const newData = filterVal
      ?.filter((el: any) => el.value)
      ?.map((el: any) => el.key)
    props.onChange?.(newData)
  }
  return (
    <>
      {props.value?.map(
        (el: { value: boolean; key: number; label: string }) => (
          <Checkbox
            key={el.key}
            onChange={e => onChange(e.target.checked, el)}
            checked={el.value}
          >
            {el.label}
          </Checkbox>
        ),
      )}
    </>
  )
}
interface EditType {
  onChange?(val: boolean): void
  value?: boolean
}
const Edit = (props: EditType) => {
  return (
    <RowStyle>
      <Text>自动提醒未提交的人</Text>
      <Switch
        checked={props.value || false}
        style={{ marginLeft: 8 }}
        onChange={e => props.onChange?.(e)}
      />
    </RowStyle>
  )
}
interface CheckBoxType {
  title: string
  value?: boolean
  onChange?(val: boolean): void
}

const CheckBox = (props: CheckBoxType) => {
  return (
    <Checkbox
      checked={props.value}
      onChange={e => props.onChange?.(e.target.checked)}
    >
      {props.title}
    </Checkbox>
  )
}
interface FormType {
  // 每周每月每日补交范围不同，不重复没有补交范围
  type: string
  // backValues(s: any, e: any, r: any): void
}
let startTime: any = null
let endTime: any = null
let remindTime: any = null
let err: any = null
const FormMain = (props: FormType) => {
  const dispatch = useDispatch()
  const [startTimes, setStartTimes] = useState<any>()
  const [endTimes, setEndTimes] = useState<any>()
  const [remindTimes, setRemindTimes] = useState<any>()
  const { fillingRequirements } = useSelector(store => store.formWork)
  // 每天选择不能大于24小时
  const dayJudgeTime = () => {
    if (
      (startTime?.v1 === 1 && endTime?.v1 === 1) ||
      (startTime?.v1 === 2 && endTime?.v1 === 2)
    ) {
      // 判断结束必须大于开始
      if (endTime?.v2 < startTime?.v2) {
        message.warning('结束时间不能小于开始时间')
        err = false
      } else if (endTime?.v2 === startTime?.v2) {
        if (endTime?.v3 < startTime?.v3) {
          message.warning('结束时间不能小于开始时间')
          err = false
        }
      }
    } else if (startTime?.v1 === 1 && endTime?.v1 === 2) {
      if (endTime?.v2 > startTime?.v2) {
        message.warning('结束时间不能大于24小时')
        err = false
      } else if (startTime?.v2 === endTime?.v2) {
        if (endTime?.v3 > startTime?.v3) {
          message.warning('结束时间不能大于24小时')
          err = false
        }
      }
    } else if (startTime?.v1 === 2 && endTime?.v1 === 1) {
      message.warning('开始时间不能小于结束时间')
      err = false
    } else {
      err = true
    }
  }
  // 不能超过一周
  const WeekJudgeTime = () => {
    if (endTime?.v1 > startTime?.v1 + 7) {
      message.warning('开始时间不允许超过一周')
      err = false
    } else if (endTime?.v1 === startTime?.v1 + 7) {
      if (endTime?.v2 > startTime?.v2) {
        message.warning('开始时间不允许超过一周')
        err = false
      } else if (endTime?.v2 === startTime?.v2) {
        if (endTime?.v3 > startTime?.v3) {
          message.warning('开始时间不允许超过一周')
          err = false
        }
      }
    } else {
      err = true
    }
  }
  const getValues = (type: string, v1: number, v2: number, v3: number) => {
    if (type === 'start') {
      startTime = {
        v1,
        v2,
        v3,
      }
      setStartTimes(startTime)
    } else if (type === 'end') {
      endTime = {
        v1,
        v2,
        v3,
      }
      setEndTimes(endTime)
    } else if (type === 'remind') {
      if (props.type === 'day') {
        remindTime = {
          v2,
          v3,
        }
      } else if (props.type === 'week' || props.type === 'month') {
        remindTime = {
          v1,
          v2,
          v3,
        }
      }
      setRemindTimes(remindTime)
    }
    if (props.type === 'day') {
      dayJudgeTime()
    } else if (props.type === 'week') {
      WeekJudgeTime()
    }
    dispatch(setErr(err))
  }
  const setValues = (val: any) => {
    setEndTimes(val)
  }
  return (
    <>
      {props.type === 'day' ? (
        <>
          <Form.Item label="" name="is_holiday">
            <CheckBox title={'跟随中国法定节假日自动调整'} />
          </Form.Item>
          <Form.Item
            label=""
            name="day"
            style={{
              marginBottom: '32px',
            }}
          >
            <CheckBoxGroup />
          </Form.Item>
        </>
      ) : null}
      {/* 不重复是时间插件*/}
      {props.type === 'doNot' ? null : (
        <Form.Item
          style={{
            marginBottom: '32px',
          }}
          label="开始时间"
          name="start_time"
        >
          {props.type === 'day' ||
          props.type === 'week' ||
          props.type === 'month' ? (
            <Picker
              value={startTimes}
              type={props.type}
              pickerType="start"
              getValues={(v1: number, v2: number, v3: number) =>
                getValues('start', v1, v2, v3)
              }
            />
          ) : null}
        </Form.Item>
      )}

      <Form.Item
        style={{
          margin: '32px 0 16px 0',
        }}
        label="截止时间"
        name="end_time"
      >
        {props.type === 'day' ||
        props.type === 'week' ||
        props.type === 'month' ? (
          <Picker
            getValues={(v1, v2, v3) => getValues('end', v1, v2, v3)}
            type={props.type}
            pickerType="end"
            value={endTimes}
          />
        ) : (
          <DatePicker1
            value={endTimes}
            datePickValue={(val: any) => {
              setValues(val)
            }}
          />
        )}
      </Form.Item>
      <RowStyle>
        <Form.Item style={{ marginRight: 48 }} label="" name="is_supply">
          <CheckBox title="截止时间后允许补交" />
        </Form.Item>
        {props.type === 'doNot' ? null : (
          <Form.Item label="" name="hand_scope">
            <SupScope type={props.type} />
          </Form.Item>
        )}
      </RowStyle>
      <Form.Item label="" name="is_cycle_limit">
        <CheckBox title="每个周限填一次" />
      </Form.Item>
      <Form.Item label="" name="is_submitter_edit">
        <CheckBox title="提交汇报提交人可修改" />
      </Form.Item>
      <Form.Item
        style={{
          marginTop: '32px',
        }}
        label=""
        name="auto_reminder"
      >
        <Edit />
      </Form.Item>
      <Form.Item
        style={{
          marginTop: '16px',
          marginBottom: '44px',
        }}
        label="提醒时间"
        name="reminder_time"
      >
        <Picker
          getValues={(v1, v2, v3) => getValues('remind', v1, v2, v3)}
          value={remindTimes}
          type={props.type}
          pickerType="remind"
        />
      </Form.Item>
    </>
  )
}

export default FormMain
