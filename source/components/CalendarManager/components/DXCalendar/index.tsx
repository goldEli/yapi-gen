import React from 'react'
import { StyledCalendar } from '../../styles'

import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import dayLocaleData from 'dayjs/plugin/localeData'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { useDispatch, useSelector } from '@store/index'
import { setCheckedTime } from '@store/calendar'

dayjs.extend(dayLocaleData)
const CalendarHeader = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .icon {
    font-size: 16px;
    color: var(--neutral-n1-d1);
    cursor: pointer;
  }
  .time {
    font-size: 16px;
    color: var(--neutral-n1-d1);
    font-family: SiYuanMedium;
  }
`

const DXCalendar: React.FC = () => {
  const dispatch = useDispatch()
  const { checkedTime } = useSelector(store => store.calendar)

  const wrapperStyle: React.CSSProperties = {
    // width: 240,
    background: 'var(--neutral-n9)',
    //  border: `1px solid ${token.colorBorderSecondary}`,
    //  borderRadius: token.borderRadiusLG,
  }

  console.log(
    checkedTime,
    '=checkedTimecheckedTime',
    new Date().getDate(),
    dayjs('2023-04-09'),
  )

  return (
    <StyledCalendar
      style={wrapperStyle}
      fullscreen={false}
      value={dayjs(checkedTime ? checkedTime : '2023-04-08')}
      onChange={value => {
        dispatch(setCheckedTime(value.format('YYYY-MM-DD')))
      }}
      // onPanelChange={(value, mode) => {
      //   console.log(value.format('YYYY-MM-DD'), mode)
      // }}
      headerRender={({ value, type, onChange, onTypeChange }) => {
        const month = value.month()
        return (
          <CalendarHeader>
            <span
              className="icon"
              onClick={() => {
                const now = value.clone().month(month - 1)
                onChange(now)
              }}
            >
              <IconFont type="left" />
            </span>
            <span className="time">{value.format('YYYY-MM')}</span>
            <span
              className="icon"
              onClick={() => {
                const now = value.clone().month(month + 1)
                onChange(now)
              }}
            >
              <IconFont type="right" />
            </span>
          </CalendarHeader>
        )
      }}
    />
  )
}

export default DXCalendar
