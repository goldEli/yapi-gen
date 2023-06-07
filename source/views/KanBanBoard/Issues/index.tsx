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

const DropArea = styled.div`
  min-height: 100px;
  display: flex;
  flex-direction: column;
  background: var(--neutral-n9);
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

  const { data, showStateTransitionList } = useDropData(issues.id, groupId)
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

  return (
    <Droppable
      key={droppableId}
      droppableId={droppableId}
      type="drop-status"
      // isDropDisabled={false}
    >
      {(provided, snapshot) => {
        return (
          <DropArea ref={provided.innerRef} {...provided.droppableProps}>
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
