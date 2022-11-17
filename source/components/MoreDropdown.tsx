// 更多的点点，加宽hover区域

/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Dropdown } from 'antd'
import IconFont from './IconFont'

const DropdownWrap = styled(Dropdown)({
  visibility: 'hidden',
  cursor: 'pointer',
  '&: hover': {
    svg: {
      color: '#2877ff',
    },
  },
})

interface Props {
  isMoreVisible?: any
  menu: any
  onChangeVisible?(visible: any): void
  isHidden?: any
  size?: any
  color?: any
}

const MoreDropdown = (props: Props) => {
  return (
    <DropdownWrap
      key={props.isMoreVisible ? props.isMoreVisible.toString() : null}
      visible={props.isMoreVisible}
      overlay={props.menu}
      trigger={['hover']}
      placement="bottomRight"
      getPopupContainer={node => node}
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
