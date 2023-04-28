import React from 'react'
import styled from '@emotion/styled'
import { Dot, Time, Title } from '../styled'
import { getColor } from '@/components/CalendarManager/utils'
import useShowTime from '@/components/CalendarManager/hooks/useShowTime'
import IconFont from '@/components/IconFont'

interface ScheduleStripContentProps {
  data?: Model.Schedule.Info
}

const ScheduleStripContentBox = styled.div`
  width: 100%;
`

const ScheduleStripContent: React.FC<ScheduleStripContentProps> = props => {
  const { timeStr } = useShowTime(props?.data)
  const showRedBell = React.useMemo(() => {
    return props.data?.is_show_replay
  }, [props.data])
  // if (props?.data?.is_show_busy) {
  //   return (
  //     <>
  //       <Time className={getColorClassName()}>{data?.start_time}&nbsp;</Time>
  //       <Title
  //         color={color}
  //         isSelected={isSelected}
  //         className={getColorClassName()}
  //       >
  //         {data?.is_busy_text}
  //       </Title>
  //     </>
  //   )
  // }
  const title = React.useMemo(() => {
    if (props.data?.is_show_busy) {
      return props.data?.is_busy_text
    }
    return props.data?.subject
  }, [props.data])
  return (
    <>
      <Dot bg={getColor(props?.data?.color ?? 0)} />
      <Time className="text">{timeStr}</Time>
      {showRedBell && (
        <IconFont
          style={{ fontSize: '16px', marginRight: '4px' }}
          type="bell-red"
        />
      )}
      <Title className="text">{title}</Title>
    </>
  )
}

export default ScheduleStripContent
