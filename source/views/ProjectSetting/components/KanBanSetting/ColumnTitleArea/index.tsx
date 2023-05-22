/**
 * kanban 列title区域
 */
import React from 'react'
import styled from '@emotion/styled'
import MoveIcon from '../MoveIcon'
import IconFont from '@/components/IconFont'
import { Draggable } from 'react-beautiful-dnd'
import IssuesGroupList from '../IssuesGroupList'
import useKanBanData from '../hooks/useKanBanData'
// import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd'

interface ColumnTitleAreaProps {
  index: number
  // provided: DraggableProvided
  // snapshot: DraggableStateSnapshot
}
const ColumnTitle = styled.span`
  flex-shrink: 0;
  width: 302px;
  height: 48px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  background-color: var(--neutral-n9);
  padding: 0 16px;
  justify-content: space-between;
`

const ColumnTitleAreaBox = styled.div<{ showBorder: boolean }>`
  display: flex;
  gap: 16px;
  flex-direction: column;
  box-sizing: border-box;
  border: 1px solid
    ${props => (props.showBorder ? 'var(--primary-d1)' : 'transparent')};
`
const Text = styled.div`
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--neutral-n1-d1);
  margin-left: 8px;
  margin-right: 16px;
`

const Count = styled.div`
  display: flex;
  font-size: 12px;
  color: var(--neutral-n3);
`
const Left = styled.div`
  display: flex;
  align-items: center;
`
const IconWrap = styled(IconFont)`
  font-size: 20px;
  color: var(--neutral-n1-d1);
`
const ColumnTitleArea: React.FC<ColumnTitleAreaProps> = props => {
  const { columnList } = useKanBanData()
  const item = columnList?.[props.index ?? 0]
  const draggableId = item.id + '1'
  return (
    <Draggable draggableId={draggableId} index={props.index}>
      {(provided, snapshot) => {
        return (
          <ColumnTitleAreaBox
            ref={provided.innerRef}
            {...provided.draggableProps}
            showBorder={snapshot.isDragging}
          >
            <ColumnTitle {...provided.dragHandleProps} key={item.id}>
              <Left>
                <MoveIcon active={snapshot.isDragging} />
                <Text>{item?.name}</Text>
                <Count>{`最大：${item.max_num}`}</Count>
              </Left>
              <IconWrap onClick={e => {}} type="edit" />
            </ColumnTitle>

            <IssuesGroupList
              groupId={item.id}
              key={item.id}
              index={props.index}
            />
          </ColumnTitleAreaBox>
        )
      }}
    </Draggable>
  )
}

export default ColumnTitleArea
