import React from 'react'
import styled from '@emotion/styled'
import DropCard from '../DropCard'
import { useSelector } from '@store/index'

interface DropCardListProps {
  columnId: Model.KanBan.Column['id']
  groupId: Model.KanBan.Group['id']
}

const DropCardListBox = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
  flex-direction: column;
`

const DropCardList: React.FC<DropCardListProps> = props => {
  const { kanbanConfig, movingStory } = useSelector(store => store.kanBan)
  const list = React.useMemo(() => {
    if (!movingStory || !kanbanConfig) {
      return []
    }

    const { story, status } = movingStory ?? {}
    const column = kanbanConfig?.columns?.find(
      column => column.id === props.columnId,
    )
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
    if (props.columnId === 4) {
      console.log({ data })
    }
    return data
  }, [kanbanConfig, movingStory, props.columnId])
  return (
    <DropCardListBox>
      {list?.map(item => {
        const { source, target } = item
        return (
          <DropCard
            source={source}
            target={target}
            key={source?.id + '-' + target.id}
          />
        )
      })}
    </DropCardListBox>
  )
}

export default DropCardList
