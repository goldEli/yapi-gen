/**
 * kanban 列title区域
 */
import React from 'react'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'

interface ColumnTitleAreaProps {}
const ColumnTitle = styled.span`
  width: 302px;
  height: 48px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`

const ColumnTitleAreaBox = styled.div`
  display: flex;
  gap: 16px;
`

const ColumnTitleArea: React.FC<ColumnTitleAreaProps> = props => {
  const { kanbanConfig, kanbanInfoByGroup } = useSelector(store => store.kanBan)
  return (
    <ColumnTitleAreaBox>
      {kanbanConfig?.columns?.map(item => {
        const num = kanbanInfoByGroup.reduce((res, group) => {
          const len =
            group.columns.find(column => column.id === item.id)?.stories
              .length ?? 0
          return len + res
        }, 0)
        return (
          <ColumnTitle key={item.id}>{`${item.name}（${num}）`}</ColumnTitle>
        )
      })}
    </ColumnTitleAreaBox>
  )
}

export default ColumnTitleArea
