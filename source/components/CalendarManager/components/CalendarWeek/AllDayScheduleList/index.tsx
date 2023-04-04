import React, { useMemo, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import useMaxWidth from '../hooks/useMaxWidth'
import AllDayScheduleCard from '../AllDayScheduleCard'
import useWeeks from '../hooks/useWeeks'
import useAllDayList from '../hooks/useAllDayList'

interface AllDayScheduleListProps {}

const AllDayScheduleListBox = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding-left: 58px;
  position: absolute;
  top: 0;
  left: 0;
`
interface SchedulePosition {
  id: Model.Schedule.Info['id']
  width: number
  top: number
  left: number
}

export const allDayScheduleListClassName = 'all-day-schedule-list'

const AllDayScheduleList: React.FC<AllDayScheduleListProps> = props => {
  const { list, allDayScheduleList } = useAllDayList()
  const { maxWidth } = useMaxWidth()
  const { getLeftByCurrentWeekDay, weeks } = useWeeks()

  const [schedulePosition, setSchedulePosition] = useState<SchedulePosition[]>(
    [],
  )

  useEffect(() => {
    const res: SchedulePosition[] = []

    for (const key in allDayScheduleList) {
      const item = allDayScheduleList[key]
      item.forEach((schedule, idx) => {
        res.push({
          id: schedule.id,
          width: maxWidth,
          top: 20 * idx,
          left: getLeftByCurrentWeekDay(schedule.start_timestamp),
        })
      })
    }

    setSchedulePosition(res)
  }, [allDayScheduleList, maxWidth])

  return (
    <AllDayScheduleListBox className={allDayScheduleListClassName}>
      <div style={{ position: 'relative' }}>
        {list.map(item => {
          const { width, top, left } =
            schedulePosition.find(i => item.id === i.id) ?? {}
          return (
            <AllDayScheduleCard
              top={top ?? 0}
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
