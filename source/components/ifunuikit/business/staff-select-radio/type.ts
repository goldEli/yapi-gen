export interface IStaffListAll {
  list: {
    avatar: string
    cardNumber: string
    cardType: string
    code: string
    companyId: string
    departmentId: string
    departmentName: string
    gender: number
    hiredate: string
    id: string
    jobId: string
    name: string
    phoneNumber: string
    type: number
  }[]
}

export interface IUser {
  admin: boolean
  avatar: string
  companyId: string
  companyName: string
  gender: number
  id?: string
  name: string
  permissions: string[]
  phone: string
  remark: string
}

export interface IDepartment {
  code: string
  id: string
  name: string
  notes?: string
  parentId?: string
}
