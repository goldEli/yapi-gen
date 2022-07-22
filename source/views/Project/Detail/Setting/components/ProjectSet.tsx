/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import { Checkbox, Space, Modal, Input, Menu, Dropdown } from 'antd'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { useEffect, useState } from 'react'
import { type CheckboxValueType } from 'antd/lib/checkbox/Group'
import { useModel } from '@/models'
import { type CheckboxChangeEvent } from 'antd/lib/checkbox'

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
      <div style={{ display: 'flex', alignItems: 'center' }}>
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

const ProjectSet = () => {
  const [activeTabs, setActiveTabs] = useState(-1)
  const [isVisible, setIsVisible] = useState(false)
  const [dataList, setDataList] = useState<any>([])
  const [havePermission, setHavePermission] = useState<any>([])
  const [selectKeys, setSelectKeys] = useState<CheckboxValueType[]>([])
  const [addValue, setAddValue] = useState('')
  const { getProjectPermission, getPermission, setPermission, addPermission }
    = useModel('project')

  const init = async () => {
    const result = await getProjectPermission()
    setDataList(result)
    setActiveTabs(0)
  }

  const getPermissionMethod = async () => {
    const result = await getPermission(activeTabs)
    setHavePermission(result)
  }

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    getPermissionMethod()
  }, [activeTabs])

  const onSavePermission = async () => {
    try {
      await setPermission({ roleId: activeTabs, permissionIds: selectKeys })
      getPermissionMethod()

      //
    } catch (error) {

      //
    }
  }

  const onSaveGroup = async () => {
    try {
      await addPermission({ name: addValue })
      setIsVisible(false)
      setAddValue('')

      //
    } catch (error) {

      //
    }
  }

  const onClickMenu = (e: any, type: string) => {
    e.stopPropagation()
    if (type === 'edit') {
      setIsVisible(true)
    }
  }

  const onClose = () => {
    setIsVisible(false)
    setAddValue('')
  }

  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: <div onClick={e => onClickMenu(e, 'edit')}>编辑</div>,
        },
        {
          key: '2',
          label: <div onClick={e => onClickMenu(e, 'delete')}>删除</div>,
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
            onClick={onClose}
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
          <Button onClick={onClose}>取消</Button>
          <Button disabled={!addValue} onClick={onSaveGroup} type="primary">
            确认
          </Button>
        </ModalFooter>
      </Modal>
      <Warp>
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
              {havePermission.list?.map((i: any) => (
                <PermissionItem
                  key={i.id}
                  item={i}
                  onChange={setSelectKeys}
                  value={selectKeys}
                />
              ))}
            </MainWrap>
            <Button
              style={{ width: 'fit-content', marginTop: 16 }}
              type="primary"
              onClick={onSavePermission}
            >
              保存
            </Button>
          </SetRight>
        </SetMain>
      </Warp>
    </div>
  )
}

export default ProjectSet
