import React, { useMemo } from 'react'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import { setScheduleListModal } from '@store/schedule'
import dayjs from 'dayjs'
import MoreScheduleButton from '../MoreScheduleButton'
import MoveActiveItem from '../MoveActiveItem'
import ScheduleStripListItem from '../ScheduleStripListItem'

interface ScheduleListProps {
  data: Model.Calendar.DaysOfMonth
  // .calendar-week-all-day-box
  containerClassName: string
  idx: number
  // 用于显示的日程列表
  list?: (Model.Schedule.Info | undefined)[]
  // 全部的日程列表 用于溢出多少项
  allList?: Model.Schedule.Info[]
}

const ScheduleListBox = styled.div`
  width: 100%;
  min-height: 114px;
  position: relative;
`

const ScheduleStripList: React.FC<ScheduleListProps> = props => {
  // const { scheduleList } = useSelector(store => store.schedule)

  const { list, data, allList } = props
  // const key = data.date
  // const list = scheduleList?.[key]

  // console.log({list}, scheduleList)

  const showList = useMemo(() => {
    const newList = list?.slice(0, 3)
    if (!newList?.length) {
      return []
    }

    // 处理前三项目
    // 溢出数组中后面的undefined 避免错位
    const arr = [...newList]
    const len = arr.length
    for (let i = len - 1; i >= 0; --i) {
      const item = arr[i]
      if (item) {
        break
      }
      arr.splice(i, 1)
    }
    return arr
  }, [allList])

  // 计算隐藏了多少项目
  const hiddenNum = useMemo(() => {
    if (!allList?.length) {
      return 0
    }
    const len = allList?.length
    return len > showList.length ? len - showList.length : 0
  }, [allList, showList])

  const dispatch = useDispatch()

  const scheduleListItemElements = useMemo(() => {
    if (!showList) {
      return <></>
    }

    return showList?.map((item, idx) => {
      if (!item) {
        return <div key={idx} style={{ height: '22px' }}></div>
      }
      return (
        <ScheduleStripListItem
          containerClassName={props.containerClassName}
          idx={props.idx}
          data={item}
          key={item?.id}
        />
      )
    })
  }, [showList, props.idx, props.containerClassName])

  return (
    <ScheduleListBox>
      {scheduleListItemElements}
      <div
        onClick={e => {
          e.stopPropagation()
          const target = e.target as HTMLDivElement
          const { left, top } = target.getBoundingClientRect()
          const box = document.querySelector(
            props.containerClassName,
          ) as HTMLDivElement
          const { left: boxLeft, top: boxTop } = box?.getBoundingClientRect()
          dispatch(
            setScheduleListModal({
              visible: true,
              top: top - boxTop,
              left: left - boxLeft,
              date: dayjs(data.date).date(),
              scheduleListData: allList,
            }),
          )
        }}
      >
        <MoreScheduleButton hiddenNum={hiddenNum} />
      </div>
      <MoveActiveItem idx={props.idx} />
    </ScheduleListBox>
  )
}

export default ScheduleStripList
