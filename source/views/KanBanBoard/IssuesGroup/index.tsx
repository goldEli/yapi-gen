import React, { useMemo } from 'react'
import styled from '@emotion/styled'
import Issues from '../Issues'
import UpDownBtn from '@/components/UpDownBtn'
import MultipleAvatar from '@/components/MultipleAvatar'
import ChoosePeople from '@/views/WorkReport/Formwork/ChoosePeople'
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
  gap: 16px;
`
const Title = styled.div`
  font-size: 14px;
  color: var(--neutral-n1-d1);
  font-family: SiYuanMedium;
  flex-shrink: 0;
`
const TitleBtn = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const Text = styled.div`
  font-size: 12px;
  color: var(--neutral-n3);
`

const IssuesGroup: React.FC<IssuesGroupProps> = props => {
  const { issuesGroup } = props

  const text = useMemo(() => {
    const storiesNum =
      issuesGroup?.columns?.reduce((res, column) => {
        const n = column.stories.length ?? 0
        return res + n
      }, 0) ?? 0
    return `共计${issuesGroup?.users?.length ?? 0}人，${storiesNum}个事务`
  }, [issuesGroup])

  const titleArea = (
    <GroupTitleArea>
      <TitleBtn>
        <UpDownBtn isOpen={false} />
        <Title>{issuesGroup.name}</Title>
      </TitleBtn>
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
      <ChoosePeople
        margin={0}
        onChange={(...args: any) => {
          console.log({ args })
        }}
        hiddenNumbers
        initValue={[]}
      />
      <Text>{text}</Text>
    </GroupTitleArea>
  )
  return (
    <IssuesGroupBox>
      {titleArea}
      <DropAreaList>
        {issuesGroup?.columns?.map(column => {
          return (
            <Issues key={column.id} issues={column} groupId={issuesGroup.id} />
          )
        })}
      </DropAreaList>
    </IssuesGroupBox>
  )
}

export default IssuesGroup
