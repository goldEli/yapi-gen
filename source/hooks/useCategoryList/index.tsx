import React, { useState } from 'react'
type affairProps = {
  [key in string]: Model.Project.Category[]
}
// const useCategory = () => {
//   const getTypeCategory = (
//     arr: Model.Project.Category[],
//     filed: 'work_type',
//   ) => {
//     const maps = new Map<number, string>([
//       [1, '需求类型'],
//       [2, '缺陷类型'],
//       [3, '长故事事务类型'],
//       [4, '标准事务类型'],
//       [5, '故障事务类型'],
//       [6, '子任务类型'],
//     ])
//     let categoryData = [
//       { name: '需求类型', visible: true, workType: '1', children: [] },
//       { name: '缺陷类型', visible: true, workType: '2', children: [] },
//       { name: '长故事类型', visible: true, workType: '3', children: [] },
//       { name: '标准事务类型', visible: true, workType: '4', children: [] },
//       { name: '故障事务类型', visible: true, workType: '5', children: [] },
//       { name: '子任务类型', visible: true, workType: '6', children: [] },
//     ]
//     const obj: affairProps = {}
//     // debugger
//     for (let i = 0; i < arr.length; i++) {
//       const item = arr[i]
//       const key = item[filed]
//       if (!key) {
//         return
//       }
//       if (obj[key]) {
//         obj[key].push(item)
//       } else {
//         obj[key] = [item]
//       }
//     }
//     // console.log('obj----', obj)
//     const resArr: Model.Project.CategoryList[] = []
//     Object.keys(obj).forEach(key => {
//       resArr.push({
//         name: maps.get(parseInt(key, 10)) ?? '',
//         children: obj[key] || [],
//         visible: true,
//         workType: key,
//       })
//     })
//     // console.log('resArr-----', resArr)
//     return resArr
//   }
//   return { getTypeCategory }
// }
// export default useCategory

const useCategory = () => {
  const getTypeCategory = (
    arr: Model.Project.Category[],
    filed: 'work_type',
    projectType?: string,
    type?: false,
  ) => {
    let categoryData: Model.Project.CategoryList[] = [
      {
        name: '需求类型',
        visible: true,
        workType: 1,
        children: [],
        projectType: 'iteration',
      },
      {
        name: '缺陷类型',
        visible: true,
        workType: 2,
        children: [],
        projectType: 'iteration',
      },
      {
        name: '长故事类型',
        visible: true,
        workType: 3,
        children: [],
        projectType: 'sprint',
      },
      {
        name: '标准事务类型',
        visible: true,
        workType: 4,
        children: [],
        projectType: 'sprint',
      },
      {
        name: '故障事务类型',
        visible: true,
        workType: 5,
        children: [],
        projectType: 'sprint',
      },
      {
        name: '子任务类型',
        visible: true,
        workType: 6,
        children: [],
        projectType: 'sprint',
      },
    ]
    // debugger
    if (type) {
      categoryData = categoryData.filter(item => item.workType !== 3)
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
