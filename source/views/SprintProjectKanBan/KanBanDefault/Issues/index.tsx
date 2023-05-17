import React from 'react'
import styled from '@emotion/styled'
import { Droppable } from 'react-beautiful-dnd'
import IssueCard from '../IssueCard'
import { handleId } from '../utils'
import { columnsFromBackend, issueColumns } from '../data'

interface IssuesProps {
  issues: Model.SprintKanBan.Issues
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
  const column = issueColumns?.find(item => item.id === issues.id)
  return (
    <Droppable key={issues.id} droppableId={handleId(groupId, issues.id)}>
      {(provided, snapshot) => {
        console.log(snapshot, groupId)
        return (
          <DropArea ref={provided.innerRef} {...provided.droppableProps}>
            {/* {column?.deps?.map?.((item) => {
              return <DropStatusArea>{`123 -> ${item.title}`}</DropStatusArea>;
            })} */}
            {issues.list?.map((item, index) => (
              <IssueCard
                groupId={groupId}
                key={item.id}
                item={item}
                index={index}
              />
            ))}
            {provided.placeholder}
          </DropArea>
        )
      }}
    </Droppable>
  )
}

export default Issues
