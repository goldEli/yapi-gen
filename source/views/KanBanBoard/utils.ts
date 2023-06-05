import { getParamsValueByKey } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
import { NavigateFunction } from 'react-router-dom'
import { store } from '@store/index'
// import { createBrowserHistory } from 'history'

// export const history = createBrowserHistory()

export const handleId = (groupId: number, id: number) => {
  return `${groupId}-${id}`
}

// id: groupId-id
export const getId = (idStr: string) => {
  const [groupId, id] = idStr.split('-')

  return {
    groupId: parseInt(groupId, 10),
    id: parseInt(id, 10),
  }
}

export const jumpToKanbanConfig = (navigate: NavigateFunction) => {
  // 如果没有配置列 跳转到列配置页面
  // const { projectType } = store.getState().project.projectInfo
  const projectType = getParamsValueByKey('projectType')
  console.log('projectType', projectType)
  const params = encryptPhp(
    JSON.stringify({
      id: getParamsValueByKey('id'),
      pageIdx: 'ProjectKanBan',
      type: projectType === 2 || !projectType? 'ProjectKanBan' : 5,
    }),
  )
  if (projectType === 2 || !projectType) {
    navigate(`/SprintProjectManagement/Setting?data=${params}`)
  } else {
    navigate(`/ProjectManagement/ProjectSetting?data=${params}`)
  }
}
