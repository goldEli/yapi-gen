import React from 'react'
import styled from '@emotion/styled'
import StatusList from '../StatusList'
import { useSelector } from '@store/index'

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
const Tips = styled.div<{ show: boolean }>`
  flex: 1;
  width: 100%;
  display: ${props => (props.show ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--neutral-n3);
`

const BoardLeft: React.FC<BoardLeftProps> = props => {
  const { unassignStatusList } = useSelector(store => store.KanbanConfig)

  return (
    <BoardLeftBox>
      <Title>未分配状态</Title>
      <StatusList list={unassignStatusList} />
      <Tips show={!unassignStatusList.length}>
        将状态拖放到此处，以将其在看板中隐藏
      </Tips>
    </BoardLeftBox>
  )
}

export default BoardLeft
