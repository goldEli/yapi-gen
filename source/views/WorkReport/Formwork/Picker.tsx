/* eslint-disable complexity */
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
  width: '232px',
})

interface PropsType {
  // remind 代表提醒时间
  pickerType: string
  // 每天 day ,每周 week , 每月 month , 不重复doNot
  type: string
}
interface Item {
  label: string
  key?: number
}
const Picker = (props: PropsType) => {
  const [leftActive, setLeftActive] = useState<number>(-1)
  const [centerActive, setCenterActive] = useState<number>(-1)
  const [rightActive, setRightActive] = useState<number>(-1)
  const [leftDataList, setLeftDataList] = useState<Array<Item>>()
  const [rightDataList, setRightDataList] = useState<Array<Item>>()
  const [centerDataList, setCenterDataList] = useState<Array<Item>>()
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
      const day = dayData.filter(el => el.key >= 25 && el.key <= getCountDays())
      setLeftDataList([...day, ...nextMonthDay])
      setCenterDataList(hourData)
      setRightDataList(minuteData)
    } else if (props.type === 'month' && props.pickerType === 'end') {
      // 每月，开始时间 - 从25-次月的15日
      const day = dayData.filter(el => el.key >= 26 && el.key <= getCountDays())
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
  }, [props.type])

  const content = () => {
    return (
      <PickerStyle>
        {/* 提醒时间才有 */}
        {props.pickerType === 'remind' ? (
          <LeftTime1>{<Item>截止时间前</Item>}</LeftTime1>
        ) : null}
        {props.type === 'day' && props.pickerType === 'remind' ? null : (
          <LeftTime>
            {leftDataList?.map((el: { label: string }, index: number) => (
              <Item
                key={el.label}
                onClick={() => setLeftActive(index)}
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
          {centerDataList?.map((el: { label: string }, index: number) => (
            <Item
              key={el.label}
              onClick={() => setCenterActive(index)}
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
          {rightDataList?.map((el: { label: string }, index: number) => (
            <Item
              key={el.label}
              onClick={() => setRightActive(index)}
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
        </RightTime>
      </PickerStyle>
    )
  }
  return (
    <div>
      <InputStyle
        type="text"
        suffix={
          <Popover
            placement="bottomRight"
            title={''}
            content={content}
            trigger="click"
          >
            <CommonIconFont type="alarm" size={16} color="var(--neutral-n4)" />
          </Popover>
        }
      />
    </div>
  )
}
export default Picker
