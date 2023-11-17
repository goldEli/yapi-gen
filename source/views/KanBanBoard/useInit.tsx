import { store, useDispatch } from '@store/index'
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
import { getIdByUrl, getValueByUrl, getProjectType } from '@/tools'
import { setSortByGroupOptions } from '@store/kanBan'

const useInit = () => {
  const dispatch = useDispatch()
  const { projectId } = useProjectId()
  const projectType = getProjectType()

  const navigate = useNavigate()
  const { useKeys } = useKeyPress()
  useKeys(
    '1',
    projectType === 1 ? '/ProjectDetail/Iteration' : '/ProjectDetail/Sprint',
  )
  useKeys('3', '/Report/Performance')
  useKeys(
    '5',
    projectType === 1 ? '/ProjectDetail/Demand' : '/ProjectDetail/Affair',
  )

  // init
  useEffect(() => {
    async function run() {
      const otherConfig = getValueByUrl('otherConfig')
      const currentRowAndStatusId = otherConfig?.currentRowAndStatusId
      const currentGroupKey = otherConfig?.currentGroupKey
      const res = await dispatch(
        getKanbanConfigList({
          project_id: projectId,
          showId: currentRowAndStatusId,
        }),
      )
      const { sortByRowAndStatusOptions } = res.payload as any
      if (!sortByRowAndStatusOptions?.length) {
        jumpToKanbanConfig(navigate)
        return
      }

      // 如果分享的分组有值则先采用分享的值
      if (currentGroupKey) {
        await dispatch(setSortByGroupOptions(currentGroupKey))
      }
      // 如果是分享先复制分享视图得到当前视图
      const shareViewId = getIdByUrl('valueId')
      let id: number | null = null
      try {
        const copyViewRes = await dispatch(copyView({ id: shareViewId }))
        id = copyViewRes?.id ?? null
      } catch (error) {
        console.error(error)
      }
      await dispatch(getStoryViewList(id))

      dispatch(getKanbanByGroup())
    }
    run()
  }, [projectId])
}

export default useInit
