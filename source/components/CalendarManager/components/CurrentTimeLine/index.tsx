import styled from '@emotion/styled'
import dayjs from 'dayjs'
import React, { memo, useMemo } from 'react'
import { getDistanceByTime } from '../../utils'

interface CurrentTimeLineProps {
  time: number
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
    font-weight: 500;
    top: -10px;
    left: -42px;
    color: #f842af;
    background: var(--neutral-white-d1);
  }
`

const CurrentTimeLine: React.FC<CurrentTimeLineProps> = props => {
  const time = useMemo(() => {
    return dayjs(props.time).format('hh:mm')
  }, [props.time])
  const top = useMemo(() => {
    return getDistanceByTime(props.time)
  }, [props.time])
  console.log({ top }, props.time)
  return (
    <CurrentLine top={top}>
      <span className="time">{time}</span>
    </CurrentLine>
  )
}

export default memo(CurrentTimeLine)
