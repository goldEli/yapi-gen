import AddButton from './AddButton'
import { Input, Space } from 'antd'
import IconFont from './IconFont'

interface Props {
  text: string
  onChangeVisible?(): void
  onChangeSearch?(val: string): void
  placeholder: string
}

export default (props: Props) => (
  <Space size={16}>
    <AddButton text={props.text} onChangeClick={props.onChangeVisible} />
    <Input
      onPressEnter={(e: any) => props.onChangeSearch?.(e.target.value)}
      onChange={(e: any) =>
        e.target.value ? void 0 : props.onChangeSearch?.(e.target.value)
      }
      suffix={
        <IconFont type="search" style={{ color: '#BBBDBF', fontSize: 16 }} />
      }
      placeholder={props.placeholder}
      allowClear
    />
  </Space>
)
