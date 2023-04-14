/* eslint-disable camelcase */
// 项目设置

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import { AsyncButton as Button } from '@staryuntech/ant-pro'
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
import {
  editSaveConfig,
  getConfig,
  getSysConfig,
} from '@/services/SiteNotifications'

const Warp = styled.div({
  height: 'calc(100vh - 123px)',
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
  display: 'flex',
  flexDirection: 'column',
  padding: '0 16px',
  height: 'calc(100% - 28px)',
  overflow: 'scroll',
})

const MenuItem = styled.div<{ isActive: boolean }>(
  {
    display: 'flex',
    flexDirection: 'column',
    height: 52,
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
  marginTop: 14,
  color: 'var(--neutral-n4)',
  fontSize: 12,
})

export const MainWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})

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
export const OperationWrap = styled.div({ width: 100 })
export const OperationWrap2 = styled.div({ width: 100, flexShrink: 0 })

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
      <OperationWrap2>{props.item.name}</OperationWrap2>
      <OperationWrap2>
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
      </OperationWrap2>
      <OperationWrap2>
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
      </OperationWrap2>

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
  const [dataList, setDataList] = useState<any>([
    {
      id: 108,
      name: '需求',
      type: 1,
      label: '管理员',
      types: 'demand',
    },
    {
      id: 109,
      name: '迭代',
      type: 2,
      label: '编辑者',
      types: 'iteration',
    },
    {
      id: 110,
      name: '项目',
      type: 3,
      label: '参与者',
      types: 'project',
    },
  ])
  const [permissionList, setPermissionList] = useState<any>([])
  const [selectKeys, setSelectKeys] = useState<CheckboxValueType[]>([])
  const [activeDetail, setActiveDetail] = useState<any>({
    id: 108,
    name: '需求',
    type: 1,
    label: '管理员',
    types: 'demand',
  })

  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const [isSpinning, setIsSpinning] = useState(false)
  const { isRefresh } = useSelector(store => store.user)
  const { projectInfo } = useSelector(store => store.project)
  asyncSetTtile(`${t('title.a7')}【${projectInfo.name}】`)
  const getPermissionList = async (id: number) => {
    setIsSpinning(true)
    const result = await getPermission({ projectId, roleId: id })

    // setPermissionList(result)
    console.log(result)

    setIsSpinning(false)
    let keys: any[] = []
    result.list.forEach((i: any) => {
      const a = i.children.filter((j: any) => j.checked)
      keys = [...keys, ...a.map((k: any) => k.value)]
    })
    setSelectKeys(keys)
  }

  const init2 = async () => {
    const res1 = await getConfig(projectId)
    const res2 = await getSysConfig()
    const index = res2.findIndex((i: any) => {
      return i.type === activeDetail.types
    })
    const index2 = res1.findIndex((i: any) => {
      return i.type === activeDetail.types
    })

    res2[index].list.forEach((i: any) => {
      res1[index2].list.forEach((k: any) => {
        if (i.code === k.code) {
          i.tip_type = k.tip_type
          i.objects = k.objects
        }
      })
    })
    setPermissionList(res2[index].list)
  }
  useEffect(() => {
    init2()
  }, [isRefresh, activeDetail])

  const onSavePermission = async () => {
    const res = await editSaveConfig({
      projectId,
      data: permissionList,
      type: activeDetail.type,
    })

    if (res.code === 0) {
      message.success('成功')
    }
  }

  const onChangeTabs = (item: any) => {
    setSelectKeys([])
    setActiveDetail(item)
    getPermissionList(item.id)
  }

  const onChange = (ty: any, less: any, ins: any, check: any) => {
    const newA: any = JSON.parse(JSON.stringify(permissionList))
    console.log(ty, less, ins, check)
    let c: any = ''
    if (check === 1) {
      c = 2
    } else if (check === 2) {
      c = 1
    }

    const index = newA.findIndex((i: any) => i.code === ty)
    const index2 = newA[index].objects.findIndex((i: any) => i.name === ins)
    const index3 = newA[index].tip_type.findIndex((i: any) => i.name === ins)

    if (less === 'ob') {
      newA[index].objects[index2].is_check = c
    }
    if (less === 'msg') {
      newA[index].tip_type[index3].is_check = c
    }
    setPermissionList(newA)
  }
  return (
    <PermissionWrap
      auth="b/project/role"
      permission={projectInfo?.projectPermissions?.map((i: any) => i.identity)}
    >
      <div style={{ height: '100%', position: 'relative' }}>
        <div
          style={{
            zIndex: 11,
            position: 'absolute',
            right: '24px',
            top: '-60px',
          }}
        >
          <CommonButton
            style={{ width: 'fit-content', marginTop: 16 }}
            type="primary"
            onClick={onSavePermission}
          >
            {t('common.save')}
          </CommonButton>
        </div>
        <Warp>
          <Spin indicator={<NewLoadingTransition />} spinning={isSpinning}>
            <SetMain>
              <SetLeft>
                <MenuItems>
                  {dataList?.map((item: any) => (
                    <MenuItem
                      key={item.id}
                      onClick={() => onChangeTabs(item)}
                      isActive={item.id === activeDetail.id}
                    >
                      <div className="name">{item.name}</div>
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
                  <span
                    style={{
                      width: '168px',
                    }}
                  >
                    事件
                  </span>
                  <span
                    style={{
                      width: '120px',
                    }}
                  >
                    邮箱通知
                  </span>
                  <span
                    style={{
                      width: '120px',
                    }}
                  >
                    站内通知
                  </span>
                  <span
                    style={{
                      width: '504px',
                    }}
                  >
                    通知对象
                  </span>
                </TitleGroup>
                <MainWrap>
                  {permissionList?.map((i: any) => {
                    return (
                      <MainWrapItem key={i.code}>
                        <span
                          style={{
                            width: '168px',
                          }}
                        >
                          {i.note}
                        </span>
                        <span>
                          {i.tip_type.map((k: any) => (
                            <span
                              style={{
                                display: 'inline-block',
                                width: '120px',
                              }}
                              key={k.name}
                            >
                              <Checkbox
                                onChange={() =>
                                  onChange(i.code, 'msg', k.name, k.is_check)
                                }
                                checked={k.is_check === 1}
                              >
                                {k.name}
                              </Checkbox>
                            </span>
                          ))}
                        </span>
                        <span
                          style={{
                            width: '504px',
                          }}
                        >
                          {i.objects.map((k: any) => (
                            <span
                              style={{
                                display: 'inline-block',
                                width: '120px',
                              }}
                              key={k.name}
                            >
                              <Checkbox
                                onChange={() =>
                                  onChange(i.code, 'ob', k.name, k.is_check)
                                }
                                checked={k.is_check === 1}
                              >
                                {k.name}
                              </Checkbox>
                            </span>
                          ))}
                        </span>
                      </MainWrapItem>
                    )
                  })}
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
