import React from 'react'
import { Modal } from 'antd'
import { css } from '@emotion/css'
import styled from '@emotion/styled'
import head from '@/assets/head.png'

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
  return (
    <Modal
      width={420}
      footer={null}
      onCancel={() => props.close()}
      title="个人资料"
      visible={props.visible}
    >
      <PersonalHead>
        <img className={imgCss} src={head} alt="" />
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
          <RightLine>18866686868</RightLine>
          <RightLine>1056982569@qq.com</RightLine>
          <RightLine>千颂伊</RightLine>
          <RightLine>万颂伊</RightLine>
          <RightLine>男</RightLine>
          <RightLine>产品部</RightLine>
          <RightLine>UI设计</RightLine>
          <RightLine>管理员</RightLine>
          <RightLine>在职</RightLine>
        </Right>
      </PersonalFooter>
    </Modal>
  )
}
