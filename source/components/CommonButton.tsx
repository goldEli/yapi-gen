/* eslint-disable @typescript-eslint/naming-convention */

// 公用按钮

import { useThrottle } from '@/hooks/useThrottle'
import { css } from '@emotion/css'
import { Space, Button } from 'antd'
import IconFont from './IconFont'
// import { AsyncButton as Button } from '@staryuntech/ant-pro'
import styled from '@emotion/styled'
import { MouseEvent } from 'react'

const primary = css`
  background: var(--auxiliary-b1) !important;
  color: var(--auxiliary-text-t1-d1) !important;
  border: 1px solid transparent !important;
  /* span {
    color: var(--auxiliary-text-t1-d1) !important;
  } */
  &:hover {
    background: var(--auxiliary-b2) !important;
    color: var(--auxiliary-text-t1-d1) !important;
  }
  &:active {
    background: var(--auxiliary-b3) !important;
    color: var(--auxiliary-text-t1-d1) !important;
  }
  &:disabled {
    background: var(--auxiliary-b10) !important;
    color: var(--auxiliary-t4) !important;
    cursor: no-drop !important;
  }
`

const light = css`
  background: var(--auxiliary-b4) !important;
  color: var(--auxiliary-text-t2-d1) !important;
  border: 1px solid transparent !important;
  &:hover {
    background: var(--auxiliary-b4) !important;
    color: var(--auxiliary-text-t2-d2) !important;
  }
  &:active {
    background: var(--auxiliary-b5) !important;
    color: var(--auxiliary-text-t2-d2) !important;
  }
  &:disabled {
    background: var(--auxiliary-b10) !important;
    color: var(--auxiliary-t4) !important;
    cursor: no-drop !important;
  }
`
const secondary = css`
  background: var(--auxiliary-b4) !important;
  color: var(--auxiliary-b1) !important ;
  border: 1px solid transparent !important;
  &:hover {
    background: var(--auxiliary-b5) !important;
    color: var(--auxiliary-text-t2-d2) !important;
  }
  &:active {
    background: var(--auxiliary-b6) !important;
    color: var(--auxiliary-text-t2-d2) !important;
  }
  &:disabled {
    background: var(--auxiliary-b10) !important;
    color: var(--auxiliary-t4) !important;
    cursor: no-drop !important;
  }
`
const danger = css`
  background: var(--auxiliary-b7) !important;
  color: var(--auxiliary-text-t3) !important;
  border: 1px solid transparent !important;
  &:hover {
    background: var(--auxiliary-b8) !important;
    color: var(--auxiliary-text-t3) !important;
  }
  &:active {
    background: var(--auxiliary-b9) !important;
    color: var(--auxiliary-text-t3) !important;
  }
  &:disabled {
    background: var(--auxiliary-b10) !important;
    color: var(--auxiliary-t4) !important;
    cursor: no-drop !important;
  }
`
const primaryText = css`
  background: transparent !important;
  color: var(--auxiliary-text-t2-d2) !important;
  border: 1px solid transparent !important;
  &:hover {
    background: var(--auxiliary-b4) !important;
    color: var(--auxiliary-text-t2-d2) !important;
  }
  &:active {
    background: var(--auxiliary-b5) !important;
    color: var(--auxiliary-text-t2-d2) !important;
  }
  &:disabled {
    background: var(--auxiliary-b10) !important;
    color: var(--auxiliary-t4) !important;
    cursor: no-drop !important;
  }
`
const secondaryText = css`
  background: transparent !important;
  color: var(--auxiliary-text-t2-d1) !important;
  border: 1px solid transparent !important;
  &:hover {
    background: var(--auxiliary-b4) !important;
    color: var(--auxiliary-text-t2-d1) !important;
  }
  &:active {
    background: var(--auxiliary-b5) !important;
    color: var(--auxiliary-text-t2-d2) !important;
  }
  &:disabled {
    background: var(--auxiliary-b10) !important;
    color: var(--auxiliary-t4) !important;
    cursor: no-drop !important;
  }
`
const icon = css`
  width: auto !important;
  padding: 0 6px !important;
  background: transparent !important;
  color: var(--auxiliary-text-t2-d1) !important;
  border: 1px solid var(--neutral-n6-d1) !important;
  padding: 0 6px;
  &:hover {
    background: var(--auxiliary-b4) !important;
    color: var(--auxiliary-text-t2-d2) !important;
    border: 1px solid transparent !important;
  }
  &:active {
    background: var(--auxiliary-b5) !important;
    color: var(--auxiliary-text-t2-d2) !important;
    border: 1px solid transparent !important;
  }
  &:disabled {
    background: var(--auxiliary-b10) !important;
    color: var(--auxiliary-t4) !important;
    cursor: no-drop !important;
  }
`

const ButtonWrap = styled(Button)<{ size?: any }>`
  display: flex;
  align-items: center;
  height: ${props => (props.size === 'small' ? '24px' : '32px')};
`

interface Props {
  loading?: boolean
  hidden?: any
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  // 按钮文本
  children?: React.ReactNode
  // 按钮类型
  type:
    | 'primary'
    | 'light'
    | 'secondary'
    | 'danger'
    | 'primaryText'
    | 'secondaryText'
    | 'icon'

  //   图标位置
  iconPlacement?: 'left' | 'right'
  //   图标
  icon?: string
  //   是否禁用
  isDisable?: boolean
  style?: any
  // 按钮大小
  size?: 'small' | 'large'
}

const CommonButton = (props: Props) => {
  // const throttleClick = useThrottle(() => {
  //   props.onClick?.()
  // }, 1000)

  const allButton = {
    primary,
    light,
    secondary,
    danger,
    primaryText,
    secondaryText,
    icon,
  }

  const commonCss = css`
    ${allButton[props.type]};
    border-radius: 6px;
    padding: 0 16px;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    align-items: center;
    span:first-child {
      display: flex;
      align-items: center;
    }
  `

  //   如果有图标
  if (props.icon && props.type !== 'icon') {
    return (
      <ButtonWrap
        size={props.size}
        className={commonCss}
        onClick={props.onClick}
        disabled={props.isDisable}
        loading={props?.loading}
      >
        {props.iconPlacement !== 'right' && (
          <Space size={8}>
            <IconFont type={props.icon} />
            {props.children}
          </Space>
        )}
        {props.iconPlacement === 'right' && (
          <Space size={8}>
            {props.children}
            <IconFont type={props.icon} />
          </Space>
        )}
      </ButtonWrap>
    )
  }

  //   如果有图标没有内容
  if (props.type === 'icon') {
    return (
      <ButtonWrap
        className={commonCss}
        onClick={props.onClick}
        disabled={props.isDisable}
        loading={props?.loading}
      >
        <IconFont type={props.icon || ''} style={{ fontSize: 20 }} />
      </ButtonWrap>
    )
  }

  return (
    <ButtonWrap
      style={props?.style}
      className={commonCss}
      onClick={props.onClick}
      disabled={props.isDisable}
      hidden={props.hidden}
      size={props.size}
      loading={props?.loading}
    >
      {props.children}
    </ButtonWrap>
  )
}

export default CommonButton
