import CustomSelect from '@/components/CustomSelect'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import { setCalendarPanelType } from '@store/calendar'
import { Select } from 'antd'
import React from 'react'

interface CalendarPanelToolBarProps {
  children?: React.ReactDOM
}

const Box = styled.div`
  width: 100%;
  height: 32px;
  display: flex;
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
    state => state.calendar.calendarPanelType,
  )
  const dispatch = useDispatch()

  return (
    <Box>
      <div>今天 2023年</div>
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
