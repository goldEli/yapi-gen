import React from 'react'
import IssuesGroup from '../IssuesGroup'

interface IssuesGroupListProps {
  data: Model.KanBan.Group[]
}

const IssuesGroupList: React.FC<IssuesGroupListProps> = props => {
  return (
    <>
      {props.data.map(issuesGroup => {
        console.log({ issuesGroup })
        return <IssuesGroup key={issuesGroup.id} issuesGroup={issuesGroup} />
      })}
    </>
  )
}

export default IssuesGroupList
