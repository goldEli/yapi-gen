/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import { Checkbox, Space, Modal, Input, Menu, Dropdown, message } from 'antd'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { useEffect, useState } from 'react'
import { type CheckboxValueType } from 'antd/lib/checkbox/Group'
import { useModel } from '@/models'
import { type CheckboxChangeEvent } from 'antd/lib/checkbox'
import { useSearchParams } from 'react-router-dom'
import DeleteConfirm from '@/components/DeleteConfirm'
import PermissionWrap from '@/components/PermissionWrap'
import { getIsPermission } from '@/tools'

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
  const [isVisible, setIsVisible] = useState(false)
  const [isMoreVisible, setIsMoreVisible] = useState(false)
  const [dataList, setDataList] = useState<any>([])
  const [permissionList, setPermissionList] = useState<any>([])
  const [selectKeys, setSelectKeys] = useState<CheckboxValueType[]>([])
  const [activeDetail, setActiveDetail] = useState<any>({})
  const [addValue, setAddValue] = useState('')
  const [operationDetail, setOperationDetail] = useState<any>({})
  const [isDelete, setIsDelete] = useState(false)
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const {
    getProjectPermission,
    getPermission,
    setPermission,
    addPermission,
    updatePermission,
    deletePermission,
    projectInfo,
  } = useModel('project')

  const getPermissionList = async (id: number) => {
    const result = await getPermission({ projectId, roleId: id })
    setPermissionList(result)
    let keys: any[] = []
    result.list.forEach((i: any) => {
      const a = i.children.filter((j: any) => j.checked)
      keys = [...keys, ...a.map((k: any) => k.value)]
    })
    setSelectKeys(keys)
  }

  const init = async (isInit?: boolean) => {
    const result = await getProjectPermission({ projectId })
    setDataList(result.list)
    if (isInit) {
      setActiveDetail(result.list[0])
      getPermissionList(result.list[0].id)
    }
  }

  useEffect(() => {
    init(true)
  }, [])

  const onSavePermission = async () => {
    if (!selectKeys.length) {
      message.warning('请选择需要添加的权限')
      return
    }
    try {
      await setPermission({
        roleId: activeDetail.id,
        permissionIds: selectKeys,
        projectId,
      })
      getPermissionList(activeDetail.id)
      message.success('保存成功')

      //
    } catch (error) {

      //
    }
  }

  const onSaveGroup = async () => {
    try {
      if (operationDetail.id) {
        await updatePermission({
          name: addValue,
          id: operationDetail.id,
          projectId,
        })
        setAddValue('')
        setOperationDetail({})
        message.success('编辑成功')
      } else {
        await addPermission({ name: addValue, projectId })
        setAddValue('')
        message.success('创建成功')
      }
      setIsVisible(false)
      init()

      //
    } catch (error) {

      //
    }
  }

  const onClickMenu = (e: any, type: string, item: any) => {
    e.stopPropagation()
    setOperationDetail(item)
    if (type === 'edit') {
      setIsVisible(true)
      setAddValue(item.name)
    } else {
      setIsDelete(true)
    }
  }

  const onClose = () => {
    setIsVisible(false)
    setAddValue('')
  }

  const onChangeTabs = (item: any) => {
    setActiveDetail(item)
    getPermissionList(item.id)
  }

  const onDeleteConfirm = async () => {
    try {
      await deletePermission({ id: operationDetail.id })
      setIsDelete(false)
      setOperationDetail({})
      message.success('删除成功')
      init(true)
    } catch (error) {

      //
    }
  }

  const menu = (item: any) => (
    <Menu
      items={[
        {
          key: '1',
          label: <div onClick={e => onClickMenu(e, 'edit', item)}>编辑</div>,
        },
        {
          key: '2',
          label: <div onClick={e => onClickMenu(e, 'delete', item)}>删除</div>,
        },
      ]}
    />
  )

  return (
    <PermissionWrap
      auth="b/project/role"
      permission={projectInfo?.projectPermissions}
    >
      <div style={{ height: '100%' }}>
        <DeleteConfirm
          isVisible={isDelete}
          text="确认要删除该分组？"
          onChangeVisible={() => setIsDelete(!isDelete)}
          onConfirm={onDeleteConfirm}
        />
        <Modal
          footer={false}
          visible={isVisible}
          title={false}
          closable={false}
          bodyStyle={{ padding: '16px 24px' }}
          width={420}
          maskClosable={false}
        >
          <ModalHeader>
            <span>{operationDetail.id ? '编辑权限组' : '创建权限组'}</span>
            <IconFont
              onClick={onClose}
              style={{ cursor: 'pointer' }}
              type="close"
            />
          </ModalHeader>
          <div style={{ margin: '24px 0' }}>
            <Input
              maxLength={10}
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
                {dataList?.map((item: any) => (
                  <MenuItem
                    key={item.id}
                    onClick={() => onChangeTabs(item)}
                    isActive={item.id === activeDetail.id}
                  >
                    <div className="name">{item.name}</div>
                    <span className="subName">
                      {item.type === 1 ? '系统权限组' : '自定义权限组'}
                    </span>
                    <Dropdown
                      key={isMoreVisible.toString()}
                      visible={isMoreVisible}
                      overlay={() => menu(item)}
                      placement="bottomRight"
                      trigger={['hover']}
                      getPopupContainer={node => node}
                      onVisibleChange={visible => setIsMoreVisible(visible)}
                    >
                      <IconWrap type="more" hidden={item.type === 1} />
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
              <Title>{activeDetail.name}</Title>
              <TitleGroup>
                <CheckboxWrap>全选</CheckboxWrap>
                <OperationWrap>操作对象</OperationWrap>
                <span>权限</span>
              </TitleGroup>
              <MainWrap>
                {permissionList.list?.map((i: any) => (
                  <PermissionItem
                    key={i.id}
                    item={i}
                    onChange={setSelectKeys}
                    value={selectKeys}
                  />
                ))}
              </MainWrap>
              <Button
                hidden={activeDetail.type === 1}
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
    </PermissionWrap>
  )
}

export default ProjectSet
