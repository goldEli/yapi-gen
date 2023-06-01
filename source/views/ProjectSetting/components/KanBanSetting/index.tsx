import styled from '@emotion/styled'
import React, { useEffect, useMemo } from 'react'
import ToolBar from './ToolBar'
import Board from './Board'
import BoardLeft from './BoardLeft'
import BoardRight from './BoardRight'
import EditColumnModal from './EditColumnModal'
import {
  getKanbanConfigList,
  openSaveAsViewModel,
} from '@store/kanbanConfig/kanbanConfig.thunk'
import { useDispatch, useSelector } from '@store/index'
import useProjectId from './hooks/useProjectId'
import NoData from '@/components/NoData'
import CommonButton from '@/components/CommonButton'
import SaveAsViewModal from './SaveAsViewModal'
interface IProps {}
const KanBanSettingBox = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 20px 0 20px;
`
const KanBanSetting: React.FC<IProps> = props => {
  const dispatch = useDispatch()
  const { projectId } = useProjectId()
  const { viewList } = useSelector(store => store.KanbanConfig)
  const showNoData = !viewList?.length

  // init
  useEffect(() => {
    dispatch(getKanbanConfigList({ project_id: projectId }))
  }, [projectId])

  const content = useMemo(() => {
    if (showNoData) {
      return (
        <NoData
          subText={
            '当前还未创建列与状态，使用列和状态来定义工作在看板上的推进方式'
          }
        >
          <CommonButton
            onClick={() => {
              dispatch(
                openSaveAsViewModel({
                  title: '创建视图列与状态',
                }),
              )
            }}
            style={{ marginTop: 24 }}
            type="light"
          >
            创建列与状态
          </CommonButton>
        </NoData>
      )
    }
    return (
      <>
        <ToolBar />
        <Board>
          <BoardLeft />
          <BoardRight />
        </Board>
      </>
    )
  }, [showNoData])
  return (
    <KanBanSettingBox>
      {content}
      <EditColumnModal />
      <SaveAsViewModal />
    </KanBanSettingBox>
  )
}
export default KanBanSetting
