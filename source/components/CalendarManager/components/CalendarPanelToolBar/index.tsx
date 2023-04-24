/* eslint-disable @typescript-eslint/ban-types */
import CustomSelect from '@/components/CustomSelect'
import styled from '@emotion/styled'
import { css } from '@emotion/css'
import {
  setCalendarPanelType,
  setCalenderDayValue,
  setCalenderWeekValue,
  setCalenderMonthValue,
  setCalenderYearValue,
  setCalenderListValue,
  setCalenderYearWeekValue,
  setScheduleInfoDropdown,
} from '@store/calendarPanle'
import { setCheckedTime } from '@store/calendar'
import { useDispatch, useSelector } from '@store/index'
import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs, { Dayjs } from 'dayjs'
import _ from 'lodash'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import IconFont from '@/components/IconFont'
import InputSearch from '@/components/InputSearch'
import { useTranslation } from 'react-i18next'
import CommonButton from '@/components/CommonButton'
import { clearScheduleList } from '@store/schedule'
import { TodayButton } from '../../styles'
dayjs.extend(weekOfYear)

interface CalendarPanelToolBarProps {
  children?: React.ReactDOM
}
const Box = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
  top: 4px;
  z-index: 100;
  background: #fff;
  position: sticky;
  top: 0px;
  left: 0px;
  z-index: 100;
  height: 70px;
  flex-shrink: 0;
`
const CalendarPanelToolBar: React.FC<CalendarPanelToolBarProps> = props => {
  const navigate = useNavigate()
  const [t] = useTranslation()
  const [selectOptions, setSelectOptions] = useState<
    { value: Model.Calendar.CalendarPanelType; label: string }[]
  >([
    { value: 'day', label: t('calendarManager.day') },
    { value: 'week', label: t('calendarManager.week') },
    { value: 'month', label: t('calendarManager.month') },
    { value: 'year', label: t('calendarManager.year') },
    { value: 'list', label: t('calendarManager.list') },
  ])
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

  const dayValue = useRef<string>()
  const monthValue = useRef<string>()

  useEffect(() => {
    if (!checkedTime) {
      dispatch(setCalenderDayValue(dayjs().format('YYYY-MM-DD')))
      return
    }
    const selectedMonth = dayjs(checkedTime)
    const firstDay = dayjs(selectedMonth).startOf('month').format('YYYY-MM-DD')
    if (calendarPanelType === 'day') {
      dispatch(setCalenderDayValue(dayjs(checkedTime).format('YYYY-M-D')))
    } else if (calendarPanelType === 'week') {
      dispatch(setCalenderWeekValue(dayjs(checkedTime).format('YYYY-MM')))
    } else if (calendarPanelType === 'month') {
      dispatch(setCalenderMonthValue(dayjs(checkedTime).format('YYYY-MM')))
    } else if (calendarPanelType === 'list') {
      dispatch(setCalenderListValue(checkedTime))
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

  const iconTypeRef = useRef<number>(0)

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
      &:hover {
        color: var(--primary-d2);
      }
    }
  `
  const TodayWrap = styled.div`
    margin: 0px 10px;
    border: 1px solid var(--neutral-n6-d1);
    border-radius: 4px;
    padding: 0px 10px;
    height: 32px;
    display: flex;
    align-items: center;
    color: var(--neutral-n2);
    &:hover {
      background: #f6f7f9;
    }
  `
  const disables = css`
    background: #f6f7f9;
  `
  const listenDay = (): void => {
    const { current } = iconTypeRef
    if (current === 1) {
      dispatch(
        setCalenderDayValue(
          dayjs(calenderDayValue).add(1, 'day').format('YYYY-MM-DD'),
        ),
      )

      dayValue.current = dayjs(calenderDayValue)
        .add(1, 'day')
        .format('YYYY-MM-DD')
    } else if (current === -1) {
      dispatch(
        setCalenderDayValue(
          dayjs(calenderDayValue).subtract(1, 'day').format('YYYY-MM-DD'),
        ),
      )
      dayValue.current = dayjs(calenderDayValue)
        .subtract(1, 'day')
        .format('YYYY-MM-DD')
    } else {
      dispatch(setCalenderDayValue(dayjs().format('YYYY-MM-DD')))
      dayValue.current = dayjs().format('YYYY-MM-DD')
    }
    dispatch(setCheckedTime(dayValue.current))
  }
  const listenWeek = (): void => {
    const { current } = iconTypeRef
    let newWeekValue = null
    if (current === 1) {
      //dayjs('2018-06-27').week()
      dispatch(
        setCalenderWeekValue(
          dayjs(calenderWeekValue).add(1, 'week').format('YYYY-M-D'),
        ),
      )
      newWeekValue = dayjs(calenderWeekValue).add(1, 'week').format('YYYY-M-D')
    } else if (current === -1) {
      dispatch(
        setCalenderWeekValue(
          dayjs(calenderWeekValue).subtract(1, 'week').format('YYYY-M-D'),
        ),
      )
      newWeekValue = dayjs(calenderWeekValue)
        .subtract(1, 'week')
        .format('YYYY-M-D')
    } else {
      dispatch(setCalenderWeekValue(dayjs().format('YYYY-M-D')))
      newWeekValue = dayjs().format('YYYY-M-D')
    }
    let yearWeekValue =
      dayjs(newWeekValue).year() + '/' + dayjs(newWeekValue).week()
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
      monthValue.current = dayjs(calenderMonthValue)
        .add(1, 'month')
        .format('YYYY-MM')
    } else if (current === -1) {
      dispatch(
        setCalenderMonthValue(
          dayjs(calenderMonthValue).subtract(1, 'month').format('YYYY-MM'),
        ),
      )
      monthValue.current = dayjs(calenderMonthValue)
        .subtract(1, 'month')
        .format('YYYY-MM')
    } else {
      dispatch(setCalenderMonthValue(dayjs().format('YYYY-MM')))
      monthValue.current = dayjs().format('YYYY-MM')
    }
    dispatch(setCheckedTime(monthValue.current))
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
  const prevYearClick = (e: any) => {
    e.stopPropagation()
    iconTypeRef.current = -1
    let methods = maps.get(calendarPanelType) as Function
    methods()
  }

  const nextYearClick = (e: any) => {
    console.log(e)
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
        {/* <TodayWrap onClick={todayClick}> {t('today')}</TodayWrap> */}
        <TodayButton onClick={todayClick}> {t('today')}</TodayButton>
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
            width: '90px',
            marginRight: '10px',
          }}
          onChange={(value: Model.Calendar.CalendarPanelType) => {
            // 清空日程
            dispatch(clearScheduleList())
            setInputDefaultValue('')
            dispatch(setCalendarPanelType(value))
            dispatch(setCalenderDayValue(dayjs().format('YYYY-MM-DD')))
            dispatch(setCalenderWeekValue(dayjs().format('YYYY-M-D')))
            dispatch(setCalenderMonthValue(dayjs().format('YYYY-MM')))
            dispatch(setCalenderYearValue(dayjs().format('YYYY')))
            dispatch(setCalenderListValue(dayjs().format('YYYY-MM')))
            dispatch(
              setScheduleInfoDropdown({ schedule_id: 0, visible: false }),
            )
            dispatch(setCheckedTime(dayjs().format('YYYY-MM-DD')))
          }}
          options={selectOptions}
        />
        <InputSearch
          placeholder={t('calendarManager.search_schedule')}
          defaultValue={inputDefaultValue}
          width={184}
          onChangeSearch={value => {}}
          onFocus={() => {
            navigate('/ScheduleSearch')
          }}
        ></InputSearch>
      </div>
    </Box>
  )
}

export default CalendarPanelToolBar
