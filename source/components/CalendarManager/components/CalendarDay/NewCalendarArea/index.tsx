import styled from '@emotion/styled'
import dayjs from 'dayjs'
import React from 'react'
import usePosition from '../hooks/usePosition'
import { useSelector } from '@store/index'
import useColor from '@/components/CalendarManager/hooks/useColor'
import classNames from 'classnames'
import { CreateMoveCardBox } from '@/components/CalendarManager/styles'

interface NewCalendarAreaProps {
  timeRange: {
    startTime: string
    endTime: string
  }
}

const Box = styled.div`
  width: calc(100% - 58px - 20px);
  font-size: 12px;
  line-height: 20px;
  background-color: var(--primary-d1);
  position: absolute;
  left: 58px;
  display: ${(props: { visible: boolean }) =>
    props.visible ? 'block' : 'none'};
  border-radius: 6px;
`
const Title = styled.span`
  font-size: 12px;
  line-height: 20px;
  color: var(--neutral-white-d7);
  padding-left: 8px;
  /* color: var(--neutral-n1-d1); */
`

const NewCalendarArea: React.FC<NewCalendarAreaProps> = props => {
  // console.table(props.pointerPosition)
  const { calendarData } = useSelector(store => store.calendar)
  const { getBgColor, getColorClassName } = useColor()
  const currentColor = React.useMemo(() => {
    const colorIdx = calendarData.manager.find(
      item => item.is_default === 1,
    )?.color
    return colorIdx
  }, [calendarData])

  const { startTime, endTime } = props.timeRange

  const { top, height } = usePosition(
    dayjs(startTime).valueOf(),
    dayjs(endTime).valueOf(),
  )

  return (
    <CreateMoveCardBox
      top={top}
      left={58}
      height={height}
      width={'calc(100% - 58px - 20px)'}
      visible={!!props.timeRange.endTime}
    >
      <span className="title">{`${dayjs(startTime).format('HH:mm')}-${dayjs(
        endTime,
      )?.format('HH:mm')}`}</span>
    </CreateMoveCardBox>
  )
}

export default NewCalendarArea
