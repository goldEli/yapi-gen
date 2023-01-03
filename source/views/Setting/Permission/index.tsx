// 权限设置

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable operator-linebreak */
/* eslint-disable react-hooks/exhaustive-deps */
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import { Checkbox, Input, Space, message, Menu, Spin } from 'antd'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { useEffect, useState } from 'react'
import { useModel } from '@/models'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'
import type { CheckboxChangeEvent } from 'antd/lib/checkbox'
import DeleteConfirm from '@/components/DeleteConfirm'
import { useTranslation } from 'react-i18next'
import CommonModal from '@/components/CommonModal'
import MoreDropdown from '@/components/MoreDropdown'
import useSetTitle from '@/hooks/useSetTitle'
import { GroupWrap } from '@/views/Project/Detail/Setting/components/ProjectSet'

const Header = styled.div({
  height: 64,
  background: 'white',
  lineHeight: '64px',
  position: 'sticky',
  top: 0,
  zIndex: 1,
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
  minHeight: '100%',
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
  padding: '0 24px',
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
    position: 'relative',
    '.dropdownIcon': {
      position: 'absolute',
      right: 0,
    },
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
      background: '#F4F5F5',
      '.dropdownIcon': {
        visibility: 'visible',
      },
    },
  },
  ({ isActive }) => ({
    borderRight: isActive ? '3px solid #2877FF' : '3px solid transparent',
    background: isActive ? '#F0F4FA!important' : 'white',
    '.name': {
      color: isActive ? '#2877FF' : '#323233',
    },
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
  '.ant-checkbox-wrapper': {
    margin: '0 !important',
  },
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
  activeDetail?: any
}

const PermissionItem = (props: ItemProps) => {
  const keys =
    props.value?.filter(
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
          disabled={props.activeDetail?.type === 1}
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
      <GroupWrap>
        <Checkbox.Group value={keys} onChange={onChange}>
          {props.item.children.map((item: any) => {
            return (
              <Checkbox
                key={item.label}
                disabled={props.activeDetail?.type === 1}
                value={item.value}
              >
                {/* <ShowText names={item.label} /> */}
                <span
                  style={{
                    width: '150px',
                    display: 'inline-block',
                    marginBottom: '10px',
                  }}
                >
                  {item.label}
                </span>
              </Checkbox>
            )
          })}
        </Checkbox.Group>
      </GroupWrap>
    </MainWrapItem>
  )
}

const Permission = () => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  asyncSetTtile(t('title.c2'))
  const [isVisible, setIsVisible] = useState(false)
  const [isMoreVisible, setIsMoreVisible] = useState(false)
  const [dataList, setDataList] = useState<any>([])
  const [permission, setPermission] = useState<any>([])
  const [selectKeys, setSelectKeys] = useState<CheckboxValueType[]>([])
  const [activeDetail, setActiveDetail] = useState<any>({})
  const [addValue, setAddValue] = useState('')
  const [operationDetail, setOperationDetail] = useState<any>({})
  const [isDelete, setIsDelete] = useState(false)
  const {
    getRoleList,
    getRolePermission,
    setRolePermission,
    addRole,
    updateRole,
    deleteRole,
  } = useModel('setting')
  const [isSpinning, setIsSpinning] = useState(false)
  const { isRefresh, setIsRefresh } = useModel('user')

  const getPermission = async (id: number) => {
    setIsSpinning(true)
    const result = await getRolePermission({ roleId: id })
    setPermission(result)
    setIsSpinning(false)
    let keys: any[] = []
    result.list.forEach((i: any) => {
      const a = i.children.filter((j: any) => j.checked)
      keys = [...keys, ...a.map((k: any) => k.value)]
    })
    setSelectKeys(keys)
    setIsRefresh(false)
  }

  const init = async (isInit?: boolean, str?: string) => {
    setIsSpinning(true)
    const result = await getRoleList()
    setDataList(result.list)
    if (isInit) {
      setActiveDetail(result.list[0])
      getPermission(result.list[0].id)
    } else {
      setIsSpinning(false)
    }
    if (str) {
      setActiveDetail(result?.list?.filter((i: any) => i.id === str)[0])
      getPermission(result?.list?.filter((i: any) => i.id === str)[0]?.id)
    }
  }

  useEffect(() => {
    init(true)
  }, [isRefresh])

  const onSavePermission = async () => {
    if (!selectKeys.length) {
      message.warning(t('setting.pleasePermission'))
      return
    }
    try {
      await setRolePermission({
        roleId: activeDetail.id,
        permissionIds: selectKeys,
      })
      getRolePermission({ roleId: activeDetail.id })
      message.success(t('common.saveSuccess'))

      //
    } catch (error) {
      //
    }
  }

  const onSaveGroup = async () => {
    if (!String(addValue).trim()) {
      message.warning(t('version2.permissionNull'))
      setAddValue('')
      return
    }
    let result
    try {
      if (operationDetail.id) {
        await updateRole({ name: addValue, id: operationDetail.id })
        message.success(t('common.editSuccess'))
      } else {
        result = await addRole({ name: addValue })
        message.success(t('common.createSuccess'))
      }
      setIsVisible(false)
      init(false, result?.data?.id)
      setAddValue('')
      setOperationDetail({})

      //
    } catch (error) {
      //
    }
  }

  const onClickMenu = (e: any, type: string, item: any) => {
    e.stopPropagation()
    setOperationDetail(item)
    setIsMoreVisible(false)
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
    setSelectKeys([])
    setActiveDetail(item)
    getPermission(item.id)
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteRole({ id: operationDetail.id })
      setIsDelete(false)
      setOperationDetail({})
      message.success(t('common.deleteSuccess'))
      init()
    } catch (error) {
      //
    }
  }

  const menu = (item: any) => (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <div onClick={e => onClickMenu(e, 'edit', item)}>
              {t('common.edit')}
            </div>
          ),
        },
        {
          key: '2',
          label: (
            <div onClick={e => onClickMenu(e, 'delete', item)}>
              {t('common.del')}
            </div>
          ),
        },
      ]}
    />
  )

  return (
    <div style={{ height: '100%' }}>
      <DeleteConfirm
        isVisible={isDelete}
        text={t('setting.confirmGroup')}
        onChangeVisible={() => setIsDelete(!isDelete)}
        onConfirm={onDeleteConfirm}
      />
      <CommonModal
        isVisible={isVisible}
        title={
          operationDetail.id
            ? t('setting.editPermission')
            : t('setting.createPermission')
        }
        width={420}
        onClose={onClose}
        isShowFooter
      >
        <div style={{ margin: '0 16px 24px 0' }}>
          <Input
            autoComplete="off"
            value={addValue}
            onChange={e => setAddValue(e.target.value)}
            placeholder={t('setting.pleaseEnterName')}
          />
        </div>
        <ModalFooter size={16} style={{ padding: '0 16px 24px 0' }}>
          <Button onClick={onClose}>{t('common.cancel')}</Button>
          <Button disabled={!addValue} onClick={onSaveGroup} type="primary">
            {t('common.confirm2')}
          </Button>
        </ModalFooter>
      </CommonModal>
      <Header>
        <span>{t('setting.permissionManagement')}</span>
      </Header>
      <Content>
        <Spin spinning={isSpinning}>
          <SetMain>
            <SetLeft>
              <Title style={{ marginLeft: 24 }}>{t('setting.userGroup')}</Title>
              <MenuItems>
                {dataList?.map((item: any) => (
                  <MenuItem
                    key={item.id}
                    onClick={() => onChangeTabs(item)}
                    isActive={item.id === activeDetail.id}
                  >
                    <div className="name">{item.name}</div>
                    <span className="subName">
                      {item.type === 1
                        ? t('setting.systemGroup')
                        : t('setting.customGroup')}
                    </span>
                    <MoreDropdown
                      isHidden={item.type === 1}
                      isMoreVisible={isMoreVisible}
                      onChangeVisible={setIsMoreVisible}
                      menu={menu(item)}
                    />
                  </MenuItem>
                ))}
              </MenuItems>
              <div
                style={{
                  textAlign: 'center',
                  cursor: 'pointer',
                  color: '#2877FF',
                  height: 58,
                  lineHeight: '58px',
                }}
                onClick={() => setIsVisible(true)}
              >
                <IconFont type="plus" />
                <span>{t('setting.addUserGroup')}</span>
              </div>
            </SetLeft>
            <SetRight>
              <Title>{activeDetail.name}</Title>
              <TitleGroup>
                <CheckboxWrap>{t('setting.all')}</CheckboxWrap>
                <OperationWrap>{t('setting.operationObject')}</OperationWrap>
                <span>{t('common.permission')}</span>
              </TitleGroup>
              <MainWrap>
                {permission.list?.map((i: any) => (
                  <PermissionItem
                    key={i.id}
                    item={i}
                    onChange={setSelectKeys}
                    value={selectKeys}
                    activeDetail={activeDetail}
                  />
                ))}
              </MainWrap>
              <Button
                hidden={activeDetail.type === 1}
                style={{ width: 'fit-content', marginTop: 16 }}
                type="primary"
                onClick={onSavePermission}
              >
                {t('common.save')}
              </Button>
            </SetRight>
          </SetMain>
        </Spin>
      </Content>
    </div>
  )
}

export default Permission
