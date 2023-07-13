import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
type affairProps = {
  [key in string]: Model.Project.Category[]
}

const useCategory = () => {
  const [t] = useTranslation()
  const getTypeCategory = (
    arr: Model.Project.Category[],
    filed: 'work_type',
    projectType?: string,
    type?: boolean,
  ) => {
    let categoryData: Model.Project.CategoryList[] = [
      {
        name: t('other.demandType'),
        visible: true,
        workType: 1,
        children: [],
        projectType: 'iteration',
      },
      {
        name: t('other.flawType'),
        visible: true,
        workType: 2,
        children: [],
        projectType: 'iteration',
      },
      {
        name: t('sprintProject.longStoryType'),
        visible: true,
        workType: 3,
        children: [],
        projectType: 'sprint',
      },
      {
        name: t('sprintProject.standardTransactionType'),
        visible: true,
        workType: 4,
        children: [],
        projectType: 'sprint',
      },
      {
        name: t('sprintProject.faultTransactionType'),
        visible: true,
        workType: 5,
        children: [],
        projectType: 'sprint',
      },
      {
        name: t('sprintProject.subtaskType'),
        visible: true,
        workType: 6,
        children: [],
        projectType: 'sprint',
      },
    ]
    // debugger
    if (type) {
      categoryData = categoryData.filter(
        item => item.workType === 4 || item.workType === 5,
      )
    }
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      const key = item[filed]
      const currentItem = categoryData.find(item => item.workType === key)
      if (currentItem) {
        currentItem?.children.push(item)
      }
    }
    if (!projectType) {
      return categoryData.filter(item => item.children.length)
    }
    return categoryData.filter(item => item.projectType === projectType)
  }
  return { getTypeCategory }
}
export default useCategory
