import styled from '@emotion/styled'
import React, { useEffect } from 'react'
import Board from './Borad'
import UserGroupingModal from './UserGroupingModal'
import ModifyStatusModal from './ModifyStatusModal'
import useGuideModal from './hooks/useGuideModal'
import FullScreenContainer from './FullScreenContainer'
import ToolBar from './ToolBar'
import TopArea from './TopArea'
import useInit from './useInit'

interface IProps {}
const KanBanBoardBox = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`

const KanBanBoard: React.FC<IProps> = props => {
  const { guildModalEl } = useGuideModal()

  useInit()

  return (
    <KanBanBoardBox>
      <TopArea />
      <ToolBar />
      {guildModalEl}
      <FullScreenContainer>
        <Board />
      </FullScreenContainer>
      <UserGroupingModal />
      <ModifyStatusModal />
    </KanBanBoardBox>
  )
}
export default KanBanBoard
