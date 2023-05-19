import React from 'react'
import styled from '@emotion/styled'

interface BoardLeftProps {}

const BoardLeftBox = styled.div`
  width: 320px;
  height: 100%;
  background: var(--neutral-n9);
`

const BoardLeft: React.FC<BoardLeftProps> = props => {
  return <BoardLeftBox>BoardLeft</BoardLeftBox>
}

export default BoardLeft
