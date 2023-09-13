import React from 'react'
import styled from '@emotion/styled'
import DropCard from '../DropCard'
import { useSelector } from '@store/index'

interface DropCardListProps {
  list: {
    source?: Model.KanbanConfig.Status
    target?: Model.KanbanConfig.Status
  }[]
  groupId: Model.KanBan.Group['id']
  columnId: Model.KanBan.Column['id']
  hidden?: boolean
}

const DropCardListBox = styled.div<{ hidden?: boolean }>`
  width: 100%;
  display: ${props => (props.hidden ? 'none' : 'flex')};
  gap: 8px;
  flex-direction: column;
  position: absolute;
  top: 0px;
  left: 0px;
`

const DropCardList: React.FC<DropCardListProps> = props => {
  return (
    <DropCardListBox hidden={props.hidden}>
      {props.list?.map(item => {
        const { source, target } = item
        return (
          <DropCard
            source={source}
            target={target}
            groupId={props.groupId}
            columnId={props.columnId}
            key={source?.id + '-' + target?.id}
          />
        )
      })}
    </DropCardListBox>
  )
}

export default DropCardList
