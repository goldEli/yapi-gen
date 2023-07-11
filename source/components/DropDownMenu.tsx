// 操作栏有下拉的组件 例：项目列表右上角切换视图

/* eslint-disable @typescript-eslint/naming-convention */
import { Dropdown } from 'antd'
import IconFont from './IconFont'
import { HoverWrap } from './StyleCommon'
import ScreenMinHover from './ScreenMinHover'

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
      placement={props.icon === 'settings' ? 'bottomRight' : 'bottomLeft'}
      onOpenChange={visible => props.onChangeVisible?.(visible)}
    >
      <div>
        {/* <ScreenMinHover isActive={props.isActive} icon={props?.icon}> */}
        {props.children}
        {/* </ScreenMinHover> */}
      </div>
    </Dropdown>
  )
}

export default DropDownMenu
