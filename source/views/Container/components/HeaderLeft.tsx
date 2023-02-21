import { Space, Drawer } from 'antd'
import { useState } from 'react'
import CommonIconFont from '@/components/CommonIconFont'
import sideLogo from '/newLogo.svg'
import {
  ChildrenMenu,
  ChildrenMenuItem,
  CompanyInfo,
  DrawerCompany,
  DrawerFooter,
  DrawerHeader,
  DrawerMenu,
  DrawerMenuItem,
  Provider,
  HeaderLeftWrap,
  LogoBox,
  MenuLabel,
} from '../style'
import { CloseWrap } from '@/components/StyleCommon'
import { useDispatch, useSelector } from '@store/index'
import { useNavigate } from 'react-router-dom'

interface DrawerComponentProps {
  value: boolean
  onChange(value: boolean): void
}

const DrawerComponent = (props: DrawerComponentProps) => {
  const { userInfo } = useSelector(store => store.user)
  const { currentMenu } = useSelector(store => store.global)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const menuIconList = [
    { id: 0, normal: 'system-nor', active: 'system-sel' },
    { id: 1, normal: 'folder-open-nor', active: 'folder-open-sel' },
    { id: 2, normal: 'log-nor', active: 'log-sel' },
  ]

  const menuList = [
    {
      id: 0,
      name: '公司概况',
      url: '/Situation',
      permission: '',
      children: [],
    },
    {
      id: 1,
      name: '项目管理',
      url: '/ProjectManagement',
      permission: '',
      children: [
        {
          id: 1,
          name: '项目',
          url: '/ProjectManagement/Project',
          permission: '',
        },
        { id: 2, name: '我的', url: '/ProjectManagement/Mine', permission: '' },
      ],
    },
    {
      id: 2,
      name: '日志管理',
      url: '/LogManagement',
      permission: '',
      children: [],
    },
    {
      id: 3,
      name: '后台管理',
      url: '/AdminManagement',
      permission: '',
      children: [],
    },
  ]

  // 点击菜单
  const onChangeCurrentMenu = (menu: any) => {
    props.onChange(false)
    navigate(menu.url)
    const resultMenu = {
      ...menu,
      ...{
        icon: menuIconList?.filter((i: any) => i.id === menu.id)[0]?.normal,
      },
    }
    dispatch({
      type: 'global/setCurrentMenu',
      payload: resultMenu,
    })
  }

  return (
    <Drawer
      headerStyle={{ display: 'none' }}
      bodyStyle={{
        padding: '16px 0px 8px',
        background: 'var(--neutral-white-d5)',
      }}
      placement="left"
      onClose={() => props.onChange(false)}
      open={props.value}
      width={320}
    >
      <DrawerHeader>
        <LogoBox>
          <img src={sideLogo} alt="" />
          <span>IFUN Agile</span>
        </LogoBox>
        <CloseWrap width={32} height={32} onClick={() => props.onChange(false)}>
          <CommonIconFont type="close" size={20} color="var(--neutral-n2)" />
        </CloseWrap>
      </DrawerHeader>
      <DrawerCompany>
        <CompanyInfo>
          <img src="" alt="" />
          <span>{userInfo.company_name}</span>
        </CompanyInfo>
        <CommonIconFont type="swap" color="var(--neutral-n2)" />
      </DrawerCompany>
      <Provider isBottom />
      <DrawerMenu>
        <Space size={12} style={{ flexWrap: 'wrap' }}>
          {menuList
            ?.filter((k: any) => k.id !== 3)
            .map((i: any) => (
              <DrawerMenuItem
                key={i.id}
                isActive={currentMenu.id === i.id}
                onClick={() => onChangeCurrentMenu(i)}
              >
                <div className="menuIcon">
                  <CommonIconFont
                    type={
                      currentMenu.id === i.id
                        ? menuIconList?.filter((k: any) => k.id === i.id)[0]
                            ?.active
                        : menuIconList?.filter((k: any) => k.id === i.id)[0]
                            ?.normal
                    }
                    size={24}
                  />
                </div>
                <div className="label">{i.name}</div>
              </DrawerMenuItem>
            ))}
        </Space>
      </DrawerMenu>
      <DrawerFooter>
        <div>
          <CommonIconFont
            type="management"
            size={20}
            color="var(--neutral-n2)"
          />
          <div>后台管理</div>
        </div>
      </DrawerFooter>
    </Drawer>
  )
}

const HeaderLeft = () => {
  const [isVisible, setIsVisible] = useState(false)
  const { currentMenu } = useSelector(store => store.global)

  return (
    <HeaderLeftWrap>
      <DrawerComponent value={isVisible} onChange={setIsVisible} />
      <Space size={24}>
        <CommonIconFont
          type="menu-02"
          size={24}
          color="var(--neutral-n2)"
          onClick={() => setIsVisible(true)}
        />
        <Space size={8}>
          <CommonIconFont
            type={currentMenu.icon}
            size={24}
            color="var(--neutral-n3)"
          />
          <MenuLabel>{currentMenu.name}</MenuLabel>
        </Space>
      </Space>
      <ChildrenMenu>
        <ChildrenMenuItem size={8} isActive>
          <span>项目</span>
          <CommonIconFont type="down" size={14} />
        </ChildrenMenuItem>
        <ChildrenMenuItem size={8}>
          <span>我的</span>
          <CommonIconFont type="down" size={14} />
        </ChildrenMenuItem>
      </ChildrenMenu>
    </HeaderLeftWrap>
  )
}

export default HeaderLeft
