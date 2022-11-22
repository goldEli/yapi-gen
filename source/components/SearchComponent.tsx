// 搜索组件 带有input和操作按钮

import AddButton from './AddButton'
import { Space } from 'antd'
import CommonInput from './CommonInput'

interface Props {
  text: string
  onChangeVisible?(e?: any): void
  onChangeSearch?(val: string): void
  placeholder: string
  isPermission?: boolean
}

const SearchComponent = (props: Props) => (
  <Space size={24}>
    {!props.isPermission && (
      <AddButton
        text={props.text}
        onChangeClick={(e: any) => props.onChangeVisible?.(e)}
      />
    )}
    <CommonInput
      onChangeSearch={props.onChangeSearch}
      placeholder={props.placeholder}
    />
  </Space>
)

export default SearchComponent
