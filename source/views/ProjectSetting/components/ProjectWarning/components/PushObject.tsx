import React, { useEffect, useState } from 'react'
import SubTitle from './SubTitle'
import CommonButton from '@/components/CommonButton'
import CommonIconFont from '@/components/CommonIconFont'
import AddDepartmentOrTeamModal from '@/components/AddDepartmentOrTeamModal'
import useProjectId from '../hooks/useProjectId'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import { setProjectWarning } from '@store/project'
import { useTranslation } from 'react-i18next'
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
  min-height: 32px;
  /* align-items: center; */
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
    height: 32px;
    /* border: 1px solid red; */
    img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }
    .username {
      margin: 0px 10px 0px 8px;
    }
    &:hover {
      background: var(--neutral-white-d4);
      box-shadow: 0px 0px 10px 0px rgba(9, 9, 9, 0.09);
    }
  }
`
const PushObject = () => {
  const [t] = useTranslation()
  const [visible, setVisible] = useState(false)
  const { projectId } = useProjectId()
  const [list, setList] = useState<any[]>([])
  const [userTotal, setUserTotal] = useState<number | undefined>()
  const [usersId, setUsersId] = useState<any>()
  const dispatch = useDispatch()
  const { projectWarning } = useSelector(store => store.project)
  const { push_obj, is_all_obj } = projectWarning
  useEffect(() => {
    setList(push_obj)
  }, [])
  return (
    <div>
      <SubTitle title={t('pushObject')}></SubTitle>
      <PushObjectBox>
        {/* <CommonButton
          type="secondary"
          style={{ marginRight: '32px' }}
          onClick={() => {
            setVisible(true)
            setUsersId(() => list.map(item => item.id))
          }}
        >
          <CommonIconFont type="plus"></CommonIconFont>
          {t('addPushObject')}
        </CommonButton> */}
        <PushObjectUserBox>
          <CommonButton
            type="secondary"
            style={{ marginRight: '32px' }}
            onClick={() => {
              setVisible(true)
              setUsersId(() => list.map(item => item.id))
            }}
          >
            <CommonIconFont type="plus"></CommonIconFont>
            {t('addPushObject')}
          </CommonButton>
          {list.map(item => (
            <div className="user" key={item.id}>
              {item.avatar ? (
                <img src={item.avatar} alt="" />
              ) : (
                <img
                  src="https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/light.png"
                  alt=""
                />
              )}
              <span className="username">{item.name}</span>
              <CommonIconFont
                type="close"
                color="var(--neutral-n3)"
                onClick={() => {
                  setList(() => list.filter(user => user.id !== item.id))
                  dispatch(
                    setProjectWarning({
                      ...projectWarning,
                      push_obj: list
                        ?.filter(user => user.id !== item.id)
                        ?.map(item => item.id),
                    }),
                  )
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
        onConfirm={(data, length) => {
          setList(data)
          setUserTotal(length)
          dispatch(setProjectWarning({ ...projectWarning, push_obj: data }))
        }}
        type={2}
        projectId={projectId}
        users={usersId}
        title={t('addPushObject')}
      ></AddDepartmentOrTeamModal>
    </div>
  )
}
export default PushObject
