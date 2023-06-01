import { useSelector } from '@store/index'
import React from 'react'

const useStoryIds = () => {
  const { kanbanInfoByGroup } = useSelector(store => store.kanBan)
  const ids = kanbanInfoByGroup.reduce<Model.KanBan.Story['id'][]>(
    (res, group) => {
      group.columns.forEach(column => {
        column.stories.forEach(story => {
          res.push(story.id)
        })
      })
      return res
    },
    [],
  )

  return { ids }
}

export default useStoryIds
