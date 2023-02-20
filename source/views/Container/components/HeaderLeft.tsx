import styled from '@emotion/styled'
import { Space, Drawer } from 'antd'
import { useState } from 'react'
import CommonIconFont from '@/components/CommonIconFont'

const HeaderLeftWrap = styled.div`
  display: flex;
  align-items: center;
`
const MenuLabel = styled.span`
  color: var(--neutral-n1-d1);
  font-family: SiYuanMedium;
  font-weight: 500;
`

const ChildrenMenu = styled.div`
  display: flex;
  align-items: center;
  margin-left: 48px;
`

const ChildrenMenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0 16px;
`

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
`

interface DrawerComponentProps {
  value: boolean
  onChange(value: boolean): void
}

const DrawerComponent = (props: DrawerComponentProps) => {
  return (
    <Drawer
      headerStyle={{ display: 'none' }}
      bodyStyle={{ padding: '8px 16px' }}
      placement="left"
      onClose={() => props.onChange(false)}
      open={props.value}
    >
      <DrawerHeader>
        <span>IFUN Agile</span>
        <CommonIconFont type="close" onClick={() => props.onChange(false)} />
      </DrawerHeader>
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
          onClick={() => setIsVisible(true)}
        />
        <Space size={8}>
          <CommonIconFont type="app-store" />
          <MenuLabel>项目管理</MenuLabel>
        </Space>
      </Space>
      <ChildrenMenu>
        <ChildrenMenuItem>
          <span>项目</span>
          <CommonIconFont type="down" />
        </ChildrenMenuItem>
        <ChildrenMenuItem>
          <span>我的</span>
          <CommonIconFont type="down" />
        </ChildrenMenuItem>
      </ChildrenMenu>
    </HeaderLeftWrap>
  )
}

export default HeaderLeft
