import React from 'react'
import styled from '@emotion/styled'
import Issues from '../Issues'
import UpDownBtn from '@/components/UpDownBtn'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import MultipleAvatar from '@/components/MultipleAvatar'

interface IssuesGroupProps {
  issuesGroup: Model.KanBan.Group
}

const IssuesGroupBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const DropAreaList = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;
  /* min-height: 80vh; */
`
const GroupTitleArea = styled.div`
  height: 24px;
  display: flex;
  align-items: center;
`
const Title = styled.div`
  font-size: 14px;
  color: var(--neutral-n1-d1);
  font-family: SiYuanMedium;
  margin-left: 8px;
  margin-right: 16px;
  flex-shrink: 0;
`

const IssuesGroup: React.FC<IssuesGroupProps> = props => {
  const { issuesGroup } = props
  return (
    <IssuesGroupBox>
      <GroupTitleArea>
        <UpDownBtn isOpen={false} />
        <Title>{issuesGroup.name}</Title>
        <MultipleAvatar
          list={Array(4)
            .fill(0)
            .map((_, idx) => {
              return {
                id: idx,
                name: 'lily' + idx,
              }
            })}
          max={3}
        />
      </GroupTitleArea>
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
