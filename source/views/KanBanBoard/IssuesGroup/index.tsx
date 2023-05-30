import React, { useMemo } from 'react'
import styled from '@emotion/styled'
import Issues from '../Issues'
import UpDownBtn from '@/components/UpDownBtn'
import MultipleAvatar from '@/components/MultipleAvatar'
import ChoosePeople from '@/views/WorkReport/Formwork/ChoosePeople'
import ChooseMember from '../ChooseMember'
import useAddUserModal from '@/hooks/useAddUserModal'
import {
  openUserGroupingModel,
  saveUserGroupingModel,
} from '@store/kanBan/kanBan.thunk'
import { useDispatch } from '@store/index'
import {
  DropAreaList,
  GroupTitleArea,
  ImgIcon,
  IssuesGroupBox,
  Text,
  Title,
  TitleBtn,
} from './styled'
import useCloseMap from '../hooks/useCloseMap'
import useGroupType from '../hooks/useGroupType'
import PriorityIcon from '@/components/PriorityIcon'
interface IssuesGroupProps {
  issuesGroup: Model.KanBan.Group
}

const IssuesGroup: React.FC<IssuesGroupProps> = props => {
  const { issuesGroup } = props
  const { AddUserModalElement, open } = useAddUserModal()
  const { closeMap, onChange } = useCloseMap()
  const dispatch = useDispatch()
  const hidden = !!closeMap?.get(issuesGroup.id)
  const { showUserRelatedInformation, groupType } = useGroupType()

  const text = useMemo(() => {
    const storiesNum =
      issuesGroup?.columns?.reduce((res, column) => {
        const n = column.stories.length ?? 0
        return res + n
      }, 0) ?? 0
    if (!showUserRelatedInformation) {
      return `${storiesNum}个事务`
    }
    return `共计${issuesGroup?.users?.length ?? 0}人，${storiesNum}个事务`
  }, [issuesGroup, showUserRelatedInformation])

  const showPeople = showUserRelatedInformation && (
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
  )

  const addPeopleBtn = showUserRelatedInformation && (
    <div
      onClick={e => {
        e.stopPropagation()
        /**
         * 如果是id === 0 是系统内置的无分组 可以创建新分组
         * 不为0只添加成员即可
         */
        if (issuesGroup.id === 0) {
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
          return
        }
        open({
          async onConfirm(data) {
            dispatch(
              openUserGroupingModel({
                userList: data,
                groupName: issuesGroup.name,
                id: issuesGroup.id,
              }),
            )
            return Promise.resolve()
          },
        })
      }}
    >
      <ChooseMember />
    </div>
  )

  const icon = useMemo(() => {
    if (showUserRelatedInformation) {
      return <></>
    }
    if (groupType === 'category') {
      return <ImgIcon src={issuesGroup.attachment_path} />
    }
    return (
      <PriorityIcon icon={issuesGroup.icon} color={issuesGroup.color ?? ''} />
    )
  }, [showUserRelatedInformation, groupType, issuesGroup])

  const titleArea = (
    <GroupTitleArea>
      <TitleBtn
        onClick={e => {
          e.stopPropagation()
          onChange(issuesGroup.id)
        }}
      >
        <UpDownBtn isOpen={hidden} />
        {icon}
        <Title>{issuesGroup.name}</Title>
      </TitleBtn>
      {showPeople}
      {addPeopleBtn}
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
