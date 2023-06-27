import React, { useCallback } from 'react'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import StateTag from '@/components/StateTag'
import { Droppable } from 'react-beautiful-dnd'
import { useDispatch, useSelector } from '@store/index'
import { modifyStatus } from '@store/kanBan/kanBan.thunk'

interface DropCardProps {
  source?: Model.KanbanConfig.Status
  target?: Model.KanbanConfig.Status
  groupId: Model.KanBan.Group['id']
  columnId: Model.KanBan.Column['id']
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
  const { source, target } = props
  const { movingStory } = useSelector(store => store.kanBan)
  // return (
  //   <Droppable
  //     key={droppableId}
  //     droppableId={droppableId}
  //     type="drop-status"
  //     // droppableId={'dropCardId'}
  //   >
  //     {(provided, snapshot) => {
  //       return (
  //         <DropCardBox ref={provided.innerRef} {...provided.droppableProps}>
  //           <StateTag
  //             state={getState(props.source)}
  //             name={props.source?.status_name}
  //           />
  //           <IconFont type="flow" />
  //           <StateTag
  //             state={getState(props.target)}
  //             name={props.target?.status_name}
  //           />
  //         </DropCardBox>
  //       )
  //     }}
  //   </Droppable>
  // )
  const dispatch = useDispatch()
  if (props.source?.flow_status_id === props.target?.flow_status_id) {
    return <></>
  }
  return (
    <DropCardBox
      onDrop={e => {
        // console.log(e)
      }}
      onMouseUp={e => {
        // console.log(props.source, props.target)
        if (!movingStory || !props.source || !props.target) {
          console.error('movingStory is null')
          return
        }
        dispatch(
          modifyStatus({
            groupId: movingStory?.groupId,
            columnId: movingStory?.columnId,
            targetColumnId: props.columnId,
            targetGroupId: props.groupId,
            storyId: movingStory?.story.id,
            source: props.source,
            target: props.target,
          }),
        )
      }}
    >
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
