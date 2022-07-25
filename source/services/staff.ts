/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import * as http from '../tools/http'

export const getStaffList: any = async (params: any) => {
  const response = await http.get(
    'getStaffList',
    JSON.stringify({
      search: {
        job_id: [],
        department_id: [],
        user_group_id: [],
      },
      keyword: '',
      order: '',
      orderkey: '',
      page: params.page,
      pagesize: params.pagesize,
    }),
  )

  // console.log(response)

  // return response.data

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
