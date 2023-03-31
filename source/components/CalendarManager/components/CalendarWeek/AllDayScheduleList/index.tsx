import React, { useMemo, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import useMaxWidth from '../hooks/useMaxWidth'
import AllDayScheduleCard from '../AllDayScheduleCard'
import useWeeks from '../hooks/useWeeks'
import { position } from 'caret-pos'

interface AllDayScheduleListProps {}

const AllDayScheduleListBox = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding-left: 58px;
  position: absolute;
  top: 0;
  left: 0;
`

const AllDayScheduleList: React.FC<AllDayScheduleListProps> = props => {
  const { scheduleList } = useSelector(store => store.schedule)
  const list = useMemo(() => {
    return scheduleList.filter(item => item.is_all_day === 1)
  }, [scheduleList])
  const { maxWidth } = useMaxWidth()
  const { getLeftByCurrentWeekDay } = useWeeks()

  const [schedulePosition, setSchedulePosition] = useState<
    {
      id: number
      width: number
      top: number
      left: number
    }[]
  >([])
  useEffect(() => {
    const data = list.map(item => {
      return {
        id: item.id,
        top: 0,
        width: maxWidth,
        left: getLeftByCurrentWeekDay(item.startTime),
      }
    })

    setSchedulePosition(data)
  }, [list, maxWidth])

  return (
    <AllDayScheduleListBox className="all-day-schedule-list">
      <div style={{ position: 'relative' }}>
        {list.map(item => {
          const { width, top, left } =
            schedulePosition.find(i => item.id === i.id) ?? {}
          return (
            <AllDayScheduleCard
              key={item.id}
              width={width ?? 0}
              left={left ?? 0}
              data={item}
            />
          )
        })}
      </div>
    </AllDayScheduleListBox>
  )
}

export default AllDayScheduleList
