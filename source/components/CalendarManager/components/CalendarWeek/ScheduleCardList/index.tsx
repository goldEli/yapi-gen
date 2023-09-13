import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from '@store/index'
import ScheduleCard from '../ScheduleCard'
// import { getScheduleList } from '@store/schedule/schedule.thunk'
import useCalculationConflict from '../hooks/useCalculationConflict'
import styled from '@emotion/styled'
import CurrentTimeLine from '../CurrentTimeLine'

interface ScheduleCardListProps {}
const ScheduleCardListBox = styled.div`
  position: absolute;
  /* width: calc(100% - 58px); */
  top: 0px;
  left: 58px;
  height: 100%;
`
const Container = styled.div`
  position: relative;
  width: 100%;
`

const ScheduleCardList: React.FC<ScheduleCardListProps> = props => {
  const { data } = useCalculationConflict()

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
  return (
    <ScheduleCardListBox className="schedule-card-list-box">
      <CurrentTimeLine />
      <Container>{content}</Container>
    </ScheduleCardListBox>
  )
}

export default ScheduleCardList
