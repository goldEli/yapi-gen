import { Drawer } from 'antd'

interface Props {
  visible: boolean
  onChangeVisible(): void
}

export default (props: Props) => {
  return (
    <Drawer
      title="Basic Drawer"
      placement="right"
      closable={false}
      onClose={props.onChangeVisible}
      visible={props.visible}
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Drawer>
  )
}
