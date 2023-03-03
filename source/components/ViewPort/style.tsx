import { css } from '@emotion/css'
import styled from '@emotion/styled'

export const ViewPortWrap = styled.div`
  height: 32px;
  min-width: 120px;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  padding: 0 8px;
  border-radius: 4px;
  &:hover {
    background: #f4f5f5;
  }
`

export const Name = styled.div`
  margin-left: 8px;
  height: 22px;
  font-size: 14px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: var(--neutral-n1-d1);
  line-height: 23px;
`

export const dropdowncontent = css`
  background: #fff;
  box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%),
    0 9px 28px 8px rgb(0 0 0 / 5%);
  & .ant-dropdown-menu {
    box-shadow: none;
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
  padding: 5px 18px;
  cursor: pointer;
`
