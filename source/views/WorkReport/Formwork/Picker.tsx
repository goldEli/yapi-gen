/* eslint-disable complexity */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-useless-concat */
import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { Input, Popover } from 'antd'
import { useEffect, useState } from 'react'
import {
  startWeekData,
  endWeekData,
  nextMonthDay,
  hourData,
  minuteData,
  data,
  dayData,
} from './DataList'
const PickerStyle = styled.div`
  width: 360px;
  height: 232px;
  background-color: var(--neutral-white-d6);
  color: var(--neutral-n2);
  font-size: 14px;
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  display: flex;
`
const LeftTime1 = styled.div`
  width: 175px;
  height: 232px;
  overflow-y: auto;
  border-right: 1px solid var(--neutral-n6-d2);
`
const LeftTime = styled.div`
  width: 120px;
  height: 232px;
  overflow-y: auto;
  border-right: 1px solid var(--neutral-n6-d2);
`
const CenterTime = styled.div`
  width: 120px;
  height: 232px;
  overflow-y: auto;
  border-right: 1px solid var(--neutral-n6-d2);
`
const RightTime = styled.div`
  width: 120px;
  height: 232px;
  overflow-y: auto;
`
const Item = styled.div`
  width: 100%;
  padding: 0 16px;
  height: 32px;
  line-height: 32px;
  &:hover {
    cursor: pointer;
    background-color: var(--hover-d3);
    color: var(--neutral-n1-d1);
  }
`
const InputStyle = styled(Input)({
  width: '320px',
})

interface PropsType {
  // remind 代表提醒时间
  pickerType: string
  // 每天 day ,每周 week , 每月 month , 不重复doNot
  type: string
  getValues(val1: number, val2: number, val3: number): void
  value: any
  onChange?(values: any): void
}
interface Item {
  label: string
  key?: number
}
let v1 = 0
let v2 = 0
let v3 = 0
const Picker = (props: PropsType) => {
  const [leftActive, setLeftActive] = useState<number>(-1)
  const [centerActive, setCenterActive] = useState<number>(-1)
  const [rightActive, setRightActive] = useState<number>(-1)
  const [leftActiveVal, setLeftActiveVal] = useState<number>(-1)
  const [centerActiveVal, setCenterActiveVal] = useState<number>(-1)
  const [rightActiveVal, setRightActiveVal] = useState<number>(-1)
  const [leftDataList, setLeftDataList] = useState<Array<Item>>()
  const [rightDataList, setRightDataList] = useState<Array<Item>>()
  const [centerDataList, setCenterDataList] = useState<Array<Item>>()
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState('')
  // 计算每月多少天
  const getCountDays = () => {
    var curDate = new Date()
    curDate.setDate(32)
    return 32 - curDate.getDate()
  }
  // 每天提醒时间只有时(提前24h)和分
  // 每周提醒时间(提前0-5)天时和分
  // 每月提醒时间(提前0-30天)天时和分
  useEffect(() => {
    setCenterDataList([])
    setLeftDataList([])
    setRightDataList([])
    setLeftActive(-1)
    setCenterActive(-1)
    setRightActive(-1)
    if (props.type === 'day' && props.pickerType === 'start') {
      // 每天，开始时间
      setLeftDataList(data)
      setCenterDataList(hourData)
      setRightDataList(minuteData)
    } else if (props.type === 'day' && props.pickerType === 'end') {
      // 每天，结束时间
      setLeftDataList(data)
      setCenterDataList(hourData)
      setRightDataList(minuteData)
    } else if (props.type === 'day' && props.pickerType === 'remind') {
      // 每天，提醒时间 去掉rightDataList,展示3栏 --- 每天提醒时间只有时(提前24h)和分
      setCenterDataList(hourData)
      setRightDataList(minuteData)
    } else if (props.type === 'week' && props.pickerType === 'start') {
      // 每周，开始时间
      setLeftDataList(startWeekData)
      setCenterDataList(hourData)
      setRightDataList(minuteData)
    } else if (props.type === 'week' && props.pickerType === 'end') {
      // 每周，结束时间
      setLeftDataList(endWeekData)
      setCenterDataList(hourData)
      setRightDataList(minuteData)
    } else if (props.type === 'week' && props.pickerType === 'remind') {
      // 每周，提醒时间 --- 每周提醒时间(提前0-5)天时和分
      setLeftDataList(dayData.filter(el => el.key <= 5))
      setCenterDataList(hourData)
      setRightDataList(minuteData)
    } else if (props.type === 'month' && props.pickerType === 'start') {
      // 每月，开始时间 - 从25-次月的15日
      const day = dayData.filter(el => el.key >= 25 && el.key <= 31)
      setLeftDataList([...day, ...nextMonthDay])
      setCenterDataList(hourData)
      setRightDataList(minuteData)
    } else if (props.type === 'month' && props.pickerType === 'end') {
      // 每月，开始时间 - 从25-次月的15日
      const day = dayData.filter(el => el.key >= 26 && el.key <= 31)
      setLeftDataList([...day, ...nextMonthDay])
      setCenterDataList(hourData)
      setRightDataList(minuteData)
    } else if (props.type === 'month' && props.pickerType === 'remind') {
      // 每月，提醒时间 --- 30天
      setLeftDataList(dayData)
      setCenterDataList(hourData)
      setRightDataList(minuteData)
    } else if (props.type === 'doNot' && props.pickerType === 'remind') {
      // 不重复--提醒时间
      setLeftDataList(dayData)
      setCenterDataList(hourData)
      setRightDataList(minuteData)
    }
  }, [isOpen, props.type])
  useEffect(() => {
    setValue('')
  }, [props.type])
  const getTime = () => {
    setIsOpen(false)
    props.getValues(leftActiveVal, centerActiveVal, rightActiveVal)
    props.onChange?.({
      v1: leftActiveVal,
      v2: centerActiveVal,
      v3: rightActiveVal,
    })
  }
  // 需要中文
  const getLabelName = (num: number) => {
    switch (num) {
      case 0:
        return '周一'
      case 1:
        return '周二'
      case 2:
        return '周三'
      case 3:
        return '周四'
      case 4:
        return '周五'
      case 5:
        return '周六'
      case 6:
        return '周日'
      case 7:
        return '次周一'
      case 8:
        return '次周二'
      case 9:
        return '次周三'
      case 10:
        return '次周四'
      case 11:
        return '次周五'
      case 12:
        return '次周六'
      case 13:
        return '次周日'
    }
  }
  // 周
  const getWeekValues = () => {
    if (props.pickerType === 'remind') {
      setValue(
        '截止时间前' + '/' + v1 + '日' + '/' + v2 + '时' + '/' + v3 + '分',
      )
    } else {
      setValue(getLabelName(v1) + '/' + v2 + '时' + '/' + v3 + '分')
    }
  }
  // 天
  const getDayValues = () => {
    // 回显input
    if (props.pickerType === 'remind') {
      setValue('截止时间前' + '/' + v2 + '时' + '/' + v3 + '分')
    } else {
      setValue((v1 == 1 ? '当日' : '次日') + '/' + v2 + '时' + '/' + v3 + '分')
    }
  }
  // 月
  const getMonthValues = () => {
    if (props.pickerType === 'remind') {
      setValue(
        '截止时间前' + '/' + v1 + '日' + '/' + v2 + '时' + '/' + v3 + '分',
      )
    } else {
      const arr = [...nextMonthDay, ...dayData]
      const label = arr.find((el: any) => el.key === v1)?.label
      setValue(label + '/' + v2 + '时' + '/' + v3 + '分')
    }
  }
  useEffect(() => {
    if (!props?.value) {
      return
    }
    v1 = props?.value?.v1
    v2 = props?.value?.v2
    v3 = props?.value?.v3
    setLeftActiveVal(props?.value?.v1)
    setCenterActiveVal(props?.value?.v2)
    setRightActiveVal(props?.value?.v3)
    if (props.type === 'day') {
      getDayValues()
    } else if (props.type === 'week') {
      getWeekValues()
    } else if (props.type === 'month') {
      getMonthValues()
    }
  }, [props.value])
  const content = () => {
    return (
      <PickerStyle>
        {/* 提醒时间才有 */}
        {props.pickerType === 'remind' ? (
          <LeftTime1>{<Item>截止时间前</Item>}</LeftTime1>
        ) : null}
        {props.type === 'day' && props.pickerType === 'remind' ? null : (
          <LeftTime>
            {leftDataList?.map((el: any, index: number) => (
              <Item
                key={el.label}
                onClick={() => {
                  setLeftActive(index), setLeftActiveVal(el.key)
                }}
                style={{
                  color:
                    leftActive === index
                      ? 'var(--primary-d2)'
                      : 'var(--neutral-n2)',
                }}
              >
                {el.label}
              </Item>
            ))}
          </LeftTime>
        )}
        <CenterTime>
          {centerDataList?.map((el: any, index: number) => (
            <Item
              key={el.label}
              onClick={() => {
                setCenterActive(index), setCenterActiveVal(el.key)
              }}
              style={{
                color:
                  centerActive === index
                    ? 'var(--primary-d2)'
                    : 'var(--neutral-n2)',
              }}
            >
              {el.label}
            </Item>
          ))}
        </CenterTime>
        <RightTime>
          {rightDataList?.map((el: any, index: number) => (
            <Item
              key={el.label}
              onClick={() => {
                setRightActive(index), setRightActiveVal(el.key)
              }}
              style={{
                color:
                  rightActive === index
                    ? 'var(--primary-d2)'
                    : 'var(--neutral-n2)',
              }}
            >
              {el.label}
            </Item>
          ))}
          <Item onClick={getTime}>完成</Item>
        </RightTime>
      </PickerStyle>
    )
  }
  return (
    <div>
      <InputStyle
        type="text"
        value={value}
        suffix={
          <Popover
            open={isOpen}
            placement="bottomRight"
            title={''}
            content={content}
            trigger="click"
          >
            <CommonIconFont
              type="time"
              size={16}
              color="var(--neutral-n4)"
              onClick={() => setIsOpen(!isOpen)}
            />
          </Popover>
        }
      />
    </div>
  )
}
export default Picker
