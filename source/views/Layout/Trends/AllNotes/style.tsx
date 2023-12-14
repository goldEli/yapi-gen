import styled from '@emotion/styled'

export const MessageListWrap = styled.div`
  height: calc(100% - 38px);
  background: var(--neutral-white-d1);
  box-sizing: border-box;
  padding: 0px 24px;
  position: relative;
  .pagination-box {
    position: absolute;
    bottom: 0px;
    right: 24px;
  }
`

export const HeaderWrap = styled.div`
  height: 72px;
  display: flex;
  align-items: center;
`

export const ContentWrap = styled.div`
  height: calc(100% - 110px);
  overflow: auto;
`

export const ItemBox = styled.div<{
  hasLink?: boolean
  hasClick?: boolean
}>`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0px 16px;
  border-radius: 6px 6px 6px 6px;
  height: 56px;
  cursor: pointer;
  &:hover {
    background-color: var(--hover-d2);
  }
  .name {
    width: 120px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    &:hover {
      color: var(--primary-d2);
    }
  }
  .system {
    width: 120px;
  }

  .content {
    color: ${prop =>
      prop.hasClick ? 'var(--neutral-n4)' : 'var(--neutral-n1-d1)'};
    font-size: 14px;
    margin: 0px 8px;
    &:hover {
      color: ${prop => (prop.hasLink ? 'var(--primary-d2)' : null)};
      text-decoration: ${prop => (prop.hasLink ? 'underline' : null)};
    }
  }
  .time {
    color: var(--neutral-n3);
    font-size: 12px;
    white-space: nowrap;
  }
`

export const ItemImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
`
