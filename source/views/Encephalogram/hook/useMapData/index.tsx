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
        if (iterationVal.includes(item.iterate_id)) {
          return true
        }
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
