import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { Space } from 'antd'

// 头部操作栏右侧

export const CreateIcon = styled.div`
  height: 24px;
  width: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: var(--primary-d1);
  color: var(--neutral-white-d7);
  &:hover {
    background: var(--auxiliary-b2);
  }
`

export const CreateWrap = styled.div`
  height: 24px;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--primary-d1);
  color: var(--neutral-white-d7);
  cursor: pointer;
  &:hover {
    background: var(--auxiliary-b2);
  }
`

export const UserAvatar = styled.div`
  background: #feb2a1;
  width: 32px;
  height: 32px;
  border-radius: '50%';
`

export const UserInfoWrap = styled.div`
  background: var(--neutral-white-d6);
  border-radius: 6px;
  padding: 16px 0;
  width: 240px;
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
  font-family: SiYuanRegular;
  color: var(--neutral-n1-d1);
  margin-bottom: 2px;
  font-size: var(--font14);
`

export const PhoneWrap = styled.div`
  font-family: SiYuanRegular;
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
  font-family: SiYuanRegular;
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

export const PersonalHead = styled.div`
  margin-top: 15px;
  /* display: flex; */
  /* justify-content: center; */
`

export const PersonalFooter = styled.div`
  /* display: flex; */
  /* justify-content: space-between; */
  /* padding-right: 20px; */
`

export const imgCss = css`
  width: 32px;
  height: 32px;
  border-radius: 50%;
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

// 头部操作栏左侧
export const HeaderLeftWrap = styled.div`
  display: flex;
  align-items: center;
`

export const MenuLabel = styled.span`
  color: var(--neutral-n1-d1);
  font-family: SiYuanMedium;
  font-family: siyuanmedium;
  font-size: var(--font16);
`

export const ChildrenMenu = styled.div`
  display: flex;
  align-items: center;
  margin-left: 48px;
`

export const ChildrenMenuItem = styled(Space)<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 56px;
  cursor: pointer;
  font-size: var(--font14);
  font-family: ${props => (props.isActive ? 'SiYuanMedium' : 'inherit')};
  color: ${props =>
    props.isActive ? 'var(--primary-d2)' : 'var(--neutral-n1-d2)'};
  background: ${props =>
    props.isActive ? 'var(--gradient)' : 'var(--neutral-white-d2)'};
  &:hover {
    color: var(--primary-d2);
  }
`

export const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 0 24px;
`

export const LogoBox = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 120px;
  }
`

export const DrawerCompany = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 52px;
  cursor: pointer;
  margin: 14px 0;
  background: var(--neutral-white-d5);
  &:hover {
    background: var(--hover-d2);
  }
`

export const CompanyInfo = styled.div`
  display: flex;
  align-items: center;
  width: 94%;
  img {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    margin-right: 12px;
  }
  div {
    color: var(--neutral-n1-d1);
    font-family: SiYuanRegular;
    font-size: 14px;
    font-weight: 400;
    width: 70%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`

export const Provider = styled.div<{ isBottom?: boolean }>`
  height: 1px;
  width: 88%;
  margin-left: 6%;
  background: var(--neutral-n6-d1);
  margin-bottom: ${props => (props.isBottom ? 16 : 0)}px;
`

export const DrawerMenu = styled.div`
  padding: 0 12px;
  display: flex;
  flex-wrap: wrap;
  max-height: calc(100vh - 204px);
  gap: 12px;
  align-items: start;
  overflow-y: scroll;
`

export const DrawerMenuItem = styled.div<{ isActive?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-top: 8px;
  width: 88px;
  padding: 5px 0;
  .menuIcon {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    width: 48px;
    border-radius: 6px;
    background: ${props =>
      props.isActive ? 'var(--primary-d1)' : 'var(--hover-d2)'};
    color: ${props =>
      props.isActive ? 'var(--neutral-white-d7)' : 'var(--neutral-n1-d1)'};
  }
  .label {
    margin-top: 8px;
    color: ${props =>
      props.isActive ? 'var(--primary-d2)' : 'var(--neutral-n1-d2)'};
  }
  &:hover {
    .menuIcon {
      color: ${props =>
        props.isActive ? 'var(--neutral-white-d7)' : 'var(--primary-d2)'};
    }
  }
`

export const DrawerFooter = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 52px;
  cursor: pointer;
  background: var(--neutral-white-d5);
  position: absolute;
  bottom: 8px;
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
    background: var(--hover-d2);
  }
`

export const CompanyCards = styled.div`
  min-height: 384px;
  max-height: 540px;
  overflow-y: auto;
  padding: 0 16px;
  padding-top: 8px;
`

export const CompanyCard = styled.div<{ isActive?: boolean }>`
  height: 64px;
  display: flex;
  transition: all 0.5s;
  align-items: center;
  justify-content: space-between;
  border-radius: 6px;
  margin-top: 16px;
  padding: 0 12px;
  border: ${props =>
    props.isActive
      ? '1px solid transparent'
      : '1px solid var(--neutral-n6-d2)'};
  background: ${props =>
    props.isActive ? 'var(--hover-d2)' : 'var(--neutral-white-d6)'};
  box-sizing: border-box;
  cursor: pointer;
  .info {
    display: flex;
    align-items: center;
    width: 95%;
    img {
      border-radius: 4px;
      width: 40px;
      height: 40px;
      margin-right: 8px;
    }
    span {
      font-size: var(--font14);
      color: var(--neutral-n1-d1);
      max-width: 83%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline-block;
    }
  }
  &:hover {
    box-shadow: 0px 0px 9px 3px rgba(0, 0, 0, 0.07);
    background: var(--neutral-white-d6);
    border: 1px solid transparent;
  }
`

export const WaitingMenu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: no-drop;
  margin-top: 8px;
  width: 88px;
  padding: 5px 0;
  .menuIcon {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    width: 48px;
    border-radius: 6px;
    background: var(--hover-d2);
    color: var(--neutral-n3);
  }
  .label {
    margin-top: 8px;
    color: var(--neutral-n3);
  }
  .menuTag {
    position: absolute;
    top: 5px;
    right: -9px;
  }
`

export const RobotButton = styled.div`
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  margin-right: 8px;
  .img {
    height: 46px;
  }
  .name {
    margin-left: 8px;
    font-size: 14px;
    color: var(--neutral-n1-d1);
  }
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
