/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable complexity */
/* eslint-disable max-lines */
/* eslint-disable no-else-return */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import * as http from '@/tools/http'
import { getTreeList } from './tree'

function filterTreeData(data: any) {
  const newData = data.map((item: any) => ({
    title: item.name,
    value: item.id,
    children:
      item.children && item.children.length
        ? filterTreeData(item.children)
        : null,
  }))
  return newData
}

export const getShapeLeft = async (params: any) => {
  const res = await http.get('getShapeLeft', {
    project_id: params.id,
    story_id: params.nId,
  })

  return res.data
}

export const getShapeRight = async (params: any) => {
  const res = await http.get('getShapeRight', {
    project_id: params.id,
    story_id: params.nId,
    category_status_from_id: params.fromId,
    category_status_to_id: params.toId,
  })

  // 处理人、抄送人

  const memberList = await http.get('getProjectMember', {
    search: {
      project_id: params.id,
      all: 1,
    },
  })

  const filterMemberList = memberList.data.map((item: any) => ({
    id: item.id,
    name: item.name,
  }))

  // console.log(filterMemberList, '处理人、抄送人')

  // 分类

  const treeList = await getTreeList({ id: params.id })
  const filterTreeList = filterTreeData(treeList)

  // console.log(filterTreeList, '分类')

  // 迭代

  const iterateList = await http.get('getIterateList', {
    search: {
      project_id: params.id,
      all: 1,
    },
  })

  const filterIterateList = iterateList.data.map((item: any) => ({
    id: item.id,
    name: item.name,
  }))

  // console.log(filterIterateList, '迭代列表')

  // 标签
  const getTagList = await http.get<any>('getTagList', {
    project_id: params.id,
  })

  const filterGetTagList = getTagList.data.map((item: any) => ({
    ...item,
    id: item.id,
    name: item.content_txt,
  }))

  // console.log(filterGetTagList, '标签')

  // 优先级

  const getPriOrStu = await http.get('getPriOrStu', {
    project_id: params.id,
    type: 'priority',
  })

  const filterGetPriOrStu = getPriOrStu.data.map((item: any) => ({
    ...item,
    id: item.id,
    name: item.content_txt,
  }))

  // console.log(filterGetPriOrStu, '优先级')

  const filterFieldsList = res.data.fields.map((item: any, index: number) => {
    if (item.title.includes('时间') && !item.attr) {
      return {
        ...item,
        id: index,
        name: item.title,
        key: item.content,
        content: item.content,
        type: 'time',
      }
    } else if (
      (item.content.includes('users_name')
        || item.content.includes('users_copysend_name'))
      && !item.attr
    ) {
      return {
        ...item,
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        children: filterMemberList,
        type: 'select_checkbox',
        isDefault: item.is_default_filter,
        contentTxt: item.content_txt,
      }
    } else if (item.content.includes('class') && !item.attr) {
      return {
        ...item,
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        children: filterTreeList,
        type: 'tree',
        isDefault: item.is_default_filter,
        contentTxt: item.content_txt,
      }
    } else if (item.content.includes('iterate_name') && !item.attr) {
      return {
        ...item,
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        children: filterIterateList,
        type: 'select',
        isDefault: item.is_default_filter,
        contentTxt: item.content_txt,
      }
    } else if (item.content.includes('tag') && !item.attr) {
      return {
        ...item,
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        children: filterGetTagList,
        type: 'select_checkbox',
        isDefault: item.is_default_filter,
        contentTxt: item.content_txt,
      }
    } else if (item.content.includes('priority') && !item.attr) {
      return {
        ...item,
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        children: filterGetPriOrStu,
        type: 'select',
        isDefault: item.is_default_filter,
        contentTxt: item.content_txt,
      }
    } else if (item.title.includes('需求进度') && !item.attr) {
      return {
        ...item,
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        children: item.values,
        type: 'number',
        isDefault: item.is_default_filter,
        contentTxt: item.content_txt,
      }
    } else if (item.title.includes('评论') && !item.attr) {
      return {
        ...item,
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        children: item.values,
        type: 'area',
        isDefault: item.is_default_filter,
        contentTxt: item.content_txt,
      }
    } else if (item.attr) {
      if (item.attr === 'date') {
        return {
          ...item,
          id: index,
          name: item.title,
          key: item.content,
          content: item.content,
          dvalue: item.true_value,
          type: item.value[0],
        }
      }
      return {
        ...item,
        id: index,
        name: item.title,
        key: item.content,
        content: item.content,
        type: item.attr,
        dvalue: item.true_value,
        children: item?.value?.map((item: any) => ({
          name: item,
          id: item,
        })),
      }
    }
    return {
      ...item,
      id: index,
      name: item.title,
      key: item.content,
      content: item.content,

      type: 'select',
    }
  })

  const obj = {
    fields: filterFieldsList,
    verify: res.data.verify,
    is_verify: res.data.is_verify === 1,
    user_has_auth: res.data.user_has_auth,
  }
  return obj
}
