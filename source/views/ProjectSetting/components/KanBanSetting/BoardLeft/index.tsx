import React from 'react'
import styled from '@emotion/styled'
import StatusList from '../StatusList'

interface BoardLeftProps {}

const BoardLeftBox = styled.div`
  width: 320px;
  height: 100%;
  background: var(--neutral-n9);
  padding: 13px 16px;
  display: flex;
  flex-direction: column;
  gap: 29px;
`
const Title = styled.div`
  font-family: SiYuanMedium;
  height: 22px;
  font-size: 14px;
  color: var(--neutral-n1-d1);
  align-items: center;
`

const BoardLeft: React.FC<BoardLeftProps> = props => {
  return (
    <BoardLeftBox>
      <Title>未分配状态</Title>
      <StatusList />
    </BoardLeftBox>
  )
}

export default BoardLeft
