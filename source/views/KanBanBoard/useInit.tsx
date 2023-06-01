import { useDispatch } from '@store/index'
import React, { useEffect } from 'react'
import useProjectId from './hooks/useProjectId'
import { useNavigate } from 'react-router-dom'
import {
  getKanbanByGroup,
  getKanbanConfigList,
  getStoryViewList,
} from '@store/kanBan/kanBan.thunk'
import { jumpToKanbanConfig } from './utils'

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
      await dispatch(getStoryViewList())
      dispatch(getKanbanByGroup())
    }
    run()
  }, [projectId])
}

export default useInit
