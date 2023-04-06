import React from 'react'
import styled from '@emotion/styled'
import DayItem from './DayItem'

interface ContentProps {}

const ContentBox = styled.div`
  width: 100%;
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
`

const Content: React.FC<ContentProps> = props => {
  return (
    <ContentBox>
      {Array(35)
        .fill(0)
        .map((_, idx) => {
          return <DayItem idx={idx} key={idx} />
        })}
    </ContentBox>
  )
}

export default Content
