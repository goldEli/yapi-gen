import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { Space, Drawer, Button, message } from 'antd'
import { useState } from 'react'
import { whiteTheme, blackTheme } from '@/theme'
import { useDispatch, useSelector } from '@store/index'

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
  const { theme } = useSelector(store => store.global)
  const dispatch = useDispatch()
  const onChangeTheme = () => {
    const resultTheme = {
      type: theme.type === 'white' ? 'black' : 'white',
      themeColors: theme.type === 'white' ? blackTheme : whiteTheme,
    }
    dispatch({
      type: 'global/setTheme',
      payload: resultTheme,
    })
    message.success('切换成功')
  }

  return (
    <div>
      <DrawerComponent value={isVisible} onChange={setIsVisible} />
      <Space size={16}>
        <IconFont type="app-store" onClick={() => setIsVisible(true)} />
        <div>项目管理</div>
        <Button onClick={onChangeTheme}>切换主题</Button>
      </Space>
    </div>
  )
}

export default HeaderLeft
