import { AsyncButton as Button } from '@staryuntech/ant-pro'
import { Checkbox, Space, Modal, Input } from 'antd'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { useState } from 'react'

const Warp = styled.div({
  padding: 16,
  height: '100%',
})

const SetMain = styled.div({
  padding: '24px 0',
  background: 'white',
  borderRadius: 6,
  height: '100%',
  width: '100%',
  display: 'flex',
})

const SetLeft = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  borderRight: '1px solid #EBEDF0',
  width: 160,
})

const SetRight = styled.div({
  display: 'flex',
  flexDirection: 'column',
  marginLeft: 24,
  width: 'calc(100% - 184px)',
})

const Title = styled.div({
  fontSize: 14,
  fontWeight: 400,
  color: 'black',
  paddingLeft: 8,
  borderLeft: '3px solid #2877FF',
  marginBottom: 8,
})

const MenuItems = styled.div({
  display: 'flex',
  flexDirection: 'column',
})

const MenuItem = styled.div<{ isActive: boolean }>(
  {
    display: 'flex',
    flexDirection: 'column',
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxSizing: 'border-box',
    div: {
      fontSize: 14,
      color: 'black',
      fontWeight: 400,
    },
    span: {
      fontSize: 12,
      color: '#BBBDBF',
      fontWeight: 400,
    },
    '&:hover': {
      borderRight: '3px solid #2877FF',
      background: '#F0F4FA',
    },
  },
  ({ isActive }) => ({
    borderRight: isActive ? '3px solid #2877FF' : '3px solid white',
    background: isActive ? '#F0F4FA' : 'white',
  }),
)

const TitleGroup = styled.div({
  display: 'flex',
  alignItems: 'center',
  marginTop: 14,
  color: '#BBBDBF',
  fontSize: 12,
})

const MainWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})

const MainWrapItem = styled.div({
  borderBottom: '1px solid #EBEDF0',
  padding: '24px 0',
  display: 'flex',
  alignItems: 'center',
})

const ModalHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: 16,
  color: '#323233',
})

const ModalFooter = styled(Space)({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
})

const CheckboxWrap = styled.div({ width: 100 })
const OperationWrap = styled.div({ width: 100 })

const permissionList = [
  {
    name: '管理员',
    subName: '系统分组',
    children: [
      {
        name: '需求',
        children: [
          { name: '创建需求' },
          { name: '删除需求' },
          { name: '编辑需求' },
        ],
      },
      {
        name: '迭代',
        children: [
          { name: '创建迭代' },
          { name: '删除迭代' },
          { name: '编辑迭代' },
        ],
      },
    ],
  },
  {
    name: '编辑者',
    subName: '系统分组',
    children: [
      {
        name: '需求',
        children: [
          { name: '创建需求' },
          { name: '删除需求' },
          { name: '编辑需求' },
        ],
      },
    ],
  },
  {
    name: '参与者',
    subName: '系统分组',
    children: [
      {
        name: '需求',
        children: [{ name: '创建需求' }],
      },
    ],
  },
]

export default () => {
  const [activeTabs, setActiveTabs] = useState(0)
  const [visible, setVisible] = useState(false)
  return (
    <Warp>
      <Modal
        footer={false}
        visible={visible}
        title={false}
        closable={false}
        bodyStyle={{ padding: '16px 24px' }}
        width={420}
      >
        <ModalHeader>
          <span>创建权限组</span>
          <IconFont
            onClick={() => setVisible(false)}
            style={{ cursor: 'pointer' }}
            type="close"
          />
        </ModalHeader>
        <div style={{ margin: '24px 0' }}>
          <Input placeholder="请输入权限组名称" />
        </div>
        <ModalFooter size={16}>
          <Button onClick={() => setVisible(false)}>取消</Button>
          <Button type="primary">确认</Button>
        </ModalFooter>
      </Modal>
      <SetMain>
        <SetLeft>
          <Title style={{ marginLeft: 24 }}>用户组</Title>
          <MenuItems>
            {permissionList.map((item, index) => (
              <MenuItem
                key={item.name}
                onClick={() => setActiveTabs(index)}
                isActive={index === activeTabs}
              >
                <div>{item.name}</div>
                <span>{item.subName}</span>
              </MenuItem>
            ))}
          </MenuItems>
          <div
            onClick={() => setVisible(true)}
            style={{ textAlign: 'center',
              cursor: 'pointer',
              color: '#2877FF' }}
          >
            <IconFont type="plus" />
            <span>添加用户组</span>
          </div>
        </SetLeft>
        <SetRight>
          <Title>管理员</Title>
          <TitleGroup>
            <CheckboxWrap>全选</CheckboxWrap>
            <OperationWrap>操作对象</OperationWrap>
            <span>权限</span>
          </TitleGroup>
          <MainWrap>
            {permissionList[activeTabs].children.map(i => (
              <MainWrapItem key={i.name}>
                <CheckboxWrap>
                  <Checkbox />
                </CheckboxWrap>
                <OperationWrap>{i.name}</OperationWrap>
                <div style={{ display: 'flex',
                  alignItems: 'center' }}>
                  {i.children.map(k => (
                    <div
                      key={k.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginRight: 24,
                      }}
                    >
                      <Checkbox style={{ marginRight: 8 }} />
                      <span>{k.name}</span>
                    </div>
                  ))}
                </div>
              </MainWrapItem>
            ))}
          </MainWrap>
          <Button
            style={{ width: 'fit-content',
              marginTop: 16 }}
            type="primary"
          >
            保存
          </Button>
        </SetRight>
      </SetMain>
    </Warp>
  )
}
