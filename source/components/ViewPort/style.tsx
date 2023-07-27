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
  & span {
    color: ${props =>
      props.show ? 'var(--neutral-n1-d1)' : 'var(--neutral-n3)'};
  }
  &:hover {
    background: var(--hover-d1);
    color: var(--neutral-n1-d1);
  }
  &:hover span {
    /* background: var(--hover-d1); */
    color: var(--neutral-n1-d1);
  }
  &:active {
    background: var(--neutral-n6-d1);
  }
`

export const Name = styled.span`
  margin-left: 8px;
  height: 22px;
  font-size: 14px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: var(--neutral-n3);
  line-height: 23px;
`
export const TextSpan = styled.span`
  height: 22px;
  font-size: 14px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: var(--neutral-n2);
  line-height: 22px;
  :hover {
    /* color: red; */
  }
`
export const dropdowncontent = css`
  border-radius: 6px;
  padding: 5px 0;
  cursor: pointer;
  background: var(--neutral-white-d2);
  box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%),
    0 9px 28px 8px rgb(0 0 0 / 5%);
  & .ant-dropdown-menu {
    box-shadow: none;
  }
  .ant-dropdown-menu-item-group-list {
    margin: 0;
  }
  .ant-dropdown-menu-item-group-list li {
    :hover ${TextSpan} {
      color: var(--neutral-n1-d1);
    }
    /* border-radius: 6px; */
  }
`

export const SetLine = styled.div`
  margin: 5px 0px;
  padding: 5px 12px;
  cursor: pointer;
  :hover {
    background: var(--hover-d3) !important;
    /* color: var(--neutral-n1-d1); */
    /* border-radius: 6px; */
  }
  :hover ${TextSpan} {
    color: var(--neutral-n1-d1);
  }
`
