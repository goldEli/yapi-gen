// 项目设置

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import { Checkbox, Space, Input, Menu, message, Spin } from 'antd'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { useEffect, useRef, useState } from 'react'
import { type CheckboxValueType } from 'antd/lib/checkbox/Group'
import { useModel } from '@/models'
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

const Warp = styled.div({
  padding: 16,
  height: '100%',
})

const SetMain = styled.div({
  padding: '24px 0',
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
  fontWeight: 'bold',
  color: 'black',
  paddingLeft: 10,
  borderLeft: '3px solid #2877FF',
  marginBottom: 16,
  lineHeight: '18px',
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
    background: isActive ? '#F0F4FA!important' : 'transparent',
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
  const {
    getProjectPermission,
    getPermission,
    setPermission,
    addPermission,
    updatePermission,
    deletePermission,
  } = useModel('project')
  const [isSpinning, setIsSpinning] = useState(false)
  const dispatch = useDispatch()
  const { isRefresh } = useSelector((store: { user: any }) => store.user)
  const { projectInfo } = useSelector(
    (store: { project: any }) => store.project,
  )
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
      message.warning(t('setting.pleasePermission'))
      return
    }
    try {
      await setPermission({
        roleId: activeDetail.id,
        permissionIds: selectKeys,
        projectId,
      })
      getPermissionList(activeDetail.id)
      message.success(t('common.saveSuccess'))
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
        await updatePermission({
          name: addValue,
          id: operationDetail.id,
          projectId,
        })
        setOperationDetail({})
        message.success(t('common.editSuccess'))
      } else {
        result = await addPermission({ name: addValue, projectId })
        message.success(t('common.createSuccess'))
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
      message.success(t('common.deleteSuccess'))
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

  return (
    <PermissionWrap
      auth="b/project/role"
      permission={projectInfo?.projectPermissions}
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
          width={420}
          onClose={onClose}
          isShowFooter
        >
          <div style={{ margin: ' 0 20px 24px 0' }}>
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
          <ModalFooter size={16} style={{ padding: '0 20px 24px 0' }}>
            <Button onClick={onClose}>{t('common.cancel')}</Button>
            <Button disabled={!addValue} onClick={onSaveGroup} type="primary">
              {t('common.confirm2')}
            </Button>
          </ModalFooter>
        </CommonModal>
        <Warp>
          <Spin spinning={isSpinning}>
            <SetMain>
              <SetLeft>
                <Title style={{ marginLeft: 24 }}>
                  {t('setting.userGroup')}
                </Title>
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
                  onClick={() => {
                    setIsVisible(true)
                    setTimeout(() => {
                      inputRefDom.current?.focus()
                    }, 100)
                  }}
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
        </Warp>
      </div>
    </PermissionWrap>
  )
}

export default ProjectSet
