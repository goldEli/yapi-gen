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
  list?: (Model.Schedule.Info | undefined)[]
}

const ScheduleListBox = styled.div`
  width: 100%;
  position: relative;
`

const ScheduleStripList: React.FC<ScheduleListProps> = props => {
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

  const dispatch = useDispatch()

  const scheduleListItemElements = useMemo(() => {
    if (showList?.[0]?.start_datetime === '2023-04-18 00:00:00') {
      console.log({ showList }, showList?.length)
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
            '.calendar-week-all-day-box',
          ) as HTMLDivElement
          const { left: boxLeft, top: boxTop } = box?.getBoundingClientRect()
          dispatch(
            setScheduleListModal({
              visible: true,
              top: top - boxTop,
              left: left - boxLeft,
              date: dayjs(data.date).date(),
              scheduleListData: scheduleList?.[key] ?? [],
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
