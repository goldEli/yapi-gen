import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { Space, Drawer } from 'antd'
import { useState } from 'react'

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
        <IconFont type="close" onClick={() => props.onChange(false)} />
      </DrawerHeader>
    </Drawer>
  )
}

const HeaderLeft = () => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div>
      <DrawerComponent value={isVisible} onChange={setIsVisible} />
      <Space size={16}>
        <IconFont type="app-store" onClick={() => setIsVisible(true)} />
        <div>项目管理</div>
      </Space>
    </div>
  )
}

export default HeaderLeft
