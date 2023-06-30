import React, { useMemo } from 'react'
import styled from '@emotion/styled'
import { Droppable } from 'react-beautiful-dnd'
import { handleId } from '../utils'
import StatusListItem from '../StatusListItem'
import usePlaceholderStatusNum from '../hooks/usePlaceholderStatusNum'
import useKanBanData from '../hooks/useKanBanData'
import useI18n from '@/hooks/useI18n'

interface IssuesProps {
  issues?: Model.KanbanConfig.Category
  groupId?: Model.KanbanConfig.Column['id']
}

const DropArea = styled.div<{ showBorder: boolean }>`
  min-height: 100px;
  display: flex;
  flex-direction: column;
  background: var(--neutral-n9);
  width: 302px;
  box-sizing: border-box;
  padding: 16px;
  gap: 8px;
  border: 1px dashed
    ${props => (props.showBorder ? 'var(--primary-d1)' : 'transparent')};
  position: relative;
`

const Tips = styled.div<{ show: boolean }>`
  width: 100%;
  height: 100%;
  display: ${props => (props.show ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--neutral-n3);
  position: absolute;
  left: 0;
  top: 0;
`
const StatusListItemPlaceholder = styled.div`
  width: 100%;
  height: 44px;
  padding: 0 16px;
  box-sizing: border-box;
  flex-shrink: 0;
`
const Issues: React.FC<IssuesProps> = props => {
  const { issues, groupId } = props
  const droppableId = handleId(groupId ?? 0, issues?.id ?? 0)
  const { placeholderItemsLength } = usePlaceholderStatusNum(issues)
  const { t } = useI18n()
  const { checkIsDrop } = useKanBanData()
  const isDrop = checkIsDrop(issues?.id ?? 0)
  return (
    <Droppable
      isDropDisabled={!isDrop}
      type="STATUS"
      key={issues?.id}
      droppableId={droppableId}
    >
      {(provided, snapshot) => {
        return (
          <DropArea
            showBorder={isDrop}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
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
            {Array(placeholderItemsLength)
              .fill(0)
              .map((_, idx) => {
                return <StatusListItemPlaceholder key={idx} />
              })}
            {provided.placeholder}
            <Tips show={!issues?.status?.length}>
              {t('move_a_status_here_to_assign_it_to_this_column')}
            </Tips>
          </DropArea>
        )
      }}
    </Droppable>
  )
}

export default Issues
