/* eslint-disable no-restricted-globals */
import styled from '@emotion/styled'
import { changeColorText } from '@store/color-text'
import { useDispatch, useSelector } from '@store/index'
import { saveInputKey } from '@store/view'
import { Input } from 'antd'
import { useCallback, useEffect, useRef, useState } from 'react'
import CommonIconFont from './CommonIconFont'
import useFKeyPress from '@/hooks/useFKeyPress/useFKeyPress'
import { useHotkeys } from 'react-hotkeys-hook'

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
  isReport?: boolean
  // 用于公共使用时，清除
  defaultValue?: string
}

const InputSearch = (props: Props) => {
  // 用于控制输入框的删除图标
  const inputRef = useRef<any>(null)
  const [value, setValue] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    if (!props.defaultValue) {
      setValue('')
    }
  }, [props.defaultValue])

  const handleFKeyPress = useCallback((event?: any) => {
    // 在这里执行你想要触发的事件
    if (event.key === 'F' || event.key === 'f') {
      event.preventDefault()
      inputRef.current!.focus({
        preventScroll: true,
      })
    }
  }, [])

  useHotkeys(
    'f',
    () => {
      handleFKeyPress(event)
    },
    [],
  )

  return (
    <InputStyle
      ref={inputRef}
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
