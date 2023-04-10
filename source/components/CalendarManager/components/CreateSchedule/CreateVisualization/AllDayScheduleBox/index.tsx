import React from 'react'
import styled from '@emotion/styled'

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
  }
`

const AllDayScheduleBox: React.FC<AllDayScheduleBoxProps> = props => {
  return (
    <AllDayScheduleBoxBox>
      <div className="label">GTM+08</div>
      <div className="list">123</div>
    </AllDayScheduleBoxBox>
  )
}

export default AllDayScheduleBox
