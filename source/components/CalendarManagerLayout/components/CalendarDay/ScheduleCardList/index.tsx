import React, { useMemo } from 'react'
import { useSelector } from '@store/index'
import ScheduleCard from '../ScheduleCard'

interface ScheduleCardListProps {}

const ScheduleCardList: React.FC<ScheduleCardListProps> = props => {
  const scheduleList = useSelector(store => store.managerCalendar.scheduleList)
  const content = useMemo(() => {
    return scheduleList.map(item => {
      return <ScheduleCard key={item.id} data={item} />
    })
  }, scheduleList)
  return <>{content}</>
}

export default ScheduleCardList
