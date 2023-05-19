import React from 'react'
import styled from '@emotion/styled'

interface BoardProps {
  children: React.ReactNode
}

const BoardBox = styled.div`
  width: 100%;
  display: flex;
  gap: 19px;
  flex: 1;
`

const Board: React.FC<BoardProps> = props => {
  return <BoardBox>{props.children}</BoardBox>
}

export default Board
