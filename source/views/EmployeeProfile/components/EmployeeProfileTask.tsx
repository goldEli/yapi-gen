import { useSelector } from '@store/index'
import { TaskWrap } from '../style'
import { useEffect } from 'react'

const EmployeeProfileTask = () => {
  const { filterParams } = useSelector(store => store.employeeProfile)

  useEffect(() => {
    //调用任务接口
    console.log(filterParams, '任务msfilterParams')
  }, [filterParams])

  return <TaskWrap>任务</TaskWrap>
}

export default EmployeeProfileTask
