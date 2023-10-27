import React, { useMemo } from 'react'
import Issues from '../Issues'
import UpDownBtn from '@/components/UpDownBtn'
import MultipleAvatar from '@/components/MultipleAvatar'
import ChooseMember from '../ChooseMember'
import useAddUserModal from '@/hooks/useAddUserModal'
import {
  openUserGroupingModel,
  deleteKanbanGroup,
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
  DelIcon,
} from './styled'
import useCloseMap from '../hooks/useCloseMap'
import useGroupType from '../hooks/useGroupType'
import PriorityIcon from '@/components/PriorityIcon'
import useI18n from '@/hooks/useI18n'
import IssuesForPriority from '../IssuesForPriority'
import IconFont from '@/components/IconFont'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
interface IssuesGroupProps {
  issuesGroup: Model.KanBan.Group
  style?: any
}

const IssuesGroup: React.FC<IssuesGroupProps> = props => {
  const { issuesGroup } = props
  const { AddUserModalElement, open } = useAddUserModal()
  const { closeMap, onChange } = useCloseMap()
  const { open: openDelete, DeleteConfirmModal } = useDeleteConfirmModal()
  const dispatch = useDispatch()

  const { showUserRelatedInformation, groupType, isNoGroup } = useGroupType()
  const hidden =
    groupType === 'none'
      ? !!closeMap?.get(issuesGroup.id)
      : !closeMap?.get(issuesGroup.id)

  const { t } = useI18n()

  const text = useMemo(() => {
    const storiesNum =
      issuesGroup?.columns?.reduce((res, column) => {
        const n = column.stories.length ?? 0
        return res + n
      }, 0) ?? 0
    if (!showUserRelatedInformation) {
      return t('count_transaction', { count: issuesGroup.story_count })
    }
    return `${t('count_person', {
      count: issuesGroup.story_count,
    })}`
  }, [issuesGroup, showUserRelatedInformation])

  const showPeople = showUserRelatedInformation && (
    <div
      onClick={e => {
        if (issuesGroup.users?.length === 0) {
          return
        }
        e.stopPropagation()
        dispatch(
          openUserGroupingModel({
            userList: issuesGroup.users ?? [],
            groupName: issuesGroup.name,
            id: issuesGroup.id,
          }),
        )
      }}
      style={props.style}
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
              dispatch(
                openUserGroupingModel({
                  userList: data,
                }),
              )
              return Promise.resolve()
            },
            people: issuesGroup.users?.map(item => item.id),
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
          people: issuesGroup.users?.map(item => item.id),
        })
      }}
    >
      <ChooseMember id={issuesGroup.id} />
    </div>
  )
  const delBtn = !!issuesGroup.id && (
    <DelIcon>
      <IconFont
        type="delete"
        style={{ color: 'var(--neutral-n3)', fontSize: 18 }}
        onClick={() => {
          openDelete({
            title: t('confirm_deletion'),
            text: t('confirmToDeleteThisGroup'),
            onConfirm() {
              const params = {
                id: issuesGroup.id,
              }
              dispatch(deleteKanbanGroup(params))
              return Promise.resolve()
            },
          })
        }}
      ></IconFont>
    </DelIcon>
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

  const titleArea = !isNoGroup && (
    <GroupTitleArea>
      <TitleBtn
        onClick={e => {
          e.stopPropagation()

          onChange(issuesGroup.id)
        }}
      >
        <UpDownBtn isOpen={!hidden} />
        {icon}
        <Title>{issuesGroup.name}</Title>
      </TitleBtn>
      {showPeople}
      {addPeopleBtn}
      {AddUserModalElement}
      <Text>{text}</Text>
      {<>{groupType === 'users' && delBtn}</>}
    </GroupTitleArea>
  )
  console.log(issuesGroup, 'issuesGroup')

  return (
    <IssuesGroupBox>
      {titleArea}
      <DeleteConfirmModal />
      <DropAreaList hidden={hidden}>
        {issuesGroup.columns?.map((column, index) => {
          if (groupType === 'priority') {
            return (
              <IssuesForPriority
                key={column.id}
                issues={column}
                groupId={issuesGroup.id}
                index={index}
              />
            )
          }

          return (
            <Issues key={column.id} issues={column} groupId={issuesGroup.id} />
          )
        })}
      </DropAreaList>
    </IssuesGroupBox>
  )
}

export default IssuesGroup
