/* eslint-disable react/no-unstable-nested-components */
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import { Menu } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fromPairs, flattenDeep } from 'lodash'
import { t } from 'i18next'

const AdminSideWrap = styled.div`
  /* background-color: var(--neutral-n6-d1); */
  height: 100%;
`

const HeaderWrap = styled.div`
  margin: 0 16px;
  height: 72px;
  font-size: 12px;
  font-weight: 400;
  color: var(--neutral-n1-d1);
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--neutral-n6-d1);
  margin-bottom: 20px;
  img {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    margin: 0 8px;
  }
`
const MenuStyle = styled(Menu)`
  background-color: var(--neutral-n9) !important;
  .ant-menu-item {
    height: 44px !important;
    background-color: var(--neutral-n9);
    color: var(--neutral-n1-d2);
    margin: 0;
    .icon {
      color: var(--neutral-n3);
    }
  }
  .ant-menu-submenu {
    color: var(--neutral-n1-d2);
    .icon {
      color: var(--neutral-n3);
    }
  }
  & .ant-menu-submenu:hover,
  & .ant-menu-item:hover {
    color: var(--primary-d2) !important;
    .icon {
      color: var(--primary-d2) !important;
    }
  }
  & .ant-menu-item-selected {
    background: var(--gradient-left);
    border: none;
    border-right: 0;
    color: var(--primary-d2);
    .icon {
      color: var(--primary-d2) !important;
    }
  }
  & .ant-menu-item-selected::after,
  & .ant-menu-item::after {
    border: none !important;
    border-right: 0 !important;
  }
  &.ant-menu-inline.ant-menu-root .ant-menu-item > .ant-menu-title-content,
  .ant-menu-submenu-title .anticon + span {
    margin-left: 12px;
  }
  &.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
    background: var(--gradient-left);
  }
  &.ant-menu-inline.ant-menu-root
    .ant-menu-sub
    .ant-menu-item
    > .ant-menu-title-content {
    margin-left: 4px;
  }
  .ant-menu-vertical .ant-menu-item:not(:last-child),
  .ant-menu-vertical-left .ant-menu-item:not(:last-child),
  .ant-menu-vertical-right .ant-menu-item:not(:last-child),
  .ant-menu-inline .ant-menu-item:not(:last-child) {
    margin-bottom: 0;
  }
`
const IconFontStyle = styled(IconFont)`
  font-size: 18px !important;
`
const UserName = styled.span`
  display: inline-block;
  width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`
const AdminSide = () => {
  const navigate = useNavigate()
  const { currentMenu, userInfo } = useSelector(store => store.user)
  const [defaultKey, setDefaultKey] = useState<any>()
  const currentMenuMap = fromPairs(
    (currentMenu?.children || [])?.map((i: any) => [i.url, i]),
  )

  const side: any = [
    {
      label: t('corporate_information'),
      key: '/AdminManagement/CompanyInfo',
      icon: <IconFontStyle className="icon" type="file-text" />,
      path: '/AdminManagement/CompanyInfo',
    },
    {
      label: t('organizational_information'),
      key: '3',
      icon: <IconFontStyle className="icon" type="apartment" />,
      children: [
        {
          label: t('staff_management'),
          key: '/AdminManagement/StaffManagement',
          path: '/AdminManagement/StaffManagement',
        },
        {
          label: t('team_management'),
          key: '/AdminManagement/TeamManagement',
          path: '/AdminManagement/TeamManagement',
        },
      ],
    },
    {
      label: t('authority_management'),
      key: '/AdminManagement/PermissionManagement',
      icon: <IconFontStyle className="icon" type="lock" />,
      path: '/AdminManagement/PermissionManagement',
    },
    {
      label: t('safety_management'),
      key: '4',
      icon: <IconFontStyle className="icon" type="safety-certificate" />,
      children: [
        {
          label: t('secure_watermark'),
          key: '/AdminManagement/WaterMarkManagement',
          path: '/AdminManagement/WaterMarkManagement',
        },
        {
          label: t('operation_log'),
          key: '/AdminManagement/OperationManagement',
          path: '/AdminManagement/OperationManagement',
        },
        {
          label: t('log_in_log'),
          key: '/AdminManagement/LoginManagement',
          path: '/AdminManagement/LoginManagement',
        },
      ],
    },
    {
      label: t('system_notification'),
      key: '5',
      icon: <IconFontStyle className="icon" type="bell" />,
      children: [
        {
          label: t('notification_management'),
          key: '/AdminManagement/NoteManagement',
          path: '/AdminManagement/NoteManagement',
        },
      ],
    },
  ]

  const onFilter = (list: any[]) => {
    return list.filter(i => (i.path ? currentMenuMap[i.path] : true))
  }

  const sideList = onFilter(side).map(item => {
    return {
      ...item,
      // children: item.children ? onFilter(item.children) : null,
    }
  })

  const allSide = flattenDeep(
    sideList.map(i => [i, i.children ? i.children : []]),
  )

  const onMenuClick = (e: any) => {
    const pathObject = allSide.filter((i: any) => i.key === e.key)[0]
    pathObject.path && navigate(pathObject.path)
  }

  // 根据导航匹配父级key
  const getDefaultKey = (data: any, parentKeys: any) => {
    for (const i in data) {
      if (data[i]?.path === location.pathname) {
        setDefaultKey([parentKeys?.key])
      }
      if (data[i].children) {
        getDefaultKey(data[i].children, data[i])
      }
    }
  }

  useEffect(() => {
    getDefaultKey(side, null)
  }, [])

  return (
    <AdminSideWrap>
      <HeaderWrap>
        <img src={userInfo.company_logo} />
        <UserName>{userInfo.company_name}</UserName>
      </HeaderWrap>
      <MenuStyle
        expandIcon={e =>
          e.isOpen ? (
            <IconFontStyle className="icon" type="up" />
          ) : (
            <IconFontStyle className="icon" type="down" />
          )
        }
        defaultSelectedKeys={[location.pathname]}
        openKeys={defaultKey}
        onOpenChange={e => setDefaultKey(e)}
        mode="inline"
        items={sideList?.filter(
          (i: any) => !(['3', '4'].includes(i.key) && !i.children?.length),
        )}
        onSelect={onMenuClick}
      />
    </AdminSideWrap>
  )
}

export default AdminSide
