import React from 'react'
import IssuesGroup from '../IssuesGroup'
import useKanBanData from '../hooks/useKanBanData'

interface IssuesGroupListProps {
  index: number
  groupId: Model.SprintKanBan.IssuesGroup['groupId']
}

const IssuesGroupList: React.FC<IssuesGroupListProps> = props => {
  return <IssuesGroup index={props.index} groupId={props.groupId} />
}

export default IssuesGroupList
