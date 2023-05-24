import React, { useState } from 'react'
type affairProps = {
  [key in string]: Model.Project.Category[]
}
const useCategory = () => {
  const getTypeCategory = (
    arr: Model.Project.Category[],
    filed: 'work_type',
  ) => {
    const maps = new Map<number, string>([
      [1, '需求类型'],
      [2, '缺陷类型'],
      [3, '长故事事务类型'],
      [4, '标准事务类型'],
      [5, '故障事务类型'],
      [6, '子任务类型'],
    ])
    const obj: affairProps = {}
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      const key = item[filed]
      if (!key) {
        return
      }
      if (obj[key]) {
        obj[key].push(item)
      } else {
        obj[key] = [item]
      }
    }
    const resArr: Model.Project.CategoryList[] = []
    Object.keys(obj).forEach(key => {
      resArr.push({
        name: maps.get(parseInt(key, 10)) ?? '',
        children: obj[key],
        visible: true,
        workType: key,
      })
    })
    console.log('data----', obj)
    return resArr
  }
  return { getTypeCategory }
}
export default useCategory
