import { useState } from 'react'
import * as services from '@/services'

export default () => {
  const [projectList, setProjectList] = useState<any>([])

  const getProjectList = async () => {
    const result = await services.project.getProjectList()
    setProjectList(result)
  }
  return {
    projectList,
    getProjectList,
  }
}
