import React from 'react'
import styled from '@emotion/styled'
import Header from './Header'
import Content from './Content'
import dayjs from 'dayjs'

interface CreateVisualizationProps {}

const CreateVisualizationBox = styled.div`
  width: 524px;
  max-height: 60vh;
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
  return (
    <CreateVisualizationBox>
      <Header />
      <Content />
    </CreateVisualizationBox>
  )
}

export default CreateVisualization
