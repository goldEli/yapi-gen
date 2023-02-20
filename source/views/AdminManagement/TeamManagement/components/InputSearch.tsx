import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { Input } from 'antd'

const InputStyle = styled(Input)`
  height: 32px;
  background: #fff;
  border-radius: 6px;
  .ant-input {
    font-size: 14px;
  }
  .ant-input-prefix {
    margin-right: 10px;
  }
  padding: 0 12px;
  border: 1px solid var(--neutral-n6-d1);
`
const HeaderSearch = (props: any) => {
  return (
    <InputStyle
      width={props.width}
      placeholder={props.placeholder}
      maxLength={props.length}
      onBlur={(e: any) => props.onBlur(e.target.value)}
      onChange={(e: any) => props.onChange(e.target.value)}
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
