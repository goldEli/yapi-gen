import React from 'react'
import styled from '@emotion/styled'
import useScheduleAllDayList from '../hooks/useScheduleAllDayList'
import { AllDayScheduleItem } from '@/components/CalendarManager/styles'
import { getColorWithOpacityPointOne } from '@/components/CalendarManager/utils'

interface AllDayScheduleBoxProps {}

const AllDayScheduleBoxBox = styled.div`
  width: 100%;
  min-height: 52px;
  align-items: center;
  box-sizing: border-box;
  display: flex;

  .label {
    width: 58px;
  }
  .list {
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
`

const AllDayScheduleBox: React.FC<AllDayScheduleBoxProps> = props => {
  const { list } = useScheduleAllDayList()
  return (
    <AllDayScheduleBoxBox>
      <div className="label">GTM+08</div>
      <div className="list">
        {list.map(item => {
          return (
            <AllDayScheduleItem
              bg={getColorWithOpacityPointOne(item.color)}
              key={item.schedule_id}
            >
              {item.subject}
            </AllDayScheduleItem>
          )
        })}
      </div>
    </AllDayScheduleBoxBox>
  )
}

export default AllDayScheduleBox
