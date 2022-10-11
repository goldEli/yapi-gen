/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import {
  Checkbox,
  Space,
  Modal,
  Input,
  Menu,
  Dropdown,
  message,
  Spin,
} from 'antd'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { useEffect, useState } from 'react'
import { type CheckboxValueType } from 'antd/lib/checkbox/Group'
import { useModel } from '@/models'
import { type CheckboxChangeEvent } from 'antd/lib/checkbox'
import { useSearchParams } from 'react-router-dom'
import DeleteConfirm from '@/components/DeleteConfirm'
import PermissionWrap from '@/components/PermissionWrap'
import { getParamsData } from '@/tools'
import { useTranslation } from 'react-i18next'

const Warp = styled.div({
  padding: 16,
  height: '100%',
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
const GroupWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  width: 'calc(100% - 200px)',
})

interface ItemProps {
  item: any
  onChange?(value: CheckboxValueType[]): void
  value?: CheckboxValueType[]
  activeDetail?: any
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
        <Checkbox.Group
          options={props.item.children}
          style={{ marginRight: 8 }}
          value={keys}
          onChange={onChange}
          disabled={props.activeDetail?.type === 1}
        />
      </GroupWrap>
    </MainWrapItem>
  )
}

const ProjectSet = () => {
  const [t] = useTranslation()
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
    projectInfo,
    getProjectInfo,
  } = useModel('project')
  const [isSpinning, setIsSpinning] = useState(false)
  const { isRefresh, setIsRefresh } = useModel('user')

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
    setIsRefresh(false)
  }

  useEffect(() => {
    init(true)
  }, [])

  useEffect(() => {
    if (isRefresh) {
      init(true)
    }
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
      getProjectInfo({ projectId })
    } catch (error) {

      //
    }
  }

  const onSaveGroup = async () => {
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
        <Modal
          footer={false}
          visible={isVisible}
          title={false}
          closable={false}
          bodyStyle={{ padding: '16px 24px' }}
          width={420}
          maskClosable={false}
          destroyOnClose
          keyboard={false}
        >
          <ModalHeader>
            <span>
              {operationDetail.id
                ? t('setting.editPermission')
                : t('setting.createPermission')}
            </span>
            <IconFont
              onClick={onClose}
              style={{ cursor: 'pointer' }}
              type="close"
            />
          </ModalHeader>
          <div style={{ margin: '24px 0' }}>
            <Input
              autoComplete="off"
              maxLength={10}
              value={addValue}
              onChange={e => setAddValue(e.target.value)}
              placeholder={t('setting.pleaseEnterName')}
            />
          </div>
          <ModalFooter size={16}>
            <Button onClick={onClose}>{t('common.cancel')}</Button>
            <Button disabled={!addValue} onClick={onSaveGroup} type="primary">
              {t('common.confirm2')}
            </Button>
          </ModalFooter>
        </Modal>
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
                      <Dropdown
                        key={isMoreVisible.toString()}
                        visible={isMoreVisible}
                        overlay={() => menu(item)}
                        placement="bottomRight"
                        trigger={['hover']}
                        getPopupContainer={node => node}
                        onVisibleChange={visible => setIsMoreVisible(visible)}
                      >
                        <IconWrap
                          type="more"
                          hidden={item.type === 1}
                          style={{ color: '#2877ff', fontSize: 16 }}
                        />
                      </Dropdown>
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
