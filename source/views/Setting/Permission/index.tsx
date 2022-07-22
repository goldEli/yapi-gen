import { AsyncButton as Button } from '@staryuntech/ant-pro'
import { Checkbox, Modal, Input, Space, Popover, Menu, Dropdown } from 'antd'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { useEffect, useState } from 'react'
import { useModel } from '@/models'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'
import type { CheckboxChangeEvent } from 'antd/lib/checkbox'

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

const IconWrap = styled(IconFont)({
  display: 'none',
  position: 'absolute',
  right: 10,
  fontSize: '16px!important',
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
    position: 'relative',
    '.name': {
      fontSize: 14,
      color: 'black',
      fontWeight: 400,
    },
    '.subName': {
      fontSize: 12,
      color: '#BBBDBF',
      fontWeight: 400,
    },
    '&:hover': {
      '.name': {
        color: '#2877FF',
      },
      [IconWrap.toString()]: {
        display: 'block',
      },
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
  onChange?(value: CheckboxValueType[]): void
  value?: CheckboxValueType[]
}

const PermissionItem = (props: ItemProps) => {
  const keys
    = props.value?.filter(
      (i: any) => !!props.item.children.find((item: any) => item.value === i),
    ) || []

  const otherKeys = props.value?.filter((i: any) => !keys.includes(i)) || []

  const onChange = (newKeys: CheckboxValueType[]) => {
    console.log(newKeys)
    props.onChange?.([...new Set([...newKeys, ...otherKeys])])
  }

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    onChange(
      e.target.checked ? props.item.children.map((i: any) => i.value) : [],
    )
  }

  return (
    <MainWrapItem>
      <CheckboxWrap>
        <Checkbox
          indeterminate={
            keys.length > 0 && keys.length !== props.item.children.length
          }
          onChange={onCheckAllChange}
          checked={
            keys.length > 0 && keys.length === props.item.children.length
          }
        />
      </CheckboxWrap>
      <OperationWrap>{props.item.name}</OperationWrap>
      <div style={{ display: 'flex',
        alignItems: 'center' }}>
        <Checkbox.Group
          options={props.item.children}
          style={{ marginRight: 8 }}
          value={keys}
          onChange={onChange}
        />
      </div>
    </MainWrapItem>
  )
}

export default () => {
  const [activeTabs, setActiveTabs] = useState(-1)
  const [isVisible, setIsVisible] = useState(false)
  const [dataList, setDataList] = useState<any>([])
  const [permission, setPermission] = useState<any>([])
  const [selectKeys, setSelectKeys] = useState<CheckboxValueType[]>([])
  const [addValue, setAddValue] = useState('')
  const {
    getRoleList,
    getRolePermission,
    setRolePermission,
    addRole,
    deleteRole,
    updateRole,
  } = useModel('setting')

  const init = async () => {
    const result = await getRoleList()
    setDataList(result)
    setActiveTabs(0)
  }

  const getPermission = async () => {
    const result = await getRolePermission(activeTabs)
    setPermission(result)
  }

  useEffect(
    () => {
      init()
    },
    [],
  )

  useEffect(
    () => {
      getPermission()
    },
    [activeTabs],
  )

  const onSavePermission = async () => {
    try {
      await setRolePermission({ roleId: activeTabs,
        permissionIds: selectKeys })

      //
    } catch (error) {

      //
    }
  }

  const onSaveGroup = async () => {
    try {
      await addRole({ name: addValue })

      //
    } catch (error) {

      //
    }
  }

  const onClickMenu = (e: any, type: string) => {
    e.stopPropagation()
    type === 'edit' ? setIsVisible(true) : console.log('删除')
  }

  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: <div onClick={e => onClickMenu(
            e,
            'edit',
          )}>编辑</div>,
        },
        {
          key: '2',
          label: <div onClick={e => onClickMenu(
            e,
            'delete',
          )}>删除</div>,
        },
      ]}
    />
  )
  return (
    <div style={{ height: '100%' }}>
      <Modal
        footer={false}
        visible={isVisible}
        title={false}
        closable={false}
        bodyStyle={{ padding: '16px 24px' }}
        width={420}
      >
        <ModalHeader>
          <span>创建权限组</span>
          <IconFont
            onClick={() => setIsVisible(false)}
            style={{ cursor: 'pointer' }}
            type="close"
          />
        </ModalHeader>
        <div style={{ margin: '24px 0' }}>
          <Input
            value={addValue}
            onChange={e => setAddValue(e.target.value)}
            placeholder="请输入权限组名称"
          />
        </div>
        <ModalFooter size={16}>
          <Button onClick={() => setIsVisible(false)}>取消</Button>
          <Button disabled={!addValue} onClick={onSaveGroup} type="primary">
            确认
          </Button>
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
                  <div className="name">{item.name}</div>
                  <span className="subName">
                    {item.type === 1 ? '系统权限组' : '自定义权限组'}
                  </span>
                  <Dropdown
                    overlay={menu}
                    placement="bottomRight"
                    trigger={['click']}
                    getPopupContainer={node => node}
                  >
                    <IconWrap type="more" />
                  </Dropdown>
                </MenuItem>
              ))}
            </MenuItems>
            <div
              style={{
                textAlign: 'center',
                cursor: 'pointer',
                color: '#2877FF',
              }}
              onClick={() => setIsVisible(true)}
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
                  onChange={setSelectKeys}
                  value={selectKeys}
                />
              ))}
            </MainWrap>
            <Button
              style={{ width: 'fit-content',
                marginTop: 16 }}
              type="primary"
              onClick={onSavePermission}
            >
              保存
            </Button>
          </SetRight>
        </SetMain>
      </Content>
    </div>
  )
}
