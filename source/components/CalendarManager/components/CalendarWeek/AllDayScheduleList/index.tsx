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

const AllDayScheduleList: React.FC<AllDayScheduleListProps> = props => {
  // const { scheduleList } = useSelector(store => store.schedule)
  // const allDayScheduleList = useMemo(() => {
  //   const res = { ...scheduleList }
  //   for (const key in res) {
  //     const item = res[key]
  //     res[key] = item.filter(i => i.is_all_day === 1)
  //   }
  //   return res
  //   // return scheduleList.filter(item => item.is_all_day === 1)
  // }, [scheduleList])
  // const list = useMemo(() => {
  //   const res: Model.Schedule.Info[] = []
  //   for (const key in allDayScheduleList) {
  //     const item = allDayScheduleList[key]
  //     res.push(...item)
  //   }

  //   return res
  // }, [allDayScheduleList])
  const { list, allDayScheduleList } = useAllDayList()
  const { maxWidth } = useMaxWidth()
  const { getLeftByCurrentWeekDay, weeks } = useWeeks()

  // const [schedulePosition, setSchedulePosition] = useState<
  //   {
  //     id: Model.Schedule.Info['id']
  //     width: number
  //     top: number
  //     left: number
  //   }[]
  // >([])
  const schedulePosition = useMemo(() => {
    const res: {
      id: Model.Schedule.Info['id']
      width: number
      top: number
      left: number
    }[] = []

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
    return res
  }, [allDayScheduleList, maxWidth])

  // useEffect(() => {
  //   if (!maxWidth) {
  //     return
  //   }
  //   const data = list.map(item => {
  //     return {
  //       id: item.id,
  //       top: 0,
  //       width: maxWidth,
  //       left: getLeftByCurrentWeekDay(item.startTime),
  //     }
  //   })

  //   // 相同left， 处理top 避免重贴
  //   const leftTopMap = weeks.map((item, idx) => {
  //     return {
  //       left: idx * maxWidth,
  //       top: 0,
  //     }
  //   })
  //   const dataWithTop = data.map(item => {
  //     const index = Math.floor(item.left / maxWidth)
  //     console.log(item, index, maxWidth)
  //     const value = leftTopMap[index].top
  //     leftTopMap[index].top += 20
  //     return {
  //       ...item,
  //       top: value,
  //     }
  //   })
  //   console.log({ dataWithTop })

  //   setSchedulePosition(dataWithTop)
  // }, [list, maxWidth, weeks])

  // useEffect(() => {

  //   const

  // }, [allDayScheduleList])

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
