import { getParamsValueByKey } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
import { NavigateFunction } from 'react-router-dom'
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
  const params = encryptPhp(
    JSON.stringify({
      id: getParamsValueByKey('id'),
      pageIdx: 'ProjectKanBan',
      type: 5,
    }),
  )
  navigate(`/ProjectManagement/ProjectSetting?data=${params}`)
}
