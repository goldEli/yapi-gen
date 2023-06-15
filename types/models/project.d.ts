declare namespace Model.Project {
  interface CheckStatusItem {
    // 可流转的状态列表
    canChange?: string[]
    content: string
    // 处理人 例：'张三;李四'
    dealName?: string
    // 来自id状态名称
    fromContent: string
    // 流转名称
    statusName: string
    // 来自id
    fromId: number
    // 来自id是否是结束状态
    fromIsEnd: number
    // 来自id是否是开始状态
    fromIsStart: number
    // 流转到id
    id: number
    // 需求id、事务id、缺陷id
    infoId: number
    // 流转到id是否是结束状态
    is_end: number
    // 流转到id是否是结束状态
    is_start: number
    // 项目id
    projectId: number
  }
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
    //  1：迭代-需求类型，2：迭代-缺陷类型，3：冲刺-长故事事务类型，4：冲刺-标准事务类型，5：冲刺-故障事务类型 6-子任务 7-是事务下的所有类型
    type?: 1 | 2 | 3 | 4 | 5 | 6 | 7
    // 弹窗名称
    title?: string
  }
  interface AddQuickSprintParams {
    id?: number
    name?: string
    icon?: string
    parentName?: string
    parentId?: number
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
  interface CategoryValue {
    name: string | undefined
    id?: number | undefined
  }
}
