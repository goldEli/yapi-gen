/**
 * kanban 列title区域
 */
import React, { useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import MoveIcon from '../MoveIcon'
import IconFont from '@/components/IconFont'
import { Draggable } from 'react-beautiful-dnd'
import IssuesGroupList from '../IssuesGroupList'
import useKanBanData from '../hooks/useKanBanData'
import { useDispatch } from '@store/index'
import { openEditColumnModel } from '@store/kanbanConfig/kanbanConfig.thunk'
import { Tooltip } from 'antd'
import useIsTextOverflowed from '../hooks/useIsTextOverflowed'
// import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd'

interface ColumnTitleAreaProps {
  index: number
  // provided: DraggableProvided
  // snapshot: DraggableStateSnapshot
}
const ColumnTitle = styled.div`
  flex-shrink: 0;
  width: 302px;
  height: 48px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  background-color: var(--neutral-n9);
  padding: 0 16px;
  justify-content: space-between;
  overflow: hidden;
`

const ColumnTitleAreaBox = styled.div<{ showBorder: boolean }>`
  display: flex;
  gap: 16px;
  flex-direction: column;
  box-sizing: border-box;
  border: 1px solid
    ${props => (props.showBorder ? 'var(--primary-d1)' : 'transparent')};
`
const TextBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  margin-right: 16px;
  overflow: hidden;
`
const Text = styled.span`
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--neutral-n1-d1);
`

const Count = styled.div`
  display: flex;
  font-size: 12px;
  color: var(--neutral-n3);
  flex-shrink: 0;
`
const Left = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  align-items: center;
  padding-right: 8px;
  box-sizing: border-box;
`
const IconWrap = styled(IconFont)`
  font-size: 20px;
  color: var(--neutral-n1-d1);
`
const ColumnTitleArea: React.FC<ColumnTitleAreaProps> = props => {
  const { columnList } = useKanBanData()
  const item = columnList?.[props.index ?? 0]
  const draggableId = item.id + '1'
  const dispatch = useDispatch()

  const { textRef, isTextOverflowed } = useIsTextOverflowed(item.name)

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
                <TextBox>
                  <Tooltip title={isTextOverflowed ? item?.name : ''}>
                    <Text ref={textRef}>{item?.name}</Text>
                  </Tooltip>
                </TextBox>
                <Count>{`最大：${item.max_num}`}</Count>
              </Left>
              <IconWrap
                onClick={e => {
                  e.stopPropagation()
                  dispatch(openEditColumnModel(item))
                }}
                type="edit"
              />
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
