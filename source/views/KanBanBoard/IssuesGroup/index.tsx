import React from 'react'
import styled from '@emotion/styled'
import Issues from '../Issues'

interface IssuesGroupProps {
  issuesGroup: Model.KanBan.Group
}

const IssuesGroupBox = styled.div`
  width: 100%;
`

const DropAreaList = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;
  /* min-height: 80vh; */
`

const IssuesGroup: React.FC<IssuesGroupProps> = props => {
  const { issuesGroup } = props
  return (
    <IssuesGroupBox>
      <div>{issuesGroup.name}</div>
      <DropAreaList>
        {issuesGroup.columns.map(column => {
          return (
            <Issues key={column.id} issues={column} groupId={issuesGroup.id} />
          )
        })}
      </DropAreaList>
    </IssuesGroupBox>
  )
}

export default IssuesGroup
