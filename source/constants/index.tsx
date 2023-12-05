/* eslint-disable @typescript-eslint/naming-convention */
export const GENDER_MAP: any = {
  1: '男',
  2: '女',
}

export const EMAIL_REGEXP =
  // eslint-disable-next-line require-unicode-regexp, prefer-named-capture-group
  /[a-zA-Z0-9]+([-_.][A-Za-zd]+)*@([a-zA-Z0-9]+[-.])+[A-Za-zd]{2,15}$/
export const FAULT_MAPS = ['发现版本', '严重程度', '解决方法']

export const AFFAIRS_CHILD_TYPE: any = { 3: [4, 5], 4: [6], 5: [6] }

export const PHONE_NUMBER_REGEXP = /^\d+$/u

export const TYPE_ENCEPHALOGRAM = [
  {
    text: '已完成',
    color: '#BBFFBA',
  },
  {
    text: '进行中',
    color: '#FFF383 ',
  },
  {
    text: '新增',
    color: '#E4D8FF',
  },
  {
    text: '逾期',
    color: '#FFC8A0',
  },
]
export const ROUTERS_URL: any = {
  '/SprintProjectManagement/Affair': '/ProjectDetail/Affair',
  '/ProjectManagement/Demand': '/ProjectDetail/Demand',
  '/ProjectManagement/Defect': '/ProjectDetail/Defect',
  '/ProjectManagement/Iteration': '/ProjectDetail/Iteration',
  '/ProjectManagement/IterationDetail': '/ProjectDetail/IterationDetail',
  '/SprintProjectManagement/Sprint': '/ProjectDetail/Sprint',
  '/ProjectManagement/ProjectSetting': '/ProjectDetail/Setting',
  '/SprintProjectManagement/Setting': '/ProjectDetail/Setting',
}
/**
 * 1规划中  2 已完成 3 实现中
 */
export const StatusTagColor: any = new Map([
  [1, { color: 'var(--neutral-n1-d1)', bg: '#CBECFF' }],
  [2, { color: 'var(--neutral-n1-d1)', bg: '#BBFFBA' }],
  [3, { color: 'var(--neutral-n1-d1)', bg: '#FFF383' }],
])
