import styled from '@emotion/styled'
import { Dropdown } from 'antd'
import dayjs from 'dayjs'
import React from 'react'
import { oneMinuteHeight } from '../../config'
import usePosition from '../CalendarDay/hooks/usePosition'
import { getTimeByAddDistance, hexToRgba } from '../CalendarDay/utils'

interface NewCalendarAreaProps {
  timeZone: string[]
  color: string
  distance: number
  onChangeVisible(bool: boolean): void
}

const Box = styled.div`
  width: calc(100% - 58px);
  font-size: 12px;
  line-height: 20px;
  color: var(--neutral-n1-d1);
  position: absolute;
  left: 58px;
  display: ${(props: { visible: boolean }) =>
    props.visible ? 'block' : 'none'};
`
const Title = styled.span`
  font-size: 12px;
  line-height: 20px;
  color: var(--neutral-n1-d1);
`

const DropdownContainer = styled.div`
  width: 528px;
  height: 636px;
  background-color: var(--neutral-white-d1);
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
`

const NewCalendarArea: React.FC<NewCalendarAreaProps> = props => {
  // console.table(props.pointerPosition)

  const startTime = React.useMemo(() => {
    const key = props.timeZone[0]
    return dayjs(key)
  }, [props.timeZone])

  const endTime = React.useMemo(() => {
    if (!startTime) {
      return dayjs(startTime)
    }
    const step = Math.ceil(props.distance / oneMinuteHeight / 15)
    // 起步30分钟
    const dis = Math.max(step * 15, oneMinuteHeight * 15)
    const time = getTimeByAddDistance(startTime.valueOf(), dis)
    return dayjs(time)
  }, [props.distance, startTime])

  const { top, height } = usePosition(startTime.valueOf(), endTime.valueOf())

  return (
    // <Dropdown
    //   open={props.visible}
    //   // trigger={['click']}
    //   onOpenChange={bool => {
    //     props.onChangeVisible(bool)
    //   }}
    //   align={{ offset: [-props.pointerPosition.x, -props.pointerPosition.y] }}
    //   dropdownRender={() => {
    //     return <DropdownContainer>123123123</DropdownContainer>
    //   }}
    // >
    <Box
      style={{ background: hexToRgba(props.color, 0.1), top, height }}
      className="new-calendar-area"
      visible={!!props.timeZone.length}
    >
      <Title>{`${startTime.format('HH:mm')}-${endTime?.format(
        'HH:mm',
      )}`}</Title>
    </Box>
    // </Dropdown>
  )
}

export default NewCalendarArea
