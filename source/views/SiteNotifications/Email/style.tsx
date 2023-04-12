import styled from '@emotion/styled'

export const Content = styled.div`
  padding: 48px 56px;
`

export const Content1 = styled.div`
  height: 22px;
  font-size: 14px;
  font-weight: 400;
  color: var(--neutral-n1-d1);
  line-height: 22px;
  margin: 16px 0;
`

export const ContentEmail = styled.span`
  padding: 5px 10px;
  height: 32px;
  background: #f6f7f9;
  border-radius: 6px 6px 6px 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--neutral-n1-d1);
  margin-left: 8px;
`

export const ContentEmail2 = styled.span<{ active?: boolean }>`
  cursor: pointer;
  padding: 2px 8px;
  height: 28px;
  background: ${props => (props.active ? ' rgba(102,136,255,0.1)' : '#F2F2F4')};
  border-radius: 6px 6px 6px 6px;
  font-size: 14px;
  font-weight: 500;
  user-select: none;
  color: ${props =>
    props.active ? 'var(--primary-d1)' : 'var(----neutral-n2)'};
  margin-left: 8px;
  line-height: 28px;
`

export const ActiveContentEmail2 = styled.span<{ active?: boolean }>`
  transition: all 0.5s;
  visibility: ${props => (props.active ? 'visible' : 'hidden')};
`
