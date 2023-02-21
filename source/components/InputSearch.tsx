import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { Input } from 'antd'

const InputStyle = styled(Input)<{ bgColor: string }>`
  height: 32px;
  background: ${props => props.bgColor ?? '#fff'};
  border-radius: 6px;
  .ant-input {
    font-size: 14px;
  }
  .ant-input-prefix {
    margin-right: 10px;
  }
  padding: 0 12px;
  border: 1px solid var(--neutral-n6-d1);
  &::placeholder {
    font-size: 14px;
  }
  input {
    background: ${props => props.bgColor ?? '#fff'};
  }
`
interface PropsType {
  bgColor: string
  width: number
  value: string
  placeholder: string
  length: number
  onSearch(value: string): void
  onChange(value: string): void
  onClear(): void
}
const HeaderSearch = (props: PropsType) => {
  return (
    <InputStyle
      bgColor={props.bgColor}
      width={props.width}
      value={props.value}
      placeholder={props.placeholder}
      maxLength={props.length}
      onBlur={(e: any) => props.onSearch(e.target.value)}
      onChange={(e: any) => props.onChange(e.target.value)}
      onPressEnter={(e: any) => props.onSearch?.(e.target.value)}
      suffix={
        <>
          {/* 删除按钮 */}
          {props.value && (
            <IconFont
              type="close-circle-fill"
              onClick={() => {
                props.onSearch?.('')
                props.onClear()
              }}
              style={{ color: '#BBBDBF', fontSize: 16 }}
            />
          )}
        </>
      }
      prefix={
        <IconFont
          type="search"
          style={{ color: `var(--neutral-n4)`, fontSize: 16 }}
        />
      }
    />
  )
}
export default HeaderSearch
