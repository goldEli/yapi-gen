import styled from '@emotion/styled'

export const AllWrap = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`

export const WrapDetail = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
  transition: 0.2s;
  position: relative;
  white-space: nowrap;
`

export const WrapSet = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
  transition: 0.2s;
  display: none;
  white-space: nowrap;
`

export const WrapCategory = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
  transition: 0.2s;
  white-space: nowrap;
`

export const SideTop = styled.div`
  display: flex;
  align-items: center;
  padding: 24px 24px 14px;
  img {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    margin-right: 8px;
  }
`

export const SideInfo = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;
  width: calc(100% - 40px);
  div {
    color: var(--neutral-n1-d1);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  span {
    color: var(--neutral-n3);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export const MenuBox = styled.div`
  height: calc(100% - 150px);
  overflow-y: scroll;
  overflow-x: hidden;
`

export const MenuItem = styled.div<{ isActive?: boolean }>`
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  color: ${props =>
    props.isActive ? 'var(--primary-d2)' : 'var(--neutral-n1-d2)'};
  cursor: pointer;
  div {
    margin-left: 12px;
  }
  svg {
    color: ${props =>
      props.isActive ? 'var(--primary-d2)' : 'var(--neutral-n3'};
  }
  background: ${props =>
    props.isActive ? 'var(--gradient-left)' : 'transparent'};
  &:hover {
    svg {
      color: var(--primary-d2) !important;
    }
    color: var(--primary-d2) !important;
  }
`

export const Provider = styled.div`
  height: 1px;
  width: 88%;
  margin-left: 6%;
  background: var(--neutral-n6-d1);
  margin-bottom: 16px;
`

export const SideFooter = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 44px;
  cursor: pointer;
  background: var(--neutral-n9);
  position: absolute;
  bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  border-right: 1px solid var(--neutral-n6-d1);
  div {
    display: flex;
    align-items: center;
    div {
      margin-left: 12px;
      font-size: 14px;
      color: var(--neutral-n1-d2);
    }
  }
  &:hover {
    div,
    svg {
      color: var(--primary-d2) !important;
    }
  }
`
