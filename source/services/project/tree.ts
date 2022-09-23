/* eslint-disable max-lines */
/* eslint-disable no-else-return */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import * as http from '@/tools/http'

export const getTreeList = async (params: any) => {
  const res = await http.get('getNeedTreeList', {
    project_id: params.id,
    is_tree: 2,
  })

  console.log(res)

  return res
}

export const addTreeList = async (params: any) => {
  const res = await http.get('addNeedTreeList', {
    name: params.name,
    project_id: params.id,
    parent_id: params.pid,
    remark: params.remark,
  })

  console.log(res)

  return res
}
