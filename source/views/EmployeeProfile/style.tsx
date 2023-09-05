import styled from '@emotion/styled'
import { Checkbox } from 'antd'
// index

export const Wrap = styled.div`
  width: 100%;
  min-width: 1440px;
  overflow: auto;
`

export const ContentWrap = styled.div`
  display: flex;
  height: calc(100% - 157px);
  overflow: auto;
  flex: 1;
`

export const PersonBox = styled.div<{ isOpen: boolean; permission?: boolean }>`
  width: ${props => (props.isOpen ? 0 : 320)}px;
  height: 100%;
  align-items: center;
  max-width: unset !important;
  min-width: unset !important;
  flex: unset !important;
  border-right: 1px solid var(--neutral-n6-d1);
  position: relative;
  .ant-menu-inline .ant-menu-item,
  .ant-menu-inline .ant-menu-submenu-title {
    width: 100%;
  }
`

export const SideMain = styled.div<{ isOpen: boolean }>`
  height: 100%;
  width: 100%;
  overflow: hidden;
  transition: all 0.3s;
  .box {
    opacity: ${props => (props.isOpen ? 0 : 1)};
    height: 100%;
  }
`

export const FoldIcon = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  background: var(--neutral-white-d3);
  border-radius: 50%;
  top: 50%;
  width: 24px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 2px 6px 0px rgba(24, 43, 71, 0.12);
  z-index: 12;
  right: -12px;
  cursor: pointer;
  &:hover {
    background: var(--primary-d1);
    svg {
      color: var(--neutral-white-d7);
    }
  }
`

// EmployeeProfileHeader

export const HeaderWrap = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid var(--neutral-n6-d1);
`

export const HeaderSearch = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
`

export const HeaderCardGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`

export const Card = styled.div<{ isActive?: boolean }>`
  height: 64px;
  border-radius: 6px;
  padding: 16px;
  border: ${props =>
    props.isActive
      ? '1px solid var(--primary-d2)'
      : '1px solid var(--neutral-n6-d1)'};
  cursor: pointer;
  display: flex;
  align-items: center;
  flex: 1;
  .name {
    margin-left: 8px;
    font-size: 14px;
    font-family: SiYuanMedium;
    color: var(--neutral-n1-d1);
  }
`

export const TabsGroup = styled.div`
  display: flex;
  align-items: center;
  height: 32px;
  border-radius: 4px;
  background: var(--hover-d2);
  padding: 2px;
`

export const TabItem = styled.div<{ isActive?: boolean }>`
  height: 28px;
  line-height: 28px;
  padding: 0 16px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  color: ${props =>
    props.isActive ? 'var(--primary-d2)' : 'var(--neutral-n2)'};
  background: ${props =>
    props.isActive ? 'var(--neutral-white-d6)' : 'transparent'};
`

// EmployeeProfilePerson

export const PersonWrap = styled.div`
  padding: 24px 4px 24px 24px;
  position: relative;
  display: flex;
  flex-direction: column;
  white-space: nowrap;
  height: 100%;
  .label {
    font-size: 14px;
    color: var(--neutral-n1-d1);
    font-family: SiYuanMedium;
    margin-bottom: 8px;
  }
  .ant-checkbox-wrapper {
    height: 40px;
    line-height: 40px;
    .ant-checkbox + span {
      padding: 0 12px;
    }
  }
  .ant-checkbox-wrapper + .ant-checkbox-wrapper {
    margin-left: 0;
  }
`

export const ReportButton = styled.div`
  position: absolute;
  right: 0;
  top: 19px;
  height: 32px;
  line-height: 32px;
  padding: 0 8px;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  background: var(--primary-d1);
  color: var(--neutral-white-d7);
  font-size: 14px;
  cursor: pointer;
`

export const CheckboxAll = styled(Checkbox)`
  padding-left: 12px;
`

export const CheckBoxWrap = styled.div`
  height: calc(100% - 70px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding-right: 20px;
  .ant-checkbox {
    top: -2px;
  }
`

export const CheckboxLi = styled.div`
  padding: 0 0px 0 12px;
  border-radius: 6px;
  &:hover {
    background: var(--hover-d2);
  }
  .ant-checkbox-wrapper {
    width: 100%;
  }
`
