// 公用input 例：项目的搜索

import styled from '@emotion/styled'
import { Input } from 'antd'
import { useState } from 'react'
import IconFont from './IconFont'

const MyInput = styled(Input)<{ bgColor?: string }>`
  font-size: 14px;
  height: 32px;
  background: ${props => props.bgColor ?? 'rgba(245, 246, 247, 1)'};
  background-blend-mode: normal;
  mix-blend-mode: normal;
  display: flex;
  justify-content: flex-start;
  padding: 5px 12px 5px 12px;
  border: ${props => (props.bgColor ? '1px solid #ebedf0' : '1px solid white')};
  input {
    background: ${props => props.bgColor ?? 'rgba(245, 246, 247, 1)'};
    &::placeholder {
      font-size: 14px;
    }
  }
`

interface Props {
  onChangeSearch?(val: string): void
  placeholder: string
  width?: any
  autoFocus?: boolean
  ref?: any
  bgColor?: string
}

const CommonInput = (props: Props) => {
  // 用于控制输入框的删除图标
  const [value, setValue] = useState('')
  return (
    <MyInput
      bgColor={props.bgColor}
      value={value}
      ref={props?.ref}
      style={{ width: props.width || 240 }}
      onPressEnter={(e: any) => props.onChangeSearch?.(e.target.value)}
      onBlur={(e: any) => props.onChangeSearch?.(e.target.value)}
      onChange={(e: any) => setValue(e.target.value)}
      prefix={
        <>
          {/* 展示搜索图标 */}
          <IconFont type="search" style={{ color: '#BBBDBF', fontSize: 16 }} />
        </>
      }
      suffix={
        <>
          {/* 删除按钮 */}
          {value && (
            <IconFont
              type="close-circle-fill"
              onClick={() => {
                props.onChangeSearch?.('')
                setValue('')
              }}
              style={{ color: '#BBBDBF', fontSize: 16 }}
            />
          )}
        </>
      }
      placeholder={props.placeholder}
      autoFocus={props?.autoFocus}
    />
  )
}

export default CommonInput
