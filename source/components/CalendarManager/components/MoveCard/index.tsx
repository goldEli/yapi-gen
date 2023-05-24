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
import { useSelector } from '@store/index'
import IconFont from '@/components/IconFont'
import BellRed from '../BellRed'

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

  const { scheduleInfoDropdown } = useSelector(state => state.calendarPanel)

  const isSelected = useMemo(() => {
    if (!!timeRange) {
      return true
    }
    if (
      scheduleInfoDropdown.visible &&
      scheduleInfoDropdown.schedule_id === data?.schedule_id
    ) {
      return true
    }
    return false
  }, [scheduleInfoDropdown, data, timeRange])

  const content = useMemo(() => {
    const color = getColor(props.data?.color ?? 0)
    if (data?.is_show_reply && data?.is_show_busy) {
      return (
        <>
          <BellRed />
          <Title
            color={color}
            isSelected={isSelected}
            className={getColorClassName()}
          >
            {data?.is_busy_text}
          </Title>
        </>
      )
    }
    if (data?.is_show_reply && !data?.is_show_busy) {
      return (
        <>
          <BellRed />
          <Title
            color={color}
            isSelected={isSelected}
            className={getColorClassName()}
          >
            {data?.subject}
          </Title>
        </>
      )
    }
    if (is_show_busy) {
      return (
        <>
          <Time className={getColorClassName()}>{data?.start_time}&nbsp;</Time>
          <Title
            color={color}
            isSelected={isSelected}
            className={getColorClassName()}
          >
            {data?.is_busy_text}
          </Title>
        </>
      )
    }

    return (
      <>
        <TimeRange color={color} isSelected={isSelected} hidden={!timeRange}>
          {`${timeRange?.start_timestamp} - ${timeRange?.end_timestamp}`}
        </TimeRange>

        <Title color={color} isSelected={isSelected}>
          {data?.subject}
        </Title>
      </>
    )
  }, [timeRange, data, isSelected])
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
