import { useLiveQuery } from 'dexie-react-hooks'
import useProjectId from '../useProjectId'
import { dbs as db } from '@/views/Encephalogram/until/DbHelper'
import { flattenObjectToArray } from '@/views/Encephalogram/until'

const useMapData = () => {
  const { projectId } = useProjectId()
  const allItems = useLiveQuery(() => {
    if (projectId) {
      return (db as any).item.toArray()
    }
    return []
  }, [projectId])
  return {
    data: allItems,
  }
}

export default useMapData
