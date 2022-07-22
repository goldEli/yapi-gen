import React, { useEffect, useState } from 'react'
import { Modal, Spin } from 'antd'
import { css } from '@emotion/css'
import styled from '@emotion/styled'
import head from '@/assets/head.png'
import { useModel } from '@/models'

const PersonalHead = styled.div`
  display: flex;
  justify-content: center;
`
const PersonalFooter = styled.div`
  display: flex;
  justify-content: space-around;
`

const Left = styled.div``
const Line = styled.div`
  color: rgba(100, 101, 102, 1);
  margin-top: 24px;
`
const RightLine = styled(Line)`
  margin-top: 24px;
  color: rgba(50, 50, 51, 1);
`

const Right = styled.div``
const imgCss = css`
  width: 104px;
  height: 104px;
  border-radius: 50%;
`

export const Personal = (props: { visible: boolean, close(): void }) => {
  const { getUserDetail } = useModel('user')
  const [userDetail, setUserDetail] = useState<any>('')
  const [isShow, setIsShow] = useState<any>(false)
  const init = async () => {
    const response = await getUserDetail()
    setUserDetail(response)
    console.log(
      response,
      '获取个人资料',
    )
  }

  useEffect(
    () => {
      init()
    },
    [],
  )

  const labelList = [
    {
      label: '手机号',
      value: userDetail.account,
    },
    {
      label: '邮箱',
      value: userDetail.email,
    },
    {
      label: '昵称',
      value: userDetail.nickname,
    },
    {
      label: '姓名',
      value: userDetail.name,
    },
    {
      label: '性别',
      value: userDetail.gender === 1 ? '男' : '女',
    },
    {
      label: '所属部门',
      value: userDetail.department_name,
    },
    {
      label: '职位',
      value: userDetail.position_name,
    },
    {
      label: '权限组',
      value: userDetail.group_name,
    },
  ]
  return (
    <Modal
      width={420}
      footer={null}
      onCancel={() => props.close()}
      title="个人资料"
      visible={props.visible}
    >
      {isShow ? <Spin /> : null}
      {!isShow && (
        <>
          <PersonalHead>
            <img
              className={imgCss}
              src={userDetail.avatar ? userDetail.avatar : head}
              alt=""
            />
          </PersonalHead>
          <PersonalFooter>
            <Left>
              {labelList.map(item => <Line key={item.label}>{item.label ? item.label : '-'}</Line>)}
            </Left>
            <Right>
              {labelList.map(item => <Line key={item.label}>{item.value ? item.value : '-'}</Line>)}
            </Right>
          </PersonalFooter>
        </>
      )}
    </Modal>
  )
}
