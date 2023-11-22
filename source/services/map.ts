// 导图接口
import { flattenObjectToArray } from '@/views/Encephalogram/until'
import * as http from '../tools/http'
import { addTaskForTable } from '@/views/Encephalogram/until/DbHelper'

// 获取导图任务列表
export const getMapList = async (params: any) => {
  const response = await http.get('getMapList', params)
  // 拆分树，存入indexDB
  if (response.data) {
    const temp = {
      ...response.data,
      project_id: response.data.id,
    }
    const arr = flattenObjectToArray(temp)
    addTaskForTable(params.project_id, arr, params.group_by)
  }
  return response.data
}
export const getMapMembers = async (params: any) => {
  // const response = await http.get('getMapMembers', params)
  // return response.data
  const data = [
    {
      id: '1542006488750587906',
      name: 'php',
      members: [
        {
          id: 6,
          name: '马成龙',
          department_id: '1542006488750587906',
        },
        {
          id: 693,
          name: '马二',
          department_id: '1542006488750587906',
        },
        {
          id: 1438,
          name: '董杰',
          department_id: '1542006488750587906',
        },
      ],
    },
    {
      id: 1666636259793043456,
      name: '测试部门主管',
      members: [
        {
          id: 39,
          name: ' 汪志君',
          department_id: 1666636259793043456,
        },
      ],
    },
  ]
  return data
}
