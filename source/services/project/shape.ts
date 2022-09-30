/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable complexity */
/* eslint-disable max-lines */
/* eslint-disable no-else-return */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import * as http from '@/tools/http'

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
    } else if (item.title.includes('需求分类') && !item.attr) {
      return {
        ...item,
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        children: item.values,
        type: 'tree',
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
