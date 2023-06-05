// 更多的点点、列表每列的操作图标，加宽hover区域

import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { css } from '@emotion/css'
import { Dropdown, Tooltip } from 'antd'

/* eslint-disable @typescript-eslint/naming-convention */

interface Props {
  isMoreVisible?: any
  menu: any
  onChangeVisible?(visible: any): void
  isHidden?: any
  size?: any
  color?: any
  // 是否是子表格
  hasChild?: any
  contentText: any
}

const ContentText = styled.div`
  &:hover {
    color: var(--auxiliary-b1);
  }
  margin-right: 8px;
  color: var(--neutral-n1-d1);
  max-width: 150px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`
const dropdownIcon = css({
  cursor: 'pointer',
  '&: hover': {
    svg: {
      color: 'var(--auxiliary-b1)',
    },
  },
  '.ant-dropdown-menu-item, .ant-dropdown-menu-submenu-title': {
    textAlign: 'left',
  },
})

const ClickDropdown = (props: Props) => {
  return (
    <Dropdown
      key={
        props.isMoreVisible && !props?.hasChild
          ? props.isMoreVisible.toString()
          : Math.random()
      }
      destroyPopupOnHide
      visible={props?.hasChild ? void 0 : props.isMoreVisible}
      overlay={props.menu}
      trigger={['click']}
      placement={props?.hasChild ? 'bottomLeft' : 'bottomRight'}
      getPopupContainer={() => document.body}
      onVisibleChange={(visible: any) => props.onChangeVisible?.(visible)}
      className={dropdownIcon}
    >
      <div
        hidden={props.isHidden}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: props.size ? 12 : 0,
        }}
      >
        <Tooltip placement="topLeft" title={props.contentText}>
          <ContentText>
            {props.contentText ? props.contentText : '--'}
          </ContentText>
        </Tooltip>
        <IconFont
          style={{
            fontSize: props.size || 14,
            color: props.color || 'var(--neutral-n4)',
          }}
          type="down-icon"
        />
      </div>
    </Dropdown>
  )
}

export default ClickDropdown
