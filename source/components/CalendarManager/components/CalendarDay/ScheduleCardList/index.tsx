import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from '@store/index'
import ScheduleCard from '../ScheduleCard'
import { getScheduleList } from '@store/schedule/schedule.thunk'

interface ScheduleCardListProps {}

const ScheduleCardList: React.FC<ScheduleCardListProps> = props => {
  const scheduleList = useSelector(store => store.schedule.scheduleList)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getScheduleList({ id: 1 }))
  }, [])

  const content = useMemo(() => {
    return scheduleList.map(item => {
      return <ScheduleCard key={item.id} data={item} />
    })
  }, [scheduleList])
  return <>{content}</>
}

export default ScheduleCardList
