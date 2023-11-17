/* eslint-disable no-undefined */
/* eslint-disable complexity */
/* eslint-disable max-lines */
/* eslint-disable no-else-return */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */

// 我的

import * as http from '../tools/http'
import { getTreeList } from '@/services/demand'
import { storyConfigCategoryList } from '@/services/project'
import { getStaffListAll } from './staff'

// 顶部导航-待办列表
export const getMineNoFinishListHeader: any = async (params: any) => {
  const response = await http.get('getMineNoFinishListHeader', {
    page: params.page,
    pagesize: params.pagesize,
  })
  return response.data
}

// 顶部导航-已办列表
export const getMineFinishListHeader: any = async (params: any) => {
  const response = await http.get('getMineFinishListHeader', {
    page: params.page,
    pagesize: params.pagesize,
  })
  return response.data
}

// 顶部导航-待审核列表
export const getVerifyUserListHeader: any = async (params: any) => {
  const response: any = await http.get<any>('getVerifyUserListHeader', {
    pagesize: params.pagesize,
    page: params.page,
  })
  return response.data
}

//获取任务接收处理概况
export const getHisProjectCharts: any = async (params: any) => {
  const response = await http.get(
    `/b/efficiency/member/work_handle/statistics`,
    params,
  )
  return response
}

//获取任务接收处理概况
export const getProjectCharts: any = async (params: any) => {
  const response = await http.get(
    `/b/efficiency/member/work_handle/${params}/statistics`,
  )
  return response
}

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

const filArr = (data: any) => {
  return data?.map((item: any) => {
    return {
      content_txt: item,
      id: item,
    }
  })
}

const filArr2 = (data: any) => {
  return data?.map((item: any) => {
    return {
      content_txt: item.name,
      id: item.id,
    }
  })
}

// 获取动态搜索段
export const getSearchField: any = async (params: any) => {
  // 成员列表
  if (params === 0) {
    return null
  }

  const res = await getTreeList({ id: params })

  const res2 = await storyConfigCategoryList({
    projectId: params,
    isSelect: true,
  })
  const newTreeData = filterTreeData(res)
  const newLieBieData = filArr2(res2.list)

  // 公司

  const companyList = await getStaffListAll({ all: 1 })

  const filterCompanyList = companyList.map((item: any) => ({
    id: item.id,
    content: item.name,
    content_txt: item.name,
  }))

  const memberList = await http.get('getProjectMember', {
    search: {
      project_id: params,
      all: 1,
    },
  })

  const filterMemberList = memberList.data.map((item: any) => {
    return {
      id: item.id,
      content: item.name,
      content_txt: item.name,
    }
  })

  // 迭代列表
  const iterateList = await http.get('getIterateList', {
    search: {
      project_id: params,
      all: 1,
    },
  })

  const filterIterateList = iterateList.data.map((item: any) => {
    return {
      id: item.id,
      content: item.name,
      content_txt: item.name,
    }
  })

  const response = await http.get('getProjectInfo', {
    id: params,
  })

  const {
    storyConfig: { filter_fidlds },
  } = response.data

  const allList = filter_fidlds.map((item: any) => {
    if (item.content === 'iterate_name') {
      item.values = [
        { id: -1, content: '空', content_txt: '空' },
        ...filterIterateList,
      ]
    }
    if (item.content === 'priority' || item.content === 'tag') {
      item.values = [
        { id: -1, content: '空', content_txt: '空' },
        ...item.values,
      ]
    }
    if (
      item.content === 'user_name' ||
      item.content === 'users_name' ||
      item.content === 'users_copysend_name'
    ) {
      item.values = [
        { id: -1, content: '空', content_txt: '空' },
        ...filterMemberList,
      ]
    }
    return item
  })

  const filterAllList = allList?.map((item: any) => {
    if (item.title.includes('时间') && !item.attr) {
      return {
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        children: item.values,
        type: 'time',
        isDefault: item.is_default_filter,
        contentTxt: item.content_txt,
      }
    } else if (item.title.includes('需求进度') && !item.attr) {
      return {
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
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        type: 'tree',
        isDefault: item.is_default_filter,
        contentTxt: item.content_txt,
        children: newTreeData,
      }
    } else if (item.title.includes('需求类别') && !item.attr) {
      return {
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        type: 'select_checkbox',
        isDefault: item.is_default_filter,
        contentTxt: item.content_txt,
        children: [
          { id: -1, content: '空', content_txt: '空' },
          ...newLieBieData,
        ],
      }
    } else if (item.attr) {
      // 成员

      if (item.attr === 'user_select') {
        if (item.values[0] === 'projectMember') {
          return {
            id: item.id,
            name: item.title,
            key: item.content,
            content: item.content,
            type: 'select_checkbox',
            isDefault: item.is_default_filter,
            contentTxt: item.content_txt,
            children: [
              { id: -1, content: '空', content_txt: '空' },
              ...filterMemberList,
            ],
          }
        }
        if (item.values[0] === 'companyMember') {
          return {
            id: item.id,
            name: item.title,
            key: item.content,
            content: item.content,
            type: 'select_checkbox',
            isDefault: item.is_default_filter,
            contentTxt: item.content_txt,
            children: [
              { id: -1, content: '空', content_txt: '空' },
              ...filterCompanyList,
            ],
          }
        }
      }
      if (item.attr === 'user_select_checkbox') {
        if (item.values[0] === 'projectMember') {
          return {
            id: item.id,
            name: item.title,
            key: item.content,
            content: item.content,
            type: 'select_checkbox',
            isDefault: item.is_default_filter,
            contentTxt: item.content_txt,
            children: [
              { id: -1, content: '空', content_txt: '空' },
              ...filterMemberList,
            ],
          }
        }
        if (item.values[0] === 'companyMember') {
          return {
            id: item.id,
            name: item.title,
            key: item.content,
            content: item.content,
            type: 'select_checkbox',
            isDefault: item.is_default_filter,
            contentTxt: item.content_txt,
            children: [
              { id: -1, content: '空', content_txt: '空' },
              ...filterCompanyList,
            ],
          }
        }
      }

      const filterData = filArr(item?.values) || []
      return {
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        type: item.attr,
        isDefault: item.is_default_filter,
        contentTxt: item.content_txt,
        children: [{ id: -1, content: '空', content_txt: '空' }, ...filterData],
      }
    }
    return {
      id: item.id,
      name: item.title,
      key: item.content,
      content: item.content,
      children: item.values,
      type: 'select_checkbox',
      isDefault: item.is_default_filter,
      contentTxt: item.content_txt,
    }
  })
  const filterBasicsList = filter_fidlds.filter(
    (item: any) => item.group_name === '基本字段',
  )

  const filterSpecialList = filter_fidlds.filter(
    (item: any) => item.group_name === '人员与时间字段',
  )

  const filterCustomList = filter_fidlds.filter(
    (item: any) => item.group_name === '自定义字段',
  )

  return {
    filterAllList,
    filterBasicsList,
    filterSpecialList,
    filterCustomList,
  }
}

// 获取动态表头
export const getField: any = async (params: any) => {
  const response = await http.get('getProjectInfo', {
    id: params,
  })

  const {
    storyConfig: { display_fidlds },
  } = response.data

  const plainOptions = display_fidlds
    .filter((item: { group_name: string }) => item.group_name === '基本字段')
    .map(
      (item: {
        title: any
        content: any
        is_default_display: any
        content_txt: any
      }) => {
        return {
          label: item.title,
          value: item.content,
          is_default_display: item.is_default_display,
          labelTxt: item.content_txt,
        }
      },
    )

  const plainOptions2 = display_fidlds
    .filter(
      (item: { group_name: string }) => item.group_name === '人员与时间字段',
    )
    .map(
      (item: {
        is_default_display: any
        title: any
        content: any
        content_txt: any
      }) => {
        return {
          label: item.title,
          value: item.content,
          is_default_display: item.is_default_display,
          labelTxt: item.content_txt,
        }
      },
    )

  const plainOptions3 = display_fidlds
    .filter((item: { group_name: string }) => item.group_name === '自定义字段')
    .map((item: any) => {
      return {
        label: item.title,
        value: item.content,
        is_default_display: item.is_default_display,
        labelTxt: item.content_txt,
        attr: item.attr,
      }
    })

  const titleList: any[] = []
  plainOptions
    .filter((item: any) => item.is_default_display === 1)
    .forEach((item: { title: any; value: any }) => {
      titleList.push(item.value)
    })

  const titleList2: any[] = []
  plainOptions2
    .filter((item: any) => item.is_default_display === 1)
    .forEach((item: { title: any; value: any }) => {
      titleList2.push(item.value)
    })

  const titleList3: any[] = []
  plainOptions3
    .filter((item: any) => item.is_default_display === 1)
    .forEach((item: { title: any; value: any }) => {
      titleList3.push(item.value)
    })

  return {
    plainOptions,
    plainOptions2,
    plainOptions3,
    titleList,
    titleList2,
    titleList3,
  }
}

// 获取左侧动态列表
export const getUserFeedList: any = async (params: any) => {
  const response = await http.get('getUserFeedList', {
    limit: params.limit,
    page: params.page,
    pagesize: params.pagesize,
  })
  return response
}

// 获取优先级或者状态
export const getPriOrStu: any = async (params: any) => {
  const response = await http.get('getPriOrStu', {
    project_id: params.projectId,
    type: params.type,
  })
  return response
}

// 获取甘特图
export const getMineGatte: any = async (params: any) => {
  const response = await http.get('getMineGatte', {
    start_time: params.startTime,
    end_time: params.endTime,
    page: params.page,
    pagesize: params.pagesize,
  })

  return {
    pager: response.data.pager,
    list: response.data.list?.map((k: any, index: any) => ({
      ...k,
      id: k.id || new Date().getTime() + index * 11,
      text: k.name || '',
      start_date: k.start_at,
      end_date: k.end_at,
      statusName: k.status_name || '',
      statusColor: k.status_color || '',
      categoryName: k.category || '',
      categoryColor: k.category_color || '',
      parent: k.parent || '',
      render: k.render || '',
    })),
  }
}

// 获取状态下的成员列表
export const getProjectMember: any = async (params: any) => {
  const response = await http.get('getProjectMember', {
    search: {
      project_id: params,
      all: 1,
    },
  })
  return response
}

// 流转状态
export const updateDemandStatus: any = async (params: any) => {
  delete params.fields.reviewerValue
  await http.put<any>('updateDemandStatus', {
    project_id: params.projectId,
    story_id: params.nId,
    category_status_to_id: params.toId,
    fields: params.fields,
    verify_user_id: params.verifyId ?? undefined,
  })
}

// 修改优先级
export const updatePriorityStatus: any = async (params: any) => {
  const res = await http.put<any>('updatePriority', {
    project_id: params.projectId,
    priority: params.priorityId,
    id: params.id,
  })
  return res
}

// 获取我的待办列表
export const getMineNoFinishList: any = async (params: any) => {
  const response = await http.get('getMineNoFinishList', {
    search: {
      project_id: params?.projectId,
      keyword: params?.keyword,
      category_status_ids: params.searchGroups?.statusId,
      priority: params.searchGroups?.priorityId,
      iterate_id: params.searchGroups?.iterateId,
      tag: params.searchGroups?.tagId,
      user_id: params.searchGroups?.userId,
      users_name: params.searchGroups?.usersnameId,
      users_copysend_name: params.searchGroups?.usersCopysendNameId,
      created_at: params.searchGroups?.createdAtId,
      expected_start_at: params.searchGroups?.expectedStartAtId,
      expected_end_at: params.searchGroups?.expectedendat,
      updated_at: params.searchGroups?.updatedat,
      finish_at: params.searchGroups?.finishAt,
      panel_date: params?.panelDate,
      all: params?.all,
      class_ids: params.searchGroups?.class_ids,
      category_id: params.searchGroups?.category_id,
      schedule_start: params.searchGroups?.schedule_start,
      schedule_end: params.searchGroups?.schedule_end,
      custom_field: params.searchGroups?.custom_field,
    },
    order: params.order === 1 ? 'asc' : params.order === 2 ? 'desc' : '',
    orderkey: params.orderkey,
    page: params.page,
    pagesize: params.pagesize,
  })
  if (params?.all) {
    return response.data?.list?.map((k: any) => ({
      status_name: k.status_name,
      count: k.count,
      list: k.list
        ? k.list?.map((i: any) => ({
            ...i,
            statusName: k.status_name,
            category_attachment: i.category_attachment,
            categoryConfigList: i.category_config_list,
            storyPrefixKey: i.story_prefix_key,
            new: i.is_new,
            id: i.id,
            name: i.name,
            demand: i.child_story_count,
            priority: i.priority,
            iteration: i.iterate_name || '--',
            status: i.status,
            dealName: i.users_name || '--',
            time: i.created_at,
            expectedStart: i.expected_start_at,
            expectedEnd: i.expected_end_at,
            info: i.info,
            userIds: i.user_id,
            userAvatar: i.user_avatar,
            iterateId: i.iterate_id,
            parentId: i.parent_id,
            finishTime: i.finish_at,
            updatedTime: i.updated_at,
            usersCopySendName: i.users_copysend_name,
            userName: i.user_name,
            tag: i.tag,
            project_id: i.project_id,
            schedule: i.schedule,
            isExamine: i.verify_lock === 1,
            category: i.category,
            categoryColor: i.category_color,
            ...i.custom_field,
            usersNameIds: i.users_name_ids,
            usersCopySendIds: i.users_copysend_name_ids,
            copy_send_users: i.copy_send_users,
            class: i.class,
            project: {
              name: i.project.name,
              isPublic: i.project.is_public,
              isUserMember: i.project.user_ismember,
              permissions: i.project.permissions,
              isEdit: Object.values(i.project.permissions).includes(
                i.project_type === 2
                  ? 'b/transaction/update'
                  : i.project_type === 1 && i.is_bug === 1
                  ? 'b/flaw/update'
                  : 'b/story/update',
              ),
              isDelete: Object.values(i.project.permissions).includes(
                i.project_type === 2
                  ? 'b/transaction/delete'
                  : i.project_type === 1 && i.is_bug === 1
                  ? 'b/flaw/delete'
                  : 'b/story/delete',
              ),
            },
            usersInfo: i.usersInfo,
            is_bug: i.is_bug,
            project_type: i.project_type,
            // 父需求列表
            parent: [{ value: i.id, label: i.name }],
          }))
        : [],
    }))
  } else {
    return {
      list: response.data?.list
        ? response.data.list.map((i: any) => ({
            ...i,
            category_attachment: i.category_attachment,
            categoryConfigList: i.category_config_list,
            storyPrefixKey: i.story_prefix_key,
            new: i.is_new,
            id: i.id,
            name: i.name,
            demand: i.child_story_count,
            priority: i.priority,
            iteration: i.iterate_name || '--',
            status: i.status,
            dealName: i.users_name || '--',
            time: i.created_at,
            expectedStart: i.expected_start_at,
            expectedEnd: i.expected_end_at,
            info: i.info,
            userIds: i.user_id,
            userAvatar: i.user_avatar,
            iterateId: i.iterate_id,
            parentId: i.parent_id,
            finishTime: i.finish_at,
            updatedTime: i.updated_at,
            usersCopySendName: i.users_copysend_name,
            userName: i.user_name,
            tag: i.tag,
            project_id: i.project_id,
            schedule: i.schedule,
            category: i.category,
            categoryColor: i.category_color,
            usersNameIds: i.users_name_ids,
            usersCopySendIds: i.users_copysend_name_ids,
            copy_send_users: i.copy_send_users,
            class: i.class,
            project: {
              name: i.project.name,
              isPublic: i.project.is_public,
              isUserMember: i.project.user_ismember,
              permissions: i.project.permissions,
              isEdit: Object.values(i.project.permissions).includes(
                i.project_type === 2
                  ? 'b/transaction/update'
                  : i.project_type === 1 && i.is_bug === 1
                  ? 'b/flaw/update'
                  : 'b/story/update',
              ),
              isDelete: Object.values(i.project.permissions).includes(
                i.project_type === 2
                  ? 'b/transaction/delete'
                  : i.project_type === 1 && i.is_bug === 1
                  ? 'b/flaw/delete'
                  : 'b/story/delete',
              ),
            },
            usersInfo: i.usersInfo,
            is_bug: i.is_bug,
            project_type: i.project_type,
            // 父需求列表
            parent: [{ value: i.id, label: i.name }],
            isExamine: i.verify_lock === 1,
            ...i.custom_field,
          }))
        : [],
      pager: response.data.pager,
    }
  }
}

// 我的创建列表
export const getMineCreacteList: any = async (params: any) => {
  const response = await http.get('getMineCreacteList', {
    search: {
      project_id: params.projectId,
      keyword: params?.keyword,
      category_status_ids: params.searchGroups?.statusId,
      priority: params.searchGroups?.priorityId,
      iterate_id: params.searchGroups?.iterateId,
      tag: params.searchGroups?.tagId,
      user_id: params.searchGroups?.userId,
      users_name: params.searchGroups?.usersnameId,
      users_copysend_name: params.searchGroups?.usersCopysendNameId,
      created_at: params.searchGroups?.createdAtId,
      expected_start_at: params.searchGroups?.expectedStartAtId,
      expected_end_at: params.searchGroups?.expectedendat,
      updated_at: params.searchGroups?.updatedat,
      finish_at: params.searchGroups?.finishAt,
      class_ids: params.searchGroups?.class_ids,
      category_id: params.searchGroups?.category_id,
      schedule_start: params.searchGroups?.schedule_start,
      schedule_end: params.searchGroups?.schedule_end,
      custom_field: params.searchGroups?.custom_field,
    },
    order: params.order === 1 ? 'asc' : params.order === 2 ? 'desc' : '',
    orderkey: params.orderkey,
    page: params.page,
    pagesize: params.pagesize,
  })
  return {
    list: response.data?.list
      ? response.data.list.map((i: any) => ({
          ...i,
          category_attachment: i.category_attachment,
          categoryConfigList: i.category_config_list,
          storyPrefixKey: i.story_prefix_key,
          id: i.id,
          name: i.name,
          demand: i.child_story_count,
          priority: i.priority,
          iteration: i.iterate_name || '--',
          status: i.status,
          dealName: i.users_name || '--',
          time: i.created_at,
          expectedStart: i.expected_start_at,
          expectedEnd: i.expected_end_at,
          info: i.info,
          userIds: i.user_id,
          userAvatar: i.user_avatar,
          iterateId: i.iterate_id,
          parentId: i.parent_id,
          finishTime: i.finish_at,
          updatedTime: i.updated_at,
          usersCopySendName: i.users_copysend_name,
          userName: i.user_name,
          tag: i.tag,
          project_id: i.project_id,
          schedule: i.schedule,
          isExamine: i.verify_lock === 1,
          category: i.category,
          categoryColor: i.category_color,
          ...i.custom_field,
          usersNameIds: i.users_name_ids,
          usersCopySendIds: i.users_copysend_name_ids,
          copy_send_users: i.copy_send_users,
          class: i.class,
          project: {
            isPublic: i.project.is_public,
            isUserMember: i.project.user_ismember,
            permissions: i.project.permissions,
            isEdit: Object.values(i.project.permissions).includes(
              i.project_type === 2
                ? 'b/transaction/update'
                : i.project_type === 1 && i.is_bug === 1
                ? 'b/flaw/update'
                : 'b/story/update',
            ),
            isDelete: Object.values(i.project.permissions).includes(
              i.project_type === 2
                ? 'b/transaction/delete'
                : i.project_type === 1 && i.is_bug === 1
                ? 'b/flaw/delete'
                : 'b/story/delete',
            ),
          },
          usersInfo: i.usersInfo,
          is_bug: i.is_bug,
          project_type: i.project_type,
          // 父需求列表
          parent: [{ value: i.id, label: i.name }],
        }))
      : [],
    pager: response.data.pager,
  }
}

// 获取我的已办列表
export const getMineFinishList: any = async (params: any) => {
  const response = await http.get('getMineFinishList', {
    search: {
      project_id: params.projectId,
      keyword: params?.keyword,
      category_status_ids: params.searchGroups?.statusId,
      priority: params.searchGroups?.priorityId,
      iterate_id: params.searchGroups?.iterateId,
      tag: params.searchGroups?.tagId,
      user_id: params.searchGroups?.userId,
      users_name: params.searchGroups?.usersnameId,
      users_copysend_name: params.searchGroups?.usersCopysendNameId,
      created_at: params.searchGroups?.createdAtId,
      expected_start_at: params.searchGroups?.expectedStartAtId,
      expected_end_at: params.searchGroups?.expectedendat,
      updated_at: params.searchGroups?.updatedat,
      finish_at: params.searchGroups?.finishAt,
      class_ids: params.searchGroups?.class_ids,
      category_id: params.searchGroups?.category_id,
      schedule_start: params.searchGroups?.schedule_start,
      schedule_end: params.searchGroups?.schedule_end,
      custom_field: params.searchGroups?.custom_field,
    },
    order: params.order === 1 ? 'asc' : params.order === 2 ? 'desc' : '',
    orderkey: params.orderkey,
    page: params.page,
    pagesize: params.pagesize,
  })
  return {
    list: response.data?.list
      ? response.data?.list?.map((i: any) => ({
          ...i,
          category_attachment: i.category_attachment,
          categoryConfigList: i.category_config_list,
          storyPrefixKey: i.story_prefix_key,
          id: i.id,
          name: i.name,
          demand: i.child_story_count,
          priority: i.priority,
          iteration: i.iterate_name || '--',
          status: i.status,
          dealName: i.users_name || '--',
          time: i.created_at,
          expectedStart: i.expected_start_at,
          expectedEnd: i.expected_end_at,
          info: i.info,
          userIds: i.user_id,
          userAvatar: i.user_avatar,
          iterateId: i.iterate_id,
          parentId: i.parent_id,
          finishTime: i.finish_at,
          updatedTime: i.updated_at,
          usersCopySendName: i.users_copysend_name,
          userName: i.user_name,
          tag: i.tag,
          project_id: i.project_id,
          schedule: i.schedule,
          isExamine: i.verify_lock === 1,
          category: i.category,
          categoryColor: i.category_color,
          ...i.custom_field,
          usersNameIds: i.users_name_ids,
          usersCopySendIds: i.users_copysend_name_ids,
          copy_send_users: i.copy_send_users,
          class: i.class,
          project: {
            name: i.project.name,
            isPublic: i.project.is_public,
            isUserMember: i.project.user_ismember,
            permissions: i.project.permissions,
            isEdit: Object.values(i.project.permissions).includes(
              i.project_type === 2
                ? 'b/transaction/update'
                : i.project_type === 1 && i.is_bug === 1
                ? 'b/flaw/update'
                : 'b/story/update',
            ),
            isDelete: Object.values(i.project.permissions).includes(
              i.project_type === 2
                ? 'b/transaction/delete'
                : i.project_type === 1 && i.is_bug === 1
                ? 'b/flaw/delete'
                : 'b/story/delete',
            ),
          },
          usersInfo: i.usersInfo,
          is_bug: i.is_bug,
          project_type: i.project_type,
          // 父需求列表
          parent: [{ value: i.id, label: i.name }],
        }))
      : [],
    pager: response.data.pager,
  }
}

// 获取我的抄送列表
// eslint-disable-next-line complexity
export const getMineNeedList: any = async (params: any) => {
  const response = await http.get('getMineNeedList', {
    search: {
      project_id: params.projectId,
      keyword: params?.keyword,
      category_status_ids: params.searchGroups?.statusId,
      priority: params.searchGroups?.priorityId,
      iterate_id: params.searchGroups?.iterateId,
      tag: params.searchGroups?.tagId,
      user_id: params.searchGroups?.userId,
      users_name: params.searchGroups?.usersnameId,
      users_copysend_name: params.searchGroups?.usersCopysendNameId,
      created_at: params.searchGroups?.createdAtId,
      expected_start_at: params.searchGroups?.expectedStartAtId,
      expected_end_at: params.searchGroups?.expectedendat,
      updated_at: params.searchGroups?.updatedat,
      finish_at: params.searchGroups?.finishAt,
      class_ids: params.searchGroups?.class_ids,
      category_id: params.searchGroups?.category_id,
      schedule_start: params.searchGroups?.schedule_start,
      schedule_end: params.searchGroups?.schedule_end,
      custom_field: params.searchGroups?.custom_field,
    },
    order: params.order === 1 ? 'asc' : params.order === 2 ? 'desc' : '',
    orderkey: params.orderkey,
    page: params.page,
    pagesize: params.pagesize,
  })
  return {
    list: response.data?.list
      ? response.data.list.map((i: any) => ({
          ...i,
          category_attachment: i.category_attachment,
          categoryConfigList: i.category_config_list,
          storyPrefixKey: i.story_prefix_key,
          id: i.id,
          name: i.name,
          demand: i.child_story_count,
          priority: i.priority,
          iteration: i.iterate_name || '--',
          status: i.status,
          dealName: i.users_name || '--',
          time: i.created_at,
          expectedStart: i.expected_start_at,
          expectedEnd: i.expected_end_at,
          info: i.info,
          userIds: i.user_id,
          userAvatar: i.user_avatar,
          iterateId: i.iterate_id,
          parentId: i.parent_id,
          finishTime: i.finish_at,
          updatedTime: i.updated_at,
          usersCopySendName: i.users_copysend_name,
          userName: i.user_name,
          tag: i.tag,
          project_id: i.project_id,
          schedule: i.schedule,
          category: i.category,
          categoryColor: i.category_color,
          usersNameIds: i.users_name_ids,
          usersCopySendIds: i.users_copysend_name_ids,
          copy_send_users: i.copy_send_users,
          class: i.class,
          project: {
            isPublic: i.project.is_public,
            isUserMember: i.project.user_ismember,
            permissions: i.project.permissions,
            isEdit: Object.values(i.project.permissions).includes(
              i.project_type === 2
                ? 'b/transaction/update'
                : i.project_type === 1 && i.is_bug === 1
                ? 'b/flaw/update'
                : 'b/story/update',
            ),
            isDelete: Object.values(i.project.permissions).includes(
              i.project_type === 2
                ? 'b/transaction/delete'
                : i.project_type === 1 && i.is_bug === 1
                ? 'b/flaw/delete'
                : 'b/story/delete',
            ),
          },
          usersInfo: i.usersInfo,
          is_bug: i.is_bug,
          project_type: i.project_type,
          // 父需求列表
          parent: [{ value: i.id, label: i.name }],
          isExamine: i.verify_lock === 1,
          ...i.custom_field,
        }))
      : [],
    pager: response.data.pager,
  }
}

// 获取我的项目列表
export const getMineProjectList: any = async (params: any) => {
  const response = await http.get('getMineProjectList', {
    type: params,

    // abeyance-待办 ；copysend-抄送； create创建 ；finish-已办
  })
  return response
}

// 获取我的概况
export const getMineChartsList: any = async () => {
  const response = await http.get('getMineChartsList')

  return response.data
}

// 表单区域

// 获取项目列表

export const getProjectList: any = async (params: any) => {
  const response: any = await http.get<any>('getProjectList', {
    search: {
      self: params.self,
      all: params.all,
    },
  })
  return response
}

// 获取标签列表
export const getTagList: any = async (params: any) => {
  const response: any = await http.get<any>('getTagList', {
    project_id: params.projectId,
  })
  return response.data
}

// 获取迭代列表
export const getIterateList: any = async (params: any) => {
  const response: any = await http.get<any>('getIterateList', {
    search: {
      project_id: params.projectId,
      all: params.all,
    },
  })

  return response.data
}

// 获取成员列表
export const getPeopleList: any = async (params: any) => {
  const response: any = await http.get<any>('getProjectMember', {
    search: {
      project_id: params.projectId,
      all: params.all,
    },
  })
  return response.data
}

// 快速创建
export const addQuicklyCreate: any = async (params: any) => {
  const element = document.createElement('div')
  element.innerHTML = params?.info || ''
  const hasImg = Array.from(element.getElementsByTagName('img'))
  const info = hasImg.length
    ? params?.info
    : element.innerText.trim() === ''
    ? ''
    : element.innerHTML

  const response: any = await http.post<any>('addQuicklyCreate', {
    project_id: params.projectId,
    name: params.name,
    info,
    expected_start_at: params.expectedStart,
    expected_end_at: params.expectedEnd,
    iterate_id: params.iterate_id,
    parent_id: params.parentId,
    priority: params.priority,
    users: params.users,
    copysend: params.copysend,
    tag: params.tag,
    attachment: params.attachments,
    custom_field: params.customField,
    category_id: params?.category,
    class_id: params?.class,
    schedule: params?.schedule,
  })
  return response
}

export const getVerifyUserList: any = async (params: any) => {
  const response: any = await http.get<any>('getVerifyUserList', {
    search: {
      project_id: params.projectId,
      user_id: params.userId,
      keyword: params.searchValue,
      verify_status: params.verifyStatus,
      verify_opinion: params.remark,
      verify_at: params.verifyTime,
      created_at: params.time,
    },
    pagesize: params.pageSize,
    page: params.page,
    orderkey: params.orderKey,
    order: params.order === 1 ? 'asc' : params.order === 2 ? 'desc' : '',
  })
  return {
    currentPage: params.page,
    total: response.data.pager.total,
    otherCount: response.data.otherCount,
    list: response.data.list.map((i: any) => ({
      ...i,
      category_attachment: i.category_attachment,
      id: i.id,
      storyVerifyId: i.story_verify_id,
      status: i.verify_status,
      verifyTime: i.verify_at,
      reason: i.verify_opinion,
      demandId: i.story_id,
      demandName: i.story_name,
      categoryName: i.category_name,
      categoryColor: i.category_color,
      categoryAttachment: i.category_attachment,
      userName: i.user_name,
      userId: i.user_id,
      is_member: i.is_member,
      userAvatar: i.user_avatar,
      usersName: i.users_name,
      statusFromTo: i.status_from_to,
      projectId: i.project_id,
      storyPrefixKey: i.story_prefix_key,
      usersInfo: i.usersInfo,
      is_bug: i.is_bug,
      project_type: i.project_type,
      project_name: i.project_name,
      // 父需求列表
      parent: [{ value: i.id, label: i.name }],
    })),
  }
}

export const getVerifyList: any = async (params: any) => {
  const response: any = await http.get<any>('getVerifyList', {
    search: {
      project_id: params.projectId,
      user_id: params.userId,
      keyword: params.searchValue,
      verify_status: params.verifyStatus,
      verify_at: params.verifyTime,
      created_at: params.time,
    },
    pagesize: params.pageSize,
    page: params.page,
    orderkey: params.orderKey,
    order: params.order === 1 ? 'asc' : params.order === 2 ? 'desc' : '',
  })

  return {
    currentPage: params.page,
    total: response.data.pager.total,
    otherCount: response.data.otherCount,
    list: response.data.list.map((i: any) => ({
      id: i.id,
      storyVerifyId: i.story_verify_id,
      status: i.verify_status,
      verifyTime: i.verify_at,
      demandId: i.story_id,
      demandName: i.story_name,
      categoryName: i.category_name,
      categoryAttachment: i.category_attachment,
      categoryColor: i.category_color,
      usersName: i.users_name,
      statusFromTo: i.status_from_to,
      projectId: i.project_id,
      storyPrefixKey: i.story_prefix_key,
      usersInfo: i.usersInfo,
      is_bug: i.is_bug,
      project_type: i.project_type,
      is_member: i.is_member,
      // 父需求列表
      parent: [{ value: i.id, label: i.name }],
    })),
  }
}

export const getVerifyInfo: any = async (params: any) => {
  const response = await http.get(`/b/user/verify/${params?.id}`)

  return {
    cancel_verify: response.data.cancel_verify,
    category_attachment: response.data.category_attachment,
    id: response.data.id,
    demandName: response.data.story_name,
    categoryColor: response.data.category_color,
    categoryName: response.data?.category_name,
    statusFromTo: response.data?.status_from_to,
    usersName: response.data.users_name,
    userName: response.data.user_name,
    time: response.data.created_at,
    from: response.data.category_status_from,
    to: response.data.category_status_to,
    verifyStatus: response.data.verify_status,
    verify: {
      verifyType: response.data.verify.verify_type,
      process: response.data.verify.process?.map((i: any) => ({
        operator: i.operator,
        verifyUsers: i.verify_users?.map((k: any) => ({
          id: k.user_id,
          status: k.verify_status,
          time: k.verify_at,
          remark: k.verify_opinion,
          userName: k.user_name,
        })),
      })),
    },
    fixedUser: response.data.verify_users?.map((k: any) => ({
      userName: k.user_name,
      time: k.verify_at,
      status: k.verify_status,
      remark: k.verify_opinion,
      id: k.user_id,
    })),
    fields: response.data.fields,
    storyPrefixKey: response.data.story_prefix_key,
  }
}

export const updateVerifyOperation: any = async (params: any) => {
  await http.put('updateVerifyOperation', {
    id: params.id,
    project_id: params.projectId,
    verify_status: params.status,
    verify_opinion: params.remark,
  })
}

export const cancelVerify = async (id: any) => {
  await http.post(`/b/user/verify/cancel/${id}`, undefined, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}
