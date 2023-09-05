/* eslint-disable no-undefined */
import { getMemberOverviewList } from '@store/employeeProfile/employeeProfile.thunk'
import { useDispatch, useSelector } from '@store/index'
import { useEffect, useState } from 'react'

interface EmployeeProfilePersonProps {
  // 人员数组
  ids?: string[] | number[]
  //   修改后的人员数组列表
  onChangeCheckPerson(arr: number[]): void
}

const EmployeeProfilePerson = (poprs: EmployeeProfilePersonProps) => {
  const dispatch = useDispatch()
  const { allMemberList, memberStatistics } = useSelector(
    store => store.employeeProfile,
  )

  useEffect(() => {
    dispatch(getMemberOverviewList())
  }, [])
  return <div>人员组件</div>
}

export default EmployeeProfilePerson
