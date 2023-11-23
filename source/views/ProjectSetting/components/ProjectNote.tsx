/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
// 项目设置

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import { Checkbox, message, Spin } from 'antd'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { type CheckboxValueType } from 'antd/lib/checkbox/Group'
import { useSearchParams } from 'react-router-dom'
import PermissionWrap from '@/components/PermissionWrap'
import { getParamsData } from '@/tools'
import { useTranslation } from 'react-i18next'
import useSetTitle from '@/hooks/useSetTitle'
import { useSelector } from '@store/index'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import CommonButton from '@/components/CommonButton'
import {
  editSaveConfig,
  getConfig,
  getSysConfig,
} from '@/services/SiteNotifications'
import { getMessage } from '@/components/Message'

const Warp = styled.div({
  height: '100%',
  padding: '24px',
})

const SetMain = styled.div({
  paddingBottom: '0px',
  background: 'white',
  borderRadius: 6,
  height: '100%',
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
  height: '100%',
  overflow: 'scroll',
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
  marginTop: 14,
  color: 'var(--neutral-n4)',
  fontSize: 12,
  minWidth: '1400px',
})

export const MainWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  minWidth: '1400px',
})

const MainWrapItem = styled.div({
  borderBottom: '1px solid var(--neutral-n6-d1)',
  padding: '24px 0',
  display: 'flex',

  '.ant-checkbox-wrapper': {
    margin: '0 !important',
  },
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

const ProjectSet = () => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [isMoreVisible, setIsMoreVisible] = useState(false)
  const [dataList, setDataList] = useState<any>()
  const [permissionList, setPermissionList] = useState<any>([])

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

  function formatName(type: any) {
    let name = ''
    switch (type) {
      case 'email':
        name = t('mailbox')

        break
      case 'website':
        name = t('station_premise')

        break
      case 'create':
        name = t('common.createName')

        break
      case 'admin':
        name = t('Administrator')

        break
      case 'leader':
        name = t('project_leader')

        break
      case 'handle':
        name = t('common.dealName')

        break
      case 'bcc':
        name = t('common.copySend')

        break
      case 'bAdd':
        name = t('person_to_be_added')

        break
      case 'bAt':
        name = t('the_person_being')

        break
      case 'bOpt':
        name = t('the_person_being_manipulated')

        break
      case 'mber':
        name = t('project.projectMember')

        break

      default:
        break
    }

    return name
  }

  function forName(code: string) {
    let name = ''
    switch (code) {
      case '1000':
        name = t('Create_requirements')
        break

      case '1001':
        name = t('import_requirement')
        break

      case '1002':
        name = t('export_requirement')
        break

      case '1003':
        name = t('assign_handler')
        break

      case '1004':
        name = t('update_status')
        break

      case '1005':
        name = t('commented_on_requirement')
        break

      case '1006':
        name = t('comment')
        break

      case '1007':
        name = t('delete_requirement')
        break

      case '1008':
        name = t('add_cc')
        break
      case '0001':
        name = t('import_product')
        break
      case '1100':
        name = t('add_requirement_or_defect')
        break
      case '1101':
        name = t('remove_requirement_or_defect')
        break
      case '1102':
        name = t('create_iteration')
        break
      case '1103':
        name = t('edit_iteration')
        break
      case '1104':
        name = t('update_iteration_status')
        break
      case '1105':
        name = t('delete_iteration')
        break
      case '1106':
        name = t('edit_iteration_outcome')
        break
      case '1200':
        name = t('member_change')
        break
      case '1203':
        name = t('edit_project')
        break
      case '1204':
        name = t('delete_project')
        break
      case '1205':
        name = t('update_project_status')
        break

      default:
        break
    }
    return name
  }
  const init2 = async () => {
    setDataList([
      {
        id: 108,
        name: t('demand'),
        type: 1,
        label: '管理员',
        types: 'demand',
      },
      {
        id: 109,
        name: t('iteration'),
        type: 2,
        label: '编辑者',
        types: 'iteration',
      },
      {
        id: 110,
        name: t('title.project'),
        type: 3,
        label: '参与者',
        types: 'project',
      },
    ])
    setIsSpinning(true)
    const res2 = await getSysConfig({ project_type: 1 })
    const index = res2.findIndex((i: any) => {
      return i.type === activeDetail.types
    })

    const res1 = await getConfig(projectId)
    setIsSpinning(false)
    const index2 = res1.findIndex((i: any) => {
      return i.type === activeDetail.types
    })

    res2[index].list.forEach((i: any) => {
      res1[index2].list.forEach((k: any) => {
        if (i.code === k.code) {
          i.tip_type = k.tip_type.map((m: any) => ({
            ...m,
            text: formatName(m.name),
          }))
          i.objects = k.objects.map((m: any) => ({
            ...m,
            text: formatName(m.name),
          }))
        }
      })
    })
    const newArr = res2[index].list.map((i: any) => ({
      ...i,
      note: forName(i.code),
    }))
    setPermissionList(newArr)
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
      getMessage({ msg: t('report.list.success') as string, type: 'success' })
    }
  }

  const onChangeTabs = (item: any) => {
    setActiveDetail(item)
  }

  const onChange = (ty: any, less: any, ins: any, check: any) => {
    const newA: any = JSON.parse(JSON.stringify(permissionList))

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

  // 判断是否详情回来，并且权限是不是有
  const isLength =
    projectInfo?.id && projectInfo?.projectPermissions?.length <= 0

  return (
    <PermissionWrap
      auth="b/project/notification"
      permission={
        isLength
          ? ['0']
          : projectInfo?.projectPermissions?.map((i: any) => i.identity)
      }
    >
      <div style={{ height: '100%', position: 'relative' }}>
        <div
          style={{
            zIndex: 11,
            position: 'absolute',
            right: '48px',
            top: '0px',
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
                </RightHeader>
                <TitleGroup>
                  <span
                    style={{
                      width: '168px',
                    }}
                  >
                    {t('incident')}
                  </span>
                  <span
                    style={{
                      width: '150px',
                    }}
                  >
                    {t('email_notification')}
                  </span>
                  <span
                    style={{
                      width: '150px',
                    }}
                  >
                    {t('insite_notifications')}
                  </span>
                  <span
                    style={{
                      width: '600px',
                    }}
                  >
                    {t('notify_object')}
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
                        <span
                          style={{
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {i.tip_type.map((k: any) => (
                            <span
                              style={{
                                display: 'inline-block',
                                width: '150px',
                                whiteSpace: 'nowrap',
                              }}
                              key={k.name}
                            >
                              <Checkbox
                                onChange={() =>
                                  onChange(i.code, 'msg', k.name, k.is_check)
                                }
                                checked={k.is_check === 1}
                              >
                                {k.text}
                              </Checkbox>
                            </span>
                          ))}
                        </span>

                        {i.objects.map((k: any) => (
                          <span
                            style={{
                              display: 'inline-block',
                              width: '150px',
                              whiteSpace: 'nowrap',
                            }}
                            key={k.name}
                          >
                            <Checkbox
                              onChange={() =>
                                onChange(i.code, 'ob', k.name, k.is_check)
                              }
                              checked={k.is_check === 1}
                            >
                              {k.text}
                            </Checkbox>
                          </span>
                        ))}
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
