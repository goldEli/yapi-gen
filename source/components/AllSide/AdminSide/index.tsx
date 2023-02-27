/* eslint-disable react/no-unstable-nested-components */
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import { Menu } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
    border: 1px solid red;
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
`
const IconFontStyle = styled(IconFont)`
  font-size: 18px !important;
`
const AdminSide = (props: any) => {
  const navigate = useNavigate()
  const { currentMenu, userInfo } = useSelector(store => store.user)
  const [sideList, setSideList] = useState<any>([])

  // side需要做权限，currentMenu.children 里面有的才显示
  const side: any = [
    {
      label: '公司信息',
      key: '1',
      icon: <IconFontStyle className="icon" type="folder-open-nor" />,
      path: '/AdminManagement/CompanyInfo',
    },
    {
      label: '组织信息',
      key: '2',
      icon: <IconFontStyle className="icon" type="folder-open-nor" />,
      children: [
        {
          label: '员工管理',
          key: '1-33',
          path: '/AdminManagement/StaffManagement',
        },
        {
          label: '团队管理',
          key: '12',
          path: '/AdminManagement/TeamManagement',
        },
      ],
    },
    {
      label: '权限管理',
      key: '3',
      icon: <IconFontStyle className="icon" type="folder-open-nor" />,
      path: '/AdminManagement/PermissionManagement',
    },
    {
      label: '安全管理',
      key: '4',
      icon: <IconFontStyle className="icon" type="folder-open-nor" />,
      children: [
        {
          label: '安全水印',
          key: '1-12',
          path: '/AdminManagement/WaterMarkManagement',
        },
        {
          label: '操作日志',
          key: '1-13',
          path: '/AdminManagement/OperationManagement',
        },
        {
          label: '登录日志',
          key: '1-14',
          path: '/AdminManagement/LoginManagement',
        },
      ],
    },
  ]

  const onMenuClick = (e: any) => {
    const pathObject = side.filter((i: any) => i.key === e.key)[0]
    navigate(pathObject.path)
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
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        items={side}
        onSelect={onMenuClick}
      />
    </AdminSideWrap>
  )
}

export default AdminSide
