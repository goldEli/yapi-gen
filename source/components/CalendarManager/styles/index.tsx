import styled from '@emotion/styled'
import dayjsGenerateConfig from 'rc-picker/es/generate/dayjs'
import generateCalendar from 'antd/es/calendar/generateCalendar'
import { Dayjs } from 'dayjs'
import { Form, Space } from 'antd'

const Calendar = generateCalendar<Dayjs>(dayjsGenerateConfig)

export const RepeatTextWrap = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: var(--neutral-n3);
  margin-top: 4px;
`

export const CalenderBox = styled.div`
  display: flex;
  height: calc(100vh - 56px);
  width: 100%;
`

export const CalenderBoxLeftArea = styled.div`
  box-sizing: border-box;
  background: var(--neutral-n9);
  height: 100%;
  display: flex;
  gap: 24px;
  width: 288px;
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
    background: transparent;
    border-top: none;
  }
  .ant-picker-cell .ant-picker-cell-inner {
    border-radius: 50%;
  }
  .ant-picker-cell-in-view.ant-picker-cell-today
    .ant-picker-cell-inner::before {
    border-radius: 50%;
  }
  .ant-picker-date-panel .ant-picker-content thead {
  }
  .ant-picker-date-panel .ant-picker-content th {
    width: 24px;
    height: 24px;
    font-size: 12px;
    color: var(--neutral-n3);
    margin-top: 8px;
    text-align: left;
    padding-left: 7px;
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

export const CalendarSidebarBox = styled.div<{ collapse?: boolean }>`
  width: ${props => (props.collapse ? 0 : 200)}px;
  height: 100%;
  align-items: center;
  border-right: 1px solid var(--neutral-n6-d1);
  background: ${props =>
    props.collapse ? 'var(--neutral-white-d6)' : 'var(--neutral-n9)'};
  position: relative;
`

export const FoldIcon = styled.div`
  position: absolute;
  top: 50%;
  width: 24px;
  transform: translateY(-50%);
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
  &:hover {
    background: var(--primary-d1);
    svg {
      color: var(--neutral-white-d7);
    }
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
  padding-right: 20px;
  width: 100%;
  box-sizing: border-box;
`

export const CreateContent = styled.div`
  display: flex;
  height: 100%;
  height: calc(100% - 136px);
  overflow: auto;
  padding-right: 4px;
  width: 100%;
`

export const CreateContentAll = styled.div`
  display: flex;
  height: 100%;
  height: calc(100% - 136px);
  overflow: auto;
  padding-right: 4px;
  .haveRight {
    width: 50%;
  }
  .notRight {
    width: 100%;
  }
`

export const CreateFormAll = styled(Form)`
  padding: 0 16px 0 24px;
  height: 100%;
  overflow: auto;
`

export const CreateForm = styled(Form)`
  padding: 0 16px 0 24px;
  height: 100%;
  overflow: auto;
  width: 100%;
`

export const CreateFormItemWrap = styled.div`
  display: flex;
  align-items: center;
  .icon {
    font-size: 16px;
    color: var(--neutral-n3);
    margin-right: 4px;
  }
  div {
    font-size: 14px;
    color: var(--neutral-n1-d1);
  }
`

export const TimeWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  .ant-checkbox-wrapper {
    margin-bottom: 5px;
  }
`

export const ItemFlex = styled.div`
  width: 100%;
  .box {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .ant-select {
    width: 80%;
  }
  .select {
    margin-top: 8px;
  }
  .color {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    cursor: pointer;
  }
`

export const ProviderForm = styled.div`
  height: 100%;
  background: var(--neutral-n6-d1);
  width: 1px;
  margin: 0 24px;
`

export const ParticipantItems = styled(Space)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 8px;
`

export const ParticipantItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  border-radius: 6px;
  padding: 0 16px;
  background: var(--neutral-n8);
  .icon {
    margin-left: 8px;
    cursor: pointer;
  }
`

export const CreateScheduleChecks = styled(Space)`
  margin-top: 8px;
  display: flex;
`

export const RepeatModalCheck = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 4px 16px 16px;
  border-radius: 6px;
  background: var(--neutral-n8);
  margin-bottom: 24px;
  .ant-checkbox-group-item {
    margin-right: 32px;
    margin-top: 12px;
  }
`

export const NoticeBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  .ant-select {
    width: 95%;
  }
  .icon {
    font-size: 16px;
    color: var(--neutral-n3);
    cursor: pointer;
  }
`

export const AllDayScheduleItem = styled.div<{
  bg: string
  hoverTextColor: string
}>`
  width: calc(100% - 20px);
  box-sizing: border-box;
  padding-left: 8px;
  background-color: ${props => props.bg};
  font-size: 14px;
  border-radius: 6px;
  color: var(--neutral-n1-d1);
  display: flex;
  align-items: center;
  height: 20px;
  &:hover {
    color: ${props => props.hoverTextColor};
  }
  cursor: pointer;
  display: flex;
  /* gap: 7px; */
  align-items: center;
`

export const EasyScheduleHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  color: var(--neutral-n1-d1);
  font-family: siyuanmedium;
  height: 56px;
  padding: 0 13px 0 24px;
  font-family: SiYuanMedium;
`

export const DayItemBox = styled.div`
  user-select: none;
  width: 100%;
  /* padding: 12px 0; */
  box-sizing: border-box;
  border-color: var(--neutral-n6-d1);
  border-style: solid;
  border-left-width: 1px;
  border-top-width: 1px;
  border-right-width: 0px;
  border-bottom-width: 0px;
  /* height: 100%; */
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: relative;
`

// export const CreateMoveCardBox = styled.div<{
//   width: string | number
//   height: number
//   left: number
//   top: number
//   visible: boolean
// }>`
//   width: ${props =>
//     typeof props.width === 'string' ? props.width : props.width + 'px'};
//   height: ${props => props.height + 'px'};
//   top: ${props => props.top + 'px'};
//   font-size: 12px;
//   line-height: 20px;
//   background-color: var(--primary-d1);
//   position: absolute;
//   left: ${props => props.left + 'px'};
//   display: ${(props: { visible: boolean }) =>
//     props.visible ? 'block' : 'none'};
//   border-radius: 6px;
//   .title {
//     font-size: 12px;
//     line-height: 20px;
//     color: var(--neutral-white-d7);
//     padding-left: 8px;
//   }
//   z-index: 3;
// `

export const CreateScheduleText = styled.div<{
  visible: boolean
  top?: number
}>`
  font-size: 12px;
  box-sizing: border-box;
  padding-left: 8px;
  width: 100%;
  color: var(--neutral-white-d7);
  background-color: var(--primary-d1);
  border-radius: 4px;
  position: absolute;
  top: ${props => (props.top ?? 0) + 'px'};
  left: 0;
  display: ${props => (props.visible ? 'flex' : 'none')};
  height: 22px;
  align-items: center;
`
export const TodayButton = styled.div`
  margin: 0px 10px;
  border: 1px solid var(--neutral-n6-d1);
  border-radius: 4px;
  padding: 0px 10px;
  height: 32px;
  display: flex;
  align-items: center;
  color: var(--neutral-n2);
  &:hover {
    background: var(--hover-d2);
  }
`
