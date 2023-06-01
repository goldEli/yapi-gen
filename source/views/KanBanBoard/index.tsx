import styled from '@emotion/styled'
import React, { useEffect } from 'react'
import Operation from './Operation'
import ProjectCommonOperation from '@/components/CommonProjectComponent/CommonHeader'

import { useDispatch, useSelector } from '@store/index'
import Board from './Borad'
import {
  getKanbanByGroup,
  getKanbanConfigList,
  getStoryViewList,
  offFullScreenMode,
  onFilter,
} from '@store/kanBan/kanBan.thunk'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import useProjectId from './hooks/useProjectId'
import { jumpToKanbanConfig } from './utils'
import UserGroupingModal from './UserGroupingModal'
import ModifyStatusModal from './ModifyStatusModal'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import useGuideModal from './hooks/useGuideModal'

const FullScreenContainer = styled(FullScreen)`
  flex: 1;
  overflow: hidden;
`
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

const ToolBarBox = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  /* position: relative; */
`

const KanBanBoard: React.FC<IProps> = props => {
  const dispatch = useDispatch()
  const { projectId } = useProjectId()
  const navigate = useNavigate()
  const handle = useFullScreenHandle()
  const { guildModalEl } = useGuideModal()

  // init
  useEffect(() => {
    async function run() {
      const res = await dispatch(getKanbanConfigList({ project_id: projectId }))
      const { sortByRowAndStatusOptions } = res.payload as any
      if (!sortByRowAndStatusOptions?.length) {
        jumpToKanbanConfig(navigate)
        return
      }
      await dispatch(getStoryViewList())
      dispatch(getKanbanByGroup())
    }
    run()
  }, [projectId])

  const { fullScreen } = useSelector(store => store.kanBan)
  useEffect(() => {
    if (fullScreen) {
      handle.enter()
    }
  }, [fullScreen])
  return (
    <KanBanBoardBox>
      <ProjectCommonOperation
        onInputSearch={async val => {
          console.log(val)
          dispatch(onFilter())
        }}
      />
      <ToolBarBox>
        <Operation
          pid={1}
          isGrid={1}
          onChangeGrid={() => {}}
          onChangeIsShowLeft={() => {}}
          onChangeVisible={(e: any) => {}}
          onRefresh={() => {}}
          onSearch={data => {
            dispatch(onFilter())
          }}
          settingState={true}
          onChangeSetting={() => {}}
          isShowLeft={false}
          otherParams={{}}
          dataLength={2}
        />
      </ToolBarBox>
      {guildModalEl}
      <FullScreenContainer
        handle={handle}
        onChange={state => {
          if (!state) {
            dispatch(offFullScreenMode())
          }
        }}
      >
        <Board />
      </FullScreenContainer>
      <UserGroupingModal />
      <ModifyStatusModal />
    </KanBanBoardBox>
  )
}
export default KanBanBoard
