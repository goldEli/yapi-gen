/* eslint-disable @typescript-eslint/naming-convention */
import useButtonPalette from '@/hooks/useButtonPalette'
import { useThrottle } from '@/hooks/useThrottle'
import styled from '@emotion/styled'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import { useSelector } from '@store/index'
import { Space } from 'antd'
import { type ReactNode } from 'react'

const ButtonWrap = styled(Button)<{ cssStyle?: any; themeColor?: any }>`
  border-radius: 6px;
  height: 32px;
  padding: 0 16px;
  border: none;
  font-size: ${(props: any) => props.themeColor.font14};
  span:first-child {
    display: flex;
    align-items: center;
  }
  svg {
    font-size: ${(props: any) => props.themeColor.font16}!important;
  }
  background: ${(props: any) => props.cssStyle.normal.background}!important;
  color: ${(props: any) => props.cssStyle.normal.text}!important;
  &:hover {
    background: ${(props: any) => props.cssStyle.hover.background}!important;
    color: ${(props: any) => props.cssStyle.hover.text}!important;
  }
  &:active {
    background: ${(props: any) => props.cssStyle.active.background}!important;
    color: ${(props: any) => props.cssStyle.active.text}!important;
  }
  &:disabled {
    background: ${(props: any) => props.cssStyle.disable.background}!important;
    color: ${(props: any) => props.cssStyle.disable.text}!important;
  }
  :after {
    border: 0 none;
    opacity: 0;
    animation: none 0 ease 0 1 normal;
    outline: none;
  }
`

interface Props {
  onClick?(): void
  // 按钮文本
  children: string
  // 按钮类型
  type: string
  //   图标位置
  iconPlacement?: 'left' | 'right'
  //   图标
  iconNode?: ReactNode
  //   是否禁用
  isDisable?: boolean
}

const CommonButton = (props: Props) => {
  const buttonPalette: any = useButtonPalette()
  const { theme } = useSelector(store => store.global)

  const throttleClick = useThrottle(() => {
    props.onClick?.()
  }, 1000)

  //   如果有图标
  if (props.iconNode) {
    return (
      <ButtonWrap
        onClick={throttleClick}
        disabled={props.isDisable}
        cssStyle={buttonPalette[props.type]}
        themeColor={theme.themeColors}
      >
        {props.iconPlacement === 'right' && (
          <>
            <div style={{ marginRight: 8 }}>{props.children}</div>
            {props.iconNode}
          </>
        )}
        {props.iconPlacement !== 'right' && (
          <>
            {props.iconNode}
            <div style={{ marginLeft: 8 }}>{props.children}</div>
          </>
        )}
      </ButtonWrap>
    )
  }

  return (
    <ButtonWrap
      onClick={throttleClick}
      disabled={props.isDisable}
      cssStyle={buttonPalette[props.type]}
      themeColor={theme.themeColors}
    >
      {props.children}
    </ButtonWrap>
  )
}

export default CommonButton
