/* eslint-disable @typescript-eslint/naming-convention */

// 公用按钮

import { useThrottle } from '@/hooks/useThrottle'
import { css } from '@emotion/css'
import { Space } from 'antd'
import IconFont from './IconFont'

const primary = css`
  background: var(--auxiliary-b1);
  color: var(--auxiliary-text-t1-d1);
  border: 1px solid transparent;
  &:hover {
    background: var(--auxiliary-b2);
    color: var(--auxiliary-text-t1-d1);
  }
  &:active {
    background: var(--auxiliary-b3);
    color: var(--auxiliary-text-t1-d1);
  }
`
const light = css`
  background: var(--auxiliary-b4);
  color: var(--auxiliary-text-t2-d1);
  border: 1px solid transparent;
  &:hover {
    background: var(--auxiliary-b4);
    color: var(--auxiliary-text-t2-d2);
  }
  &:active {
    background: var(--auxiliary-b5);
    color: var(--auxiliary-text-t2-d2);
  }
`
const secondary = css`
  background: var(--auxiliary-b4);
  color: var(--auxiliary-text-t2-d2);
  border: 1px solid transparent;
  &:hover {
    background: var(--auxiliary-b5);
    color: var(--auxiliary-text-t2-d2);
  }
  &:active {
    background: var(--auxiliary-b6);
    color: var(--auxiliary-text-t2-d2);
  }
`
const danger = css`
  background: var(--auxiliary-b7);
  color: var(--auxiliary-text-t3);
  border: 1px solid transparent;
  &:hover {
    background: var(--auxiliary-b8);
    color: var(--auxiliary-text-t3);
  }
  &:active {
    background: var(--auxiliary-b9);
    color: var(--auxiliary-text-t3);
  }
`
const primaryText = css`
  background: transparent;
  color: var(--auxiliary-text-t2-d2);
  border: 1px solid transparent;
  &:hover {
    background: var(--auxiliary-b4);
    color: var(--auxiliary-text-t2-d2);
  }
  &:active {
    background: var(--auxiliary-b5);
    color: var(--auxiliary-text-t2-d2);
  }
`
const secondaryText = css`
  background: transparent;
  color: var(--auxiliary-text-t2-d1);
  border: 1px solid transparent;
  &:hover {
    background: var(--auxiliary-b4);
    color: var(--auxiliary-text-t2-d1);
  }
  &:active {
    background: var(--auxiliary-b5);
    color: var(--auxiliary-text-t2-d2);
  }
`
const icon = css`
  background: transparent;
  color: var(--auxiliary-text-t2-d1);
  border: 1px solid var(--neutral-n9);
  padding: 0 6px !important;
  &:hover {
    background: var(--auxiliary-b4);
    color: var(--auxiliary-text-t2-d2);
    border: 1px solid transparent;
  }
  &:active {
    background: var(--auxiliary-b5);
    color: var(--auxiliary-text-t2-d2);
    border: 1px solid transparent;
  }
`

interface Props {
  onClick?(): void
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
}

const CommonButton = (props: Props) => {
  const throttleClick = useThrottle(() => {
    props.onClick?.()
  }, 1000)

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
    height: 32px;
    padding: 0 16px;
    box-sizing: border-box;
    font-size: var(--font14);
    cursor: pointer;
    display: flex;
    align-items: center;
    span:first-child {
      display: flex;
      align-items: center;
    }
    &:disabled {
      background: var(--auxiliary-b10);
      color: var(--auxiliary-t4);
      cursor: no-drop;
    }
  `

  //   如果有图标
  if (props.icon && props.type !== 'icon') {
    return (
      <button
        className={commonCss}
        onClick={throttleClick}
        disabled={props.isDisable}
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
      </button>
    )
  }

  //   如果有图标没有内容
  if (props.type === 'icon') {
    return (
      <button
        className={commonCss}
        onClick={throttleClick}
        disabled={props.isDisable}
      >
        <IconFont type={props.icon || ''} style={{ fontSize: 20 }} />
      </button>
    )
  }

  return (
    <button
      style={props?.style}
      className={commonCss}
      onClick={throttleClick}
      disabled={props.isDisable}
    >
      {props.children}
    </button>
  )
}

export default CommonButton
