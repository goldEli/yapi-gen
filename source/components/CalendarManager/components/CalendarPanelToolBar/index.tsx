import CustomSelect from '@/components/CustomSelect'
import styled from '@emotion/styled'
import { setCalendarPanelType, setCalenderYearValue,setCalenderYearType } from '@store/calendarPanle'
import { useDispatch, useSelector } from '@store/index'
import { Select } from 'antd'
import React, { useState } from 'react'
import dayjs from 'dayjs'
import IconFont from '@/components/IconFont'
interface CalendarPanelToolBarProps {
  children?: React.ReactDOM
}

const Box = styled.div`
  width: 100%;
  height: 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top:4px;
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
  const [currentYear, setCurrentYear] = useState(() => dayjs().year())

  const dispatch = useDispatch();
  
  const prevYearClick = () => {
    setCurrentYear(currentYear - 1);
    dispatch(setCalenderYearValue(currentYear - 1))
    dispatch(setCalenderYearType(-1))
  }
  const nextYearClick = () => {
    setCurrentYear(currentYear + 1)
    dispatch(setCalenderYearValue(currentYear + 1))
    dispatch(setCalenderYearType(1))
  }
  const todayClick=()=>{
    setCurrentYear(dayjs().year());
    dispatch(setCalenderYearValue(dayjs().year()))
    dispatch(setCalenderYearType(0))
  }
  return (
    <Box>
      <div style={{
        display: 'flex',
        cursor: 'pointer'
      }}>
        <div onClick={todayClick} style={{
          margin: '0px 10px'
        }}>今天</div>
        <div>
          <span>
            <IconFont type="left" onClick={prevYearClick} />
          </span>
          <span style={{
            margin: '0px 20px',
            fontSize: '16px',
            color: '#323233'
          }}>{currentYear}年</span>
          <span>
            <IconFont type="right" onClick={nextYearClick} />
          </span>
        </div>
      </div>
      <CustomSelect
        value={calendarPanelType}
        style={{
          width: '100px',
          marginLeft: '48px',
        }}
        onChange={(value: Model.Calendar.CalendarPanelType) => {
          dispatch(setCalendarPanelType(value))
        }}
        options={selectOptions}
        allowClear
      />
    </Box>
  )
}

export default CalendarPanelToolBar
