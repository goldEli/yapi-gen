import { useState } from 'react'
import * as services from '@/services'

export default () => {
  const {
    getStaffList,
    editStaff,
    refreshStaff,
    getDepartmentSelectList,
    getPositionSelectList,
  } = services.staff

  return {
    getStaffList,
    editStaff,
    refreshStaff,
    getDepartmentSelectList,
    getPositionSelectList,
  }
}
