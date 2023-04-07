import React from 'react'
import styled from '@emotion/styled'
import ScheduleListItem from '../ScheduleListItem'
import { useSelector } from '@store/index'
import MoveActiveItem from '../MoveActiveItem'

interface ScheduleListProps {
  data: Model.Calendar.DayOfMonth
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
  const list = scheduleList[key]

  // console.log({list}, scheduleList)

  return (
    <ScheduleListBox>
      {list?.map(item => {
        return <ScheduleListItem idx={props.idx} data={item} key={item.id} />
      })}

      <MoveActiveItem idx={props.idx} />
    </ScheduleListBox>
  )
}

export default ScheduleList
