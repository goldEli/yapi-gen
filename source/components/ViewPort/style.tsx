import { css } from '@emotion/css'
import styled from '@emotion/styled'

export const ViewPortWrap = styled.div<{ show: boolean }>`
  cursor: pointer;
  height: 32px;
  min-width: 120px;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  padding: 0 8px;
  border-radius: 6px;
  background: ${props => (props.show ? 'var(--hover-d1)' : '')};
  color: ${props =>
    props.show ? 'var(--neutral-n1-d1)' : 'var(--neutral-n3)'};
  & div {
    color: ${props =>
      props.show ? 'var(--neutral-n1-d1)' : 'var(--neutral-n3)'};
  }
  &:hover {
    background: var(--hover-d1);
    color: var(--neutral-n1-d1);
  }
  &:hover div {
    background: var(--hover-d1);
    color: var(--neutral-n1-d1);
  }
`

export const Name = styled.div`
  margin-left: 8px;
  height: 22px;
  font-size: 14px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: var(--neutral-n3);
  line-height: 23px;
`

export const dropdowncontent = css`
  padding: 5px;
  cursor: pointer;
  background: var(--neutral-white-d2);
  box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%),
    0 9px 28px 8px rgb(0 0 0 / 5%);
  & .ant-dropdown-menu {
    box-shadow: none;
  }
  .ant-dropdown-menu-item-group-list li {
    border-radius: 6px;
  }
`
export const TextSpan = styled.span`
  height: 22px;
  font-size: 14px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: var(--neutral-n2);
  line-height: 22px;
`

export const SetLine = styled.div`
  margin: 5px 8px;
  padding: 5px 10px;
  cursor: pointer;
  :hover {
    background: var(--hover-d3) !important;
    border-radius: 6px;
  }
`
