import React from 'react'
import styled from '@emotion/styled'
import ScheduleCard from '../ScheduleCard'
import { useDispatch } from '@store/index'
import useCalculationConflict from '../hooks/useCalculationConflict'

interface ScheduleListProps {}

const ScheduleListBox = styled.div`
  width: calc(100% - 58px);
  position: absolute;
  /* left: 58px; */
  top: 0px;
`

const ScheduleList: React.FC<ScheduleListProps> = props => {
  const { data } = useCalculationConflict()
  const dispatch = useDispatch()

  //   React.useEffect(() => {
  //     dispatch(getScheduleList({ id: 1 }))
  //   }, [])

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
  return <ScheduleListBox>{content}</ScheduleListBox>
}

export default ScheduleList