import { useSelector } from '@store/index'
import React from 'react'

const useProjectType = () => {
  const { projectInfo } = useSelector(store => store.project)

  /**
   * 1 迭代(迭代里叫需求) 2 冲刺（冲刺里是事务）
   */
  // 1-需求，2-事务，3-缺陷
  return {
    projectType: projectInfo.projectType as 1 | 2 | 3,
  }
}

export default useProjectType
