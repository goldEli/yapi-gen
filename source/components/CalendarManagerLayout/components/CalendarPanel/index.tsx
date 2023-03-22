import styled from '@emotion/styled'
import React from 'react'
import CalendarPanelToolBar from '../CalendarPanelToolBar'
import CalendarYear from '../CalendarYear'

interface CalendarPanelProps {
  children?: React.ReactDOM
}

const Box = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const CalendarPanel: React.FC<CalendarPanelProps> = props => {
  return (
    <Box>
      <CalendarPanelToolBar />
      <div>
        <CalendarYear />
      </div>
    </Box>
  )
}

export default CalendarPanel
