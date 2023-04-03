import React, { useMemo, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import useMaxWidth from '../hooks/useMaxWidth'
import AllDayScheduleCard from '../AllDayScheduleCard'
import useWeeks from '../hooks/useWeeks'

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
  const { getLeftByCurrentWeekDay, weeks } = useWeeks()

  const [schedulePosition, setSchedulePosition] = useState<
    {
      id: number
      width: number
      top: number
      left: number
    }[]
  >([])
  useEffect(() => {
    if (!maxWidth) {
      return
    }
    const data = list.map(item => {
      return {
        id: item.id,
        top: 0,
        width: maxWidth,
        left: getLeftByCurrentWeekDay(item.startTime),
      }
    })

    // 相同left， 处理top 避免重贴
    const leftTopMap = weeks.map((item, idx) => {
      return {
        left: idx * maxWidth,
        top: 0,
      }
    })
    const dataWithTop = data.map(item => {
      const index = Math.floor(item.left / maxWidth)
      console.log(item, index, maxWidth)
      const value = leftTopMap[index].top
      leftTopMap[index].top += 20
      return {
        ...item,
        top: value,
      }
    })
    console.log({ dataWithTop })

    setSchedulePosition(dataWithTop)
  }, [list, maxWidth, weeks])

  return (
    <AllDayScheduleListBox className="all-day-schedule-list">
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
