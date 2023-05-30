import { useSelector } from '@store/index'
import React from 'react'

const useDropData = (columnId: Model.KanBan.Column['id']) => {
  const { kanbanConfig, movingStory } = useSelector(store => store.kanBan)
  const data = React.useMemo(() => {
    if (!movingStory || !kanbanConfig) {
      return []
    }

    const { story, status } = movingStory ?? {}
    const column = kanbanConfig?.columns?.find(column => column.id === columnId)
    const category = column?.categories.find(
      category => category.id === story.category_id,
    )
    const statusList = category?.status?.filter(item =>
      status?.can_flow_status?.some(i => i === item.flow_status_id),
    )

    const data =
      statusList?.map(item => {
        return {
          source: status,
          target: item,
        }
      }) ?? []

    return data
  }, [kanbanConfig, movingStory, columnId])
  const showStateTransitionList = React.useMemo(() => {
    return movingStory?.columnId !== columnId && data.length
  }, [movingStory, columnId, data])
  return {
    data,
    showStateTransitionList,
  }
}

export default useDropData
