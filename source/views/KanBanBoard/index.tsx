import styled from '@emotion/styled'
import React, { useEffect } from 'react'
import Board from './Borad'
import UserGroupingModal from './UserGroupingModal'
import ModifyStatusModal from './ModifyStatusModal'
import useGuideModal from './hooks/useGuideModal'
import ToolBar from './ToolBar'
import TopArea from './TopArea'
import useInit from './useInit'
import { useSelector } from '@store/index'

interface IProps {}
const KanBanBoardBox = styled.div`
  width: 100%;
  // height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  /* gap: 20px; */
  padding: 20px;
  height: 100%;
`

const KanBanBoard: React.FC<IProps> = props => {
  const { userPreferenceConfig } = useSelector(store => store.user)
  const { guildModalEl } = useGuideModal()

  useInit()
  const { sortByRowAndStatusOptions } = useSelector(store => store.kanBan)
  return (
    <KanBanBoardBox>
      <TopArea />
      <ToolBar />
      {userPreferenceConfig?.guidePageConfig?.kanban === 1 &&
      sortByRowAndStatusOptions?.length
        ? guildModalEl
        : null}
      <Board />
      <UserGroupingModal />
      <ModifyStatusModal />
    </KanBanBoardBox>
  )
}
export default KanBanBoard
