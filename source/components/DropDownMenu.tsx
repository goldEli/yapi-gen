// 操作栏有下拉的组件 例：项目列表右上角切换视图

/* eslint-disable @typescript-eslint/naming-convention */
import { Dropdown } from 'antd'
import ScreenMinHover from './ScreenMinHover'
import styled from '@emotion/styled'

const Wrap = styled.div`
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s;
  white-space: nowrap;
  &:hover {
    background: var(--hover-d1);
    color: var(--neutral-n1-d1);
  }
  &:active {
    background: var(--neutral-n6-d1);
  }
`

interface Props {
  menu: any
  notIcon?: boolean
  children: any
  icon?: any
  isVisible?: boolean
  onChangeVisible?(visible: any): void
  isActive?: boolean
}

const DropDownMenu = (props: Props) => {
  return (
    <Dropdown
      open={props?.isVisible}
      overlay={props?.isVisible ? props.menu : ''}
      getPopupContainer={node => node}
      trigger={['hover']}
      placement={props.icon === 'settings' ? 'bottomRight' : 'bottomLeft'}
      onOpenChange={visible => props.onChangeVisible?.(visible)}
    >
      <div>
        {props.notIcon && <Wrap>{props.children}</Wrap>}
        {!props.notIcon && (
          <ScreenMinHover isActive={props.isActive} icon={props?.icon}>
            {props.children}
          </ScreenMinHover>
        )}
      </div>
    </Dropdown>
  )
}

export default DropDownMenu
