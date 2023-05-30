import React from 'react'
import styled from '@emotion/styled'
import DropCard from '../DropCard'
import { useSelector } from '@store/index'

interface DropCardListProps {
  list: {
    source?: Model.KanbanConfig.Status
    target?: Model.KanbanConfig.Status
  }[]
}

const DropCardListBox = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
  flex-direction: column;
`

const DropCardList: React.FC<DropCardListProps> = props => {
  return (
    <DropCardListBox>
      {props.list?.map(item => {
        const { source, target } = item
        return (
          <DropCard
            source={source}
            target={target}
            key={source?.id + '-' + target?.id}
          />
        )
      })}
    </DropCardListBox>
  )
}

export default DropCardList
