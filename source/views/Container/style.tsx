import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { Space } from 'antd'

// 头部操作栏右侧
export const CreateWrap = styled.div`
  height: 24px;
  width: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: var(--primary-d1);
  color: var(--neutral-white-d7);
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
  border-bottom: 1px solid var(--neutral-n6-d1);
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

export const ChangeItem = styled.div<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: SiYuanRegular;
  height: 32px;
  cursor: pointer;
  padding: 0 16px;
  color: ${props =>
    props.isActive ? 'var(--primary-d2)' : 'var(--neutral-n2)'};
  &:hover {
    color: var(--primary-d2);
  }
`

export const PersonalHead = styled.div`
  display: flex;
  justify-content: center;
`

export const PersonalFooter = styled.div`
  display: flex;
  justify-content: space-around;
  padding-right: 20px;
`

export const imgCss = css`
  width: 104px;
  height: 104px;
  border-radius: 50%;
`

export const Line = styled.div`
  margin-top: 24px;
`

// 头部操作栏左侧
export const HeaderLeftWrap = styled.div`
  display: flex;
  align-items: center;
`

export const MenuLabel = styled.span`
  color: var(--neutral-n1-d1);
  font-family: SiYuanMedium;
  font-weight: 500;
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
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
  span {
    color: var(--neutral-n1-d1);
    font-family: SiYuanMedium;
    font-size: 16px;
    font-weight: 500;
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
  background: var(--neutral-white-d6);
  &:hover {
    background: var(--hover-d2);
  }
`

export const CompanyInfo = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    margin-right: 12px;
  }
  span {
    color: var(--neutral-n1-d1);
    font-family: SiYuanRegular;
    font-size: 14px;
    font-weight: 400;
  }
`

export const DrawerProvider = styled.div`
  height: 1px;
  width: 88%;
  margin-left: 6%;
  background: var(--neutral-n6-d1);
`

export const DrawerMenu = styled.div`
  padding: 0 12px;
  display: flex;
  flex-wrap: wrap;
  max-height: calc(100vh - 188px);
  overflow-y: scroll;
`

export const DrawerMenuItem = styled.div`
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
    background: var(--hover-d2);
    color: var(--neutral-n1-d1);
  }
  .label {
    margin-top: 8px;
    color: var(--neutral-n1-d2);
  }
  &:hover {
    .menuIcon {
      color: var(--primary-d2);
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
  background: var(--neutral-white-d6);
  position: absolute;
  bottom: 8px;
  &:hover {
    background: var(--hover-d2);
  }
`
