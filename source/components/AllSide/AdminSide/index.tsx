/* eslint-disable react/no-unstable-nested-components */
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { Menu } from 'antd'
const AdminSideWrap = styled.div`
  background-color: var(--neutral-n6-d1);
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
  background-color: var(--neutral-n6-d1) !important;
  .ant-menu-item {
    height: 44px !important;
    background-color: var(--neutral-n6-d1);
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
  const side: any = [
    {
      label: '项目成员',
      key: '1',
      icon: <IconFontStyle className="icon" type="folder-open-nor" />,
      children: [
        {
          label: '项目成员',
          key: '1-1',
        },
      ],
    },
    {
      label: '2-2',
      key: '2-2',
      icon: <IconFontStyle className="icon" type="folder-open-nor" />,
    },
  ]
  return (
    <AdminSideWrap>
      <HeaderWrap>
        <img src="" />
        <span>公司名称oo</span>
      </HeaderWrap>
      <MenuStyle
        style={{ width: props.leftWidth }}
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
      />
    </AdminSideWrap>
  )
}

export default AdminSide
