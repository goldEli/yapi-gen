import React, { useEffect, useMemo } from 'react'
import ScheduleCard from '../ScheduleCard'
// import { getScheduleList } from '@store/schedule/schedule.thunk'
import useCalculationConflict from '../hooks/useCalculationConflict'
import styled from '@emotion/styled'

interface ScheduleCardListProps {}
const ScheduleCardListBox = styled.div`
  /* position: relative; */
`

const ScheduleCardList: React.FC<ScheduleCardListProps> = props => {
  const { data } = useCalculationConflict()

  const content = useMemo(() => {
    return data?.map(item => {
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
