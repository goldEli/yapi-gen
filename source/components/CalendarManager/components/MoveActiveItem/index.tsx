import React from 'react'
import styled from '@emotion/styled'
import { getColor } from '@/components/CalendarManager/utils'
import { useSelector } from '@store/index'
import { Dot, Time, Title } from '../ScheduleStrip/styled'
import useColor from '@/components/CalendarManager/hooks/useColor'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'

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
  const { getBgColor, getColorClassName, getSecondaryColorClassName } =
    useColor()
  const { monthMoveScheduleActiveInfo } = useSelector(
    store => store.calendarPanel,
  )
  const visible = React.useMemo(() => {
    const res =
      monthMoveScheduleActiveInfo?.visibleList?.includes(props.idx) ?? false
    return res
  }, [monthMoveScheduleActiveInfo?.visibleList, props.idx])

  const isAllDay =
    monthMoveScheduleActiveInfo.startSchedule?.is_span_day ||
    monthMoveScheduleActiveInfo.startSchedule?.is_all_day === 1
  const [t] = useTranslation()

  const time = isAllDay
    ? t('calendarManager.allDay')
    : monthMoveScheduleActiveInfo.startSchedule?.start_time
  return (
    <MoveActiveItemBox
      bg={getBgColor(monthMoveScheduleActiveInfo.startSchedule?.color ?? 0)}
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
        <Time className={classNames('text', getSecondaryColorClassName())}>
          {time}
        </Time>
        <Title className={classNames('text', getColorClassName())}>
          {monthMoveScheduleActiveInfo.startSchedule?.subject}
        </Title>
      </Container>
    </MoveActiveItemBox>
  )
}

export default MoveActiveItem