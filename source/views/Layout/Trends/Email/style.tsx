import styled from '@emotion/styled'

export const Content = styled.div`
  height: calc(100% - 56px);
  overflow-y: auto;
`

export const FooterWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 56px;
  gap: 16px;
  padding-top: 24px;
`

export const Content1 = styled.div<{ margin?: number }>`
  height: 22px;
  font-size: 14px;
  font-weight: 400;
  color: var(--neutral-n1-d1);
  line-height: 22px;
  margin-bottom: ${(props: any) => `${props.margin}px`};
`

export const ContentEmail = styled.span`
  padding: 5px 10px;
  height: 32px;
  background: #f6f7f9;
  border-radius: 6px 6px 6px 6px;
  font-size: 14px;
  font-family: siyuanmedium;
  color: var(--neutral-n1-d1);
`

export const ContentEmail2 = styled.span<{ active?: boolean }>`
  white-space: nowrap;
  cursor: pointer;
  padding: 2px 8px;
  height: 28px;
  background: ${props => (props.active ? ' rgba(102,136,255,0.1)' : '#F2F2F4')};
  border-radius: 6px 6px 6px 6px;
  font-size: 14px;
  font-weight: 500;
  user-select: none;
  color: ${props => (props.active ? 'var(--primary-d1)' : 'var(--neutral-n2)')};
  line-height: 28px;
`

export const ActiveContentEmail2 = styled.span<{ active?: boolean }>`
  transition: all 0.5s;
  visibility: ${props => (props.active ? 'visible' : 'hidden')};
`
