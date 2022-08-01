import { Button, Modal, Select } from 'antd'
import { css } from '@emotion/css'
import styled from '@emotion/styled'
import head from '@/assets/head.png'
import { useModel } from '@/models'
import { useEffect, useState } from 'react'

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
  gap: 16px;
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

export const StaffPersonal = (props: {
  data: any
  isVisible: boolean
  onClose(): void
  onConfirm(info: { userId: string; roleId: string }): void
}) => {
  const { data } = props
  const [roleOptions, setRoleOptions] = useState([])
  const [info, setInfo] = useState({
    roleId: data.user_group_id,
    userId: data.id,
  })

  const { getRoleList } = useModel('staff')

  const init = async () => {
    const res3 = await getRoleList()

    setRoleOptions(res3.data)
  }

  useEffect(() => {
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (value: any) => {
    setInfo({ userId: data.id, roleId: value })
  }
  const onConfirm = () => {
    props.onConfirm(info)
  }

  return (
    <Modal
      width={420}
      footer={null}
      onCancel={() => props.onClose()}
      title="配置权限"
      visible={props.isVisible}
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
          <RightLine>{data.phone}</RightLine>
          <RightLine>{data.email}</RightLine>
          <RightLine>{data.name}</RightLine>
          <RightLine>{data.nickname ? data.nickname : '-'}</RightLine>
          <RightLine>
            <Select
              defaultValue={data.user_group_id === 0 ? '' : data.user_group_id}
              style={{ width: 120 }}
              onChange={handleChange}
            >
              {roleOptions.map((item: any) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </RightLine>
        </Right>
      </PersonalFooter>
      <Footer>
        <Button type="primary" onClick={onConfirm}>
          确定
        </Button>
        <Button onClick={() => props.onClose()}>取消</Button>
      </Footer>
    </Modal>
  )
}
