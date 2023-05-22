import React from 'react'
import styled from '@emotion/styled'
import Issues from '../Issues'

interface IssuesGroupProps {
  issuesGroup: Model.SprintKanBan.IssuesGroup
  index: number
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
  const issues = issuesGroup.data?.[props.index ?? 0]
  return (
    <IssuesGroupBox>
      <div>{issuesGroup.title}</div>
      <DropAreaList>
        {/* {issuesGroup.data.map(issues => {
          return ( */}
        <Issues key={issues.id} issues={issues} groupId={issuesGroup.groupId} />
        {/* )
        })} */}
      </DropAreaList>
    </IssuesGroupBox>
  )
}

export default IssuesGroup
