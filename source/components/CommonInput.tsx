import styled from '@emotion/styled'
import { Input } from 'antd'
import { useEffect } from 'react'
import IconFont from './IconFont'

const MyInput = styled(Input)`
  font-size: 14px;
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
  onChangeSearch?(val: string): void
  placeholder: string
  width?: any
  autoFocus?: boolean
  ref?: any
}

const CommonInput = (props: Props) => {
  useEffect(() => {
    document
      .getElementsByClassName('anticon-close-circle')[0]
      ?.addEventListener('click', () => props.onChangeSearch?.(''))
    return document
      .getElementsByClassName('anticon-close-circle')[0]
      ?.removeEventListener('click', () => props.onChangeSearch?.(''))
  }, [])

  return (
    <MyInput
      ref={props?.ref}
      style={{ width: props.width || 240 }}
      onPressEnter={(e: any) => props.onChangeSearch?.(e.target.value)}
      onBlur={(e: any) => props.onChangeSearch?.(e.target.value)}
      suffix={
        <IconFont type="search" style={{ color: '#BBBDBF', fontSize: 16 }} />
      }
      placeholder={props.placeholder}
      allowClear
      autoFocus={props?.autoFocus}
    />
  )
}

export default CommonInput
