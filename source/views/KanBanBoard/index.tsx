import styled from '@emotion/styled'
import React, { useEffect } from 'react'
import Operation from './Operation'
import ProjectCommonOperation from '@/components/CommonProjectComponent/CommonHeader'
import GuideModal from '@/components/GuideModal'
import { onChangeGuideVisible } from '@store/sprintKanBan'
import { useDispatch, useSelector } from '@store/index'
import guide_1 from './img/guide_1.png'
import guide_2 from './img/guide_2.png'
import guide_3 from './img/guide_3.png'
import Board from './Borad'
import {
  getKanbanByGroup,
  getKanbanConfigList,
  getStoryViewList,
  onFilter,
} from '@store/kanBan/kanBan.thunk'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import useProjectId from './hooks/useProjectId'
import { encryptPhp } from '@/tools/cryptoPhp'
import { jumpToKanbanConfig } from './utils'
import UserGroupingModal from './UserGroupingModal'
import { saveInputKey } from '@store/view'
import ModifyStatusModal from './ModifyStatusModal'
import ThreeDot from './ThreeDot'

interface IProps {}
const SprintProjectKanBanBox = styled.div`
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

const SprintProjectKanBan: React.FC<IProps> = props => {
  const dispatch = useDispatch()
  const { guideVisible } = useSelector(store => store.sprintKanBan)
  const { projectId } = useProjectId()
  const navigate = useNavigate()

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

  const inform = [
    {
      key: 0,
      title: 'Kanban工作项的状态',
      desc: '卡片状态根据可拖动的目的地来改变ta的最终状态',
      img: guide_1,
    },
    {
      key: 1,
      title: '分组视图',
      desc: '同时支持按人员、类别、优先级三个横向参数进行工作对比与查看',
      img: guide_2,
    },
    {
      key: 2,
      title: '列与状态',
      desc: '可以按不同工作流进行纵向筛选，如需定义工作流可在配置看板中新增或编辑ta',
      img: guide_3,
    },
  ]
  return (
    <SprintProjectKanBanBox>
      <ProjectCommonOperation
        onInputSearch={async val => {
          console.log(val)
          dispatch(onFilter())
        }}
      />
      {/* <ThreeDot /> */}
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
      <GuideModal
        width={784}
        height={670}
        visible={guideVisible}
        inform={inform}
        close={() => dispatch(onChangeGuideVisible(false))}
      />
      <Board />
      <UserGroupingModal />
      <ModifyStatusModal />
    </SprintProjectKanBanBox>
  )
}
export default SprintProjectKanBan
