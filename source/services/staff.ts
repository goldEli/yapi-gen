/* eslint-disable no-else-return */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import * as http from '../tools/http'

export const getStaffList: any = async (params: any) => {
  const response = await http.get('getStaffList', {
    search: {
      job_id: params?.jobId,
      department_id: params?.departmentId,
      user_group_id: params?.userGroupId,
      keyword: params?.keyword,
      all: params.all,
    },
    order: params.order,
    orderkey: params.orderkey,
    page: params.page,
    pagesize: params.pagesize,
  })

  if (params.all) {
    return response.data.map((i: any) => ({
      label: i.name,
      value: i.id,
    }))
  } else {
    return {
      plainOptions: [
        {
          label: response.data.class_one_fields.department_name,
          value: 'department_name',
        },
        { label: response.data.class_one_fields.email, value: 'email' },
        { label: response.data.class_one_fields.gender, value: 'gender' },
        { label: response.data.class_one_fields.name, value: 'name' },
        { label: response.data.class_one_fields.nickname, value: 'nickname' },
        { label: response.data.class_one_fields.phone, value: 'phone' },
        {
          label: response.data.class_one_fields.position_name,
          value: 'position_name',
        },
        {
          label: response.data.class_one_fields.project_num,
          value: 'project_num',
        },
        { label: response.data.class_one_fields.role_name, value: 'role_name' },
      ],
      plainOptions2: [
        {
          label: response.data.class_two_fields.create_time,
          value: 'created_at',
        },
      ],
      list: response.data.list,
      pager: response.data.pager,
    }
  }
}

export const updateStaff: any = async (params: any) => {
  const response = await http.post('editStaff', {
    role_id: params.roleId,
    user_id: params.userId,
  })
  return response
}

export const refreshStaff: any = async (params: any) => {
  const response = await http.get('refreshStaff', params)
  return response
}

export const getDepartmentSelectList: any = async (params: any) => {
  const response = await http.get('getDepartmentSelectList', params)
  return response
}

export const getPositionSelectList: any = async (params: any) => {
  const response = await http.get('getPositionSelectList', params)
  return response
}

export const getRoleList: any = async () => {
  const response = await http.get('getRoleList')
  return response
}
