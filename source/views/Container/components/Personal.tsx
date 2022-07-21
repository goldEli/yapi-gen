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
export const Personal = (props: { visible: boolean; close: () => void }) => {
  const { getUserDetail } = useModel('user')
  const [userDetail, setUserDetail] = useState<any>('')
  const [isShow, setIsShow] = useState<any>(false)
  const init = async () => {
    const response = await getUserDetail()
    setUserDetail(response)
    console.log(response, '获取登录详情')
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <Modal
      width={420}
      footer={null}
      onCancel={() => props.close()}
      title="个人资料"
      visible={props.visible}
    >
      {isShow && <Spin></Spin>}
      {!isShow && (
        <>
          <PersonalHead>
            <img className={imgCss} src={userDetail.avatar} alt="" />
          </PersonalHead>
          <PersonalFooter>
            <Left>
              <Line>手机号</Line>
              <Line>邮箱</Line>
              <Line>邮箱</Line>
              <Line>姓名</Line>
              <Line>性别</Line>
              <Line>所属部门</Line>
              <Line>职位</Line>
              <Line>权限组</Line>
              <Line>状态</Line>
            </Left>
            <Right>
              <RightLine>{userDetail.account}</RightLine>
              <RightLine>{userDetail.email}</RightLine>
              <RightLine>{userDetail.nickname}</RightLine>
              <RightLine>{userDetail.name}</RightLine>
              <RightLine>{userDetail.gender}</RightLine>
              <RightLine>{userDetail.department_name}</RightLine>
              <RightLine>{userDetail.position_name}</RightLine>
              <RightLine>{userDetail.group_name}</RightLine>
              <RightLine>{userDetail.status}</RightLine>
            </Right>
          </PersonalFooter>
        </>
      )}
    </Modal>
  )
}
