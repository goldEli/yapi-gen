import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import styled from '@emotion/styled'
import { handleId } from '../utils'

const IssueCardBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 270px;
  height: 144px;
  border-radius: 6px 6px 6px 6px;
  background: var(--neutral-white-d2);
  margin-bottom: 8px;

  .secondary-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-size: 12px;
  }
`

interface IssueCardProps {
  item: Model.SprintKanBan.Issue
  index: number
  groupId: Model.SprintKanBan.IssuesGroup['groupId']
}

const IssueCard = (props: IssueCardProps) => {
  const { item, index } = props
  return (
    <Draggable
      key={item.id}
      draggableId={handleId(props.groupId, item.id)}
      index={index}
    >
      {provided => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <IssueCardBox>
            <p>{item.name}</p>
            <div className="secondary-details">
              {/* <p>
                <span>
                  {new Date(item.Due_Date).toLocaleDateString("en-us", {
                    month: "short",
                    day: "2-digit",
                  })}
                </span>
              </p> */}
            </div>
          </IssueCardBox>
        </div>
      )}
    </Draggable>
  )
}

export default IssueCard
