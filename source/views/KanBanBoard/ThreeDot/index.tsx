import React from 'react'
import styled from '@emotion/styled'
import MoreDropdown from '@/components/MoreDropdown'
import { Dropdown, Menu } from 'antd'
import IconFont from '@/components/IconFont'
import { HoverIcon } from '../IssueCard/styled'

interface ThreeDotProps {}

const ThreeDotBox = styled.div`
  width: 100%;
`

const ThreeDot: React.FC<ThreeDotProps> = props => {
  const menu = () => (
    <Menu
      items={[
        {
          key: '1',
          label: <div>1</div>,
        },
        {
          key: '2',
          label: <div>2</div>,
        },
      ]}
    />
  )
  return (
    <Dropdown
      trigger={['hover']}
      menu={{
        items: [
          {
            key: 'edit',
            label: <span>2</span>,
          },
          {
            key: 'over',
            label: <span>2</span>,
          },
        ],
      }}
      placement="bottomRight"
      getPopupContainer={(i: any) => i.parentNode}
    >
      <HoverIcon>
        <IconFont
          style={{
            color: 'var(--neutral-n3)',
          }}
          type="more"
        />
      </HoverIcon>
    </Dropdown>
  )
  return (
    <MoreDropdown
      isHidden={false}
      isMoreVisible={true}
      onChangeVisible={() => {}}
      menu={menu()}
    />
  )
}

export default ThreeDot
