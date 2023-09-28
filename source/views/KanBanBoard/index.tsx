import styled from '@emotion/styled'
import React, { useEffect } from 'react'
import Board from './Borad'

import UserGroupingModal from './UserGroupingModal'
import ModifyStatusModal from './ModifyStatusModal'
import useGuideModal from './hooks/useGuideModal'
import ToolBar from './ToolBar'
import TopArea from './TopArea'
import useInit from './useInit'
import { useDispatch, useSelector } from '@store/index'
import { onComputedPermission } from '@/tools'
import PermissionWrap from '@/components/PermissionWrap'
import FullScreenContainer from './FullScreenContainer'
import { resetkanbanConfig } from '@store/kanBan'
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
  const dispatch = useDispatch()
  const { userPreferenceConfig, currentMenu } = useSelector(store => store.user)
  const { guildModalEl } = useGuideModal()
  const { projectInfo } = useSelector(store => store.project)
  useInit()
  const { sortByRowAndStatusOptions } = useSelector(store => store.kanBan)
  const resultAuth = onComputedPermission(
    currentMenu,
    '/ProjectManagement/Project',
  )
  useEffect(() => {
    return () => {
      console.log('离开')
      dispatch(resetkanbanConfig())
    }
  }, [])

  const isLength =
    projectInfo?.id && projectInfo?.projectPermissions?.length <= 0
  return (
    <PermissionWrap
      auth={
        resultAuth
          ? projectInfo.projectType === 2
            ? 'b/transaction/'
            : 'b/story/'
          : '/ProjectManagement/Project'
      }
      permission={
        resultAuth
          ? isLength
            ? ['0']
            : projectInfo?.projectPermissions?.map((i: any) => i.identity)
          : currentMenu?.children?.map((i: any) => i.url)
      }
    >
      <KanBanBoardBox>
        <TopArea />
        <ToolBar />
        {userPreferenceConfig?.guidePageConfig?.kanban === 1 &&
        sortByRowAndStatusOptions?.length
          ? guildModalEl
          : null}

        <FullScreenContainer>
          <Board />
        </FullScreenContainer>

        <UserGroupingModal />
        <ModifyStatusModal />
      </KanBanBoardBox>
    </PermissionWrap>
  )
}
export default KanBanBoard
