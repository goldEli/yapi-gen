/**
 * 日视图 周视图 可移动的日程
 */
import React, { useMemo } from 'react'
import { Rnd } from 'react-rnd'
import {
  getColor,
  getColorWithOpacityPointOne,
} from '@/components/CalendarManager/utils'
import useColor from '../../hooks/useColor'
import { Content, MoveCardBox, Time, TimeRange, Title } from './styled'

type ScheduleCardProps = {
  data: Model.Schedule.Info | null
  children?: React.ReactNode
  timeRange: {
    start_timestamp: string
    end_timestamp: string
  } | null
} & React.ComponentProps<typeof Rnd>

const MoveCard: React.FC<ScheduleCardProps> = props => {
  const { data, timeRange } = props

  const { is_show_busy } = data || {}

  const { getColorClassName } = useColor()

  const content = useMemo(() => {
    if (is_show_busy) {
      return (
        <>
          <Time className={getColorClassName()}>{data?.start_time}&nbsp;</Time>
          <Title className={getColorClassName()}>{data?.is_busy_text}</Title>
        </>
      )
    }
    return (
      <>
        <TimeRange className={getColorClassName()}>
          {timeRange &&
            `${timeRange?.start_timestamp} - ${timeRange?.end_timestamp}`}
        </TimeRange>

        <Title className={getColorClassName()}>{data?.subject}</Title>
      </>
    )
  }, [is_show_busy, timeRange, data?.subject, data?.start_time])
  const children = props.children || <Content>{content}</Content>
  const { enableResizing, ...otherProps } = props ?? {}

  return (
    <MoveCardBox
      hoverTextColor={getColor(data?.color ?? 0)}
      onClick={(e: MouseEvent) => {
        e.stopPropagation()
      }}
      bg={getColorWithOpacityPointOne(data?.color ?? 0)}
      disableDragging={is_show_busy}
      enableResizing={is_show_busy ? false : enableResizing}
      {...otherProps}
    >
      {children}
    </MoveCardBox>
  )
}

export default MoveCard
