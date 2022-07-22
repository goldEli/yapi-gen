import { useState } from 'react'
import * as services from '@/services'

export default () => {
  const {
    getStaffList,
    updateStaff,
    refreshStaff,
    getDepartmentSelectList,
    getPositionSelectList,
  } = services.staff

  return {
    getStaffList,
    updateStaff,
    refreshStaff,
    getDepartmentSelectList,
    getPositionSelectList,
  }
}
