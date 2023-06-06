import { useDispatch } from '@store/index'
import React, { useEffect } from 'react'
import useProjectId from './hooks/useProjectId'
import { useNavigate } from 'react-router-dom'
import useKeyPress from '@/hooks/useKeyPress'
import {
  copyView,
  getKanbanByGroup,
  getKanbanConfigList,
  getStoryViewList,
} from '@store/kanBan/kanBan.thunk'
import { jumpToKanbanConfig } from './utils'
import { getIdByUrl, getProjectType } from '@/tools'

const useInit = () => {
  const dispatch = useDispatch()
  const { projectId } = useProjectId()
  const projectType = getProjectType()
  console.log('projectType', projectType)
  const navigate = useNavigate()
  const { useKeys } = useKeyPress()
  useKeys(
    '1',
    projectType === 1
      ? '/ProjectManagement/Iteration'
      : '/SprintProjectManagement/Sprint',
  )
  useKeys('3', '/Report/PerformanceInsight')

  // init
  useEffect(() => {
    async function run() {
      const res = await dispatch(getKanbanConfigList({ project_id: projectId }))
      const { sortByRowAndStatusOptions } = res.payload as any
      if (!sortByRowAndStatusOptions?.length) {
        jumpToKanbanConfig(navigate)
        return
      }
      // 如果是分享先复制分享视图得到当前视图
      const shareViewId = getIdByUrl('viewId')
      const copyViewRes = await dispatch(copyView({ id: shareViewId }))
      await dispatch(getStoryViewList(copyViewRes?.id ? copyViewRes.id : null))
      dispatch(getKanbanByGroup())
    }
    run()
  }, [projectId])
}

export default useInit
