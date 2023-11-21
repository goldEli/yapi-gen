import { useLiveQuery } from 'dexie-react-hooks'
import useProjectId from '../useProjectId'
import { dbs as db } from '@/views/Encephalogram/until/DbHelper'
import { buildIntactTree } from '@/views/Encephalogram/until'
import { useMemo } from 'react'

const useMapData = () => {
  const { projectId } = useProjectId()
  const allItems = useLiveQuery(() => {
    if (projectId) {
      return (db as any).item.where('project_id').equals(projectId).toArray()
    }
    return []
  }, [projectId])

  const data = useMemo(() => {
    if (!allItems) {
      return {}
    }
    return buildIntactTree(allItems)
  }, [allItems])
  console.log(data, 'datadatadatadatadatadatadata')
  return {
    data: allItems,
  }
}

export default useMapData
