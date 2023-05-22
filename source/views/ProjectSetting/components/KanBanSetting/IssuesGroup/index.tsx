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
  flex-direction: column;
  /* min-height: 80vh; */
`
const CateGoryTittleArea = styled.div<{ visible: boolean }>`
  visibility: ${props => (props.visible ? 'visible' : 'hidden')};
`

const IssuesGroup: React.FC<IssuesGroupProps> = props => {
  const { columnList } = useKanBanData()
  const group = columnList.find(item => item.id === props.groupId)
  return (
    <IssuesGroupBox>
      <DropAreaList>
        {group?.categories.map(issues => {
          return (
            <>
              <CateGoryTittleArea visible={props.index === 0}>
                {issues.name}
              </CateGoryTittleArea>
              <Issues key={issues?.id} issues={issues} groupId={group?.id} />
            </>
          )
        })}
      </DropAreaList>
    </IssuesGroupBox>
  )
}

export default IssuesGroup
