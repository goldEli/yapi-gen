import React from 'react'
import styled from '@emotion/styled'
import Issues from '../Issues'
import useKanBanData from '../hooks/useKanBanData'

interface IssuesGroupProps {
  // issuesGroup: Model.SprintKanBan.IssuesGroup
  index: number
  groupId: Model.SprintKanBan.IssuesGroup['groupId']
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
  const { data } = useKanBanData()
  const group = data.find(item => item.groupId === props.groupId)
  const issues = group?.data?.[props.index ?? 0]
  return (
    <IssuesGroupBox>
      <div>{group?.title}</div>
      <DropAreaList>
        {/* {issuesGroup.data.map(issues => {
          return ( */}
        <Issues key={issues?.id} issues={issues} groupId={group?.groupId} />
        {/* )
        })} */}
      </DropAreaList>
    </IssuesGroupBox>
  )
}

export default IssuesGroup
