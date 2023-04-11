/* eslint-disable @typescript-eslint/ban-types */
import CustomSelect from '@/components/CustomSelect'
import styled from '@emotion/styled'
import {
  setCalendarPanelType,
  setCalenderDayValue,
  setCalenderWeekValue,
  setCalenderMonthValue,
  setCalenderYearValue,
  setCalenderListValue,
  setScheduleSearchKey,
  setCalenderYearWeekValue,
} from '@store/calendarPanle'
import { useDispatch, useSelector } from '@store/index'
import React, { useState, useRef, useEffect } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import IconFont from '@/components/IconFont'
import InputSearch from '@/components/InputSearch'
dayjs.extend(weekOfYear)

interface CalendarPanelToolBarProps {
  children?: React.ReactDOM
}
const Box = styled.div`
  width: 100%;
  height: 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
`
const selectOptions: {
  value: Model.Calendar.CalendarPanelType
  label: string
}[] = [
  { value: 'day', label: '日' },
  { value: 'week', label: '周' },
  { value: 'month', label: '月' },
  { value: 'year', label: '年' },
  { value: 'list', label: '列表' },
]
const CalendarPanelToolBar: React.FC<CalendarPanelToolBarProps> = props => {
  const calendarPanelType = useSelector(
    state => state.calendarPanel.calendarPanelType,
  )
  const [dateText, setDateText] = useState<string>()
  const [inputDefaultValue, setInputDefaultValue] = useState('')
  //日视图
  const calenderDayValue = useSelector(
    state => state.calendarPanel.calenderDayValue,
  )
  //周视图
  const calenderWeekValue = useSelector(
    state => state.calendarPanel.calenderWeekValue,
  )
  //月视图
  const calenderMonthValue = useSelector(
    state => state.calendarPanel.calenderMonthValue,
  )
  // 年视图初始值
  const calenderYearValue = useSelector(
    state => state.calendarPanel.calenderYearValue,
  )
  // 列表视图初始值
  const calenderListValue = useSelector(
    state => state.calendarPanel.calenderListValue,
  )
  // 左侧日历切换的值
  const checkedTime = useSelector(state => state.calendar.checkedTime)

  useEffect(() => {
    console.log(
      'check-time',
      checkedTime,
      dayjs(checkedTime).format('YYYY-MM-DD'),
    )
    if (!checkedTime) {
      dispatch(setCalenderDayValue(dayjs().format('YYYY-MM-DD')))
      return
    }
    const selectedMonth = dayjs(checkedTime)
    const firstDay = dayjs(selectedMonth).startOf('month').format('YYYY-MM-DD')
    if (calendarPanelType === 'day') {
      dispatch(setCalenderDayValue(firstDay))
    } else if (calendarPanelType === 'month') {
      dispatch(setCalenderMonthValue(dayjs(checkedTime).format('YYYY-MM')))
    } else if (calendarPanelType === 'list') {
      dispatch(setCalenderListValue(firstDay))
    }
  }, [checkedTime])
  useEffect(() => {
    const maps = new Map([
      ['day', dayjs(calenderDayValue).format('YYYY年M月D日')],
      ['week', dayjs(calenderWeekValue).format('YYYY年M月')],
      ['month', dayjs(calenderMonthValue).format('YYYY年M月')],
      ['year', dayjs(calenderYearValue).format('YYYY年')],
      ['list', dayjs(calenderListValue).format('YYYY年M月')],
    ])
    setDateText(maps.get(calendarPanelType) as string)
  }, [
    calendarPanelType,
    calenderListValue,
    calenderYearValue,
    calenderDayValue,
    calenderWeekValue,
    calenderMonthValue,
    // checkedTime,
  ])

  const iconTypeRef = useRef<number>()

  const dispatch = useDispatch()

  const TextBox = styled.div`
    margin: 0px 20px;
    font-size: var(--font16);
    color: var(--neutral-n1-d1);
  `
  const IconBox = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    span {
      font-size: var(--font16);
    }
  `
  const listenDay = (): void => {
    const { current } = iconTypeRef
    if (current === 1) {
      dispatch(
        setCalenderDayValue(
          dayjs(calenderDayValue).add(1, 'day').format('YYYY-MM-DD'),
        ),
      )
    } else if (current === -1) {
      dispatch(
        setCalenderDayValue(
          dayjs(calenderDayValue).subtract(1, 'day').format('YYYY-MM-DD'),
        ),
      )
    } else {
      dispatch(setCalenderDayValue(dayjs().format('YYYY-MM-DD')))
    }
  }
  const listenWeek = (): void => {
    const { current } = iconTypeRef
    console.log(
      'dayjs(calenderWeekValue).week()',
      dayjs(calenderWeekValue).year() + '/' + dayjs(calenderWeekValue).week(),
      calenderWeekValue,
    )
    if (current === 1) {
      //dayjs('2018-06-27').week()
      dispatch(
        setCalenderWeekValue(
          dayjs(calenderWeekValue).add(1, 'week').format('YYYY-M-D'),
        ),
      )
    } else if (current === -1) {
      dispatch(
        setCalenderWeekValue(
          dayjs(calenderWeekValue).subtract(1, 'week').format('YYYY-M-D'),
        ),
      )
    } else {
      dispatch(setCalenderWeekValue(dayjs().format('YYYY-M-D')))
    }
    let yearWeekValue =
      dayjs(calenderWeekValue).year() + '/' + dayjs(calenderWeekValue).week()
    console.log('yearWeekValue----', yearWeekValue)
    dispatch(setCalenderYearWeekValue(yearWeekValue))
  }
  const listenMonth = (): void => {
    const { current } = iconTypeRef
    if (current === 1) {
      dispatch(
        setCalenderMonthValue(
          dayjs(calenderMonthValue).add(1, 'month').format('YYYY-MM'),
        ),
      )
    } else if (current === -1) {
      dispatch(
        setCalenderMonthValue(
          dayjs(calenderMonthValue).subtract(1, 'month').format('YYYY-MM'),
        ),
      )
    } else {
      dispatch(setCalenderMonthValue(dayjs().format('YYYY-MM')))
    }
  }
  const listenYear = (): void => {
    const { current } = iconTypeRef
    if (current === 1) {
      dispatch(
        setCalenderYearValue(
          dayjs(calenderYearValue).add(1, 'year').format('YYYY'),
        ),
      )
    } else if (current === -1) {
      dispatch(
        setCalenderYearValue(
          dayjs(calenderYearValue).subtract(1, 'year').format('YYYY'),
        ),
      )
    } else {
      dispatch(setCalenderYearValue(dayjs().format('YYYY')))
    }
  }
  const listenList = (): void => {
    const { current } = iconTypeRef
    if (current === 1) {
      dispatch(
        setCalenderListValue(
          dayjs(calenderListValue).add(1, 'month').format('YYYY-MM'),
        ),
      )
    } else if (current === -1) {
      dispatch(
        setCalenderListValue(
          dayjs(calenderListValue).subtract(1, 'month').format('YYYY-MM'),
        ),
      )
    } else {
      dispatch(setCalenderListValue(dayjs().format('YYYY-MM')))
    }
  }
  const maps = new Map([
    ['day', listenDay],
    ['week', listenWeek],
    ['month', listenMonth],
    ['year', listenYear],
    ['list', listenList],
  ])
  const prevYearClick = () => {
    iconTypeRef.current = -1
    let methods = maps.get(calendarPanelType) as Function
    methods()
  }

  const nextYearClick = () => {
    iconTypeRef.current = 1
    let methods = maps.get(calendarPanelType) as Function
    methods()
  }
  const todayClick = () => {
    iconTypeRef.current = 0
    let methods = maps.get(calendarPanelType) as Function
    methods()
  }
  return (
    <Box>
      <div
        style={{
          display: 'flex',
          cursor: 'pointer',
        }}
      >
        <div
          onClick={todayClick}
          style={{
            margin: '0px 10px',
          }}
        >
          今天
        </div>
        <IconBox>
          <IconFont type="left" onClick={prevYearClick} />
          <TextBox> {dateText}</TextBox>
          <IconFont type="right" onClick={nextYearClick} />
        </IconBox>
      </div>
      <div style={{ display: 'flex' }}>
        <CustomSelect
          value={calendarPanelType}
          style={{
            width: '80px',
            marginRight: '10px',
          }}
          onChange={(value: Model.Calendar.CalendarPanelType) => {
            setInputDefaultValue('')
            dispatch(setCalendarPanelType(value))
          }}
          options={selectOptions}
          allowClear
        />
        <InputSearch
          placeholder="搜索日程"
          defaultValue={inputDefaultValue}
          width={184}
          onChangeSearch={value => {
            setInputDefaultValue(value)
            dispatch(setScheduleSearchKey(value))
          }}
        ></InputSearch>
      </div>
    </Box>
  )
}

export default CalendarPanelToolBar
