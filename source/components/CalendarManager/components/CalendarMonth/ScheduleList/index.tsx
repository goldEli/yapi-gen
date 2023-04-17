import React, { useMemo } from 'react'
import styled from '@emotion/styled'
import ScheduleListItem from '../ScheduleListItem'
import { useSelector } from '@store/index'
import MoveActiveItem from '../MoveActiveItem'
import MoreScheduleButton from '../../MoreScheduleButton'

interface ScheduleListProps {
  data: Model.Calendar.DaysOfMonth
  idx: number
  list?: (Model.Schedule.Info | undefined)[]
}

const ScheduleListBox = styled.div`
  width: 100%;
  position: relative;
`

const ScheduleList: React.FC<ScheduleListProps> = props => {
  const { scheduleList } = useSelector(store => store.schedule)

  const { list, data } = props
  const key = data.date
  // const list = scheduleList?.[key]

  // console.log({list}, scheduleList)
  const hiddenNum = useMemo(() => {
    const list = scheduleList?.[key]
    if (!list?.length) {
      return 0
    }
    const len = list?.length
    return len > 3 ? len - 3 : 0
  }, [key, scheduleList])
  const showList = useMemo(() => {
    const newList = list?.slice(0, 3)
    return newList
  }, [list])

  return (
    <ScheduleListBox>
      {showList?.map((item, idx) => {
        if (!item) {
          return <div key={idx} style={{ height: '22px' }}></div>
        }
        return <ScheduleListItem idx={props.idx} data={item} key={item?.id} />
      })}
      <MoreScheduleButton hiddenNum={hiddenNum} />
      <MoveActiveItem idx={props.idx} />
    </ScheduleListBox>
  )
}

export default ScheduleList
