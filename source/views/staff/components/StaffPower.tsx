import React from 'react'
import { Modal, Select } from 'antd'
import { css } from '@emotion/css'
import styled from '@emotion/styled'
import head from '@/assets/head.png'
const { Option } = Select

const PersonalHead = styled.div`
  display: flex;
  justify-content: center;
`
const PersonalFooter = styled.div`
  display: flex;
  justify-content: space-around;
`
const Footer = styled.footer`
  align-items: center;
  margin-top: 36px;
  display: flex;
  flex-direction: row-reverse;
  height: 56px;
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
const MyButton = styled.div`
  width: 60px;
  height: 32px;
  background: rgba(242, 242, 244, 1);
  background-blend-mode: normal;
  border-radius: 6px;
  padding: 5px 16px 5px 16px;
  color: rgba(100, 101, 102, 1);
  font-size: 14px;
`
const ConfirmButton = styled(MyButton)`
  background: rgba(40, 119, 255, 1);
  color: rgba(255, 255, 255, 1);
  margin-left: 16px;
`
const Right = styled.div``
const imgCss = css`
  width: 104px;
  height: 104px;
  border-radius: 50%;
`
export const StaffPersonal = (props: {
  visible: boolean
  close: () => void
}) => {
  const handleChange = (value: string) => {
    console.log(`selected ${value}`)
  }
  return (
    <Modal
      width={420}
      footer={null}
      onCancel={() => props.close()}
      title="配置权限"
      visible={props.visible}
    >
      <PersonalHead>
        <img className={imgCss} src={head} alt="" />
      </PersonalHead>
      <PersonalFooter>
        <Left>
          <Line>手机号</Line>
          <Line>邮箱</Line>
          <Line>姓名</Line>
          <Line>昵称</Line>
          <Line>权限组</Line>
        </Left>
        <Right>
          <RightLine>18866686868</RightLine>
          <RightLine>1056982569@qq.com</RightLine>
          <RightLine>千颂伊</RightLine>
          <RightLine>万颂伊</RightLine>
          <RightLine>
            <Select
              defaultValue="lucy"
              style={{ width: 120 }}
              onChange={handleChange}
            >
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="disabled" disabled>
                Disabled
              </Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
          </RightLine>
        </Right>
      </PersonalFooter>
      <Footer>
        <ConfirmButton onClick={() => props.close()}>确定</ConfirmButton>
        <MyButton onClick={() => props.close()}>取消</MyButton>
      </Footer>
    </Modal>
  )
}
