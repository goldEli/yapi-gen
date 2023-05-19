import React from 'react'
import styled from '@emotion/styled'

interface BoardRightProps {}

const BoardRightBox = styled.div`
  flex: 1;
  overflow: auto;
  height: 100%;
`

const BoardRight: React.FC<BoardRightProps> = props => {
  return <BoardRightBox>BoardRight</BoardRightBox>
}

export default BoardRight
