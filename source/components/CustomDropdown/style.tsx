import styled from '@emotion/styled'
import { Dropdown } from 'antd'

export const StyleDropdown = styled(Dropdown)`
  ul {
    background: red !important;
  }
  &.ant-dropdown-menu-item:hover {
    color: var(--neutral-n1-d1) !important;
    background: var(--hover-d3) !important;
  }
`
