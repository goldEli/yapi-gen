/* eslint-disable @typescript-eslint/ban-types */
import CustomSelect from '@/components/CustomSelect'
import styled from '@emotion/styled'
import {
  setCalendarPanelType,
  setScheduleInfoDropdown,
  clearCalenderValue,
  setCalenderTypeValue,
} from '@store/calendarPanle'
import { setCheckedTime } from '@store/calendar'
import { useDispatch, useSelector } from '@store/index'
import React, { useState, useRef, useEffect, useReducer } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs, { Dayjs } from 'dayjs'
import _ from 'lodash'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import IconFont from '@/components/IconFont'
import InputSearch from '@/components/InputSearch'
import { useTranslation } from 'react-i18next'
import { clearScheduleList } from '@store/schedule'
import { TodayButton } from '../../styles'
import { formatYYYYMMDD } from '../../config'
dayjs.extend(weekOfYear)

interface CalendarPanelToolBarProps {
  children?: React.ReactDOM
}
const Box = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  background: #fff;
  position: sticky;
  top: 0px;
  left: 0px;
  z-index: 100;
  height: 70px;
  flex-shrink: 0;
`
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
  const calenderTypeValue = useSelector(
    state => state.calendarPanel.calenderTypeValue,
  )
  const [dateText, setDateText] = useState<string>()
  useEffect(() => {
    const maps = new Map([
      ['day', dayjs(calenderTypeValue).format('YYYY年M月D日')],
      ['week', dayjs(calenderTypeValue).format('YYYY年M月')],
      ['month', dayjs(calenderTypeValue).format('YYYY年M月')],
      ['year', dayjs(calenderTypeValue).format('YYYY年')],
      ['list', dayjs(calenderTypeValue).format('YYYY年M月')],
    ])
    setDateText(maps.get(calendarPanelType) as string)
    dispatch(setCheckedTime(calenderTypeValue))
  }, [calendarPanelType, calenderTypeValue])

  const iconTypeRef = useRef<number>(0)

  const dispatch = useDispatch()

  const changeCalendarDate = () => {
    const { current } = iconTypeRef
    let newCalendarPanelType = calendarPanelType
    if (newCalendarPanelType === 'list') {
      newCalendarPanelType = 'month'
    }
    if (current === 1) {
      dispatch(
        setCalenderTypeValue(
          dayjs(calenderTypeValue)
            .add(1, newCalendarPanelType)
            .format(formatYYYYMMDD),
        ),
      )
    } else if (current === -1) {
      dispatch(
        setCalenderTypeValue(
          dayjs(calenderTypeValue)
            .subtract(1, newCalendarPanelType)
            .format(formatYYYYMMDD),
        ),
      )
    } else {
      dispatch(setCalenderTypeValue(dayjs().format(formatYYYYMMDD)))
    }
  }

  const prevYearClick = () => {
    iconTypeRef.current = -1
    changeCalendarDate()
  }

  const nextYearClick = () => {
    iconTypeRef.current = 1
    changeCalendarDate()
  }
  const todayClick = () => {
    iconTypeRef.current = 0
    changeCalendarDate()
  }
  return (
    <Box>
      <div
        style={{
          display: 'flex',
          cursor: 'pointer',
        }}
      >
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
            dispatch(setCalendarPanelType(value))
            dispatch(clearCalenderValue())
            dispatch(
              setScheduleInfoDropdown({ schedule_id: 0, visible: false }),
            )
            dispatch(setCheckedTime(dayjs().format('YYYY-MM-DD')))
          }}
          options={selectOptions}
        />
        <InputSearch
          placeholder={t('calendarManager.search_schedule')}
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
