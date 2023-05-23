import React from 'react'
import styled from '@emotion/styled'
import KanBan from '../KanBan'
import useControlScrollPlane from '../hooks/useControlScrollPlane'

interface BoardRightProps {}

const BoardRightBox = styled.div`
  flex: 1;
  overflow: auto;
  height: 100%;
`

const BoardRight: React.FC<BoardRightProps> = props => {
  return (
    <BoardRightBox>
      <KanBan />
    </BoardRightBox>
  )
}

export default BoardRight
