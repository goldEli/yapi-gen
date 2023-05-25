declare namespace Model.Project {
  interface AddWorkItemParams {
    // 编辑传入的id
    editId?: any
    // 迭代-需求列表带入迭代id
    iterateId?: any
    // 编辑带入项目id
    projectId?: any
    // 是否为子需求
    isChild?: any
    // 父需求id --- 和isChild一起使用
    parentId?: any
    // 我的-快速创建
    isQuickCreate?: any
    // 是否是所有项目
    isAllProject?: boolean
    // 是否是需求详情，用于更新需求状态
    isInfo?: any
    // 子需求列表
    childList?: any
    // 子需求延用父需求类别
    categoryId?: any
    // 无数据创建
    noDataCreate?: any
    // 是否是全局创建
    overallCreate?: boolean
    // 1-事务 2-需求 3-缺陷
    type?: 1 | 2 | 3
    // 弹窗名称
    title?: string
  }

  interface AddQuickSprintParams {
    id?: number
    name?: string
    icon?: string
    parentName?: string
  }
  interface Category {
    active?: boolean
    attachmentPath?: string
    color?: string
    hasDemand?: number
    id?: number
    isCheck?: number
    name?: string | React.ReactNode
    eleName?: React.ReactNode
    remark?: string
    status?: number
    statusCount?: number
    work_type?: number
    labelName?: string
  }
  interface CategoryList {
    name: string
    children: Category[]
    visible: boolean
    workType: string
    // id?: number
  }
}
