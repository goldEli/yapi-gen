import styled from '@emotion/styled'
import { Input } from 'antd'
import { useState } from 'react'
import CommonIconFont from './CommonIconFont'

const InputStyle = styled(Input)<{ bgColor: any }>`
  height: 32px;
  background: ${props => props.bgColor ?? 'var(--neutral-white-d4)'};
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
    background: ${props => props.bgColor ?? 'var(--neutral-white-d4)'};
  }
`

interface Props {
  onChangeSearch?(val: string): void
  placeholder: string
  width?: any
  autoFocus?: boolean
  ref?: any
  bgColor?: string
  length?: number
  leftIcon?: boolean
}

const InputSearch = (props: Props) => {
  // 用于控制输入框的删除图标
  const [value, setValue] = useState('')

  return (
    <InputStyle
      ref={props?.ref}
      bgColor={props.bgColor}
      width={props.width}
      value={value}
      placeholder={props.placeholder}
      maxLength={props.length}
      onBlur={(e: any) => props.onChangeSearch?.(e.target.value)}
      onChange={(e: any) => setValue(e.target.value)}
      onPressEnter={(e: any) => props.onChangeSearch?.(e.target.value)}
      suffix={
        <>
          {/* 删除按钮 */}
          {value && (
            <CommonIconFont
              type="close-circle-fill"
              onClick={() => {
                props.onChangeSearch?.('')
                setValue('')
              }}
              size={16}
              color="var(--neutral-n4)"
            />
          )}
        </>
      }
      prefix={
        props.leftIcon && (
          <CommonIconFont type="search" size={16} color="var(--neutral-n4)" />
        )
      }
    />
  )
}
export default InputSearch
