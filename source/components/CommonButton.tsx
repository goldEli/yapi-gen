/* eslint-disable @typescript-eslint/naming-convention */
import useButtonPalette from '@/hooks/useButtonPalette'
import { useThrottle } from '@/hooks/useThrottle'
import styled from '@emotion/styled'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import { useSelector } from '@store/index'
import { Space } from 'antd'
import IconFont from './IconFont'

const ButtonWrap = styled(Button)<{ color?: any; theme?: any }>`
  border-radius: 6px;
  height: 32px;
  padding: 0 16px;
  border: none;
  font-size: ${(props: any) => props.theme.font14};
  span:first-child {
    display: flex;
    align-items: center;
  }
  svg {
    font-size: ${(props: any) => props.theme.font16}!important;
  }
  background: ${(props: any) => props.color.normal.background}!important;
  color: ${(props: any) => props.color.normal.text}!important;
  &:hover {
    background: ${(props: any) => props.color.hover.background}!important;
    color: ${(props: any) => props.color.hover.text}!important;
  }
  &:active {
    background: ${(props: any) => props.color.active.background}!important;
    color: ${(props: any) => props.color.active.text}!important;
  }
  &:disabled {
    background: ${(props: any) => props.color.disable.background}!important;
    color: ${(props: any) => props.color.disable.text}!important;
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
  children?: string
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
}

const CommonButton = (props: Props) => {
  const buttonPalette: any = useButtonPalette()
  const { theme } = useSelector(store => store.global)

  const throttleClick = useThrottle(() => {
    props.onClick?.()
  }, 1000)

  //   如果有图标
  if (props.icon && props.type !== 'icon') {
    return (
      <ButtonWrap
        onClick={throttleClick}
        disabled={props.isDisable}
        color={buttonPalette[props.type]}
        theme={theme.themeColors}
      >
        {props.iconPlacement === 'right' && (
          <Space size={8}>
            <IconFont type={props.icon} />
            {props.children}
          </Space>
        )}
        {props.iconPlacement !== 'right' && (
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
        onClick={throttleClick}
        disabled={props.isDisable}
        color={buttonPalette[props.type]}
        theme={theme.themeColors}
      >
        <IconFont type={props.icon || ''} style={{ fontSize: 20 }} />
      </ButtonWrap>
    )
  }

  return (
    <ButtonWrap
      onClick={throttleClick}
      disabled={props.isDisable}
      color={buttonPalette[props.type]}
      theme={theme.themeColors}
    >
      {props.children}
    </ButtonWrap>
  )
}

export default CommonButton
