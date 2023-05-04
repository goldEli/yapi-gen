import useCurrentTime from '@/components/CalendarManager/hooks/useCurrentTime'
import { getDistanceByTime } from '@/components/CalendarManager/utils'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import dayjs from 'dayjs'
import React, { memo, useMemo } from 'react'

interface CurrentTimeLineProps {
  // time: number
}

const CurrentLine = styled.div`
  border-top: 1px solid #f842af;
  width: calc(100% - 58px);
  position: absolute;
  top: ${(props: { top: number }) => props.top + 'px'};
  left: 58px;
  &:before {
    content: ' ';
    width: 8px;
    height: 8px;
    background: #f842af;
    position: absolute;
    top: -4px;
    left: 0;
    border-radius: 50%;
  }
  .time {
    font-size: 12px;
    font-family: SiYuanMedium;
    top: -10px;
    left: -42px;
    color: #f842af;
    background: var(--neutral-white-d1);
  }
`

const CurrentTimeLine: React.FC<CurrentTimeLineProps> = props => {
  const { currentTime } = useCurrentTime()
  const time = useMemo(() => {
    return currentTime.format('HH:mm')
  }, [currentTime])
  const top = useMemo(() => {
    return getDistanceByTime(currentTime.valueOf())
  }, [currentTime])
  const { calenderTypeValue } = useSelector(store => store.calendarPanel)
  const visible = useMemo(() => {
    return currentTime.isSame(dayjs(calenderTypeValue), 'day')
  }, [calenderTypeValue, currentTime])

  if (!visible) {
    return <></>
  }
  return (
    <CurrentLine top={top}>
      <span className="time">{time}</span>
    </CurrentLine>
  )
}

export default memo(CurrentTimeLine)
