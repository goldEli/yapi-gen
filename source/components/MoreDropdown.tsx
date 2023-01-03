// 更多的点点、列表每列的操作图标，加宽hover区域

/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Dropdown } from 'antd'
import IconFont from './IconFont'

const DropdownWrap = styled(Dropdown)<{ isDemandCard?: any }>(
  {
    cursor: 'pointer',
    '&: hover': {
      svg: {
        color: '#2877ff',
      },
    },
    '.ant-dropdown-menu-item, .ant-dropdown-menu-submenu-title': {
      textAlign: 'left',
    },
  },
  ({ isDemandCard }) => ({
    visibility: isDemandCard ? 'visible' : 'hidden',
  }),
)

interface Props {
  isMoreVisible?: any
  menu: any
  onChangeVisible?(visible: any): void
  isHidden?: any
  size?: any
  color?: any
  // 是否是子表格
  hasChild?: any
  // 需求卡片默认显示
  isDemandCard?: any
}

const MoreDropdown = (props: Props) => {
  return (
    <DropdownWrap
      isDemandCard={props?.isDemandCard}
      destroyPopupOnHide
      key={
        props.isMoreVisible && !props?.hasChild
          ? props.isMoreVisible.toString()
          : Math.random()
      }
      visible={props?.hasChild ? void 0 : props.isMoreVisible}
      overlay={props.menu}
      trigger={['hover']}
      placement={props?.hasChild ? 'bottomLeft' : 'bottomRight'}
      getPopupContainer={node => (props?.hasChild ? document.body : node)}
      onVisibleChange={visible => props.onChangeVisible?.(visible)}
      className="dropdownIcon"
    >
      <div
        hidden={props.isHidden}
        style={{
          width: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: props.size ? 12 : 0,
        }}
      >
        <IconFont
          style={{
            fontSize: props.size || 16,
            color: props.color || '#BBBDBF',
          }}
          type="more"
        />
      </div>
    </DropdownWrap>
  )
}

export default MoreDropdown
