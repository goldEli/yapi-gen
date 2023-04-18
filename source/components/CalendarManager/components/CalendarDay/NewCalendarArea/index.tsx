import styled from '@emotion/styled'
import dayjs from 'dayjs'
import React from 'react'
import usePosition from '../hooks/usePosition'
import { useSelector } from '@store/index'
import useColor from '@/components/CalendarManager/hooks/useColor'
import classNames from 'classnames'

interface NewCalendarAreaProps {
  timeRange: {
    startTime: string
    endTime: string
  }
}

const Box = styled.div`
  width: calc(100% - 58px);
  font-size: 12px;
  line-height: 20px;
  /* color: var(--neutral-n1-d1); */
  position: absolute;
  left: 58px;
  display: ${(props: { visible: boolean }) =>
    props.visible ? 'block' : 'none'};
`
const Title = styled.span`
  font-size: 12px;
  line-height: 20px;
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
    <Box
      style={{
        background: getBgColor(currentColor ?? 0),
        top,
        height,
      }}
      className={classNames('getBgColor', getColorClassName())}
      visible={!!props.timeRange.endTime}
    >
      <Title className={getColorClassName()}>{`${dayjs(startTime).format(
        'HH:mm',
      )}-${dayjs(endTime)?.format('HH:mm')}`}</Title>
    </Box>
  )
}

export default NewCalendarArea
