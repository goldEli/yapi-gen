/* eslint-disable max-lines */
/* eslint-disable no-else-return */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import * as http from '@/tools/http'
import { transData } from '@/tools'

export const getTreeList = async (params: any) => {
  const res = await http.get('getNeedTreeList', {
    project_id: params.id,
    is_tree: params.isTree ?? 2,
  })

  const treeData = [
    {
      name: '全部分类',
      id: 0,
      pid: 1,
      parent_id: 0,
      story_count: res.data[0]?.story_count,
      children: [
        {
          name: '未分类',
          pid: 0,
          id: -1,
          story_count: res.data[1]?.story_count,
        },
        ...transData(res.data, 'id', 'parent_id', 'children'),
      ],
    },
  ]

  return params.isTree === 1 ? res.data : treeData
}

export const addTreeList = async (params: any, tag: string) => {
  const bf = tag === 'add'
  const res = await http.post(bf ? 'addNeedTreeList' : 'editNeedTreeList', {
    name: params.name,
    project_id: params.projectId,
    parent_id: params.pid,
    id: params.id,
    remark: params.remark,
  })

  // console.log(res)

  return res
}

export const delTreeList = async (params: any) => {
  const res = await http.post('delNeedTreeList', {
    project_id: params.projectId,

    id: params?.id,
  })

  // console.log(res)

  return res
}

export const moveTreeList = async (params: any) => {
  const res = await http.post('moveNeedTreeList', {
    project_id: params.projectId,
    new_class_id: params.newId,
    sort: params.sort,
    id: params?.id,
    parent_id: params.pid,
  })

  return res
}
