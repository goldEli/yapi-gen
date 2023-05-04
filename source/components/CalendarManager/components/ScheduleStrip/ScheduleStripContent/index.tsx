import React from 'react'
import styled from '@emotion/styled'
import { Dot, Time, Title } from '../styled'
import { getColor } from '@/components/CalendarManager/utils'
import useShowTime from '@/components/CalendarManager/hooks/useShowTime'
import IconFont from '@/components/IconFont'
import useSelectedSchedule from '@/components/CalendarManager/hooks/useSelectedSchedule'

interface ScheduleStripContentProps {
  data?: Model.Schedule.Info
}

const ScheduleStripContent: React.FC<ScheduleStripContentProps> = props => {
  const { timeStr } = useShowTime(props?.data)
  const showRedBell = React.useMemo(() => {
    return props.data?.is_show_replay
  }, [props.data])

  const title = React.useMemo(() => {
    if (props.data?.is_show_busy) {
      return props.data?.is_busy_text
    }
    return props.data?.subject
  }, [props.data])

  const { selected } = useSelectedSchedule(props.data)

  return (
    <>
      <Dot bg={getColor(props?.data?.color ?? 0)} />
      <Time
        selected={selected}
        selectedColor={getColor(props?.data?.color ?? 0)}
        className="text"
      >
        {timeStr}
      </Time>
      {showRedBell && (
        <IconFont
          style={{ fontSize: '16px', marginRight: '4px' }}
          type="bell-red"
        />
      )}
      <Title
        selected={selected}
        selectedColor={getColor(props?.data?.color ?? 0)}
        className="text"
      >
        {title}
      </Title>
    </>
  )
}

export default ScheduleStripContent
