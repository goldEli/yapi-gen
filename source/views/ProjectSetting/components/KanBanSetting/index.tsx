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
import useI18n from '@/hooks/useI18n'
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
  const { t } = useI18n()

  // init
  useEffect(() => {
    dispatch(getKanbanConfigList({ project_id: projectId }))
  }, [projectId])

  const content = useMemo(() => {
    if (showNoData) {
      return (
        <NoData subText={t('columns_and_statuses_have_not_been_created_yet')}>
          <CommonButton
            onClick={() => {
              dispatch(
                openSaveAsViewModel({
                  title: t('create_columns_and_status'),
                }),
              )
            }}
            style={{ marginTop: 24 }}
            type="light"
          >
            {t('create_columns_and_status')}
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
