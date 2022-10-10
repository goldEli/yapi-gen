import * as services from '@/services'
import { useState } from 'react'

export default () => {
  const [mainInfo, setMainInfo] = useState<any>({})

  const getMainInfo = async (params: any) => {
    const result = await services.member.getMainInfo(params)
    setMainInfo(result)
  }

  const {
    getUserInfoAbeyanceStory,
    getUserInfoCreateStory,
    getUserInfoFinishStory,
    getUserInfoProject,
    getUserInfoOverviewStatistics,
    getUserInfoOverviewFeed,
    getMemberInfoAbeyanceStory,
    getMemberInfoCreateStory,
    getMemberInfoFinishStory,
    getMemberInfoProject,
    getMemberInfoOverviewStatistics,
    getMemberGantt,
  } = services.member

  return {
    getUserInfoAbeyanceStory,
    getUserInfoCreateStory,
    getUserInfoFinishStory,
    getUserInfoProject,
    getUserInfoOverviewStatistics,
    getUserInfoOverviewFeed,
    getMemberInfoAbeyanceStory,
    getMemberInfoCreateStory,
    getMemberInfoFinishStory,
    getMemberInfoProject,
    getMemberInfoOverviewStatistics,
    getMainInfo,
    mainInfo,
    getMemberGantt,
  }
}
