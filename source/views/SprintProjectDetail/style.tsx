import styled from '@emotion/styled'
import { Space } from 'antd'

export const Wrap = styled.div`
  height: 100%;
  display: flex;
  padding: 20px 16px 0 0px;
  flex-direction: column;
`

export const ContentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  padding-bottom: 20px;
  background: var(--neutral-white-d6);
`

export const HeaderLeft = styled.div`
  padding-left: 24px;
`

export const HeaderRight = styled(Space)`
  display: flex;
  align-items: center;
`

export const MemberIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--neutral-n6-d1);
  cursor: pointer;
  background: var(--neutral-white-d4);
  :hover {
    background: var(--hover-d2);
    border: none;
  }
  :hover svg {
    color: var(--primary-d1);
  }
`
