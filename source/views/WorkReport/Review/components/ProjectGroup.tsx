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
import {
  addGroup,
  editGroup,
  getGroupUserList,
  removeGroup,
} from '@/services/report'
import IconFont from '@/components/IconFont'
import DeleteConfirm from '@/components/DeleteConfirm'
const ProjectGroup = (props: any) => {
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
    <DelIcon>
      <IconFont
        type="delete"
        style={{ color: 'var(--neutral-n3)', fontSize: 18 }}
        onClick={() => {}}
      ></IconFont>
    </DelIcon>
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
        <span className="text">添加项目组</span>
      </ProjectGroupTitle>
      {data?.map((item: any) => {
        return (
          <ProjectGroupList key={item.id}>
            <GroupBox>
              <div className="group-name">{item.name}</div>
              <div className="group-user">
                <MultipleAvatar list={item.users} max={3} />
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
                共计{item.users?.length}人，{item.stories?.length}个事务
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
        userList={userList}
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
        text="确认删除该分组"
        title="删除确认"
      />
    </div>
  )
}

export default ProjectGroup
