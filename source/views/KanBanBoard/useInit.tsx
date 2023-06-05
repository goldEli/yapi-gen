import { useDispatch } from '@store/index'
import React, { useEffect } from 'react'
import useProjectId from './hooks/useProjectId'
import { useNavigate } from 'react-router-dom'
import {
  copyView,
  getKanbanByGroup,
  getKanbanConfigList,
  getStoryViewList,
} from '@store/kanBan/kanBan.thunk'
import { jumpToKanbanConfig } from './utils'
import { getIdByUrl } from '@/tools'

const useInit = () => {
  const dispatch = useDispatch()
  const { projectId } = useProjectId()
  const navigate = useNavigate()

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
