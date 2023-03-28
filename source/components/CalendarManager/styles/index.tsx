import CommonButton from '@/components/CommonButton'
import styled from '@emotion/styled'
import dayjsGenerateConfig from 'rc-picker/es/generate/dayjs'
import generateCalendar from 'antd/es/calendar/generateCalendar'
import { Dayjs } from 'dayjs'

const Calendar = generateCalendar<Dayjs>(dayjsGenerateConfig)

export const CalenderBox = styled.div`
  display: flex;
  height: 100%;
`

export const CalenderBoxLeftArea = styled.div`
  width: 288px;
  box-sizing: border-box;
  padding: 24px;
  background: var(--neutral-n9);
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const CalenderBoxRightArea = styled.div`
  flex: 1;
  height: 100%;
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
  .ant-picker-cell .ant-picker-cell-inner {
    border-radius: 50%;
  }
  .ant-picker-cell-in-view.ant-picker-cell-today
    .ant-picker-cell-inner::before {
    border-radius: 50%;
  }
  .ant-picker-date-panel .ant-picker-content th {
    width: 24px;
  }
`
