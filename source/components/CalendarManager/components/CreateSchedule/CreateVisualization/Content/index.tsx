import React from 'react'
import styled from '@emotion/styled'

interface ContentProps {}

const ContentBox = styled.div`
  width: 100%;
  flex: 1;
`

const Content: React.FC<ContentProps> = props => {
  return <ContentBox>Content</ContentBox>
}

export default Content
