import React, { useMemo } from 'react'
import styled from '@emotion/styled'
import { Droppable } from 'react-beautiful-dnd'
import IssueCard from '../IssueCard'
import { handleId } from '../utils'
import DropCardList from '../DropCardList'
import useDropData from '../hooks/useDropData'
import DropCard from '../DropCard'
import { useSelector } from '@store/index'
import useGroupType from '../hooks/useGroupType'

interface IssuesProps {
  issues: Model.KanBan.Column
  groupId: Model.KanbanConfig.Column['id']
}

export const DropArea = styled.div<{ active?: boolean; minHeight?: number }>`
  min-height: ${props => props.minHeight}px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: ${props => (props.active ? 'red' : 'var(--neutral-n9)')};
  width: 302px;
  box-sizing: border-box;
  padding: 16px;
  gap: 8px;
  position: relative;
`

const DropStatusArea = styled.div`
  width: 100%;
  height: 100px;
  box-sizing: border-box;
  border: 1px solid purple;
  &:hover {
    border: 1px solid green;
  }
`
const Issues: React.FC<IssuesProps> = props => {
  const { issues, groupId } = props
  const droppableId = useMemo(() => {
    return handleId(groupId, issues.id)
  }, [groupId, issues.id])
  const { movingStory } = useSelector(store => store.kanBan)
  const { groupType } = useGroupType()
  const columnId = issues.id

  const { data } = useDropData(issues.id)

  const showStateTransitionList = React.useMemo(() => {
    // 人员分组和类别分组，只有同组才能转换状态
    // if (groupType === 'users' || groupType === 'category') {
    const ret =
      !!movingStory &&
      movingStory?.groupId === groupId &&
      movingStory?.columnId !== columnId
    return ret
    // }

    // 跨分组可拖
    // return !!movingStory && movingStory?.columnId !== columnId
  }, [movingStory, columnId, data, groupId, groupType])
  // const showStateTransitionList = true

  const dropCardListContent = (
    <DropCardList
      hidden={!showStateTransitionList}
      list={data}
      groupId={groupId}
      columnId={issues.id}
    />
  )
  const issueCardListContent = issues.stories?.map((story, index) => {
    const uuid = `${groupId}-${issues.id}-${story.id}`
    // 如果是 人员或者类型分组 不能跨组拖动，需要隐藏卡片
    const hidden1 =
      !!movingStory &&
      (groupType === 'users' || groupType === 'category') &&
      movingStory?.groupId !== groupId
    // 如果当前展示状态转换释放区域，需要隐藏卡片
    const hidden2 = showStateTransitionList
    return (
      <IssueCard
        hidden={hidden1 || hidden2}
        uuid={uuid}
        key={uuid}
        item={story}
        index={index}
      />
    )
  })

  const minHeight =
    showStateTransitionList && data.length > 0 ? data.length * 156 + 20 : 100
  return (
    <Droppable
      key={droppableId}
      droppableId={droppableId}
      type="drop-status"
      // isDropDisabled={false}
    >
      {(provided, snapshot) => {
        return (
          <DropArea
            minHeight={minHeight}
            // active={snapshot.isDraggingOver}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {dropCardListContent}
            {issueCardListContent}
            {provided.placeholder}
          </DropArea>
        )
      }}
    </Droppable>
  )
}

export default Issues
