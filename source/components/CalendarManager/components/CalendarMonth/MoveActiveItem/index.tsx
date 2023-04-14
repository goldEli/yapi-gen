import React from 'react'
import styled from '@emotion/styled'
import {
  getColor,
  getColorWithOpacityPointOne,
} from '@/components/CalendarManager/utils'
import { useSelector } from '@store/index'
import { Dot, Time, Title } from '../ScheduleListItem/styled'

interface MoveActiveItemProps {
  idx: number
}

const MoveActiveItemBox = styled.div<{
  visible: boolean
  bg: string
}>`
  height: 22px;
  width: 100%;
  background: red;
  position: absolute;
  top: 0;
  left: 0;
  display: ${props => (props.visible ? 'block' : 'none')};
  background: ${props => props.bg};
`
const Container = styled.div<{
  visible: boolean
}>`
  width: 100%;
  display: ${props => (props.visible ? 'flex' : 'none')};
  cursor: pointer;
  gap: 7px;
  align-items: center;
`

const MoveActiveItem: React.FC<MoveActiveItemProps> = props => {
  const { monthMoveScheduleActiveInfo } = useSelector(
    store => store.calendarPanel,
  )
  const visible = React.useMemo(() => {
    const res =
      monthMoveScheduleActiveInfo?.visibleList?.includes(props.idx) ?? false
    console.log(res, { monthMoveScheduleActiveInfo })
    return res
  }, [monthMoveScheduleActiveInfo?.visibleList, props.idx])

  const isAllDay =
    monthMoveScheduleActiveInfo.startSchedule?.is_span_day ||
    monthMoveScheduleActiveInfo.startSchedule?.is_all_day === 1

  const time = isAllDay
    ? '全天'
    : monthMoveScheduleActiveInfo.startSchedule?.start_time
  return (
    <MoveActiveItemBox
      bg={getColorWithOpacityPointOne(
        monthMoveScheduleActiveInfo.startSchedule?.color ?? 0,
      )}
      visible={visible}
    >
      <Container
        visible={
          Math.min(...(monthMoveScheduleActiveInfo?.visibleList ?? [])) ===
          props.idx
        }
      >
        <Dot
          bg={getColor(monthMoveScheduleActiveInfo.startSchedule?.color ?? 0)}
        />
        <Time className="text">{time}</Time>
        <Title className="text">
          {monthMoveScheduleActiveInfo.startSchedule?.subject}
        </Title>
      </Container>
    </MoveActiveItemBox>
  )
}

export default MoveActiveItem
