import React from 'react'
import styled from '@emotion/styled'
import { Droppable } from 'react-beautiful-dnd'
import IssueCard from '../IssueCard'
import { handleId } from '../utils'
import StatusList from '../StatusList'
import StatusListItem from '../StatusListItem'

interface IssuesProps {
  issues?: Model.KanbanConfig.Category
  groupId?: Model.SprintKanBan.IssuesGroup['groupId']
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
  const droppableId = handleId(groupId ?? 0, issues?.id ?? 0)
  return (
    <Droppable type="STATUS" key={issues?.id} droppableId={droppableId}>
      {(provided, snapshot) => {
        return (
          <DropArea ref={provided.innerRef} {...provided.droppableProps}>
            {issues?.status?.map((item, idx) => {
              return (
                <StatusListItem
                  hiddenIcon
                  index={idx}
                  key={item.flow_status_id}
                  data={item}
                />
              )
            })}
            {provided.placeholder}
          </DropArea>
        )
      }}
    </Droppable>
  )
}

export default Issues
