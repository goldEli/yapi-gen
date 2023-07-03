import React, { ReactElement, ReactNode } from 'react'
import styled from '@emotion/styled'
import StatusListItem from '../StatusListItem'
import { Droppable } from 'react-beautiful-dnd'
import { UNASSIGNED_STATUS } from '../constant'

interface StatusListProps {
  list: Model.KanbanConfig.Status[]
  tips: ReactNode
}

const StatusListBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  overflow: auto;
  height: 0;
`

const StatusList: React.FC<StatusListProps> = props => {
  return (
    <Droppable droppableId={UNASSIGNED_STATUS} type="STATUS">
      {(provided, snapshot) => {
        return (
          <StatusListBox ref={provided.innerRef} {...provided.droppableProps}>
            {props.list?.map?.((item, index) => {
              return (
                <StatusListItem
                  index={index}
                  key={item.flow_status_id}
                  data={item}
                />
              )
            })}
            {props?.tips}
            {provided.placeholder}
          </StatusListBox>
        )
      }}
    </Droppable>
  )
}

export default StatusList
