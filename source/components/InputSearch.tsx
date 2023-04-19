import styled from '@emotion/styled'
import { changeColorText } from '@store/color-text'
import { useDispatch, useSelector } from '@store/index'
import { saveInputKey } from '@store/view'
import { Input } from 'antd'
import { useEffect, useImperativeHandle, useState } from 'react'
import CommonIconFont from './CommonIconFont'

const InputStyle = styled(Input)<{ bgColor: any }>`
  /* border: 1px solid var(--neutral-n6-d1);
  height: 32px;
  background: ${props => props.bgColor ?? 'var(--neutral-white-d4)'};
  input {
    background: ${props => props.bgColor ?? 'var(--neutral-white-d4)'};
  } */
  outline: none;
`

interface Props {
  onChangeSearch?(val: string): void
  onFocus?(): void
  placeholder: string
  width?: any
  autoFocus?: boolean
  ref?: any
  bgColor?: string
  length?: number
  leftIcon?: boolean
  isDemand?: boolean
  // 订阅日历弹窗-搜索使用
  defaultValue?: string
  isReport?: boolean
}

const InputSearch = (props: Props) => {
  // 用于控制输入框的删除图标
  const [value, setValue] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    if (!props.defaultValue) {
      setValue('')
    }
  }, [props.defaultValue])

  return (
    <InputStyle
      ref={props?.ref}
      bgColor={props.bgColor}
      value={value}
      style={{
        width: props.width,
        fontFamily: props.isReport ? 'MiSans' : 'inherit',
      }}
      placeholder={props.placeholder}
      maxLength={props.length}
      onBlur={(e: any) => props.onChangeSearch?.(e.target.value)}
      onChange={(e: any) => {
        dispatch(saveInputKey(e.target.value))
        setValue(e.target.value)
        dispatch(changeColorText(e.target.value))
      }}
      onFocus={() => props.onFocus?.()}
      onPressEnter={(e: any) => props.onChangeSearch?.(e.target.value)}
      suffix={
        <>
          {value && (
            <CommonIconFont
              type="close-circle-fill"
              onClick={() => {
                props.onChangeSearch?.('')
                setValue('')
                dispatch(changeColorText(''))
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
