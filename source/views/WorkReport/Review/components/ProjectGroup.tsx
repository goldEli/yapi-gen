import React, { useEffect, useState, useRef } from 'react'
import CommonIconFont from '@/components/CommonIconFont'
import {
  DelIcon,
  GroupBox,
  GroupStoryBox,
  ProjectGroupList,
  ProjectGroupTitle,
} from './style'
import AddDepartmentOrTeamModal from '@/components/AddDepartmentOrTeamModal'
import MemberGroup from './MemberGroup'
import { setProjectGroup } from '@store/workReport'
import { useDispatch } from '@store/index'
import MultipleAvatar from '@/components/MultipleAvatar'
import { useTranslation } from 'react-i18next'
import {
  addGroup,
  editGroup,
  getGroupUserList,
  removeGroup,
} from '@/services/report'
import IconFont from '@/components/IconFont'
import DeleteConfirm from '@/components/DeleteConfirm'
import { Tooltip } from 'antd'
const ProjectGroup = (props: any) => {
  const [t]: any = useTranslation()
  const [userVisible, setUserVisible] = useState(false)
  const [groupVisible, setGroupVisible] = useState(false)
  const [userList, setUserList] = useState<Model.User.User[]>()
  const [groupUser, setGroupUser] = useState<any>()
  const [groupId, setGroupId] = useState<any>()
  const [groupName, setGroupName] = useState<any>()
  const [isDeleteVisible, setIsDeleteVisible] = useState<boolean>(false)
  const dispatch = useDispatch()
  const { projectId, data, template_id, onOk } = props
  // 添加分组
  const confirm = async (data: any) => {
    const params: any = {
      user_ids: data.user_ids,
      project_id: projectId,
      template_id: template_id,
      name: data.name,
      group_id: groupId,
    }
    if (!groupId) {
      delete params.group_id
    }
    const method = groupId ? editGroup : addGroup
    console.log(data, groupId)
    await method(params)
    setGroupVisible(false)
    onOk()
    props.onChange(props.data)
    console.log(data)
  }
  //
  useEffect(() => {
    console.log('data----', data)
    props.onChange(data)
  }, [data])
  const delBtn = (
    <Tooltip title={t('deleteGroup')}>
      <DelIcon>
        <IconFont
          type="delete"
          style={{ color: 'var(--neutral-n3)', fontSize: 18 }}
          onClick={() => {}}
        ></IconFont>
      </DelIcon>
    </Tooltip>
  )
  return (
    <div>
      <ProjectGroupTitle
        onClick={() => {
          console.log(11)
          setGroupUser([])
          setGroupId('')
          setGroupName('')
          setUserVisible(true)
        }}
      >
        <CommonIconFont
          type="plus"
          color="var(--auxiliary-text-t2-d2)"
        ></CommonIconFont>
        <span className="text">{t('addProjectGroup')}</span>
      </ProjectGroupTitle>
      {data?.map((item: any) => {
        return (
          <ProjectGroupList key={item.id}>
            <GroupBox>
              <div className="group-name">{item.name}</div>
              <div
                className="group-user"
                onClick={() => {
                  console.log(111, item)
                  // setUserList(item.users)
                  setGroupName(item.name)
                  setGroupId(item.id)
                  dispatch(setProjectGroup(item.users))
                  setGroupVisible(true)
                }}
              >
                <MultipleAvatar list={item.users} max={3} disableDropDown />
              </div>
              <div className="add-icon">
                <IconFont
                  type="plus"
                  className="icon"
                  style={{
                    color: 'var(--neutral-n3)',
                    fontSize: '16px',
                  }}
                  onClick={() => {
                    const data = props.data
                      .find((ele: { id: any }) => ele.id === item.id)
                      ?.users.map((item: { id: any }) => item.id)
                    setGroupName(
                      props.data.find((ele: { id: any }) => ele.id === item.id)
                        ?.name,
                    )
                    setGroupUser(data)
                    setGroupId(
                      props.data.find((ele: { id: any }) => ele.id === item.id)
                        ?.id,
                    )
                    setUserVisible(true)
                  }}
                ></IconFont>
              </div>
              <div className="user-num">
                {t('total')}
                {item.users?.length}
                {t('people')}，{item.stories?.length}
                {t('transactions')}
              </div>

              <div
                className="del-icon"
                onClick={() => {
                  setGroupId(item.id)
                  setIsDeleteVisible(true)
                }}
              >
                {delBtn}
              </div>
            </GroupBox>
            <GroupStoryBox>
              {item.stories.map((item: any) => {
                return (
                  <div className="item" key={item.id}>
                    {item.name}（{item.schedule_percent}% {item.schedule}h）
                  </div>
                )
              })}
            </GroupStoryBox>
          </ProjectGroupList>
        )
      })}
      <AddDepartmentOrTeamModal
        isVisible={userVisible}
        onClose={() => setUserVisible(false)}
        type={2}
        onConfirm={data => {
          console.log('data----', data)
          dispatch(setProjectGroup(data))
          setUserList(data)
          setUserVisible(false)
          setGroupVisible(true)
        }}
        users={groupUser}
        projectId={projectId}
      ></AddDepartmentOrTeamModal>
      <MemberGroup
        visible={groupVisible}
        onCancel={() => setGroupVisible(!groupVisible)}
        onOk={(data: any) => {
          confirm(data)
        }}
        name={groupName}
      ></MemberGroup>
      <DeleteConfirm
        isVisible={isDeleteVisible}
        onConfirm={() => {
          const init = async () => {
            const params = {
              group_id: groupId,
              project_id: projectId,
              template_id: template_id,
            }
            const res = await removeGroup(params)
            setIsDeleteVisible(false)
            onOk()
          }
          init()
        }}
        onChangeVisible={() => {
          setIsDeleteVisible(false)
        }}
        text={t('confirmToDeleteThisGroup')}
        title={t('deleteConfirmation')}
      />
    </div>
  )
}

export default ProjectGroup
