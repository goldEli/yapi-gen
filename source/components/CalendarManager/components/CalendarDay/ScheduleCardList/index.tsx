import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from '@store/index'
import ScheduleCard from '../ScheduleCard'
import { getScheduleList } from '@store/schedule/schedule.thunk'
import useCalculationConflict from '../hooks/useCalculationConflict'

interface ScheduleCardListProps {}

const ScheduleCardList: React.FC<ScheduleCardListProps> = props => {
  // const scheduleList = useSelector(store => store.schedule.scheduleList)
  const { data } = useCalculationConflict()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getScheduleList({ id: 1 }))
  }, [])

  const content = useMemo(() => {
    return data.map(item => {
      return (
        <ScheduleCard
          key={item.info.id}
          data={item.info}
          width={item.width}
          left={item.left}
        />
      )
    })
  }, [data])
  return <>{content}</>
}

export default ScheduleCardList
