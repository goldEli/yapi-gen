import * as http from '@/tools/http'
import posterImg from '@/assets/poster.png'

export const getProjectList: any = async (params: any) => {
  // const response: any = await http.get<any>('getProjectList', {
  //     search: {
  //         self: params.self,
  //         keyword: params.searchValue,
  //         is_public: params.isPublic,
  //         status: params.status
  //     },
  //     pagesize: params.pagesize,
  //     page: params.page,
  //     orderkey: params.orderkey,
  //     order: params.order,
  // })
  const response: any = {}
  response.data = {
    list: [
      {
        id: '1',
        status: 1,
        cover: posterImg,
        name: '敏捷项目',
        member_count: 20,
        story_count: 10,
        iterate_count: 20,
        progress: '0.5',
        created_at: '2022-01-21',
        stop_at: '2022-2-21',
      },
      {
        id: '2',
        status: 1,
        cover: posterImg,
        name: '敏捷项目2.0',
        member_count: 20,
        story_count: 10,
        iterate_count: 20,
        progress: '0.5',
        created_at: '2022-01-21',
        stop_at: '2022-2-21',
      },
    ],
    pager: {
      total: 20,
      page: 2,
      pagesize: 12,
    },
  }
  return {
    currentPage: 1, // params.page ||
    total: response.data.pager.total,
    list: response.data.list.map((i: any) => ({
      id: i.id,
      status: i.status,
      url: i.cover,
      name: i.name,
      memberCount: i.member_count,
      storyCount: i.story_count,
      iterateCount: i.iterate_count,
      progress: i.progress,
      createdTime: i.created_at,
      endTime: i.stop_at,
    })),
  }
}
