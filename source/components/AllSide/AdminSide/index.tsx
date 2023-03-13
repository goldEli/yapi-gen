/* eslint-disable react/no-unstable-nested-components */
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import { Menu } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fromPairs, flattenDeep } from 'lodash'

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
  .ant-menu-submenu-open .ant-menu-submenu-title {
    color: var(--primary-d2) !important;
    .icon {
      color: var(--primary-d2);
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
`
const IconFontStyle = styled(IconFont)`
  font-size: 18px !important;
`
const AdminSide = () => {
  const navigate = useNavigate()
  const { currentMenu, userInfo } = useSelector(store => store.user)

  const currentMenuMap = fromPairs(
    (currentMenu?.children || [])?.map((i: any) => [i.url, i]),
  )
  const onFilter = (list: any[]) => {
    return list.filter(i => (i.path ? currentMenuMap[i.path] : true))
  }
  const side: any = [
    {
      label: '公司信息',
      key: '/AdminManagement/CompanyInfo',
      icon: <IconFontStyle className="icon" type="file-text" />,
      path: '/AdminManagement/CompanyInfo',
    },
    {
      label: '组织信息',
      key: '3',
      icon: <IconFontStyle className="icon" type="apartment" />,
      children: [
        {
          label: '员工管理',
          key: '/AdminManagement/StaffManagement',
          path: '/AdminManagement/StaffManagement',
        },
        {
          label: '团队管理',
          key: '/AdminManagement/TeamManagement',
          path: '/AdminManagement/TeamManagement',
        },
      ],
    },
    {
      label: '权限管理',
      key: '/AdminManagement/PermissionManagement',
      icon: <IconFontStyle className="icon" type="lock" />,
      path: '/AdminManagement/PermissionManagement',
    },
    {
      label: '安全管理',
      key: '4',
      icon: <IconFontStyle className="icon" type="safety-certificate" />,
      children: [
        {
          label: '安全水印',
          key: '/AdminManagement/WaterMarkManagement',
          path: '/AdminManagement/WaterMarkManagement',
        },
        {
          label: '操作日志',
          key: '/AdminManagement/OperationManagement',
          path: '/AdminManagement/OperationManagement',
        },
        {
          label: '登录日志',
          key: '/AdminManagement/LoginManagement',
          path: '/AdminManagement/LoginManagement',
        },
      ],
    },
  ]
  const sideList = onFilter(side).map(item => {
    return {
      ...item,
      children: item.children ? onFilter(item.children) : null,
    }
  })

  const allSide = flattenDeep(
    sideList.map(i => [i, i.children ? i.children : []]),
  )

  const onMenuClick = (e: any) => {
    const pathObject = allSide.filter((i: any) => i.key === e.key)[0]
    pathObject.path && navigate(pathObject.path)
  }
  return (
    <AdminSideWrap>
      <HeaderWrap>
        <img src={userInfo.company_logo} />
        <span>{userInfo.company_name}</span>
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
        defaultOpenKeys={[
          location.pathname === '/AdminManagement/WaterMarkManagement'
            ? '4'
            : '3',
        ]}
        mode="inline"
        items={sideList}
        onSelect={onMenuClick}
      />
    </AdminSideWrap>
  )
}

export default AdminSide
