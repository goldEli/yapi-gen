/* eslint-disable no-else-return */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import * as http from '../tools/http'

// 获取动态搜索段
export const getSearchField: any = async (params: any) => {
  const response = await http.get('getProjectInfo', {
    id: params,
  })

  const {
    storyConfig: { filter_fidlds },
  } = response.data

  const allList = filter_fidlds.map((item: any) => {
    if (item.title.includes('时间')) {
      return {
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        children: item.values,
        type: 'time',
      }
    } else {
      return {
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        children: item.values,
        type: 'select',
      }
    }
  })
  const filterBasicsList = filter_fidlds.filter(
    (item: any) => item.is_default_filter === 1,
  )
  const filterSpecialList = filter_fidlds.filter(
    (item: any) => item.is_default_filter !== 1,
  )
  return {
    allList,
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
    .map((item: { title: any; content: any; is_default_display: any }) => {
      return {
        label: item.title,
        value: item.content,
        is_default_display: item.is_default_display,
      }
    })

  const plainOptions2 = display_fidlds
    .filter(
      (item: { group_name: string }) => item.group_name === '人员与时间字段',
    )
    .map((item: { is_default_display: any; title: any; content: any }) => {
      return {
        label: item.title,
        value: item.content,
        is_default_display: item.is_default_display,
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
      start: item.created_at,
      end: item.end_at,
      beginTime: item.expected_start_at,
      endTime: item.expected_end_at,
      state: item.name,
      y: item.y,
    }
  })

  return arr2
}

// 获取状态下的成员列表
export const getProjectMember: any = async (params: any) => {
  const response = await http.get('getProjectMember', {
    search: {
      project_id: params,
      all: true,
    },
  })
  return response
}

// 流转状态
export const updateDemandStatus: any = async (params: any) => {
  await http.put<any>('updateDemandStatus', {
    project_id: params.projectId,
    story_id: params.demandId,
    status_id: params.statusId,
    content: params.content,
    user_ids: params.userIds,
  })
}

// 修改优先级
export const updatePriorityStatus: any = async (params: any) => {
  await http.put<any>('updatePriority', {
    project_id: params.projectId,
    priority: params.priorityId,
    id: params.id,
  })
}

// 获取我的待办列表
export const getMineNoFinishList: any = async (params: any) => {
  const response = await http.get('getMineNoFinishList', {
    search: {
      project_id: params.projectId,
      keyword: params?.keyword,
      status: params?.status,
      tag: params?.tag,
      user_id: params?.userId,
      users_name: params?.usersName,
      users_copysend_name: params?.usersCopysendName,
    },
    order: params.order === 1 ? 'asc' : params.order === 2 ? 'desc' : '',
    orderkey: params.orderkey,
    page: params.page,
    pagesize: params.pagesize,
  })
  return {
    list: response.data.list,
    pager: response.data.pager,
  }
}

// 我的创建列表
export const getMineCreacteList: any = async (params: any) => {
  const response = await http.get('getMineCreacteList', {
    search: {
      project_id: params.projectId,
      keyword: params?.keyword,
      status: params?.status,
      tag: params?.tag,
      user_id: params?.userId,
      users_name: params?.usersName,
      users_copysend_name: params?.usersCopysendName,
    },
    order: params.order === 1 ? 'asc' : params.order === 2 ? 'desc' : '',
    orderkey: params.orderkey,
    page: params.page,
    pagesize: params.pagesize,
  })
  return response
}

// 获取我的已办列表
export const getMineFinishList: any = async (params: any) => {
  const response = await http.get('getMineFinishList', {
    search: {
      project_id: params.projectId,
      keyword: params?.keyword,
      status: params?.status,
      tag: params?.tag,
      user_id: params?.userId,
      users_name: params?.usersName,
      users_copysend_name: params?.usersCopysendName,
    },
    order: params.order === 1 ? 'asc' : params.order === 2 ? 'desc' : '',
    orderkey: params.orderkey,
    page: params.page,
    pagesize: params.pagesize,
  })
  return {
    list: response.data.list,
    pager: response.data.pager,
  }
}

// 获取我的抄送列表
export const getMineNeedList: any = async (params: any) => {
  const response = await http.get('getMineNeedList', {
    search: {
      project_id: params.projectId,
      keyword: params?.keyword,
      status: params?.status,
      tag: params?.tag,
      user_id: params?.userId,
      users_name: params?.usersName,
      users_copysend_name: params?.usersCopysendName,
    },
    order: params.order === 1 ? 'asc' : params.order === 2 ? 'desc' : '',
    orderkey: params.orderkey,
    page: params.page,
    pagesize: params.pagesize,
  })
  return {
    list: response.data.list,
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
