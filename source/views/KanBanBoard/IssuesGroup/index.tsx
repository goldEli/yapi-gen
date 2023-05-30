import React, { useMemo } from 'react'
import styled from '@emotion/styled'
import Issues from '../Issues'
import UpDownBtn from '@/components/UpDownBtn'
import MultipleAvatar from '@/components/MultipleAvatar'
import ChoosePeople from '@/views/WorkReport/Formwork/ChoosePeople'
import ChooseMember from '../ChooseMember'
import useAddUserModal from '@/hooks/useAddUserModal'
import { openUserGroupingModel } from '@store/kanBan/kanBan.thunk'
import { useDispatch } from '@store/index'
import {
  DropAreaList,
  GroupTitleArea,
  IssuesGroupBox,
  Text,
  Title,
  TitleBtn,
} from './styled'
import useCloseMap from '../hooks/useCloseMap'
interface IssuesGroupProps {
  issuesGroup: Model.KanBan.Group
}

const IssuesGroup: React.FC<IssuesGroupProps> = props => {
  const { issuesGroup } = props
  const { AddUserModalElement, open } = useAddUserModal()
  const { closeMap, onChange } = useCloseMap()

  const text = useMemo(() => {
    const storiesNum =
      issuesGroup?.columns?.reduce((res, column) => {
        const n = column.stories.length ?? 0
        return res + n
      }, 0) ?? 0
    return `共计${issuesGroup?.users?.length ?? 0}人，${storiesNum}个事务`
  }, [issuesGroup])

  const dispatch = useDispatch()
  const hidden = !!closeMap?.get(issuesGroup.id)

  const titleArea = (
    <GroupTitleArea>
      <TitleBtn
        onClick={e => {
          e.stopPropagation()
          onChange(issuesGroup.id)
        }}
      >
        <UpDownBtn isOpen={hidden} />
        <Title>{issuesGroup.name}</Title>
      </TitleBtn>
      <div
        onClick={e => {
          e.stopPropagation()
          dispatch(
            openUserGroupingModel({
              userList: issuesGroup.users ?? [],
              groupName: issuesGroup.name,
              id: issuesGroup.id,
            }),
          )
        }}
      >
        <MultipleAvatar
          list={
            issuesGroup.users?.map(item => {
              return {
                id: item.id,
                name: item.name,
                avatar: item.avatar,
              }
            }) ?? []
          }
          disableDropDown
          max={3}
        />
      </div>
      <div
        onClick={e => {
          e.stopPropagation()
          open({
            async onConfirm(data) {
              console.log(data, 123)
              dispatch(
                openUserGroupingModel({
                  userList: data,
                }),
              )
              return Promise.resolve()
            },
          })
        }}
      >
        <ChooseMember />
      </div>
      {AddUserModalElement}
      <Text>{text}</Text>
    </GroupTitleArea>
  )
  return (
    <IssuesGroupBox>
      {titleArea}
      <DropAreaList hidden={hidden}>
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
