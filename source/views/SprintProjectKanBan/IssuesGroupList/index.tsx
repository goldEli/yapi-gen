import React from 'react'
import IssuesGroup from '../IssuesGroup'

interface IssuesGroupListProps {
  data: Model.SprintKanBan.IssuesGroup[]
}

const IssuesGroupList: React.FC<IssuesGroupListProps> = props => {
  return (
    <>
      {props.data.map(issuesGroup => {
        return (
          <IssuesGroup key={issuesGroup.groupId} issuesGroup={issuesGroup} />
        )
      })}
    </>
  )
}

export default IssuesGroupList
