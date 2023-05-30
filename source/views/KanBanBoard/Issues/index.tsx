import React, { useMemo } from 'react'
import styled from '@emotion/styled'
import { Droppable } from 'react-beautiful-dnd'
import IssueCard from '../IssueCard'
import { handleId } from '../utils'
import DropCardList from '../DropCardList'

interface IssuesProps {
  issues: Model.KanBan.Column
  groupId: Model.SprintKanBan.IssuesGroup['groupId']
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
  return (
    <Droppable
      key={droppableId}
      droppableId={droppableId}
      // droppableId={'dropCardId'}
    >
      {(provided, snapshot) => {
        return (
          <DropArea ref={provided.innerRef} {...provided.droppableProps}>
            {/* {column?.deps?.map?.((item) => {
              return <DropStatusArea>{`123 -> ${item.title}`}</DropStatusArea>;
            })} */}
            {issues.stories?.map((story, index) => (
              <IssueCard
                groupId={groupId}
                key={story.id}
                item={story}
                index={index}
              />
            ))}
            <DropCardList columnId={issues.id} groupId={groupId} />
            {provided.placeholder}
          </DropArea>
        )
      }}
    </Droppable>
  )
}

export default Issues
