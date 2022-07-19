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
  border: none;
  input {
    background: rgba(245, 246, 247, 1);
    &::placeholder {
      font-size: 14px;
    }
  }
`

interface Props {
  text: string
  onChangeVisible?(): void
  onChangeSearch?(val: string): void
  placeholder: string
}

export default (props: Props) => (
  <Space size={24}>
    <AddButton text={props.text} onChangeClick={props.onChangeVisible} />
    <MyInput
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
