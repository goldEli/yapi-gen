import styled from '@emotion/styled'
import React, { useEffect, useRef } from 'react'
import CalendarForCalendarYear from '../CalendarForCalendarYear'
import { useDispatch, useSelector } from '@store/index'
import { getCalendarDaysOfYearList } from '@store/schedule/schedule.thunk'
import { Col, Divider, Row } from 'antd'
import dayjs from 'dayjs'
interface CalendarYearProps {}

const Box = styled.div`
  display: flex;
  gap: 94px;
  flex-wrap: wrap;
`
const CalendarYear: React.FC<CalendarYearProps> = props => {
  const disPatch = useDispatch()
  const { checkedCalendarList } = useSelector(state => state.calendar)
  const checkedCalendarListRef = useRef<Model.Calendar.Info[]>()
  checkedCalendarListRef.current = checkedCalendarList
  const calendarYear = useSelector(
    state => state.calendarPanel.calenderYearValue,
  )
  useEffect(() => {
    let params = {
      year: dayjs(calendarYear).year(),
      calendar_ids: checkedCalendarList.map(item => item.calendar_id),
    }
    console.log('params----', params)
    disPatch(getCalendarDaysOfYearList(params))
  }, [calendarYear])
  return (
    <Row gutter={[6, 30]}>
      {Array(12)
        .fill(0)
        .map((item, idx) => {
          return (
            <Col xs={14} sm={12} md={10} lg={8} xl={6} xxl={4}>
              <CalendarForCalendarYear month={idx} key={idx} />
            </Col>
          )
          return
        })}
    </Row>
  )
}

export default React.memo(CalendarYear)
