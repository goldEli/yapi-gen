import styled from '@emotion/styled'
import { Checkbox } from 'antd'
// index

export const Wrap = styled.div`
  width: 100%;
  height: calc(100vh - 56px);
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

export const RightBox = styled.div`
  height: 100%;
  display: flex;
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

export const LoadingMore = styled.div`
  margin-top: 24px;
  text-align: center;
  width: 100%;
  font-size: 12px;
  color: var(--primary-d1);
  cursor: pointer;
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
  padding: 24px 4px 0px 24px;
  position: relative;
  display: flex;
  flex-direction: column;
  white-space: nowrap;
  height: 100%;
  .input {
    width: 92%;
    margin-bottom: 16px;
    border: 1px solid var(--neutral-n6-d1);
    border-radius: 6px;
    .ant-select {
      width: 100%;
    }
  }
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
  top: 72px;
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
  height: calc(100% - 118px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding-right: 20px;
  .ant-checkbox {
    top: 0px;
  }
`

export const CheckboxLi = styled.div`
  padding: 0 0px 0 12px;
  border-radius: 6px;
  width: 100%;
  &:hover {
    background: var(--hover-d2);
  }
  .ant-checkbox-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
  }
  .ant-checkbox-wrapper span:nth-child(2) {
    display: inline-block;
    width: 100%;
  }
  .ant-checkbox .ant-checkbox-inner {
    width: 16px !important;
    height: 16px;
  }
  .content {
    display: flex;
    align-items: center;
    .nameInfo {
      margin-left: 12px;
      width: calc(100% - 44px);
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
`

// EmployeeProfileReport
export const ReportWrap = styled.div`
  width: 561px;
  height: 100%;
  border-right: 1px solid var(--neutral-n6-d1);
  padding: 0 4px 0 0px;
`

export const ReportItemWrap = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 0 24px 0px;
  position: relative;
`

export const ProviderBox = styled.div`
  background: var(--neutral-n6-d1);
  height: 1px;
  margin: 0 24px;
`

export const ReportItemBox = styled.div`
  overflow-y: auto;
  height: 100%;
`

export const ReportItemHeader = styled.div<{ isExpended?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  background-color: white;
  z-index: 10;
  top: 0px;
  padding: ${props =>
    props.isExpended ? '8px 20px 8px 24px' : '8px 20px 0px 24px'};
  /* box-shadow: 0px 6px 6px -6px rgba(0,0,0,0.05); */
  .icon {
    position: absolute;
    left: 5px;
  }
`

export const ReportItemHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  .info {
    display: flex;
    flex-direction: column;
    margin-left: 8px;
    .name {
      font-size: 16px;
      font-family: SiYuanMedium;
      color: var(--neutral-n1-d1);
      max-width: 350px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .sub {
      font-size: 12px;
      color: var(--neutral-n2);
    }
  }
`

export const ReportItemHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
`

export const OperationButton = styled.div<{ isStar?: boolean }>`
  height: 32px;
  width: 32px;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid var(--neutral-n6-d1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  span {
    color: ${props =>
      props.isStar ? '#FA9746!important' : 'var(--neutral-n2)'};
  }
  &:hover {
    background: var(--auxiliary-b4);
    border: 1px solid var(--auxiliary-b4);
    span {
      color: var(--auxiliary-text-t2-d2);
    }
  }
`

export const Title = styled.div`
  font-size: 14px;
  font-family: SiYuanMedium;
  color: var(--neutral-n1-d1);
  margin-top: 16px;
`
export const Msg = styled.div`
  font-size: 14px;
  color: var(--neutral-n2);
  word-break: break-all;
`

export const RowRadius = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 5px;
`
export const Radius = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--neutral-n2);
  margin: 8px 8px 0 0;
  flex-shrink: 0;
  flex-grow: 0;
`

export const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  .title {
    font-size: 14px;
    font-family: SiYuanMedium;
    margin-bottom: 8px;
  }
`

export const CommentBox = styled.div`
  .deleteIcon {
    display: none;
  }
  &:hover .deleteIcon {
    display: inherit;
  }
  .headWrap {
    display: flex;
    justify-content: space-between;
  }
  .header {
    display: flex;
    align-items: center;
    .time {
      margin-left: 16px;
      font-size: 12px;
      color: var(--neutral-n3);
    }
  }
  .content {
    padding-left: 32px;
    margin-top: 2px;
  }
`

// EmployeeProfileTask

export const TaskWrap = styled.div`
  width: calc(100% - 561px);
  padding: 0 4px 24px 0px;
`

export const TaskItemBoxs = styled.div`
  padding-right: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
`

export const TaskItemWrap = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 0 0 24px;
`

export const TaskItemPerson = styled.div`
  display: flex;
  align-items: center;
  .info {
    display: flex;
    flex-direction: column;
    margin-left: 8px;
    .name {
      font-size: 16px;
      font-family: SiYuanMedium;
      color: var(--neutral-n1-d1);
    }
    .sub {
      font-size: 12px;
      color: var(--neutral-n2);
    }
  }
`

export const TaskItemGroup = styled.div`
  padding: 12px 0 16px 0;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--neutral-n6-d1);
`

export const TaskItemBox = styled.div`
  min-height: 58px;
  border-radius: 6px;
  display: flex;
  padding: 8px;
  cursor: pointer;
  position: relative;
  .icon {
    position: absolute;
    left: -19px;
  }
  &:hover {
    background: var(--hover-d2);
  }
`

export const TagWrap = styled.div`
  height: 20px;
  border-radius: 6px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--neutral-n1-d2);
  white-space: nowrap;
`

export const TaskContent = styled.div`
  margin-left: 8px;
  .nameBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    .left {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: var(--neutral-n1-d1);
      .name {
        max-width: 86%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        margin-right: 4px;
      }
    }
    .right {
      font-size: 12px;
      color: var(--function-error);
    }
  }
  .info {
    font-size: 12px;
    color: var(--neutral-n2);
    width: 98%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`
