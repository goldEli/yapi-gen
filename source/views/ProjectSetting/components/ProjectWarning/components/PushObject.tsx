import React, { useState } from 'react'
import SubTitle from './SubTitle'
import CommonButton from '@/components/CommonButton'
import CommonIconFont from '@/components/CommonIconFont'
import AddDepartmentOrTeamModal from '@/components/AddDepartmentOrTeamModal'
import useProjectId from '../hooks/useProjectId'
import styled from '@emotion/styled'
const PushObjectBox = styled.div`
  border: 1px solid var(--neutral-n6-d1);
  min-height: 64px;
  border-radius: 6px;
  display: flex;
  align-items: flex-start;

  padding: 16px 24px;
`
const PushObjectUserBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  .user {
    display: flex;
    min-width: 104px;
    display: flex;
    align-items: center;
    background-color: var(--neutral-n8);
    padding: 0px 8px;
    box-sizing: border-box;
    margin-right: 24px;
    margin-bottom: 16px;
    border-radius: 6px;
    img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }
    .username {
      margin: 0px 10px 0px 8px;
    }
  }
`
const PushObject = () => {
  const [visible, setVisible] = useState(false)
  const { projectId } = useProjectId()
  const [list, setList] = useState<any[]>([])
  const [usersId, setUsersId] = useState<any>()
  return (
    <div>
      <SubTitle title="推送对象"></SubTitle>
      <PushObjectBox>
        <CommonButton
          type="secondary"
          onClick={() => {
            setVisible(true)
            setUsersId(() => list.map(item => item.id))
          }}
        >
          <CommonIconFont type="plus"></CommonIconFont>添加推送对象
        </CommonButton>
        <PushObjectUserBox>
          {list.map(item => (
            <div className="user" key={item.id}>
              <img src={item.avatar} alt="" />
              <span className="username">{item.name}</span>
              <CommonIconFont
                type="close"
                color="var(--neutral-n3)"
                onClick={() => {
                  setList(() => list.filter(user => user.id !== item.id))
                }}
              ></CommonIconFont>
            </div>
          ))}
        </PushObjectUserBox>
      </PushObjectBox>
      <AddDepartmentOrTeamModal
        isVisible={visible}
        onClose={() => {
          setVisible(false)
        }}
        onConfirm={data => {
          console.log(data)
          setList(data)
        }}
        type={2}
        projectId={projectId}
        users={usersId}
      ></AddDepartmentOrTeamModal>
    </div>
  )
}
export default PushObject
