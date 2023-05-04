import styled from '@emotion/styled'

export const Wrap = styled.div``

export const Title = styled.div`
  height: 22px;
  font-size: 14px;
  color: var(--neutral-n1-d1);
  font-family: SiYuanMedium;
  line-height: 22px;
  white-space: nowrap;
`

export const First = styled.div`
  margin: 24px;
  margin-top: 24px;
  border-bottom: 1px solid var(--neutral-n6-d1);
  padding-bottom: 14px;
`

export const MenuItem = styled.div<{ idx: boolean }>`
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  color: var(--neutral-n1-d2);
  cursor: pointer;
  white-space: nowrap;
  div {
    margin-left: 12px;
  }

  & {
    svg {
      color: ${props => (props.idx ? 'var(--primary-d2) !important' : '')};
    }
    background: ${props => (props.idx ? 'var(--gradient-left)' : '')};
    color: ${props => (props.idx ? 'var(--primary-d2) !important' : '')};
  }
  &:hover {
    svg {
      color: var(--primary-d2);
    }
    color: var(--primary-d2);
  }
`

export const Back = styled.div`
  font-size: 12px;
  display: flex;
  align-items: center;
  color: var(--neutral-n3);
  margin-bottom: 14px;
  margin-left: 19px;
  &:hover {
    cursor: pointer;
    color: var(--primary-d1);
  }
`
