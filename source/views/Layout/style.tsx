import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { Badge, Popover, Spin } from 'antd'

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
  flex: 1;
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

export const MainContent = styled.div<{ isOpen?: boolean }>`
  min-width: ${props =>
    props.isOpen ? 'calc(1440px - 200px)' : 'calc(1440px - 80px)'};
  height: calc(100% - 56px);
  overflow-x: auto;
`

// 左侧侧边栏样式
export const NotOpenLogoWrap = styled.div`
  height: 68px;
  width: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .logo {
    width: 40px;
    height: 40px;
  }
  .img {
    width: 40px;
    height: 24px;
  }
`

export const OpenLogoWrap = styled.div`
  height: 40px;
  width: 152px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 0 12px;
  .logo {
    width: 28px;
    height: 28px;
  }
  .img {
    width: 96px;
    height: 24px;
    margin-left: 8px;
  }
`

export const OtherSystemMenuNotOpen = styled.div`
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 50%;
  background: var(--neutral-n6-d1);
  justify-content: center;
`

export const OtherSystemMenuOpen = styled.div`
  height: 40px;
  width: 152px;
  border-radius: 8px;
  padding: 0 12px;
  background: var(--neutral-n6-d1);
  cursor: pointer;
  display: flex;
  align-items: center;
  .img {
    margin-left: 12px;
  }
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
  padding: 0 8px;
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

export const PersonalHead = styled.div`
  margin-top: 15px;
`

export const LineBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const Line = styled.div`
  margin-top: 24px;
  color: var(--neutral-n2);
  white-space: nowrap;
`

export const Line2 = styled.div`
  margin-top: 24px;
  color: var(--neutral-n1-d1);
  max-width: 70%;
  text-align: right;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

export const MenuItemBox = styled.div`
  height: 40px;
  font-size: 14px;
  color: var(--neutral-n2);
  display: flex;
  align-items: center;
  padding: 0px 16px;
  cursor: pointer;
  user-select: none;
  &:hover {
    background: var(--hover-d3);
    color: var(--neutral-n1-d1);
    svg {
      color: var(--neutral-n1-d1);
    }
  }
`

// 快捷-我的模块样式 和 最近的样式
export const QuickPopover = styled.div<{ local?: string }>`
  width: ${props => (props.local === 'zh' ? '320px' : '400px')};
  background: var(--neutral-white-d1);
  border-radius: 6px;
  padding: 20px 0px 0;
`

export const HeaderWrap = styled.div`
  padding: 0 16px;
  width: 100%;
`

export const TabsWrap = styled.div`
  position: relative;
  width: 100%;
  height: 32px;
  padding: 2px;
  display: flex;
  align-items: center;
  background-color: var(--hover-d2);
  border-radius: 4px;
  margin-bottom: 2px;
`

export const TabsWrapItem = styled.div<{ active: boolean }>`
  white-space: nowrap;
  height: 28px;
  z-index: 1;
  padding: 4px 16px;
  border-radius: 4px;
  cursor: pointer;
  color: ${props => (props.active ? 'var(--primary-d2);' : '')};
  transition: all 0.5s;
`

export const ActiveTab = styled.div`
  position: absolute;
  bottom: 2px;
  left: 2px;
  min-width: 56px;
  padding: 4px 16px;
  border-radius: 4px;
  height: 28px;
  background: var(--neutral-white-d6);
  transition: left 0.4s;
`

export const ContentWrap = styled.div`
  height: calc(100vh - 350px);
  overflow-y: auto;
`

// 待审核样式
export const VerifyItem = styled.div`
  height: 56px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    display: flex;
    align-items: center;
    width: 78%;
    cursor: pointer;
    .img {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
    .name {
      display: flex;
      flex-direction: column;
      width: 70%;
      span {
        display: inline-block;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .title {
        font-size: 14px;
        color: var(--neutral-n1-d1);
      }
      .sub {
        font-size: 12px;
        color: var(--neutral-n3);
      }
    }
  }
  &:hover {
    background: var(--hover-d3);
  }
`

export const Border = styled.div`
  margin: 0 16px;
  text-align: center;
  border-bottom: 1px solid var(--neutral-n6-d1);
`

export const Footer = styled.div`
  height: 52px;
  width: 100%;
  cursor: pointer;
  line-height: 52px;
  padding-left: 24px;
  color: var(--neutral-n1-d1);
  font-size: 14px;
  &:hover {
    color: var(--primary-d1);
  }
`

export const ItemWrap = styled.div`
  display: flex;
  flex-direction: column;
`

export const TimeName = styled.div`
  margin-top: 16px;
  color: var(--neutral-n3);
  font-size: 12px;
  padding-left: 16px;
`

export const CanClick = styled.div`
  height: 24px;
  border-radius: 6px;
  padding: 0 8px;
  cursor: pointer;
  color: var(--neutral-white-d7);
  font-size: 12px;
  background: var(--primary-d2);
  line-height: 24px;
  width: fit-content;
`

export const TaskItem = styled.div`
  height: 56px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 7px 16px;
  cursor: pointer;
  width: 100%;
  .left {
    display: flex;
    align-items: flex-start;
    width: calc(100% - 52px);
    .icon {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
    .info {
      display: flex;
      flex-direction: column;
      width: calc(100% - 40px);
      .name {
        font-size: 14px;
        color: var(--neutral-n1-d1);
        width: 100%;
        display: inline-block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .sub {
        font-size: 12px;
        color: var(--neutral-n3);
        width: 100%;
        display: inline-block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
  &:hover {
    background: var(--hover-d3);
  }
`

export const ReportItem = styled.div`
  height: 56px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 7px 16px;
  cursor: pointer;
  .left {
    display: flex;
    align-items: center;
    width: calc(100% - 36px);
    .info {
      display: flex;
      flex-direction: column;
      width: calc(100% - 50px);
      margin-left: 12px;
      .name {
        font-size: 14px;
        color: var(--neutral-n1-d1);
        width: 100%;
        display: inline-block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .sub {
        font-size: 12px;
        color: var(--neutral-n3);
        width: 100%;
        display: inline-block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
  .right {
    font-size: 12px;
    color: var(--neutral-n3);
  }
  &:hover {
    background: var(--hover-d3);
  }
`

export const ProjectItem = styled.div<{ local?: string }>`
  height: 56px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 7px 16px;
  cursor: pointer;
  .left {
    display: flex;
    align-items: flex-start;
    width: ${props =>
      props.local === 'zh' ? 'calc(100% - 32px)' : 'calc(100% - 56px)'};
    .icon {
      height: 32px;
      height: 32px;
      border-radius: 4px;
      overflow: hidden;
    }
    .info {
      display: flex;
      flex-direction: column;
      width: calc(100% - 50px);
      margin-left: 12px;
      .name {
        font-size: 14px;
        color: var(--neutral-n1-d1);
        width: 100%;
        display: inline-block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .sub {
        font-size: 12px;
        color: var(--neutral-n3);
        width: 100%;
        display: inline-block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
  .right {
    /* font-size: 12px;
    color: var(--neutral-n3); */
  }
  &:hover {
    background: var(--hover-d3);
  }
`

export const StatusBox = styled.div`
  width: 52px;
  height: 24px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  line-height: 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 8px;
`

export const ProjectTypeBox = styled.div<{ type: number }>`
  height: 16px;
  background: ${props =>
    props.type === 1
      ? 'linear-gradient(225deg, #8dd2f6 0%, #6688ff 100%)'
      : 'linear-gradient(225deg, #FFA29C 0%, #F6856C 100%);'};
  border-radius: 4px 4px 4px 4px;
  font-size: 12px;
  padding: 0px 4px;
  color: var(--neutral-white-d1);
  line-height: 16px;
`

export const SpinWrap = styled(Spin)`
  position: absolute;
  top: 145px;
  width: 100%;
`
