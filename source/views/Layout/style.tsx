import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { Badge, Popover } from 'antd'

// 引导页
export const imgBoxCss = css`
  box-sizing: border-box;
`
export const footerCss = css`
  display: flex;
  justify-content: end;
  height: 75px;
  box-sizing: border-box;
  padding-right: 53px;
  align-items: center;
  gap: 24px;
`

export const Container = styled.div`
  z-index: 10;
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(135, 136, 137, 0.6);
`
export const Dialog = styled.div`
  width: 900px;
  background: rgba(245, 246, 247, 1);
  position: absolute;
  border-radius: 6px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`

export const ButtonWrap = styled.div({
  height: 30,
  width: 68,
  borderRadius: 6,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontSize: 12,
  fontWeight: 400,
  background: 'var(--primary-d2)',
  cursor: 'pointer',
})

export const ButtonWrapBorder = styled.div({
  height: 30,
  width: 68,
  borderRadius: 6,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--primary-d2)',
  fontSize: 12,
  fontWeight: 400,
  background: 'white',
  cursor: 'pointer',
  border: '1px solid var(--primary-d2)',
})

// 整体布局样式
export const LayoutWrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
`

export const LayoutSide = styled.div<{ isOpen?: boolean }>`
  height: 100%;
  width: ${props => (props.isOpen ? 200 : 80)}px;
  transition: 0.3s;
  background: var(--neutral-white-d2);
  border-right: 1px solid var(--neutral-n6-d1);
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  padding: ${props => (props.isOpen ? '18px 12px' : '18px 8px')};
  display: flex;
  flex-direction: column;
  align-items: ${props => (props.isOpen ? 'flex-start' : 'center')};
  z-index: 200;
  position: relative;
`

export const LayoutContent = styled.div<{ isOpen?: boolean }>`
  width: ${props =>
    props.isOpen ? 'calc(100% - 200px)' : 'calc(100% - 80px)'};
  transition: 0.3s;
  min-width: ${props =>
    props.isOpen ? 'calc(1440px - 200px)' : 'calc(1440px - 80px)'};
  display: flex;
  flex-direction: column;
`

export const LayoutHeader = styled.div`
  height: 56px;
  width: 100%;
  background: var(--neutral-n9);
  border-bottom: 1px solid var(--neutral-n6-d1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 198;
`

export const MainContent = styled.div`
  width: 100%;
  height: calc(100% - 56px);
`

// 左侧侧边栏样式
export const LogoWrap = styled.div<{ isOpen?: boolean }>`
  height: ${props => (props.isOpen ? 28 : 68)}px;
  width: ${props => (props.isOpen ? 152 : 64)}px;
  background: gray;
  margin-bottom: ${props => (props.isOpen ? 24 : 16)}px;
  margin-left: ${props => (props.isOpen ? 12 : 0)}px;
`

export const OtherSystemMenuNotOpen = styled.div`
  width: 68px;
  height: 64px;
  background: var(--neutral-n6-d1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const OtherSystemMenuOpen = styled.div`
  height: 28px;
  width: 152px;
  border-radius: 8px;
  padding: 0 12px;
  background: var(--neutral-n6-d1);
  cursor: pointer;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
`

export const notOpenSideMenu = css`
  height: 64px;
  width: 64px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  div {
    margin-top: 2px;
    font-size: 14px;
    color: var(--neutral-n2);
  }
  &:hover {
    background: var(--hover-d1);
  }
`

export const openSideMenu = css`
  height: 48px;
  width: 176px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 0 12px;
  cursor: pointer;
  position: relative;
  div {
    margin-left: 12px;
    color: var(--neutral-n1-d1);
    font-size: 16px;
  }
  &:hover {
    background: var(--hover-d1);
  }
`

export const activeSideMenu = css`
  background: var(--selected) !important;
  svg {
    color: var(--primary-d2) !important;
  }
  div {
    color: var(--primary-d2) !important;
  }
`

export const CollapseWrap = styled.div`
  position: absolute;
  bottom: 18px;
`

export const CollapseWrapItem = styled.div`
  width: 176px;
  display: flex;
  align-items: center;
  padding: 4px 8px;
  cursor: pointer;
  div {
    font-size: 16px;
    color: var(--neutral-n1-d1);
    margin-left: 8px;
  }
`

export const MorePopover = styled.div`
  width: 288px;
  height: 320px;
  background: var(--neutral-white-d1);
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  border-radius: 6px 6px 6px 6px;
  padding: 16px 24px;
`

export const MoreTitle = styled.div`
  font-size: 16px;
  font-family: SiYuanMedium;
  color: var(--neutral-n1-d1);
`

export const MorePopoverContent = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
`

export const MoreItem = styled.div<{ isDisable?: boolean }>`
  width: 64px;
  height: 64px;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: ${props =>
    props.isDisable
      ? '1px solid var(--neutral-n6-d2)'
      : '1px solid var(--neutral-n6-d1)'};
  margin-top: 16px;
  svg {
    color: ${props =>
      props.isDisable ? 'var(--neutral-n4)' : 'var(--neutral-n2)'};
  }
  div {
    margin-top: 2px;
    font-size: 14px;
    color: ${props =>
      props.isDisable ? 'var(--neutral-n4)' : 'var(--neutral-n2)'};
  }
  &:hover {
    border: ${props =>
      props.isDisable
        ? '1px solid var(--neutral-n6-d2)'
        : '1px solid var(--hover-d1)'};
    background: ${props =>
      props.isDisable ? 'transparent' : 'var(--hover-d1)'};
  }
`

export const FeedBadge = styled(Badge)`
  position: absolute;
  right: 12px;
`

export const MoreOtherPopover = styled(Popover)`
  left: 24px;
  top: 56px;
`

export const MoreOtherSystemWrap = styled.div`
  padding: 24px;
  border-radius: 6px;
  border: 2px solid var(--neutral-n6-d2);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  width: 348px;
  height: 248px;
`

export const MoreOtherSystemItem = styled.div`
  width: 88px;
  height: 88px;
  padding: 5px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  .box {
    height: 48px;
    width: 48px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--neutral-n7);
  }
  .name {
    margin-top: 8px;
    font-size: 14px;
    color: var(--neutral-n1-d1);
    font-family: SiYuanMedium;
  }
`

// 头部导航样式
export const LayoutHeaderLeftWrap = styled.div`
  display: flex;
  align-items: center;
  div {
    font-size: 16px;
    color: var(--neutral-n1-d1);
    font-family: SiYuanMedium;
    margin-left: 8px;
  }
`

export const LayoutHeaderRightWrap = styled.div`
  display: flex;
  align-items: center;
`

export const UserInfoWrap = styled.div`
  background: var(--neutral-white-d6);
  border-radius: 6px;
  padding: 16px 0;
  width: 300px;
`

export const UserInfoTop = styled.div`
  padding: 0 16px 12px;
  display: flex;
  align-items: center;
`

export const UserInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;
`

export const NameWrap = styled.div`
  color: var(--neutral-n1-d1);
  margin-bottom: 2px;
  font-size: var(--font14);
`

export const PhoneWrap = styled.div`
  color: var(--neutral-n3);
  margin-bottom: 2px;
  font-size: var(--font14);
`

export const MenuItems = styled.div`
  margin-top: 12px;
`

export const MenuLeft = styled.div`
  display: flex;
  align-items: center;
  font-size: var(--font14);
  svg {
    margin-right: 8px;
  }
`

export const MenuRight = styled.div`
  display: flex;
  align-items: center;
  color: var(--neutral-n3);
  font-size: var(--font12);
  svg {
    margin-left: 4px;
  }
`

export const MenuItem = styled.div`
  height: 40px;
  cursor: pointer;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--neutral-white-d6);
  color: var(--neutral-n2);
  &:hover {
    background: var(--hover-d3);
    .menuLeft {
      color: var(--neutral-n1-d1);
    }
  }
`

export const Provider = styled.div<{ isBottom?: boolean }>`
  height: 1px;
  width: 88%;
  margin-left: 6%;
  background: var(--neutral-n6-d1);
  margin-bottom: ${props => (props.isBottom ? 16 : 0)}px;
`

export const ChangeItems = styled.div`
  padding: 4px 0;
  border-radius: 6px;
  background: var(--neutral-white-d6);
  min-width: 120px;
`

export const ChangeItem = styled.div<{ isActive?: boolean; height?: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${props => props.height || 32}px;
  cursor: pointer;
  padding: 0 16px;
  color: ${props =>
    props.isActive ? 'var(--primary-d2)' : 'var(--neutral-n2)'};
  &:hover {
    color: var(--neutral-n1-d1);
    background-color: var(--hover-d3);
    svg {
      color: var(--neutral-n1-d1);
    }
  }
`

export const HeaderUserInfoWrap = styled.div<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-left: 12px;
  svg {
    color: ${props =>
      props.isActive ? 'var(--primary-d1)' : 'var(--neutral-n3)'};
  }
`

export const HeaderItemWrap = styled.div<{ isActive?: boolean }>`
  height: 32px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  border-radius: 4px;
  background: ${props => (props.isActive ? 'var(--active)' : 'transparent')};
  svg {
    color: var(--neutral-n3);
  }
  div {
    font-size: 14px;
    color: var(--neutral-n1-d1);
  }
  &:hover {
    background: var(--active);
  }
`

export const CompanyCards = styled.div`
  min-height: 384px;
  max-height: 540px;
  overflow-y: auto;
  padding: 0 16px;
  padding-top: 8px;
`
