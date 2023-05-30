import React from 'react'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import StateTag from '@/components/StateTag'
import { Droppable } from 'react-beautiful-dnd'

interface DropCardProps {
  source?: Model.KanbanConfig.Status
  target?: Model.KanbanConfig.Status
}

const DropCardBox = styled.div<{ active?: boolean }>`
  width: 100%;
  height: 144px;
  border-radius: 6px 6px 6px 6px;
  border: 1px dashed
    ${props => (props.active ? 'var(--primary-d1)' : 'var(--neutral-n5)')};
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  &:hover {
    border: 1px dashed var(--primary-d1);
  }
`
const getState = (text: any) => {
  return text?.is_start === 1 && text?.is_end === 2
    ? 1
    : text?.is_end === 1 && text?.is_start === 2
    ? 2
    : text?.is_start === 2 && text?.is_end === 2
    ? 3
    : 0
}

const DropCard: React.FC<DropCardProps> = props => {
  return (
    <DropCardBox>
      {/* <StateTag
        name={text.status.content}
        state={
          text?.is_start === 1 && text?.is_end === 2
            ? 1
            : text?.is_end === 1 && text?.is_start === 2
            ? 2
            : text?.is_start === 2 && text?.is_end === 2
            ? 3
            : 0
        }
      /> */}
      <StateTag
        state={getState(props.source)}
        name={props.source?.status_name}
      />
      <IconFont type="flow" />
      <StateTag
        state={getState(props.target)}
        name={props.target?.status_name}
      />
    </DropCardBox>
  )
}

export default DropCard
