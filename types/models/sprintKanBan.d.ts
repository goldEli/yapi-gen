declare namespace Model.SprintKanBan {
  interface ViewItem {
    key: string
    value: string
    check: boolean
    isDefault?: boolean
    operation?: boolean
  }

  type guideVisible = boolean
  interface GroupInfoItem {
    key: 'none' | 'person' | 'category' | 'priority'
    value: string
    check: boolean
  }
  interface Issue {
    id: number
    name: string
    // title: string;
    father_id: number
    status_id: number
    users?: {
      // https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-file/4fcfb62aefdf1cef99e446f1205aa936a0eb465cboy.png
      avatar: string
      userId: number
    }[]
  }
  interface Issues {
    id: number
    title: string
    count: number
    list?: Issue[]
  }
  interface IssueColumn {
    id: number
    title: string
    total: number
    deps?: { id: number; title: string; to?: number[] }[]
  }
  interface IssuesGroup {
    groupId: number
    title?: string
    data: Issues[]
  }
}
