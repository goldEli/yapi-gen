// 项目右侧抽屉弹窗

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/naming-convention */
import { Drawer, Dropdown, Input, Menu, message, Popover } from 'antd'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import AddMember from './AddMember'
import { useEffect, useState } from 'react'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import { useModel } from '@/models'
import { useTranslation } from 'react-i18next'
import { getIsPermission } from '@/tools'
import NoData from '@/components/NoData'
import { MoreWrap } from '../Detail/Demand/DemandMain/components/Operation'

interface Props {
  visible: boolean
  onChangeVisible(): void
  projectId: any
}

const DrawerWrap = styled(Drawer)({
  '.ant-drawer-title': {
    width: '100%',
  },
  '.ant-drawer-close': {
    margin: 0,
  },
  '.ant-drawer-header': {
    borderBottom: 'none!important',
  },
  '.ant-drawer-header-title': {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
})

const ButtonWrap = styled(Button)({
  width: '100%',
  height: 32,
  marginBottom: 16,
})

const ListWrap = styled.div`
  margin-top: 16;
  & .ant-popover-inner {
    position: relative !important;
    top: -3px !important;
  }
`

const ListItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 56,
  padding: '0 16px',
  '.avatarBox': {
    display: 'flex',
    alignItems: 'center',
    img: {
      width: 32,
      height: 32,
      borderRadius: '50%',
      marginRight: 8,
    },
    div: {
      display: 'flex',
      flexDirection: 'column',
      'span:first-child': {
        color: '#323233',
        fontSize: 14,
      },
      'span:last-child': {
        color: '#BBBDBF',
        fontSize: 12,
      },
    },
  },
  '.job': {
    color: 'black',
    fontSize: 12,
  },
  '&:nth-child(even)': {
    backgroundColor: '#f8f9fa',
  },
})
const MoreWrap2 = styled(MoreWrap)`
  background-color: transparent;
  &:hover {
    .job {
      color: #2877ff;
    }
    .job1 {
      transform: rotate(180deg);
    }
  }
`
const NameWrap = styled.div({
  width: 32,
  height: 32,
  borderRadius: '50%',
  marginRight: 8,
  textAlign: 'center',
  lineHeight: '32px',
  background: '#A4ACF5',
  color: 'white',
})

const HeaderWrap = styled.div({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})
interface DropDownProps {
  row: any
  onClickMenu(item: any, row: any): void
  roleOptions: any
}

const MoreDropdown = (props: DropDownProps) => {
  const [isVisible, setIsVisible] = useState(false)

  const onClickItem = (item: any) => {
    setIsVisible(false)
    props.onClickMenu(item, props.row)
  }

  const menu = () => {
    let menuItems: any = []
    props.roleOptions?.forEach((i: any, idx: any) => {
      menuItems.push({
        key: idx,
        label: <div onClick={() => onClickItem(i)}>{i.label}</div>,
      })
    })
    return <Menu items={menuItems} />
  }

  return (
    <Dropdown
      key={isVisible ? isVisible.toString() : null}
      visible={isVisible}
      overlay={menu}
      trigger={['hover']}
      placement="bottomRight"
      getPopupContainer={node => node}
      onVisibleChange={setIsVisible}
    >
      <MoreWrap2>
        <div
          style={{
            marginRight: '8px',
          }}
          className="job"
        >
          {props.row.roleName}
        </div>
        <span className="job1">
          <IconFont style={{ fontSize: 16 }} type="down" />
        </span>
      </MoreWrap2>
    </Dropdown>
  )
}

const Member = (props: Props) => {
  const [t] = useTranslation()
  const { getProjectMember, isRefreshMember, setIsRefreshMember, projectInfo } =
    useModel('project')
  const { getProjectPermission, updateMember } = useModel('project')
  const [isVisible, setIsVisible] = useState(false)
  const [roleOptions, setRoleOptions] = useState([])
  const [memberList, setMemberList] = useState<any>([])
  const getList = async (val?: string) => {
    const result = await getProjectMember({
      projectId: props.projectId,
      all: true,
      searchValue: val,
    })
    setMemberList(result)
    setIsRefreshMember(false)
  }
  const init = async () => {
    const res = await getProjectPermission({ projectId: props.projectId })

    setRoleOptions(res.list)
  }

  useEffect(() => {
    init()
  }, [])

  const onClickMenu = async (item: any, row: any) => {
    try {
      await updateMember({
        projectId: props.projectId,
        userGroupId: item.id,
        userIds: row.id,
      })
      message.success('修改成功！')
      getList()
    } catch (error) {
      //
    }
  }

  useEffect(() => {
    if (props.visible) {
      getList()
    }
  }, [props.visible])

  useEffect(() => {
    if (isRefreshMember) {
      getList()
    }
  }, [isRefreshMember])

  const onChangeSearch = (e: any) => {
    getList(e.target.value)
  }

  return (
    <>
      <AddMember
        value={isVisible}
        onChangeValue={() => setIsVisible(!isVisible)}
        onChangeUpdate={() => getList()}
      />
      <DrawerWrap
        title={
          <HeaderWrap>
            <span>
              {t('project.projectMemberAll', { count: memberList?.length })}
            </span>
            <IconFont
              onClick={props.onChangeVisible}
              style={{ cursor: 'pointer' }}
              type="close"
            />
          </HeaderWrap>
        }
        headerStyle={{ width: '100%' }}
        closable={false}
        placement="right"
        visible={props.visible}
        bodyStyle={{ padding: 0 }}
        width={320}
      >
        <div
          style={{
            padding: '0 16px',
            background: 'white',
          }}
        >
          {getIsPermission(
            projectInfo?.projectPermissions,
            'b/project/member/save',
          ) ? null : (
            <ButtonWrap
              type="primary"
              onClick={() => setIsVisible(true)}
              icon={
                <IconFont
                  type="plus"
                  style={{ color: 'white', fontSize: 16 }}
                />
              }
            >
              {t('project.addMember1')}
            </ButtonWrap>
          )}

          <Input
            autoComplete="off"
            onPressEnter={onChangeSearch}
            onBlur={onChangeSearch}
            suffix={
              <IconFont
                type="search"
                style={{ color: '#BBBDBF', fontSize: 16 }}
              />
            }
            placeholder={t('project.searchMember')}
            allowClear
          />
        </div>
        {memberList?.length > 0 ? (
          <ListWrap>
            {memberList?.map((i: any) => (
              <ListItem key={i.id}>
                <div className="avatarBox">
                  {i.avatar ? (
                    <img src={i.avatar} alt="" />
                  ) : (
                    <NameWrap>
                      {String(i.name?.trim().slice(0, 1)).toLocaleUpperCase()}
                    </NameWrap>
                  )}
                  <div>
                    <span>
                      {i.name}
                      {i.nickname ? `(${i.nickname})` : ''}
                    </span>
                    <span>{i.positionName}</span>
                  </div>
                </div>
                <MoreDropdown
                  onClickMenu={onClickMenu}
                  roleOptions={roleOptions}
                  row={i}
                />
              </ListItem>
            ))}
          </ListWrap>
        ) : (
          <div style={{ height: 'calc(100% - 134px)' }}>
            <NoData />
          </div>
        )}
      </DrawerWrap>
    </>
  )
}

export default Member
