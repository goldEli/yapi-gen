import styled from '@emotion/styled'
import { Space } from 'antd'

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
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

export const SearchOrProjectMember = styled(Space)`
  display: flex;
  align-items: center;
`
