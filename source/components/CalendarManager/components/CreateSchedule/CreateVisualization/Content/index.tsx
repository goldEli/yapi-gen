import React from 'react'
import styled from '@emotion/styled'
import Timescale from '../Timescale'
import AllDayScheduleBoxBox from '../AllDayScheduleBox'

interface ContentProps {}

const ContentBox = styled.div`
  width: 100%;
  flex: 1;
`

const Content: React.FC<ContentProps> = props => {
  return (
    <ContentBox>
      <AllDayScheduleBoxBox />
      <Timescale />
    </ContentBox>
  )
}

export default Content
