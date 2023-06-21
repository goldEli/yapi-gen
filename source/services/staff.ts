/* eslint-disable no-else-return */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */

// 员工

import * as http from '../tools/http'

export const getStaffList: any = async (params: any) => {
  const response = await http.get('getStaffList', {
    search: {
      job_id: params?.jobId,
      department_id: params?.departmentId,
      user_group_id: params?.userGroupId,
      keyword: params?.keyword,
      handover_status: params?.handover_status,
      status: params?.status,
      all: params.all,
    },
    order: params.order === 1 ? 'asc' : params.order === 2 ? 'desc' : '',
    orderkey: params.orderkey,
    page: params.page,
    pagesize: params.pagesize,
  })

  if (params.all) {
    return response.data.map((i: any) => ({
      label: i.name,
      value: i.id,
      id: i.id,
      name: i.name,
    }))
  } else {
    return {
      plainOptions: [
        {
          label: response.data.class_one_fields.department_name,
          value: 'department_name',
          labelTxt: response.data.class_one_fields.department_name,
        },
        {
          label: response.data.class_one_fields.email,
          value: 'email',
          labelTxt: response.data.class_one_fields.email,
        },
        {
          label: response.data.class_one_fields.gender,
          value: 'gender',
          labelTxt: response.data.class_one_fields.gender,
        },
        {
          label: response.data.class_one_fields.name,
          value: 'name',
          labelTxt: response.data.class_one_fields.name,
        },
        {
          label: response.data.class_one_fields.nickname,
          value: 'nickname',
          labelTxt: response.data.class_one_fields.nickname,
        },
        {
          label: response.data.class_one_fields.phone,
          value: 'phone',
          labelTxt: response.data.class_one_fields.phone,
        },
        {
          label: response.data.class_one_fields.position_name,
          value: 'position_name',
          labelTxt: response.data.class_one_fields.position_name,
        },
        {
          label: response.data.class_one_fields.project_num,
          value: 'project_num',
          labelTxt: response.data.class_one_fields.project_num,
        },
        {
          label: response.data.class_one_fields.status,
          value: 'status',
          labelTxt: response.data.class_one_fields.status,
        },
        {
          label: response.data.class_one_fields.handover_status,
          value: 'handover_status',
          labelTxt: response.data.class_one_fields.handover_status,
        },
        {
          label: response.data.class_one_fields.role_name,
          value: 'role_name',
          labelTxt: response.data.class_one_fields.role_name,
        },
      ],
      plainOptions2: [
        {
          label: response.data.class_two_fields.create_time,
          value: 'created_at',
          labelTxt: response.data.class_two_fields.create_time,
        },
      ],
      list: response.data.list,
      pager: response.data.pager,
    }
  }
}

export const getStaffListAll: any = async (params: any) => {
  const response = await http.get('getStaffList', {
    search: {
      job_id: params?.jobId,
      department_id: params?.departmentId,
      user_group_id: params?.userGroupId,
      keyword: params?.keyword,
      handover_status: params?.handover_status,
      status: params?.status,
      all: params.all,
    },
    order: params.order === 1 ? 'asc' : params.order === 2 ? 'desc' : '',
    orderkey: params.orderkey,
    page: params.page,
    pagesize: params.pagesize,
  })
  return response.data.map((i: any) => ({
    avatar: i.avatar,
    id: i.id,
    name: i.name,
    nickname: i.nickname,
    positionName: null,
    roleName: i.role_name,
  }))
}

export const updateStaff: any = async (params: any) => {
  const response = await http.post('editStaff', {
    role_id: params.roleId,
    user_id: params.userId,
  })
  return response
}

export const batchUpdateStaff: any = async (params: any) => {
  const response = await http.post('batchEditStaff', {
    role_id: params.roleId,
    user_ids: params.userIds,
  })
  return response
}

export const refreshStaff: any = async (params: any) => {
  const response = await http.post('refreshStaff', params)
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

const deep = (arr: any, newArr: any) => {
  arr.map((x: any) => {
    newArr.push(x.staffs)
    if (x && x.children) {
      deep(x.children, newArr)
    }
    return x
  })
  return newArr
}

export const getAddDepartMember = async (projectId: any) => {
  const response = await http.get('/b/user/department_user_list', {
    search: {
      project_id: projectId,
    },
  })
  const companyList: any = deep(response.data, [])

  const list = {
    companyList: companyList.flat(),
    departments: response.data,
  }

  return list
}
