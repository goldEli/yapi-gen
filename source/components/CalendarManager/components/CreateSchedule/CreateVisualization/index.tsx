import React from 'react'
import styled from '@emotion/styled'
import Header from './Header'
import Content from './Content'
import { useDispatch, useSelector } from '@store/index'
import { getScheduleListDaysOfDate } from '@store/schedule/schedule.thunk'
import dayjs from 'dayjs'
import {
  formatYYYYMMDD,
  formatYYYYMMDDhhmmss,
} from '@/components/CalendarManager/config'
import { getScheduleListForCurrentDay } from '@store/createScheduleVisualization/createScheduleVisualization.thunk'

interface CreateVisualizationProps {}

const CreateVisualizationBox = styled.div`
  width: 524px;
  height: 100%;
  padding: 0 16px 0 24px;
  border-left: 1px solid var(--neutral-n6-d1);
  margin-left: 4px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  user-select: none;
`

const CreateVisualization: React.FC<CreateVisualizationProps> = props => {
  const { currentDate } = useSelector(
    store => store.createScheduleVisualization,
  )
  const { checkedCalendarList } = useSelector(store => store.calendar)
  const dispatch = useDispatch()

  React.useEffect(() => {
    // dispatch(getScheduleList({ id: 1 }))
    if (!currentDate) {
      return
    }
    dispatch(
      getScheduleListForCurrentDay({
        date: dayjs(currentDate).format(formatYYYYMMDD),
        calendar_ids: checkedCalendarList.map(item => item.calendar_id),
      }),
    )
  }, [currentDate, checkedCalendarList])
  return (
    <CreateVisualizationBox>
      <Header />
      <Content />
    </CreateVisualizationBox>
  )
}

export default CreateVisualization
