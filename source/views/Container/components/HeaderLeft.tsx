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
  DrawerProvider,
  HeaderLeftWrap,
  LogoBox,
  MenuLabel,
} from '../style'
import { CloseWrap } from '@/components/StyleCommon'
import { useSelector } from '@store/index'

interface DrawerComponentProps {
  value: boolean
  onChange(value: boolean): void
}

const DrawerComponent = (props: DrawerComponentProps) => {
  const { userInfo } = useSelector(store => store.user)
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
      <DrawerProvider />
      <DrawerMenu>
        <Space size={12} style={{ flexWrap: 'wrap' }}>
          <DrawerMenuItem>
            <div className="menuIcon">
              <CommonIconFont type="system-nor" size={24} />
            </div>
            <div className="label">公司概况</div>
          </DrawerMenuItem>
          <DrawerMenuItem>
            <div className="menuIcon">
              <CommonIconFont type="folder-open-nor" size={24} />
            </div>
            <div className="label">项目管理</div>
          </DrawerMenuItem>
          <DrawerMenuItem>
            <div className="menuIcon">
              <CommonIconFont type="log-nor" size={24} />
            </div>
            <div className="label">日志管理</div>
          </DrawerMenuItem>
        </Space>
      </DrawerMenu>
      <DrawerFooter>1212</DrawerFooter>
    </Drawer>
  )
}

const HeaderLeft = () => {
  const [isVisible, setIsVisible] = useState(false)

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
            type="folder-open-nor"
            size={24}
            color="var(--neutral-n3)"
          />
          <MenuLabel>项目管理</MenuLabel>
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
