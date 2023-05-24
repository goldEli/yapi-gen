import { useSelector } from '@store/index'
import React, { useMemo } from 'react'

const usePlaceholderStatusNum = (category?: Model.KanbanConfig.Category) => {
  const { columnList } = useSelector(store => store.KanbanConfig)

  const maxNum = useMemo(() => {
    let num = 0
    // let index = columnList.findIndex(item => item.id === columnId)
    columnList.forEach(column => {
      const current = column.categories.find(item => item.id === category?.id)
      num = Math.max(num, current?.status?.length ?? 0)
    })
    return num
  }, [columnList, category])

  const placeholderItemsLength = useMemo(() => {
    const currentLen = category?.status?.length ?? 0
    return maxNum - currentLen
  }, [category, maxNum])
  return {
    maxNum,
    placeholderItemsLength,
  }
}

export default usePlaceholderStatusNum
