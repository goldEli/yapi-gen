/* eslint-disable max-len */
import AddButton from './AddButton'
import { Input, Space } from 'antd'
import IconFont from './IconFont'
import styled from '@emotion/styled'

const MyInput = styled(Input)`
  font-size: 14px;
  width: 240px;
  height: 32px;
  background: rgba(245, 246, 247, 1);
  background-blend-mode: normal;
  mix-blend-mode: normal;
  display: flex;
  justify-content: flex-start;

  padding: 5px 12px 5px 12px;
  border: 1px solid white;
  input {
    background: rgba(245, 246, 247, 1);
    &::placeholder {
      font-size: 14px;
    }
  }
`

interface Props {
  text: string
  onChangeVisible?(e?: any): void
  onChangeSearch?(val: string): void
  placeholder: string
  isPermission?: boolean
}

const SearchComponent = (props: Props) => (
  <Space size={24}>
    {props.isPermission
      ? null
      : (
          <AddButton
            text={props.text}
            onChangeClick={(e: any) => props.onChangeVisible?.(e)}
          />
        )}
    <MyInput
      onPressEnter={(e: any) => props.onChangeSearch?.(e.target.value)}
      onBlur={(e: any) => props.onChangeSearch?.(e.target.value)}
      suffix={
        <IconFont type="search" style={{ color: '#BBBDBF', fontSize: 16 }} />
      }
      placeholder={props.placeholder}
      allowClear
    />
  </Space>
)

export default SearchComponent
