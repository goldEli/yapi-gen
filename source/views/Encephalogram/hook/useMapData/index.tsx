import { useLiveQuery } from 'dexie-react-hooks'
import useProjectId from '../useProjectId'
import { dbs as db } from '@/views/Encephalogram/until/DbHelper'
import { buildIntactTree } from '@/views/Encephalogram/until'
import { useMemo } from 'react'
import { useSelector } from '@store/index'

const useMapData = () => {
  const { projectId } = useProjectId()
  const { encephalogramParams } = useSelector(store => store.encephalogram)
  const { group_by, person, iterationVal, state, time } = encephalogramParams
  const allItems: any[] = useLiveQuery(() => {
    if (projectId) {
      const allList = (db as any)[encephalogramParams.group_by]
        .where({
          project_id: projectId,
        })
        .toArray()
      return allList
    }
    return []
  }, [projectId, group_by])

  const data = useMemo(() => {
    if (!allItems) {
      return null
    }
    const filterItems = allItems.filter((item: any) => {
      console.log(item, 'itemitemitemitemitemitem')
      if (item.node_type === 'story') {
        let isNeed = true
        if (iterationVal.length) {
          if (iterationVal.includes(item.iterate_id)) {
            isNeed = true
          } else {
            return false
          }
        }
        if (person.length) {
          const handlers = item?.handlers?.map?.((k: any) => k.id)
          if (handlers.some((t: any) => person.includes(t))) {
            isNeed = true
          } else {
            return false
          }
        }
        if (state.length) {
          if (state.includes(item.category_status_id)) {
            isNeed = true
          } else {
            return false
          }
        }
        if (time.length) {
          if (state.includes(item.category_status_id)) {
            isNeed = true
          } else {
            return false
          }
        }
        return isNeed
      }
      return false
    })
    console.log(filterItems, 'filterItemsfilterItemsfilterItemsfilterItems')

    return buildIntactTree(allItems)
  }, [
    JSON.stringify(allItems),
    JSON.stringify(person),
    JSON.stringify(iterationVal),
    JSON.stringify(state),
    JSON.stringify(time),
  ])

  return {
    data: data,
  }
}

export default useMapData
