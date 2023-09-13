import React from 'react'
import ScheduleCard from '../ScheduleCard'
import useCalculationConflict from '../hooks/useCalculationConflict'

interface ScheduleListProps {}

const ScheduleList: React.FC<ScheduleListProps> = props => {
  const { data } = useCalculationConflict()

  const content = React.useMemo(() => {
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

export default ScheduleList
