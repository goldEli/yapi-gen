import { useSelector } from '@store/index'
import React from 'react'
import useGroupType from '../useGroupType'

const useDropData = (
  columnId: Model.KanBan.Column['id'],
  groupId: Model.KanBan.Group['id'],
) => {
  const { kanbanConfig, movingStory } = useSelector(store => store.kanBan)
  const { groupType } = useGroupType()

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

  // 展示状态转换释放区域
  const showStateTransitionList = React.useMemo(() => {
    // // 人员分组和类别分组，只有同组才能转换状态
    if (groupType === 'users' || groupType === 'category') {
      const ret =
        !!movingStory &&
        movingStory?.groupId === groupId &&
        movingStory?.columnId !== columnId
      console.log('users', 'category', ret, {
        groupId,
        groupIdcurrent: movingStory?.groupId,
      })
      return ret
    }

    // 跨分组可拖
    return !!movingStory && movingStory?.columnId !== columnId
  }, [movingStory, columnId, data, groupId, groupType])

  // const disableDrop = React.useMemo(() => {
  //   // 如果是人员分组 只能在同组拖动
  //   if (groupType === 'users' || groupType === 'category') {
  //     return !(
  //       movingStory?.groupId === groupId && movingStory?.columnId === columnId
  //     )
  //   }
  //   return false
  // }, [groupType, columnId, movingStory, groupId])

  return {
    data,
    showStateTransitionList,
    // disableDrop,
  }
}

export default useDropData
