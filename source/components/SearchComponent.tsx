import React from 'react'
import AddButton from './AddButton'
import { Input, Space } from 'antd'
import IconFont from './IconFont'

interface Props {
  text: string
  onChangeClick?(): void
  onChangeSearch?(val: string): void
}

export default (props: Props) => (
  <Space size={16}>
    <AddButton text={props.text} onChangeClick={props.onChangeClick} />
    <Input
      onChange={e => props.onChangeSearch?.(e.target.value)}
      suffix={<IconFont type="linesearch" style={{ color: '#ccc', fontSize: 16 }} />}
    />
  </Space>
)
