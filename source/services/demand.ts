/* eslint-disable max-lines */
/* eslint-disable no-undefined */
/* eslint-disable no-else-return */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable complexity */

// 需求

import * as http from '@/tools/http'
import { transData } from '@/tools'

// 编辑富文本
export const updateDemandEditor = async (params: any) => {
  await http.put<any>('updateDemand', {
    project_id: params.projectId,
    info: params.info,
    id: params.id,
    name: params.name,
  })
}

// 删除关联
export const deleteStoryRelation = async (
  params: API.Flaw.DeleteRelation.Params,
) => {
  await http.delete<any>('deleteStoryRelation', params)
}

// 获取缺陷关联工作项列表
export const getStoryRelationStories = async (
  params: API.Flaw.GetFlawRelationStories.Params,
) => {
  const response = await http.get<any, API.Flaw.GetFlawRelationStories.Result>(
    'getStoryRelationStories',
    {
      pagesize: params.pageSize,
      page: params.page,
      orderkey: params.orderKey,
      order: params.order,
      project_id: params.projectId,
      id: params.id,
    },
  )

  return {
    list: response.data.list.map((i: any) => ({
      ...i,
      categoryConfigList: i.category_config_list,
    })),
    pager: response.data.pager,
  }
}

//  添加关联缺陷
export const addStoryRelation = async (
  params: API.Flaw.FlawRelation.Params,
) => {
  await http.post<any>('addStoryRelation', {
    project_id: params.projectId,
    id: params.id,
    relation_id: params.relationId,
    type: params.type,
  })
}

// 关联需求拖拽排序
export const storyRelationDragSort = async (params: any) => {
  await http.post<any>('storyRelationDragSort', {
    project_id: params.projectId,
    id: params.id,
    relation_ids: params.relationIds,
    type: params.type,
  })
}

// 搜索查询下拉关联事务
export const getStorySelectRelationSearch = async (
  params: API.Flaw.GetFlawRelationList.Params,
) => {
  const response = await http.get<any, API.Flaw.GetFlawRelationList.Result>(
    'getStorySelectRelationSearch',
    {
      project_id: params.projectId,
      id: params.id,
      keywords: params.searchValue,
    },
  )

  return response.data
}

// 最近子事务查询
export const getStorySelectRelationRecent = async (
  params: API.Flaw.GetFlawRelationList.Params,
) => {
  const response = await http.get<any, API.Flaw.GetFlawRelationList.Result>(
    'getStorySelectRelationRecent',
    {
      project_id: params.projectId,
      id: params.id,
    },
  )
  return response.data
}

// 获取需求类别配置列表
export const getCategoryConfigList = async (params: any) => {
  const response = await http.get(
    `/b/project/story_config/category/config/list/${params.categoryId}`,
    {
      project_id: params.projectId,
    },
  )
  return response.data?.map((i: any) => ({
    id: i.id,
    categoryId: i.category_id,
    storyId: i.story_config_id,
    isRequired: i.is_required,
    status: i.status,
    isFold: i.is_fold,
    sort: i.sort,
    content: i.content,
    title: i.title,
    isCustomize: i.is_customize,
    fieldContent: i.field_content,
    remarks: i.remarks,
    attr: i.attr,
  }))
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

  const filterGetTagList = selectData.tag?.map((i: any) => ({
    id: i.id,
    name: i.content,
  }))

  // 优先级

  const filterGetPriOrStu = selectData.priority?.map((i: any) => ({
    id: i.id,
    name: i.content,
  }))

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
    } else if (item.content.includes('users_name') && !item.attr) {
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
    } else if (item.content.includes('users_copysend_name') && !item.attr) {
      return {
        ...item,
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        children: [...filterCompanyList],
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
    originalStatusUserIds: res.data.originalStatusUserIds,
  }
  return obj
}

export const getTreeList = async (params: any) => {
  const res = await http.get('getNeedTreeList', {
    project_id: params.id,
    is_tree: params.isTree ?? 2,
  })
  const newData = res.data.map((item: any) => {
    return {
      ...item,
      key: item.id,
    }
  })
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
        ...(transData(newData, 'id', 'parent_id', 'children') ?? []),
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

  return res
}

export const delTreeList = async (params: any) => {
  const res = await http.post('delNeedTreeList', {
    project_id: params.projectId,

    id: params?.id,
  })

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

export const updateDemandStatus: any = async (params: any) => {
  delete params.fields.reviewerValue
  const response = await http.put<any>('updateDemandStatus', {
    project_id: params.projectId,
    story_id: params.nId,
    category_status_to_id: params.toId,
    fields: params.fields,
    verify_user_id: params.verifyId ?? undefined,
  })
  return response
}

export const getDemandInfo: any = async (params: any) => {
  const response: any = await http.get<any>('getDemandInfo', {
    project_id: params.projectId,
    id: params.id,
  })

  return {
    category_attachment: response.data.category_attachment,
    categoryName: response.data.category,
    id: response.data.id,
    name: response.data.name || '--',
    info: response.data.info.replaceAll('\n', '<br/>'),
    priority: response.data.priority,
    expectedStart: response.data.expected_start_at,
    expectedEnd: response.data.expected_end_at,
    finishTime: response.data.finish_at,
    demandCount: response.data.story_count,
    iterateName: response.data.iterate_name || '--',
    userName: response.data.user_name,
    childCount: response.data.child_story_count,
    parentName: response.data.parent_name,
    attachment: response.data.attachment,
    tag: response.data.tag,
    copySend: response.data.copysend,
    user: response.data.user || '--',
    createdTime: response.data.created_at,
    status: response.data.status,
    parentId: response.data.parent_id || null,
    changeCount: response.data.app_changelog_count,
    iterateId: response.data.iterate_id || null,
    projectId: response.data.project_id,
    isExamine: response.data.verify_lock === 1,
    customField: response.data.custom_field,
    schedule: response.data.schedule,
    category: response.data.category_id,
    class: response.data.class_id,
    className: response.data.class,
    prefixKey: response.data.prefix_key,
    projectPrefix: response.data.project_prefix,
    hierarchy: response.data.hierarchy,
    level_tree: [
      ...response.data.level_tree,
      {
        id: response.data.id,
        category_id: response.data.category_id,
        prefix_key: response.data.prefix_key,
        project_prefix: response.data.project_prefix,
        category_attachment: response.data.category_attachment,
        parent_id: response.data.parent_id,
        name: response.data.name,
      },
    ],
    project_type: response.data.project_type,
    update_at: response.data.update_at,
    category_status: response.category_status,
    work_type: response.data.work_type,
    has_verify: response.data.has_verify,
    verify_data: response.data.verify_data
      ? {
          cancel_verify: response.data.verify_data.cancel_verify,
          category_attachment: response.data.verify_data.category_attachment,
          categoryColor: response.data.verify_data.category_color,
          categoryName: response.data.verify_data?.category_name,
          statusFromTo: response.data.verify_data?.status_from_to,
          usersName: response.data.verify_data.users_name,
          userName: response.data.verify_data.user_name,
          time: response.data.verify_data.created_at,
          from: response.data.verify_data.category_status_from,
          to: response.data.verify_data.category_status_to,
          verifyStatus: response.data.verify_data.verify_status,
          verify: {
            verifyType: response.data.verify_data.verify.verify_type,
            process: response.data.verify_data.verify.process?.map(
              (i: any) => ({
                operator: i.operator,
                verifyUsers: i.verify_users?.map((k: any) => ({
                  id: k.user_id,
                  status: k.verify_status,
                  time: k.verify_at,
                  remark: k.verify_opinion,
                  userName: k.user_name,
                })),
              }),
            ),
          },
          fixedUser: response.data.verify_data.verify_users?.map((k: any) => ({
            userName: k.user_name,
            time: k.verify_at,
            status: k.verify_status,
            remark: k.verify_opinion,
            id: k.user_id,
          })),
          fields: response.data.verify_data.fields,
          id: response.data.verify_data.id,
        }
      : null,
    comment_total: response.data.comment_total,
    relation_stories: response.data.relation_stories,
    child_story_statistics: response.data.child_story_statistics,
    // 父需求列表
    parent: [
      { value: response.data.parent?.id, label: response.data.parent?.name },
    ],
  }
}

export const getDemandList: any = async (params: any) => {
  const response: any = await http.get<any>('getDemandList', {
    search: {
      project_id: params?.projectId,
      keyword: params?.searchValue,
      iterate_id: params?.iterateIds,
      category_status_ids: params?.statusIds,
      priority: params?.priorityIds,
      user_id: params?.userId,
      tag: params?.tagIds,
      created_at: params?.startTime,
      expected_start_at: params?.expectedStart,
      expected_end_at: params?.expectedEnd,
      updated_at: params?.updatedTime,
      finish_at: params?.endTime,
      users_name: params?.usersNameId,
      users_copysend_name: params?.copySendId,
      parent_id: params?.parentId,
      all: params?.all ? 1 : 0,
      panel: params?.panel ? 1 : 0,
      class_ids: params.class_ids,
      class_id: params.class_id,
      category_id: params.category_id,
      schedule_start: params.schedule_start,
      schedule_end: params.schedule_end,
      custom_field: params?.custom_field,
      tree: params?.tree || 0,
      top_parent_id: params?.topParentId,
      system_view: params?.system_view,
    },
    pagesize: params?.pageSize,
    page: params?.page,
    orderkey: params?.orderKey,
    order: params?.order,
  })

  const getListItem = (array: any) => {
    return array?.map((i: any) => ({
      id: i.id,
      name: i.name,
      demand: i.child_story_count,
      priority: i.priority,
      iteration: i.iterate_name,
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
      isExamine: i.verify_lock === 1,
      category: i.category,
      class: i.class,
      schedule: i.schedule,
      ...i.custom_field,
      categoryColor: i.category_color,
      categoryRemark: i.category_remark,
      category_attachment: i.category_attachment,
      categoryId: i.category_id,
      project_id: i.project_id,
      usersNameIds: i.users_name_ids,
      usersCopySendIds: i.users_copysend_name_ids,
      allChildrenCount: i.all_child_story_count,
      allChildrenIds: i.all_child_ids,
      children: getListItem(i.children) || null,
      level: i.level,
      isExpended: true,
      topId: params?.parentId ?? params?.topParentId,
      categoryConfigList: i.category_config_list,
      storyPrefixKey: i.story_prefix_key,
      usersInfo: i.usersInfo,
      is_bug: i.is_bug,
      project_type: i.project_type,
      copy_send_users: i.copy_send_users,
      // 父需求列表
      parent: [{ value: i.id, label: i.name }],
    }))
  }

  if (params.all && params.panel) {
    return {
      list: response.data.map((k: any) => ({
        count: k.count,
        list: k.list.map((i: any) => ({
          childCount: i.child_story_count,
          id: i.id,
          name: i.name,
          userName: i.users_name ? i.users_name.split(';') : [],
          priority: i.priority,
          status: i.status,
          category: i.category,
          categoryColor: i.category_color,
          category_attachment: i.category_attachment,
          project_id: i.project_id,
          usersNameIds: i.users_name_ids,
          usersCopySendIds: i.users_copysend_name_ids,
          schedule: i.schedule,
          categoryId: i.category_id,
          storyPrefixKey: i.story_prefix_key,
          usersInfo: i.usersInfo,
          is_bug: i.is_bug,
          project_type: i.project_type,
          copy_send_users: i.copy_send_users,
          // 父需求列表
          parent: [{ value: i.id, label: i.name }],
        })),
        name: k.content_txt,
        id: k.status_id,
        isStart: k.is_start,
        isEnd: k.is_end,
      })),
    }
  } else if (params.all) {
    return response.data.map((i: any) => ({
      id: i.id,
      name: i.name,
      usersNameIds: i.users_name_ids,
      usersCopySendIds: i.users_copysend_name_ids,
      dealName: i.users_name?.split(';') || [],
      status: i.status,
      iteration: i.iterate_name,
      schedule: i.schedule,
      project_id: i.project_id,
      category: i.category,
      categoryColor: i.category_color,
      categoryRemark: i.category_remark,
      category_attachment: i.category_attachment,
      isExamine: i.verify_lock === 1,
      priority: i.priority,
      storyPrefixKey: i.story_prefix_key,
      categoryId: i.category_id,
      usersInfo: i.usersInfo,
      is_bug: i.is_bug,
      project_type: i.project_type,
      copy_send_users: i.copy_send_users,
      // 父需求列表
      parent: [{ value: i.id, label: i.name }],
    }))
  } else if (params?.isChildren) {
    return {
      list: getListItem(response.data),
    }
  } else {
    return {
      currentPage: params.page,
      pageSize: params.pageSize,
      total: response.data.pager.total,
      list: response.data.list.map((i: any) => ({
        id: i.id,
        name: i.name,
        demand: i.child_story_count,
        priority: i.priority,
        iteration: i.iterate_name,
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
        isExamine: i.verify_lock === 1,
        category: i.category,
        class: i.class,
        schedule: i.schedule,
        ...i.custom_field,
        categoryColor: i.category_color,
        categoryRemark: i.category_remark,
        categoryId: i.category_id,
        project_id: i.project_id,
        usersNameIds: i.users_name_ids,
        usersCopySendIds: i.users_copysend_name_ids,
        category_attachment: i.category_attachment,
        allChildrenCount: i.all_child_story_count,
        allChildrenIds: i.all_child_ids,
        children: getListItem(i.children) || null,
        isExpended: params.topParentId === i.id,
        level: 1,
        topId: i.id,
        categoryConfigList: i.category_config_list,
        storyPrefixKey: i.story_prefix_key,
        usersInfo: i.usersInfo,
        is_bug: i.is_bug,
        project_type: i.project_type,
        copy_send_users: i.copy_send_users,
        // 父需求列表
        parent: [{ value: i.id, label: i.name }],
      })),
    }
  }
}

export const getDemandChangeLog: any = async (params: any) => {
  const response: any = await http.get<any>('getDemandChangeLog', {
    search: {
      story_id: params.demandId,
      project_id: params.projectId,
      change_user: params.change_user,
      change_keywords: params.change_keywords,
      created_at: params.created_at,
      change_type: params.change_type,
    },
    pagesize: params.pageSize,
    page: params.page,
    orderkey: params.orderKey,
    order: params.order,
  })
  return {
    currentPage: params.page,
    total: response.data.pager.total,
    list: response.data.list.map((i: any) => ({
      id: i.id,
      fields: i.fields,
      userName: i.user_name,
      updateTime: i.created_at,
      type: i.change_log_type,
      beforeField: JSON.stringify(i.before) === '[]' ? {} : i.before,
      afterField: i.after,
    })),
  }
}

export const getCommentList: any = async (params: any) => {
  const response: any = await http.get<any>('getCommentList', {
    search: {
      story_id: params.demandId,
      project_id: params.projectId,
    },
    page: params.page,
    pagesize: params.pageSize,
  })

  return {
    list: response.data.list.map((i: any) => ({
      id: i.id,
      name: i.name,
      content: i.content,
      avatar: i.avatar,
      createdTime: i.created_at,
      statusContent: i.status_content,
      userId: i.user_id,
      attachment: i.app_attachment,
    })),
  }
}

export const addComment: any = async (params: any) => {
  await http.post<any>('addComment', {
    project_id: params.projectId,
    story_id: params.demandId,
    content: params.content,
    attachment: params.attachment,
    a_user_ids: params.a_user_ids,
  })
}

export const deleteComment: any = async (params: any) => {
  await http.delete<any>('deleteComment', {
    project_id: params.projectId,
    id: params.id,
  })
}

// 编辑评论
export const updateDemandComment = async (params: any) => {
  await http.post<any>('updateDemandComment', {
    project_id: params.projectId,
    story_id: params.storyId,
    content: params.content,
    a_user_ids: params.ids,
    id: params.id,
  })
}

export const addDemand: any = async (params: any) => {
  const element = document.createElement('div')
  element.innerHTML = params?.info || ''
  const hasImg = Array.from(element.getElementsByTagName('img'))
  const info = hasImg.length
    ? params?.info
    : element.innerText
    ? params?.info
    : element.innerHTML

  await http.post<any>('addDemand', {
    project_id: Number(params.projectId),
    name: params.name,
    info,
    expected_start_at: params?.expected_start_at,
    expected_end_at: params?.expected_end_at,
    iterate_id: params?.iterate_name || 0,
    parent_id: params?.parent_id || 0,
    priority: params?.priority?.id || 0,
    users: params?.users_name,
    copysend: params?.users_copysend_name,
    tag: params?.tagIds,
    attachment: params?.attachments,
    custom_field: params?.customField,
    category_id: params?.category_id,
    class_id: params?.class || 0,
    schedule: params?.schedule,
    status: params?.status,
  })
}

export const updateDemand: any = async (params: any) => {
  const element = document.createElement('div')
  element.innerHTML = params?.info || ''
  const hasImg = Array.from(element.getElementsByTagName('img'))
  const info = hasImg.length
    ? params?.info
    : element.innerText.trim() === ''
    ? params?.info
    : element.innerHTML
  await http.put<any>('updateDemand', {
    project_id: params.projectId,
    name: params.name,
    info,
    expected_start_at: params.expected_start_at,
    expected_end_at: params.expected_end_at,
    iterate_id:
      JSON.stringify(params.iterateId) !== '[]' && params.iterate_name
        ? params.iterate_name
        : 0,
    parent_id:
      JSON.stringify(params.parentId) !== '[]' && params.parent_id
        ? params.parent_id
        : 0,
    priority:
      JSON.stringify(params.priority) !== '[]' && params.priority
        ? params.priority?.id
        : 0,
    users: params?.users_name,
    copysend: params?.users_copysend_name,
    tag: params.tagIds,
    attachment: params.attachments,
    id: params.id,
    custom_field: params?.customField,
    class_id: params?.class || 0,
    schedule: params?.schedule,
  })
}

export const deleteDemand: any = async (params: any) => {
  await http.post<any>('deleteDemand', {
    project_id: params.projectId,
    id: params.id,
  })
}

export const deleteInfoDemand: any = async (params: any) => {
  await http.put<any>('deleteInfoDemand', {
    project_id: Number(params.projectId),
    id: Number(params.demandId),
    target_id: params.targetId,
    type: params.type,
  })
}

export const addInfoDemand: any = async (params: any) => {
  await http.put<any>('addInfoDemand', {
    project_id: Number(params.projectId),
    id: Number(params.demandId),
    target: params.targetId,
    type: params.type,
  })
}

export const updatePriority: any = async (params: any) => {
  await http.put<any>('updatePriority', {
    priority: params.priorityId,
    id: params.demandId ?? params.id,
    project_id: params.projectId,
  })
}

export const updateTableParams: any = async (params: any) => {
  await http.put<any>('changeTableParams', {
    project_id: params.projectId,
    id: params.id,
    ...params.otherParams,
  })
}

export const updateDemandCategory: any = async (params: any) => {
  await http.put<any>('updateDemandCategory', {
    project_id: params.projectId,
    story_id: params.id,
    category_id: params.categoryId,
    status_id: params.statusId,
  })
}

export const getStoryStatusLog: any = async (params: any) => {
  const response: any = await http.get<any>('getStoryStatusLog', {
    search: {
      story_id: params.demandId,
      project_id: params.projectId,
      all: params?.all ? 1 : 0,
    },
    order: 'asc',
    orderkey: 'id',
  })

  return response.data?.map((i: any) => ({
    operationName: i.user_name,
    time: i.created_at,
    id: i.id,
    is_end: i.is_end,
    is_start: i.is_end,
    statusTo: i.statusto
      ? {
          color: i.statusto?.color,
          name: i.statusto?.content,
        }
      : null,
    changeType: i.change_type,
    fields: i.fields,
    verifyAll: {
      id: i.verify?.id,
      statusFrom: i.verify?.statusfrom
        ? {
            color: i.verify?.statusfrom?.color,
            name: i.verify?.statusfrom?.content,
          }
        : null,

      // 整条审核的状态  1-待审核  2-已通过 3-未通过
      verifyStatus: i.verify?.verify_status,
      verify: {
        // 1：固定审核流程；2：用户指定审核人
        verifyType: i.verify?.verify?.verify_type,
        fixedUser: {
          comment: i.verify?.verify?.fixedUser?.verify_opinion,
          verifyStatus: i.verify?.verify?.fixedUser?.verify_status,
          userName: i.verify?.verify?.fixedUser?.user_name,
        },
        process: i.verify?.verify?.process?.map((k: any) => ({
          operator: k.operator,
          verifyUsers: k.verify_users?.map((j: any) => ({
            id: j.id,
            name: j.name,
            verifyStatus: j.verify_status,
            verifyOpinion: j.verify_opinion,
            time: j.verify_at,
          })),
        })),
      },
    },
  }))
}

export const getLoadListFields: any = async (params: any) => {
  const response: any = await http.get<any>('getLoadListFields', {
    project_id: params.projectId,
    is_update: params.isUpdate,
    is_bug: params.isBug,
  })

  return {
    baseFields: response.data.base_fields,
    timeAndPersonFields: response.data.time_person_fields,
    customFields: response.data.custom_fields,
  }
}

export const getExportFields: any = async (params: any) => {
  const response: any = await http.get<any>('getExportFields', {
    project_id: params.projectId,
  })

  return {
    baseFields: response.data.base_fields,
    timeAndPersonFields: response.data.time_person_fields,
    customFields: response.data.custom_fields,
  }
}

export const getImportDownloadModel: any = async (params: any) => {
  const response = await http.get(
    'getImportDownloadModel',
    {
      is_update: params.isUpdate,
      project_id: params.projectId,
      fields: params.fields,
    },
    { responseType: 'blob' },
  )

  return response
}

export const getImportExcel: any = async (params: any) => {
  const formData = new FormData()
  formData.append('project_id', params.projectId)
  formData.append('file_path', params.filePath)
  const response = await http.post('getImportExcel', formData, {
    headers: {
      'Content-Type': undefined,
    },
  })

  return {
    successCount: response.data.count || 0,
    errorCount: response.data.error_list
      ? Object.keys(response.data.error_list)?.length
      : 0,
    errorList: response.data.error_list ? response.data.error_list : {},
  }
}

export const getImportExcelUpdate: any = async (params: any) => {
  const formData = new FormData()
  formData.append('project_id', params.projectId)
  formData.append('file_path', params.filePath)
  const response = await http.post('getImportExcelUpdate', formData, {
    headers: {
      'Content-Type': undefined,
    },
  })

  return {
    successCount: response.data.count || 0,
    errorCount: response.data.error_list
      ? Object.keys(response.data.error_list)?.length
      : 0,
    errorList: response.data.error_list ? response.data.error_list : {},
  }
}

export const getExportExcel: any = async (params: any) => {
  const response = await http.post(
    'getExportExcel',
    {
      search: {
        project_id: params?.projectId,
        keyword: params?.searchValue,
        iterate_id: params?.iterateId,
        category_status_ids: params?.statusId,
        priority: params?.priorityId,
        user_id: params?.userId,
        tag: params?.tagId,
        created_at: params?.createdAtId,
        expected_start_at: params?.expectedStartAtId,
        expected_end_at: params?.expectedendat,
        updated_at: params?.updatedat,
        finish_at: params?.finishAt,
        users_name: params?.usersnameId,
        users_copysend_name: params?.usersCopysendNameId,
        all: params?.all ? 1 : 0,
        panel: params?.panel ? 1 : 0,
        class_ids: params.class_ids,
        class_id: params.class_id,
        category_id: params.category_id,
        schedule_start: params.schedule_start,
        schedule_end: params.schedule_end,
        custom_field: params?.custom_field,
      },
      pagesize: params?.pageSize,
      page: params?.page,
      orderkey: params?.orderKey,
      order: params?.order,
      fields: params.fields,
    },
    { responseType: 'blob' },
  )
  return response
}

export const batchDelete: any = async (params: any) => {
  await http.delete<any>('batchDelete', {
    project_id: params.projectId,
    story_ids: params.demandIds,
    is_delete_childs: params.isDeleteChild,
  })
}

export const batchEdit: any = async (params: any) => {
  await http.put<any>('batchEdit', {
    project_id: params.projectId,
    story_ids: params.demandIds,
    type: params.type,
    target: params.target,
  })
}

// 获取批量编辑选择属性下拉
export const getBatchEditConfig: any = async (params: any) => {
  const response: any = await http.get<any>('getBatchEditConfig', {
    project_id: params.projectId,
    story_ids: params.demandIds,
  })

  return response.data?.map((i: any) => ({
    label: i.title,
    value: i.content,
    selectList: i.values || [],
    attr: i.attr,
  }))
}

// 获取需求类别排序
export const getCategorySaveSort = async (params: any) => {
  const response = await http.put(
    `/b/project/story_config/category/save_sort`,
    { data: params.data },
    { project_id: params.id },
  )
  return response
}
// icon图标列表
export const getCategoryIconList = async () => {
  const response = await http.get(`/b/icon/list`)
  return response
}
// 项目已有字段
export const getProjectFieIds = async (id: any) => {
  const response = await http.get(`/b/project/fields`, {
    search: {
      project_id: id,
    },
  })
  return response.data
}
// 保存需求类别
// project/story_config/category/config/save
export const configSave = async (params: any) => {
  const response = await http.put(
    `/b/project/story_config/category/config/save/${params.id}`,
    {
      project_id: params.project_id,
      data: params.data,
    },
  )
  return response.data
}

// 需求进度统计信息
export const getStroySchedule = async (params: any) => {
  const response = await http.get('getStroySchedule', params)
  return response.data
}

// 更新需求进度统计信息
export const updateStorySchedule = async (params: any) => {
  const response = await http.put('updateStorySchedule', params)
  return response.data
}

// 需求进度详信息
export const getScheduleDetails = async (params: any) => {
  const response = await http.get('getScheduleDetails', params)
  return response.data
}

// 选择子需求-最近查询
export const getChildrenRecent = async (params: any) => {
  const response = await http.get('getChildrenRecent', params)
  return response.data
}

// 选择子需求-需求查询
export const getChildrenSearch = async (params: any) => {
  const response = await http.get('getChildrenSearch', params)
  return response.data
}

export const addChild = async (params: any) => {
  const response = await http.post('addChild', params)
  return response.data
}
// 子需求排序
export const sortChild = async (params: any) => {
  const response = await http.post('sortChild', params)
  return response.data
}
