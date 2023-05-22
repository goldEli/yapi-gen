import React from 'react'
import IssuesGroup from '../IssuesGroup'

interface IssuesGroupListProps {
  data: Model.SprintKanBan.IssuesGroup[]
  index: number
}

const IssuesGroupList: React.FC<IssuesGroupListProps> = props => {
  return (
    <>
      {props.data.map(issuesGroup => {
        return (
          <IssuesGroup
            index={props.index}
            key={issuesGroup.groupId}
            issuesGroup={issuesGroup}
          />
        )
      })}
    </>
  )
}

export default IssuesGroupList
