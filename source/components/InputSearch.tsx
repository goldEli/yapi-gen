import styled from '@emotion/styled'
import { changeColorText } from '@store/color-text'
import { useDispatch, useSelector } from '@store/index'
import { saveInputKey } from '@store/view'
import { Input } from 'antd'
import { useEffect, useState } from 'react'
import CommonIconFont from './CommonIconFont'

const InputStyle = styled(Input)<{ bgColor: any }>`
  height: 32px;
  background: ${props => props.bgColor ?? 'var(--neutral-white-d4)'};
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
  isDemand?: boolean
}

const InputSearch = (props: Props) => {
  // 用于控制输入框的删除图标
  const [value, setValue] = useState('')
  const dispatch = useDispatch()
  const { tapInputKey } = useSelector(store => store.view)
  useEffect(() => {
    if (tapInputKey && props.isDemand) {
      setValue(tapInputKey)
      // props.onChangeSearch?.(tapInputKey)
    }
  }, [tapInputKey])
  return (
    <InputStyle
      ref={props?.ref}
      bgColor={props.bgColor}
      width={props.width}
      value={value}
      placeholder={props.placeholder}
      maxLength={props.length}
      onBlur={(e: any) => props.onChangeSearch?.(e.target.value)}
      onChange={(e: any) => {
        dispatch(saveInputKey(e.target.value))
        setValue(e.target.value)
        dispatch(changeColorText(e.target.value))
      }}
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
