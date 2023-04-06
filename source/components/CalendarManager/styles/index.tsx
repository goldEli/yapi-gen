import styled from '@emotion/styled'
import dayjsGenerateConfig from 'rc-picker/es/generate/dayjs'
import generateCalendar from 'antd/es/calendar/generateCalendar'
import { Dayjs } from 'dayjs'

const Calendar = generateCalendar<Dayjs>(dayjsGenerateConfig)

export const CalenderBox = styled.div`
  display: flex;
  height: calc(100vh - 56px);
`

export const CalenderBoxLeftArea = styled.div`
  box-sizing: border-box;
  background: var(--neutral-n9);
  height: 100%;
  display: flex;
  gap: 24px;
  min-width: 288px;
`

export const CalenderBoxRightArea = styled.div`
  flex: 1;
  height: 100%;
  overflow: auto;
`

export const CreateScheduleBtn = styled.span`
  width: 100%;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  .btnText {
    line-height: 31px;
  }
`

export const StyledCalendar = styled(Calendar)`
  width: 100%;
  min-width: 240px;
  font-family: SiYuanMedium;
  .ant-picker-panel {
    background: var(--neutral-n9);
    border-top: none;
  }
  .ant-picker-cell .ant-picker-cell-inner {
    border-radius: 50%;
  }
  .ant-picker-cell-in-view.ant-picker-cell-today
    .ant-picker-cell-inner::before {
    border-radius: 50%;
  }
  .ant-picker-date-panel .ant-picker-content th {
    width: 24px;
    height: 24px;
    font-size: 12px;
    color: var(--neutral-n3);
    margin-top: 8px;
  }
  .ant-picker-date-panel .ant-picker-content td {
    width: 24px;
    height: 24px;
    font-size: 14px;
  }
  .ant-picker-body {
    padding: 0 !important;
  }
  .ant-picker-cell-today .ant-picker-calendar-date-value {
    color: var(--primary-d1);
  }
  .ant-picker-cell-selected {
    .ant-picker-cell-inner {
      background: var(--primary-d2);
    }
    .ant-picker-calendar-date-value {
      color: var(--neutral-white-d7);
    }
  }
  .ant-picker-cell-today .ant-picker-cell-inner::before {
    border: 1px solid var(--primary-d1);
  }
`

export const CalendarSidebarBox = styled.div<{ collapse: boolean }>`
  width: ${props => (props.collapse ? 0 : 200)}px;
  height: 100%;
  align-items: center;
  max-width: unset !important;
  min-width: unset !important;
  flex: unset !important;
  border-right: 1px solid var(--neutral-n6-d1);
  background: ${props =>
    props.collapse ? 'var(--neutral-white-d6)' : 'var(--neutral-n9)'};
  position: relative;
`

export const FoldIcon = styled.div`
  position: absolute;
  top: 24px;
  width: 24px;
  height: 24px;
  background: var(--neutral-white-d3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 2px 6px 0px rgba(24, 43, 71, 0.12);
  z-index: 2;
  right: -12px;
  cursor: pointer;
  :hover svg {
    color: var(--primary-d1);
  }
`

export const CalendarSidebarMain = styled.div<{ firstMenuCollapse: boolean }>`
  height: 100%;
  width: 100%;
  overflow: hidden;
  transition: all 0.3s;
  display: ${props => (props.firstMenuCollapse ? 'none' : 'block')};
`

export const CalendarSetBox = styled.div`
  width: 90%;
  height: 44px;
  cursor: pointer;
  background: var(--neutral-n9);
  position: absolute;
  bottom: 0px;
  white-space: nowrap;
  overflow: hidden;
  padding-bottom: 8px;
  .box {
    display: flex;
    align-items: center;
    height: 100%;
    div {
      font-size: 14px;
      color: var(--neutral-n1-d2);
      margin-left: 12px;
    }
    &:hover {
      div,
      svg {
        color: var(--primary-d2) !important;
      }
    }
  }
`

export const ManagerListBox = styled.div`
  min-height: 120px;
  height: calc(100% - 476px);
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 52px;
`
