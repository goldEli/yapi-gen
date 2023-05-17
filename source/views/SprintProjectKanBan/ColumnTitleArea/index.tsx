/**
 * kanban 列title区域
 */
import React from 'react'
import styled from '@emotion/styled'
import { issueColumns } from './data'

interface ColumnTitleAreaProps {}
const ColumnTitle = styled.span`
  width: 302px;
  height: 48px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
`

const ColumnTitleAreaBox = styled.div`
  display: flex;
  gap: 16px;
`

const ColumnTitleArea: React.FC<ColumnTitleAreaProps> = props => {
  return (
    <ColumnTitleAreaBox>
      {issueColumns.map(item => {
        return (
          <ColumnTitle
            key={item.id}
          >{`${item.title}（${item.total}）`}</ColumnTitle>
        )
      })}
    </ColumnTitleAreaBox>
  )
}

export default ColumnTitleArea
