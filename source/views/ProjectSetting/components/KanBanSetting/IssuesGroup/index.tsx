import React from 'react'
import styled from '@emotion/styled'
import Issues from '../Issues'
import useKanBanData from '../hooks/useKanBanData'
import CategoryArea from '../CategoryArea'

interface IssuesGroupProps {
  // issuesGroup: Model.SprintKanBan.IssuesGroup
  index: number
  groupId: Model.KanbanConfig.Column['id']
}

const IssuesGroupBox = styled.div`
  width: 100%;
`

const DropAreaList = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;
  flex-direction: column;
  /* min-height: 80vh; */
`

const IssuesGroup: React.FC<IssuesGroupProps> = props => {
  const { columnList } = useKanBanData()
  const group = columnList.find(item => item.id === props.groupId)
  return (
    <IssuesGroupBox>
      <DropAreaList>
        {group?.categories?.map(issues => {
          return (
            <CategoryArea
              showTitle={props.index === 0}
              key={issues.id}
              data={issues}
            >
              <Issues key={issues?.id} issues={issues} groupId={group?.id} />
            </CategoryArea>
          )
        })}
      </DropAreaList>
    </IssuesGroupBox>
  )
}

export default IssuesGroup
