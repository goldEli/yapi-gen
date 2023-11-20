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

  const dd = {
    id: 321,
    name: '测试项目（JXL）',
    children: [
      {
        id: 516,
        name: '分类1',
        parent_id: 0,
        children: [
          {
            id: 1002929,
            name: '个人中心（jxl）',
            parent_id: 516,
            children: [
              {
                id: 1003712,
                name: '测试关联工作项',
                parent_id: 1002929,
              },
            ],
          },
        ],
      },
    ],
  }

  const arr = [
    { id: 321, name: '测试项目（JXL）' },
    {
      id: 516,
      name: '分类1',
      parent_id: 0,
    },
    {
      id: 1002929,
      name: '个人中心（jxl）',
      parent_id: 516,
    },
    {
      id: 1003712,
      name: '测试关联工作项',
      parent_id: 1002929,
    },
  ]
  const tt = flattenObjectToArray(dd)
  console.log(tt, 'tttttttt')

  return {
    data: allItems,
  }
}

export default useMapData
