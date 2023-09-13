import styled from '@emotion/styled'
import { Select } from 'antd'
import { useState } from 'react'

const InputStyle = styled(Select)`
  outline: none;
  .anticon-down {
    display: none;
  }
`

interface Props {
  onChange?(val: string): void
  placeholder: string
  width?: any
  autoFocus?: boolean
  ref?: any
  bgColor?: string
  length?: number
  leftIcon?: boolean
  isDemand?: boolean
  options: any[]
}

const SearchSelect = (props: Props) => {
  // 用于控制输入框的删除图标
  const [value, setValue] = useState()
  return (
    <InputStyle
      showSearch
      ref={props?.ref}
      value={value}
      style={{
        width: props.width,
      }}
      allowClear
      placeholder={props.placeholder}
      filterOption={(input: string, option: any) =>
        option?.label?.includes(input)
      }
      onChange={(newValue: any) => {
        if (newValue) {
          props.onChange?.(newValue)
        }
        setValue(newValue)
      }}
      options={props.options}
      notFoundContent={null}
    />
  )
}

export default SearchSelect
