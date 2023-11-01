// 项目设置

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import { Checkbox, Space, Input, Menu, message, Spin } from 'antd'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { useEffect, useRef, useState } from 'react'
import { type CheckboxValueType } from 'antd/lib/checkbox/Group'
import { type CheckboxChangeEvent } from 'antd/lib/checkbox'
import { useSearchParams } from 'react-router-dom'
import DeleteConfirm from '@/components/DeleteConfirm'
import PermissionWrap from '@/components/PermissionWrap'
import { getParamsData } from '@/tools'
import { useTranslation } from 'react-i18next'
import CommonModal from '@/components/CommonModal'
import MoreDropdown from '@/components/MoreDropdown'
import useSetTitle from '@/hooks/useSetTitle'
import { useDispatch, useSelector } from '@store/index'
import { setIsRefresh } from '@store/user'
import {
  addPermission,
  deletePermission,
  getPermission,
  getProjectPermission,
  setPermission,
  updatePermission,
} from '@/services/project'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import CommonButton from '@/components/CommonButton'
import { CloseWrap } from '@/components/StyleCommon'
import { getMessage } from '@/components/Message'

const Warp = styled.div({
  height: '100%',
})

const SetMain = styled.div({
  paddingBottom: '0px',
  background: 'white',
  borderRadius: 6,
  minHeight: '100%',
  width: '100%',
  display: 'flex',
})

const SetLeft = styled.div({
  display: 'flex',
  flexDirection: 'column',
  borderRight: '1px solid var(--neutral-n6-d1)',
  width: 232,
  paddingRight: 4,
})
const RightHeader = styled.div`
  display: flex;
`
const SetRight = styled.div({
  display: 'flex',
  flexDirection: 'column',
  marginLeft: 24,
  width: 'calc(100% - 184px)',
})
const IconFontStyle = styled(IconFont)({
  color: 'var(--neutral-n2)',
  fontSize: '18px',
  borderRadius: '6px',
  padding: '5px',
  '&: hover': {
    background: 'var(--hover-d1)',
    cursor: 'pointer',
  },
})
const Title = styled.div({
  fontSize: 14,
  fontFamily: 'SiYuanMedium',
  color: 'var(--neutral-n1-d1)',
  marginBottom: 20,
  lineHeight: '18px',
  display: 'flex',
  alignItems: 'center',
  padding: '0 16px',
  justifyContent: 'space-between',
})
const BtnHeader = styled.div`
  position: absolute;
  right: 24px;
  top: -59px;
`
const MenuItems = styled.div({
  padding: '0 16px',
  maxHeight: 'calc(100vh - 184px)',
  overflowY: 'auto',
})

const MenuItem = styled.div<{ isActive: boolean }>(
  {
    display: 'flex',
    flexDirection: 'column',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxSizing: 'border-box',
    position: 'relative',
    margin: 0,
    '.dropdownIcon': {
      position: 'absolute',
      right: 0,
    },
    '.name': {
      width: '100%',
      textAlign: 'left',
      paddingLeft: '24px',
      fontSize: 14,
      color: 'var(--neutral-n1-d2)',
      fontWeight: 400,
    },
    '.subName': {
      paddingLeft: '24px',
      width: '100%',
      textAlign: 'left',
      fontSize: 12,
      color: 'var(--neutral-n3)',
      fontWeight: 400,
    },
    '&:hover': {
      background:
        'linear-gradient(90deg, #EBEFFF 0%, rgba(243,246,255,0) 100%)',
      '.dropdownIcon': {
        visibility: 'visible',
      },
    },
  },
  ({ isActive }) => ({
    background: isActive
      ? 'linear-gradient(90deg, #EBEFFF 0%, rgba(243,246,255,0) 100%)'
      : 'transparent',
    '.name': {
      color: isActive ? 'var(--primary-d2)' : 'var(--neutral-n1-d1)',
    },
  }),
)

export const TitleGroup = styled.div({
  display: 'flex',
  alignItems: 'center',
  color: 'var(--neutral-n2)',
  fontSize: 12,
  fontFamily: 'SiYuanMedium',
})

export const MainWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})
const MenuItemsTitle = styled.div`
  height: 44px;
  line-height: 44px;
  padding: 0px 16px;
  color: var(--neutral-n3);
  font-size: var(--font12);
  margin-bottom: 8px;
`
const MainWrapItem = styled.div({
  borderBottom: '1px solid var(--neutral-n6-d1)',
  padding: '24px 0',
  display: 'flex',

  '.ant-checkbox-wrapper': {
    margin: '0 !important',
  },
})

const ModalHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: 16,
  color: 'var(--neutral-n1-d2)',
})

const ModalFooter = styled(Space)({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
})

export const CheckboxWrap = styled.div({ width: 100 })

export const OperationWrap = styled.div({
  minWidth: 100,
  whiteSpace: 'nowrap',
  width: 'fit-content',
})

export const GroupWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  width: 'calc(100% - 200px)',
  '.ant-checkbox-group-item': {
    margin: '6px 24px 6px 0',
  },
})

interface ItemProps {
  item: any
  onChange?(value: CheckboxValueType[]): void
  value?: CheckboxValueType[]
  activeDetail?: any
}

export const PermissionItem = (props: ItemProps) => {
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
                <span
                  style={{
                    minWidth: '150px',
                    width: 'fit-content',
                    display: 'inline-block',
                    marginBottom: '10px',
                    whiteSpace: 'nowrap',
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

const ProjectSet = () => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  const inputRefDom = useRef<HTMLInputElement>(null)
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
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const [isSpinning, setIsSpinning] = useState(false)
  const dispatch = useDispatch()
  const { isRefresh } = useSelector(store => store.user)
  const { projectInfo } = useSelector(store => store.project)
  asyncSetTtile(`${t('title.a7')}【${projectInfo.name}】`)
  const getPermissionList = async (id: number) => {
    setIsSpinning(true)
    const result = await getPermission({ projectId, roleId: id })

    setPermissionList(result)
    setIsSpinning(false)
    let keys: any[] = []
    result.list.forEach((i: any) => {
      const a = i.children.filter((j: any) => j.checked)
      keys = [...keys, ...a.map((k: any) => k.value)]
    })
    setSelectKeys(keys)
  }

  const init = async (isInit?: boolean, str?: string) => {
    setIsSpinning(true)
    const result = await getProjectPermission({ projectId })
    setDataList(result.list)
    if (isInit) {
      setActiveDetail(result.list[0])
      getPermissionList(result.list[0].id)
    } else {
      setIsSpinning(false)
    }
    if (str) {
      setActiveDetail(result?.list?.filter((i: any) => i.id === str)[0])
      getPermissionList(result?.list?.filter((i: any) => i.id === str)[0])
    }
    dispatch(setIsRefresh(false))
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
      await setPermission({
        roleId: activeDetail.id,
        permissionIds: selectKeys,
        projectId,
      })
      getPermissionList(activeDetail.id)
      getMessage({ msg: t('common.saveSuccess') as string, type: 'success' })
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
        await updatePermission({
          name: addValue,
          id: operationDetail.id,
          projectId,
        })
        setOperationDetail({})
        getMessage({ msg: t('common.editSuccess') as string, type: 'success' })
      } else {
        result = await addPermission({ name: addValue, projectId })
        getMessage({
          msg: t('common.createSuccess') as string,
          type: 'success',
        })
      }
      setIsVisible(false)
      init(false, result?.data?.id)
      setAddValue('')
    } catch (error) {
      //
    }
  }

  const onClickMenu = (e: any, type: string, item: any) => {
    setIsMoreVisible(false)
    e.stopPropagation()
    setOperationDetail(item)
    if (type === 'edit') {
      setIsVisible(true)
      setAddValue(item.name)
      setTimeout(() => {
        inputRefDom.current?.focus()
      }, 100)
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
    getPermissionList(item.id)
  }

  const onDeleteConfirm = async () => {
    try {
      await deletePermission({ id: operationDetail.id, projectId })
      setIsDelete(false)
      setOperationDetail({})
      getMessage({ msg: t('common.deleteSuccess') as string, type: 'success' })
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

  // 判断是否详情回来，并且权限是不是有
  const isLength =
    projectInfo?.id && projectInfo?.projectPermissions?.length <= 0

  return (
    <PermissionWrap
      auth="b/project/role"
      permission={
        isLength
          ? ['0']
          : projectInfo?.projectPermissions?.map((i: any) => i.identity)
      }
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
          isShowFooter={false}
          hasFooter={
            <ModalFooter size={16} style={{ padding: '0 20px 24px 0' }}>
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
          <div style={{ margin: ' 0 20px 24px 24px' }}>
            <Input
              ref={inputRefDom as any}
              autoFocus
              autoComplete="off"
              maxLength={10}
              value={addValue}
              onChange={e => setAddValue(e.target.value)}
              placeholder={t('setting.pleaseEnterName')}
            />
          </div>
        </CommonModal>
        <Warp>
          <Spin indicator={<NewLoadingTransition />} spinning={isSpinning}>
            <SetMain>
              <SetLeft>
                <Title>
                  {t('sprintProject.role')}
                  <CloseWrap width={24} height={24}>
                    <IconFont
                      style={{ fontSize: 18 }}
                      type="plus"
                      onClick={() => {
                        setIsVisible(true)
                        setTimeout(() => {
                          inputRefDom.current?.focus()
                        }, 100)
                      }}
                    />
                  </CloseWrap>
                </Title>
                {/* <MenuItems>
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
                </MenuItems> */}
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
                          hasChild
                        />
                      </MenuItem>
                    ))}
                </MenuItems>
              </SetLeft>
              <SetRight>
                <RightHeader>
                  <Title style={{ padding: '0' }}>{activeDetail.name}</Title>
                  <BtnHeader>
                    <CommonButton
                      hidden={activeDetail?.type === 1}
                      style={{ width: 'fit-content', marginTop: 16 }}
                      type="primary"
                      onClick={onSavePermission}
                    >
                      {t('common.save')}
                    </CommonButton>
                  </BtnHeader>
                </RightHeader>
                <TitleGroup>
                  <CheckboxWrap>{t('setting.all')}</CheckboxWrap>
                  <OperationWrap>{t('setting.operationObject')}</OperationWrap>
                  <span>{t('common.permission')}</span>
                </TitleGroup>
                <MainWrap>
                  {permissionList.list?.map((i: any) => (
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
        </Warp>
      </div>
    </PermissionWrap>
  )
}

export default ProjectSet
