/* eslint-disable react/jsx-max-depth */
// 权限设置

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable operator-linebreak */
/* eslint-disable react-hooks/exhaustive-deps */
import { Checkbox, Input, Space, message, Menu, Spin, Tooltip } from 'antd'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { useEffect, useRef, useState } from 'react'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'
import type { CheckboxChangeEvent } from 'antd/lib/checkbox'
import DeleteConfirm from '@/components/DeleteConfirm'
import { useTranslation } from 'react-i18next'
import CommonModal from '@/components/CommonModal'
import MoreDropdown from '@/components/MoreDropdown'
import useSetTitle from '@/hooks/useSetTitle'
import PermissionWrap from '@/components/PermissionWrap'
import {
  addRole,
  deleteRole,
  getRoleList,
  getRolePermission,
  setRolePermission,
  updateRole,
} from '@/services/setting'
import { useDispatch, useSelector } from '@store/index'
import { setIsRefresh } from '@store/user'
import CommonButton from '@/components/CommonButton'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import { CloseWrap, DelButton } from '@/components/StyleCommon'
import { getMessage } from '@/components/Message'

const GroupWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  width: 'calc(100% - 200px)',
  '.ant-checkbox-group-item': {
    margin: '6px 24px 6px 0',
  },
})

const Header = styled.div({
  background: 'var(--neutral-white-d6)',
  display: 'flex',
  justifyContent: 'space-between',
  position: 'sticky',
  top: 0,
  zIndex: 1,
  padding: '24px',
  span: {
    fontSize: 16,
    fontWeight: 400,
    color: 'var(--neutral-n1-d1)',
    lineHeight: '24px',
  },
})

const Content = styled.div({
  padding: '0 16px',
  // height: 'calc(100% - 64px)',
})

const SetMain = styled.div({
  background: 'white',
  borderRadius: 6,
  minHeight: '100%',
  width: '100%',
  display: 'flex',
})

const SetLeft = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100vh - 130px)',
  overflowY: 'auto',
  borderRight: '1px solid var(--neutral-n6-d1)',
  width: 232,
  paddingRight: '16px',
})

const SetRight = styled.div({
  display: 'flex',
  flexDirection: 'column',
  padding: '0 24px',
  width: 'calc(100% - 184px)',
  height: 'calc(100vh - 180px)',
  overflowY: 'auto',
})

const Title = styled.div({
  fontSize: 14,
  fontFamily: 'SiYuanMedium',
  color: 'var(--neutral-n1-d2)',
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
    height: 44,
    justifyContent: 'center',
    cursor: 'pointer',
    boxSizing: 'border-box',
    position: 'relative',
    paddingLeft: 24,
    alignItems: 'self-start',
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
      color: 'var(--neutral-n3)',
      fontWeight: 400,
    },
    '&:hover': {
      background: 'var(--hover-d1)',
      '.dropdownIcon': {
        visibility: 'visible',
      },
    },
  },
  ({ isActive }) => ({
    background: isActive ? 'var(--gradient-left) !important' : 'white',
    '.name': {
      color: isActive ? 'var(--primary-d1)' : 'var(--neutral-n1-d1)',
    },
  }),
)

const CheckboxWrap = styled.div({ width: 100, height: 32 })

const TitleGroup = styled.div({
  display: 'flex',
  alignItems: 'center',
  marginTop: 14,
  color: 'var(--neutral-n3)',
  fontSize: 12,
  [CheckboxWrap.toString()]: {
    lineHeight: '32px',
  },
})

const MainWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})

const MainWrapItem = styled.div({
  borderBottom: '1px solid var(--neutral-n6-d1)',
  padding: '24px 0 12px',
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

const IconFontStyle = styled(IconFont)`
  font-size: 18px;
  color: var(--neutral-n2);
  border-radius: 6px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: var(--hover-d1);
  }
`

const RowBox = styled.div`
  /* padding-right: 16px; */
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* margin-bottom: 10px; */
`

const OperationWrap = styled.div({ width: 100 })
const MenuItemsTitle = styled.div`
  height: 44px;
  line-height: 44px;
  /* padding: 0px 16px; */
  color: var(--neutral-n3);
  font-size: var(--font12);
  /* margin-bottom: 8px; */
`
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
          disabled={
            props.activeDetail?.type === 1 ||
            props.item.children[0]?.groupName === '工作汇报'
          }
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
        <Checkbox.Group
          value={keys}
          onChange={onChange}
          disabled={props.item.children[0]?.groupName === '工作汇报'}
        >
          {props.item.children.map((item: any) => {
            return (
              <>
                {item.isShow === 1 && (
                  <Checkbox
                    key={item.label}
                    disabled={props.activeDetail?.type === 1}
                    value={item.value}
                  >
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
                )}
              </>
            )
          })}
        </Checkbox.Group>
      </GroupWrap>
    </MainWrapItem>
  )
}

const PermissionManagement = () => {
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
  const [isSpinning, setIsSpinning] = useState(false)
  const dispatch = useDispatch()
  const { isRefresh } = useSelector(store => store.user)
  const { menuPermission } = useSelector(store => store.user)
  const getPermission = async (id: number) => {
    setIsSpinning(true)
    const result = await getRolePermission({ roleId: id })
    setIsSpinning(false)
    let keys: any[] = []
    result.list.forEach((i: any) => {
      const a = i.children.filter((j: any) => j.checked)
      keys = [...keys, ...a.map((k: any) => k.value)]
    })
    const filterArr = result.list.map((el: any) => ({
      ...el,
      children: el.children.filter(
        (item: any) => item.isShow !== 2 || item.groupName === '日志管理',
      ),
    }))
    setPermission(filterArr)
    setSelectKeys(keys)
    dispatch(setIsRefresh(false))
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
      getMessage({ msg: t('setting.pleasePermission'), type: 'warning' })
      return
    }
    try {
      await setRolePermission({
        roleId: activeDetail.id,
        permissionIds: selectKeys,
      })
      getRolePermission({ roleId: activeDetail.id })
      getMessage({ msg: t('common.saveSuccess'), type: 'success' })
      //
    } catch (error) {
      //
    }
  }

  const onSaveGroup = async () => {
    if (!String(addValue).trim()) {
      getMessage({ msg: t('version2.permissionNull'), type: 'warning' })
      setAddValue('')
      return
    }
    let result
    try {
      if (operationDetail.id) {
        await updateRole({ name: addValue, id: operationDetail.id })
        getMessage({ msg: t('common.editSuccess'), type: 'success' })
      } else {
        result = await addRole({ name: addValue })
        getMessage({ msg: t('common.createSuccess'), type: 'success' })
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
      getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
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
  const bIn = useRef<any>(null)
  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        bIn.current.focus()
      }, 200)
    }
  }, [isVisible])

  return (
    <PermissionWrap
      auth="/AdminManagement/PermissionManagement"
      permission={menuPermission?.menus
        ?.filter((k: any) => k.url === '/AdminManagement')?.[0]
        ?.children?.map((i: any) => i.url)}
    >
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
          width={528}
          onClose={onClose}
          hasFooter={
            <ModalFooter size={16} style={{ padding: '0 16px 24px 0' }}>
              <CommonButton type="light" onClick={onClose}>
                {t('common.cancel')}
              </CommonButton>
              <CommonButton
                isDisable={!addValue}
                onClick={onSaveGroup}
                type="primary"
              >
                {t('common.confirm2')}
              </CommonButton>
            </ModalFooter>
          }
        >
          <div style={{ margin: '0 16px 24px 24px' }}>
            <Input
              ref={bIn}
              autoComplete="off"
              value={addValue}
              onChange={e => setAddValue(e.target.value)}
              placeholder={t('setting.pleaseEnterName')}
            />
          </div>
        </CommonModal>
        <Header>
          <span style={{ fontFamily: 'SiYuanMedium' }}>
            {t('setting.permissionManagement')}
          </span>
          {activeDetail.type !== 1 && (
            <CommonButton
              style={{ width: 'fit-content' }}
              type="primary"
              onClick={onSavePermission}
            >
              {t('common.save')}
            </CommonButton>
          )}
        </Header>
        <Content>
          <Spin indicator={<NewLoadingTransition />} spinning={isSpinning}>
            <SetMain>
              <SetLeft>
                <RowBox>
                  <Title style={{ marginBottom: 0 }}>
                    {t('sprintProject.role')}
                  </Title>
                  <Tooltip placement="top" title={t('adding_a_user_group')}>
                    <CloseWrap width={24} height={24}>
                      <IconFont
                        style={{ fontSize: 18 }}
                        type="plus"
                        onClick={() => setIsVisible(true)}
                      />
                    </CloseWrap>
                  </Tooltip>
                </RowBox>
                <MenuItems>
                  <MenuItemsTitle>
                    {t('sprintProject.systemGrouping')}
                  </MenuItemsTitle>
                  {dataList
                    ?.filter((item: { type: number }) => item.type === 1)
                    .map((item: any) => (
                      <MenuItem
                        key={item.id}
                        onClick={() => onChangeTabs(item)}
                        isActive={item.id === activeDetail.id}
                      >
                        <div className="name">{item.name}</div>
                        {/* <span className="subName">
                          {item.type === 1
                            ? t('setting.systemGroup')
                            : t('setting.customGroup')}
                        </span> */}
                        <MoreDropdown
                          isHidden={item.type === 1}
                          isMoreVisible={isMoreVisible}
                          onChangeVisible={setIsMoreVisible}
                          menu={menu(item)}
                        />
                      </MenuItem>
                    ))}
                </MenuItems>

                <MenuItems>
                  <MenuItemsTitle>
                    {t('sprintProject.customRole')}
                  </MenuItemsTitle>
                  {dataList
                    ?.filter((item: { type: number }) => item.type === 2)
                    .map((item: any) => (
                      <MenuItem
                        key={item.id}
                        onClick={() => onChangeTabs(item)}
                        isActive={item.id === activeDetail.id}
                      >
                        <div className="name">{item.name}</div>
                        {/* <span className="subName">
                          {item.type === 1
                            ? t('setting.systemGroup')
                            : t('setting.customGroup')}
                        </span> */}
                        <MoreDropdown
                          isHidden={item.type === 1}
                          isMoreVisible={isMoreVisible}
                          onChangeVisible={setIsMoreVisible}
                          menu={menu(item)}
                        />
                      </MenuItem>
                    ))}
                </MenuItems>
              </SetLeft>
              <SetRight>
                <Title style={{ paddingLeft: 0 }}>{activeDetail.name}</Title>
                <TitleGroup>
                  <CheckboxWrap>{t('setting.all')}</CheckboxWrap>
                  <OperationWrap>{t('setting.operationObject')}</OperationWrap>
                  <span>{t('common.permission')}</span>
                </TitleGroup>
                <MainWrap>
                  {permission?.map((i: any) => (
                    <PermissionItem
                      key={i.id}
                      item={i}
                      onChange={setSelectKeys}
                      value={selectKeys}
                      activeDetail={activeDetail}
                    />
                  ))}
                </MainWrap>
              </SetRight>
            </SetMain>
          </Spin>
        </Content>
      </div>
    </PermissionWrap>
  )
}

export default PermissionManagement
