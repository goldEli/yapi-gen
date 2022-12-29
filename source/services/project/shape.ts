/* eslint-disable no-undefined */
/* eslint-disable complexity */
/* eslint-disable no-else-return */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import * as http from '@/tools/http'
import { transData } from '@/tools'

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

  const selectData = res.data.fieldsFilterData
  // 公司
  const filterCompanyList = selectData.company_user

  // 处理人、抄送人

  const filterMemberList = selectData.project_member

  // console.log(filterMemberList, '处理人、抄送人')

  // 分类

  const treeData = [
    {
      name: '全部分类',
      key: 0,
      id: 0,
      pid: 1,
      parent_id: 0,
      story_count: res.data[0]?.story_count,
      children: [
        {
          key: -1,
          name: '未分类',
          pid: 0,
          id: -1,
          story_count: res.data[1]?.story_count,
        },
        ...(transData(
          selectData.class ? selectData.class : [],
          'id',
          'parent_id',
          'children',
        ) ?? []),
      ],
    },
  ]
  const filterTreeList = filterTreeData(treeData)

  // 迭代

  const filterIterateList = selectData.iterate_name

  // 标签

  const filterGetTagList = selectData.tag

  // console.log(filterGetTagList, '标签')

  // 优先级

  const filterGetPriOrStu = selectData.priority?.map((i: any) => ({
    id: i.id,
    name: i.content,
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
      (item.content.includes('users_name') ||
        item.content.includes('users_copysend_name')) &&
      !item.attr
    ) {
      return {
        ...item,
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        children: [...filterMemberList],
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
        type: 'tag',
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
    } else if (item.content.includes('comment') && !item.attr) {
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

      // 这里操作人员

      if (item.attr === 'user_select') {
        if (item.value[0] === 'projectMember') {
          return {
            ...item,
            id: index,
            name: item.title,
            key: item.content,
            content: item.content,
            dvalue: item.true_value,
            type: 'select',
            children: [...filterMemberList],
          }
        }
        if (item.value[0] === 'companyMember') {
          return {
            ...item,
            id: index,
            name: item.title,
            key: item.content,
            content: item.content,
            dvalue: item.true_value,
            type: 'select',
            children: [...filterCompanyList],
          }
        }
      }
      if (item.attr === 'user_select_checkbox') {
        if (item.value[0] === 'projectMember') {
          return {
            ...item,
            id: index,
            name: item.title,
            key: item.content,
            content: item.content,
            dvalue: item.true_value,
            type: 'select_checkbox',
            children: [...filterMemberList],
          }
        }
        if (item.value[0] === 'companyMember') {
          return {
            ...item,
            id: index,
            name: item.title,
            key: item.content,
            content: item.content,
            dvalue: item.true_value,
            type: 'select_checkbox',
            children: [...filterCompanyList],
          }
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
        children: item?.value
          ? item?.value?.map((k: any) => ({
              name: k,
              id: k,
            }))
          : [],
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
