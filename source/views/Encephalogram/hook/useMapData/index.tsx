import { useLiveQuery } from 'dexie-react-hooks'
import useProjectId from '../useProjectId'
import { dbs as db } from '@/views/Encephalogram/until/DbHelper'
import { buildIntactTree } from '@/views/Encephalogram/until'
import { useMemo } from 'react'
import { useSelector } from '@store/index'

const useMapData = () => {
  const { projectId } = useProjectId()
  const { encephalogramParmas } = useSelector(store => store.encephalogram)
  const allItems = useLiveQuery(() => {
    if (projectId) {
      return (db as any).item
        .where({
          project_id: projectId,
          group_by: encephalogramParmas.group_by,
        })
        .toArray()
    }
    return []
  }, [projectId, encephalogramParmas.group_by])

  const data = useMemo(() => {
    if (!allItems) {
      return null
    }
    return buildIntactTree(allItems)
  }, [JSON.stringify(allItems)])

  console.log(data, 'datatatasss')

  return {
    data: data,
  }
}

export default useMapData
