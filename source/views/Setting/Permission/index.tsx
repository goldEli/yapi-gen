import { AsyncButton as Button } from '@staryuntech/ant-pro'
import { Checkbox, Modal, Input, Space } from 'antd'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import React, { useEffect, useState } from 'react'
import { useModel } from '@/models'

const Header = styled.div({
  height: 64,
  background: 'white',
  lineHeight: '64px',
  position: 'sticky',
  top: 0,
  zIndex: 2,
  span: {
    fontSize: 16,
    fontWeight: 400,
    color: 'black',
    paddingLeft: 24,
  },
})

const Content = styled.div({
  padding: 16,
  background: '#F5F7FA',
  height: 'calc(100% - 64px)',
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

interface ItemProps {
  item: any
  onchangeKeys(arr: React.Key[]): void
  selectKeys: React.Key[]
}

const PermissionItem = (props: ItemProps) => {
  const [itemCheckedKeys, setItemCheckedKeys] = useState<React.Key[]>([])

  const onItemChange = (e: any, item: any) => {
    if (e.target.checked) {
      if (!props.selectKeys.includes(item.id)) {
        const arr = [...props.selectKeys, ...[item.id]]
        setItemCheckedKeys(arr)
        props.onchangeKeys(arr)
        console.log(arr, 'checked')
      }
    } else {
      const arr = props.selectKeys.filter(i => i !== item.id)
      setItemCheckedKeys(arr)
      props.onchangeKeys(arr)
      console.log(arr, 'nochecked')
    }
  }

  const onAllChange = (e: any, item: any) => {
    const arr = e.target.checked ? item.children.map((i: any) => i.id) : []
    setItemCheckedKeys(arr)
    props.onchangeKeys([...props.selectKeys, ...arr])
    console.log(arr, 'alll')
  }

  return (
    <MainWrapItem>
      <CheckboxWrap>
        <Checkbox
          value={itemCheckedKeys}
          onChange={e => onAllChange(e, props.item)}
        />
      </CheckboxWrap>
      <OperationWrap>{props.item.name}</OperationWrap>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {props.item.children.map((k: any) => (
          <div
            key={k.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginRight: 24,
            }}
          >
            {itemCheckedKeys.includes(k.id)}
            <Checkbox
              checked={itemCheckedKeys.includes(k.id)}
              style={{ marginRight: 8 }}
              onChange={e => onItemChange(e, k)}
            />
            <span>{k.name}</span>
          </div>
        ))}
      </div>
    </MainWrapItem>
  )
}

export default () => {
  const [activeTabs, setActiveTabs] = useState(-1)
  const [visible, setVisible] = useState(false)
  const [dataList, setDataList] = useState<any>([])
  const [permission, setPermission] = useState<any>([])
  const [selectKeys, setSelectKeys] = useState<React.Key[]>([])
  const { getRoleList, getRolePermission, setRolePermission } =
    useModel('setting')

  const init = async () => {
    const result = await getRoleList()
    setDataList(result)
    setActiveTabs(0)
  }

  const getPermission = async () => {
    const result = await getRolePermission(activeTabs)
    setPermission(result)
  }

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    getPermission()
  }, [activeTabs])

  const save = () => {
    console.log(selectKeys, '===selectKeys')
  }

  return (
    <div style={{ height: '100%' }}>
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
      <Header>
        <span>权限管理</span>
      </Header>
      <Content>
        <SetMain>
          <SetLeft>
            <Title style={{ marginLeft: 24 }}>用户组</Title>
            <MenuItems>
              {dataList.list?.map((item: any) => (
                <MenuItem
                  key={item.id}
                  onClick={() => setActiveTabs(item.id)}
                  isActive={item.id === activeTabs}
                >
                  <div>{item.name}</div>
                  <span>{item.type === 1 ? '系统权限组' : '自定义权限组'}</span>
                  {/* <IconFont type='more' /> */}
                </MenuItem>
              ))}
            </MenuItems>
            <div
              style={{
                textAlign: 'center',
                cursor: 'pointer',
                color: '#2877FF',
              }}
              onClick={() => setVisible(true)}
            >
              <IconFont type="plus" />
              <span>添加用户组</span>
            </div>
          </SetLeft>
          <SetRight>
            <Title>{dataList.list ? dataList.list[activeTabs].name : ''}</Title>
            <TitleGroup>
              <CheckboxWrap>全选</CheckboxWrap>
              <OperationWrap>操作对象</OperationWrap>
              <span>权限</span>
            </TitleGroup>
            <MainWrap>
              {permission.list?.map((i: any) => (
                <PermissionItem
                  key={i.id}
                  item={i}
                  onchangeKeys={setSelectKeys}
                  selectKeys={selectKeys}
                />
              ))}
            </MainWrap>
            <Button
              style={{ width: 'fit-content', marginTop: 16 }}
              type="primary"
              onClick={save}
            >
              保存
            </Button>
          </SetRight>
        </SetMain>
      </Content>
    </div>
  )
}
