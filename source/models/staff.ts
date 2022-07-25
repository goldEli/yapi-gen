import { useState } from 'react'
import * as services from '@/services'

export default () => {
  const {
    getRoleList,
    getStaffList,
    updateStaff,
    refreshStaff,
    getDepartmentSelectList,
    getPositionSelectList,
  } = services.staff

  return {
    getRoleList,
    getStaffList,
    updateStaff,
    refreshStaff,
    getDepartmentSelectList,
    getPositionSelectList,
  }
}
