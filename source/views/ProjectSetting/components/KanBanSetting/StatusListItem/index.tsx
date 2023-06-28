import React from 'react'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import StateTag from '@/components/StateTag'
import MoveIcon from '../MoveIcon'
import { Draggable } from 'react-beautiful-dnd'
import useI18n from '@/hooks/useI18n'
import { Tooltip } from 'antd'
interface StatusListItemProps {
  data: Model.KanbanConfig.Status
  index: number
  hiddenIcon?: boolean
}

const StatusListItemBox = styled.div`
  width: 100%;
  height: 44px;
  background: var(--neutral-white-d1);
  border-radius: 6px 6px 6px 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-sizing: border-box;
  flex-shrink: 0;
`
const StatusListItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const ImageIcon = styled.img`
  width: 20px;
  height: 20px;
`

const Count = styled.div`
  font-size: 12px;
  color: var(--neutral-n3);
`

const StatusListItem: React.FC<StatusListItemProps> = props => {
  const { data } = props
  // debugger
  const draggableId = data.flow_status_id + ''
  const { t } = useI18n()
  return (
    <Draggable
      key={data.flow_status_id}
      draggableId={draggableId}
      index={props.index}
    >
      {(provided, snapshot) => {
        return (
          <StatusListItemBox
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            key={data.flow_status_id}
          >
            <StatusListItemLeft>
              <MoveIcon active={snapshot.isDragging} />
              <Tooltip title={data.category_name}>
                {!props.hiddenIcon && <ImageIcon src={data.attachment_path} />}
              </Tooltip>
              {/* <Text bg={item.status_color}>{item.status_name}</Text> */}
              <StateTag
                name={data.status_name}
                state={
                  data?.is_start === 1 && data?.is_end === 2
                    ? 1
                    : data?.is_end === 1 && data?.is_start === 2
                    ? 2
                    : data?.is_start === 2 && data?.is_end === 2
                    ? 3
                    : 0
                }
              />
            </StatusListItemLeft>
            <Count>
              {t('count_transaction', { count: data.stories_count })}
            </Count>
          </StatusListItemBox>
        )
      }}
    </Draggable>
  )
}

export default StatusListItem
