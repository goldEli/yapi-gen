import React from 'react'
import styled from '@emotion/styled'
import ScheduleListItem from '../ScheduleListItem'
import dayjs from 'dayjs'
import { useSelector } from '@store/index'

interface ScheduleListProps {
  data: Model.Calendar.DayOfMonth
}

const ScheduleListBox = styled.div`
  width: 100%;
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
        return <ScheduleListItem data={item} key={item.id} />
      })}
    </ScheduleListBox>
  )
}

export default ScheduleList
