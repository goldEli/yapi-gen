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
import useRepeatSchedule from '../../hooks/useRepeatSchdule'

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

  const { isRepeatSchedule } = useRepeatSchedule(data)

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
    let color: string | undefined = getColor(props.data?.color ?? 0)
    if (!timeRange) {
      color = void 0
    }
    return (
      <>
        <TimeRange
          color={color}
          hidden={!timeRange}
          // className={getColorClassName()}
        >
          {`${timeRange?.start_timestamp} - ${timeRange?.end_timestamp}`}
        </TimeRange>

        <Title
          // className={getColorClassName()}
          color={color}
        >
          {data?.subject}
        </Title>
      </>
    )
  }, [
    is_show_busy,
    timeRange,
    data?.subject,
    data?.start_time,
    props.data?.color,
  ])
  const children = props.children || <Content>{content}</Content>
  const { enableResizing, ...otherProps } = props ?? {}
  const disable = useMemo(() => {
    return is_show_busy || isRepeatSchedule
  }, [is_show_busy, isRepeatSchedule])

  return (
    <MoveCardBox
      hoverTextColor={getColor(data?.color ?? 0)}
      onClick={(e: MouseEvent) => {
        e.stopPropagation()
      }}
      bg={getColorWithOpacityPointOne(data?.color ?? 0)}
      disableDragging={disable}
      enableResizing={disable ? false : enableResizing}
      {...otherProps}
    >
      {children}
    </MoveCardBox>
  )
}

export default MoveCard
