import React, { useMemo } from 'react'
import styled from '@emotion/styled'
import ScheduleListItem from '../ScheduleListItem'
import { useSelector } from '@store/index'
import MoveActiveItem from '../MoveActiveItem'
import MoreScheduleButton from '../../MoreScheduleButton'

interface ScheduleListProps {
  data: Model.Calendar.DaysOfMonth
  idx: number
}

const ScheduleListBox = styled.div`
  width: 100%;
  position: relative;
`

const ScheduleList: React.FC<ScheduleListProps> = props => {
  const { scheduleList } = useSelector(store => store.schedule)

  const { data } = props
  const key = data.date
  const list = scheduleList?.[key]

  // console.log({list}, scheduleList)
  const hiddenNum = useMemo(() => {
    if (!list?.length) {
      return 0
    }
    const len = list?.length
    return len > 3 ? len - 3 : 0
  }, [list])

  return (
    <ScheduleListBox>
      {list?.slice(0, 3).map(item => {
        return <ScheduleListItem idx={props.idx} data={item} key={item.id} />
      })}
      <MoreScheduleButton hiddenNum={hiddenNum} />
      <MoveActiveItem idx={props.idx} />
    </ScheduleListBox>
  )
}

export default ScheduleList
