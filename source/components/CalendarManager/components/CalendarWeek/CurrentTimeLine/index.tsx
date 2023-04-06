import useCurrentTime from '@/components/CalendarManager/hooks/useCurrentTime'
import { getDistanceByTime } from '@/components/CalendarManager/utils'
import styled from '@emotion/styled'
import dayjs from 'dayjs'
import React, { memo, useEffect, useMemo, useState } from 'react'
import useMaxWidth from '../hooks/useMaxWidth'
import useWeeks from '../hooks/useWeeks'

interface CurrentTimeLineProps {
  // time: number
}

const CurrentLine = styled.div`
  width: 100%;
  position: absolute;
  top: ${(props: { top: number }) => props.top + 'px'};
  left: 0;

  .time {
    font-size: 12px;
    font-weight: 500;
    top: -10px;
    left: -42px;
    color: #f842af;
    background: var(--neutral-white-d1);
  }
`
interface TimeLineProps {
  width: number
  left: number
}
const TimeLine = styled.div`
  border-top: 1px solid #f842af;
  position: absolute;
  top: 0;
  left: ${(props: TimeLineProps) => props.left + 'px'};
  width: ${(props: TimeLineProps) => props.width + 'px'};
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
`

const CurrentTimeLine: React.FC<CurrentTimeLineProps> = props => {
  const { currentTime } = useCurrentTime()
  const { weeks, getLeftByCurrentWeekDay } = useWeeks()
  const [visible, setVisible] = useState(false)
  const { maxWidth } = useMaxWidth()

  useEffect(() => {
    if (weeks.some(item => currentTime.isSame(dayjs(item), 'day'))) {
      setVisible(true)
    }
  }, [currentTime, weeks])

  const time = useMemo(() => {
    return currentTime.format('HH:mm')
  }, [currentTime])
  const top = useMemo(() => {
    return getDistanceByTime(currentTime.valueOf())
  }, [currentTime])
  const left = useMemo(
    () => getLeftByCurrentWeekDay(currentTime.valueOf()),
    [currentTime],
  )
  if (!visible) {
    return <></>
  }
  return (
    <CurrentLine top={top}>
      <span className="time">{time}</span>
      <div style={{ position: 'relative' }}>
        <TimeLine width={maxWidth} left={left} />
      </div>
    </CurrentLine>
  )
}

export default memo(CurrentTimeLine)