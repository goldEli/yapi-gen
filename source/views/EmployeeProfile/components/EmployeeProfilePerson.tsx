/* eslint-disable no-undefined */
import { useEffect, useState } from 'react'

interface EmployeeProfilePersonProps {
  // 人员数组
  ids?: string[] | number[]
  //   修改后的人员数组列表
  onChangeCheckPerson(arr: number[]): void
}

const EmployeeProfilePerson = (poprs: EmployeeProfilePersonProps) => {
  const [dataList, setDataList] = useState({
    list: undefined,
  })
  // 获取人员数据
  const getPersonList = () => {}

  useEffect(() => {
    getPersonList()
  }, [])
  return <div>人员组件</div>
}

export default EmployeeProfilePerson
