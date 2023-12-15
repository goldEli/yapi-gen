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
  isFlexStart?: boolean
}>`
  display: flex;
  align-items: center;
  align-items: ${prop => (prop.isFlexStart ? 'flex-start' : 'center')};
  box-sizing: border-box;
  padding: ${prop => (prop.isFlexStart ? '12px 16px' : '16px 16px')};
  border-radius: 6px 6px 6px 6px;
  cursor: pointer;
  &:hover {
    background-color: var(--hover-d2);
  }
  .icons {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: rgba(250, 151, 70, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .name {
    width: 120px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-family: SiYuanMedium;
    &:hover {
      color: var(--primary-d2);
    }
    color: ${prop =>
      prop.hasClick ? 'var(--neutral-n4)' : 'var(--neutral-n1-d1)'};
  }
  .system {
    width: 120px;
    font-family: SiYuanMedium;
    color: ${prop =>
      prop.hasClick ? 'var(--neutral-n4)' : 'var(--neutral-n1-d1)'};
  }

  .content {
    color: ${prop =>
      prop.hasClick ? 'var(--neutral-n4)' : 'var(--neutral-n1-d1)'};
    font-size: 14px;
    margin: 0px 8px;
    flex: 1;
    &:hover {
      color: ${prop => (prop.hasLink ? 'var(--primary-d2)' : null)};
      text-decoration: ${prop => (prop.hasLink ? 'underline' : 'none')};
    }
  }
  .time {
    color: var(--neutral-n3);
    font-size: 12px;
    white-space: nowrap;
    flex-grow: 0;
    flex-shrink: 0;
  }
`

export const ItemImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
`
