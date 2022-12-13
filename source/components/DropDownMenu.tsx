// 操作栏有下拉的组件

/* eslint-disable @typescript-eslint/naming-convention */
import { Dropdown } from 'antd'
import IconFont from './IconFont'
import { HoverWrap } from './StyleCommon'

interface Props {
  menu: any
  hasIcon?: boolean
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
      placement="bottomRight"
      onOpenChange={visible => props.onChangeVisible?.(visible)}
    >
      <HoverWrap isActive={props.isActive}>
        <IconFont
          style={{
            marginRight: 8,
            fontSize: 18,
          }}
          type={props?.icon}
        />
        {props.children}
      </HoverWrap>
    </Dropdown>
  )
}

export default DropDownMenu
