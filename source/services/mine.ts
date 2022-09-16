/* eslint-disable max-lines */
/* eslint-disable no-else-return */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import * as http from '../tools/http'

// 获取动态搜索段
export const getSearchField: any = async (params: any) => {

  // 成员列表
  if (params === 0) {
    return
  }

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
      item.values = filterIterateList
    }
    if (
      item.content === 'user_name'
      || item.content === 'users_name'
      || item.content === 'users_copysend_name'
    ) {
      item.values = filterMemberList
    }
    return item
  })

  const filterAllList = allList.map((item: any) => {
    if (item.title.includes('时间')) {
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
    } else {
      return {
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        children: item.values,
        type: 'select',
        isDefault: item.is_default_filter,
        contentTxt: item.content_txt,
      }
    }
  })
  const filterBasicsList = filter_fidlds.filter(
    (item: any) => item.is_default_filter === 1,
  )
  const filterSpecialList = filter_fidlds.filter(
    (item: any) => item.is_default_filter !== 1,
  )

  // eslint-disable-next-line consistent-return
  return {
    filterAllList,
    filterBasicsList,
    filterSpecialList,
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

  return {
    plainOptions,
    plainOptions2,
    titleList,
    titleList2,
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
  const handleData = (data: any) => {
    return data.reduce((res: any, item: any, index: any) => {
      const { children, ...rest } = item
      children.forEach((child: any) => {
        res.push({
          ...rest,
          ...child,
          y: index,
        })
      })
      return res
    }, [])
  }

  const arr = handleData(response.data.list)
  const arr2 = arr.map((item: any) => {
    return {
      start: item.created_at * 1000,
      end: item.end_at * 1000,
      beginTime: item.expected_start_at,
      endTime: item.expected_end_at,
      name: item.name,
      state: item.status_name,
      y: item.y,
    }
  })

  return { list: arr2, pager: response.data.pager }
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
  const res = await http.put<any>('updateDemandStatus', {
    project_id: params.projectId,
    story_id: params.demandId,
    status_id: params.statusId,
    content: params.content,
    user_ids: params.userIds,
  })
  return res
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
      status: params.searchGroups?.statusId,
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
    },
    order: params.order === 1 ? 'asc' : params.order === 2 ? 'desc' : '',
    orderkey: params.orderkey,
    page: params.page,
    pagesize: params.pagesize,
  })
  if (params?.all) {
    return response.data?.map((k: any) => ({
      status_name: k.status_name,
      count: k.count,
      list: k.list
        ? k.list?.map((i: any) => ({
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
          iterateId: i.iterate_id,
          parentId: i.parent_id,
          finishTime: i.finish_at,
          updatedTime: i.updated_at,
          usersCopySendName: i.users_copysend_name,
          userName: i.user_name,
          tag: i.tag,
          project_id: i.project_id,
          isExamine: true,
        }))
        : [],
    }))
  } else {
    return {
      list: response.data?.list
        ? response.data.list.map((i: any) => ({
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
          iterateId: i.iterate_id,
          parentId: i.parent_id,
          finishTime: i.finish_at,
          updatedTime: i.updated_at,
          usersCopySendName: i.users_copysend_name,
          userName: i.user_name,
          tag: i.tag,
          project_id: i.project_id,
          isExamine: true,
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
      status: params.searchGroups?.statusId,
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
    },
    order: params.order === 1 ? 'asc' : params.order === 2 ? 'desc' : '',
    orderkey: params.orderkey,
    page: params.page,
    pagesize: params.pagesize,
  })
  return {
    list: response.data?.list
      ? response.data.list.map((i: any) => ({
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
        iterateId: i.iterate_id,
        parentId: i.parent_id,
        finishTime: i.finish_at,
        updatedTime: i.updated_at,
        usersCopySendName: i.users_copysend_name,
        userName: i.user_name,
        tag: i.tag,
        project_id: i.project_id,
        isExamine: true,
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
      status: params.searchGroups?.statusId,
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
    },
    order: params.order === 1 ? 'asc' : params.order === 2 ? 'desc' : '',
    orderkey: params.orderkey,
    page: params.page,
    pagesize: params.pagesize,
  })
  return {
    list: response.data?.list
      ? response.data?.list?.map((i: any) => ({
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
        iterateId: i.iterate_id,
        parentId: i.parent_id,
        finishTime: i.finish_at,
        updatedTime: i.updated_at,
        usersCopySendName: i.users_copysend_name,
        userName: i.user_name,
        tag: i.tag,
        project_id: i.project_id,
        isExamine: true,
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
      status: params.searchGroups?.statusId,
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
    },
    order: params.order === 1 ? 'asc' : params.order === 2 ? 'desc' : '',
    orderkey: params.orderkey,
    page: params.page,
    pagesize: params.pagesize,
  })
  return {
    list: response.data?.list
      ? response.data.list.map((i: any) => ({
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
        iterateId: i.iterate_id,
        parentId: i.parent_id,
        finishTime: i.finish_at,
        updatedTime: i.updated_at,
        usersCopySendName: i.users_copysend_name,
        userName: i.user_name,
        tag: i.tag,
        project_id: i.project_id,
        project: i.project,
        isExamine: true,
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
  const { join, abeyance } = response.data

  return {
    firstP: join.project_count,
    firstN: join.story_count,
    firstD: join.iterate_count,
    secondAll: abeyance.total,
    secondNoFinish: abeyance.abeyance_count,
    secondTimeOut: abeyance.expired_count,
    secondFinish: abeyance.finish_count,
    secondOutFinish: abeyance.expired_finish_count,
  }
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

// 获取成员列表
export const addQuicklyCreate: any = async (params: any) => {
  const element = document.createElement('div')
  element.innerHTML = params?.info
  const info = element.innerText.trim()

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
  })
  return response
}
