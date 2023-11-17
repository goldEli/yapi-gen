import React, { useEffect, useMemo } from 'react'
import Issues from '../Issues'
import UpDownBtn from '@/components/UpDownBtn'
import MultipleAvatar from '@/components/MultipleAvatar'
import ChooseMember from '../ChooseMember'
import useAddUserModal from '@/hooks/useAddUserModal'
import {
  openUserGroupingModel,
  deleteKanbanGroup,
} from '@store/kanBan/kanBan.thunk'
import { store, useDispatch, useSelector } from '@store/index'
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
import { getNewstoriesOfGroupFirstPage } from '@/services/kanban'
import _ from 'lodash'
import { getProjectIdByUrl } from '@/tools'
import { setKanbanInfoByGroup } from '@store/kanBan'
interface IssuesGroupProps {
  issuesGroup: Model.KanBan.Group
  style?: any
}

const IssuesGroup: React.FC<IssuesGroupProps> = props => {
  const { issuesGroup } = props

  const conId = useSelector(store => store.kanBan.kanbanConfig?.id)
  const { kanbanInfoByGroup } = useSelector(store => store.kanBan)
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

  const isEmpty = (data: any) => {
    if (_.isEmpty(data)) {
      return true
    }
    return Object.entries(data).every(([key, value]) => {
      return _.isEmpty(value)
    })
  }
  function bbh(data: any) {
    const filteredData: any = {}

    for (const key in data) {
      if (key.includes('custom')) {
        filteredData[key] = data[key]
      }
    }
    return filteredData
  }
  const checkGroup = () => {
    let obj
    switch (groupType) {
      case 'priority':
        obj = {
          priority: issuesGroup.id,
        }
        break
      case 'users':
        obj = {
          kanban_group_id: issuesGroup.id,
        }
        break
      case 'category':
        obj = {
          category_id: issuesGroup.id,
        }
        break
      default:
        // eslint-disable-next-line no-undefined
        obj = undefined
        break
    }
    return obj
  }
  function findAndReplace(
    groupId: any,

    newStories: any,
    data1: any,
  ) {
    const cc = JSON.parse(JSON.stringify(newStories))
    let data: any
    data = cc.map((item: any) => {
      if (item.id === groupId) {
        item.columns = data1
      }
      return item
    })
    return data
  }
  const add = async () => {
    const { valueKey, inputKey } = store.getState().view
    const params = {
      search: isEmpty(valueKey)
        ? {
            all: 1,
            keyword: inputKey,
            ...{ ...checkGroup() },
          }
        : {
            ...valueKey,
            user_id: valueKey.user_name,
            category_id: valueKey.category,
            iterate_id: valueKey.iterate_name,
            custom_field: bbh(valueKey),
            keyword: inputKey,
            schedule_start: valueKey?.schedule?.start,
            schedule_end: valueKey?.schedule?.end,
            ...{ ...checkGroup() },
          },
      project_id: getProjectIdByUrl(),
      kanban_config_id: conId,
      pagesize: 20,
    }

    const firstRes = await getNewstoriesOfGroupFirstPage(params)

    dispatch(
      setKanbanInfoByGroup(
        findAndReplace(issuesGroup.id, kanbanInfoByGroup, firstRes),
      ),
    )
  }

  const titleArea = !isNoGroup && (
    <GroupTitleArea>
      <TitleBtn
        onClick={e => {
          e.stopPropagation()

          onChange(issuesGroup.id)

          if (hidden) {
            add()
          }
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

  return (
    <IssuesGroupBox>
      {titleArea}
      <DeleteConfirmModal />

      <DropAreaList hidden={hidden}>
        {issuesGroup.columns?.map((column, index) => {
          if (groupType === 'priority') {
            return (
              !hidden && (
                <IssuesForPriority
                  key={column.id}
                  issues={column}
                  groupId={issuesGroup.id}
                  index={index}
                />
              )
            )
          }

          return (
            !hidden && (
              <Issues
                key={column.id}
                issues={column}
                groupId={issuesGroup.id}
              />
            )
          )
        })}
      </DropAreaList>
    </IssuesGroupBox>
  )
}

export default IssuesGroup
