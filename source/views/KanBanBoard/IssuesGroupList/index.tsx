import React from 'react'
import IssuesGroup from '../IssuesGroup'
import styled from '@emotion/styled'
interface IssuesGroupListProps {
  data: Model.KanBan.Group[]
}

const IssuesGroupListBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const IssuesGroupList: React.FC<IssuesGroupListProps> = props => {
  return (
    <IssuesGroupListBox>
      {props.data.map(issuesGroup => {
        return <IssuesGroup key={issuesGroup.id} issuesGroup={issuesGroup} />
      })}
    </IssuesGroupListBox>
  )
}

export default IssuesGroupList
