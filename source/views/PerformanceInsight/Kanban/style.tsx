import { DragLine, MouseDom } from '@/components/StyleCommon'
import styled from '@emotion/styled'
import { Checkbox, Space } from 'antd'

// 筛选及统计部分
export const KanBanHeaderWrap = styled.div`
  padding: 0 24px;
`

export const SearchWrap = styled.div`
  padding: 18px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--neutral-n6-d1);
`

export const SearchWrapLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`

export const SearchWrapRight = styled.div`
  display: flex;
  align-items: center;
`

export const StatisticsWrap = styled.div`
  height: 90px;
  border-bottom: 1px solid var(--neutral-n6-d1);
  display: flex;
  align-items: center;
`

export const StatisticsItem = styled.div`
  flex: 1;
  height: 50px;
  display: flex;
  align-items: center;
  .provider {
    height: 100%;
    width: 4px;
    border-radius: 2px;
    margin-right: 8px;
  }
  .content {
    display: flex;
    flex-direction: column;
    .title {
      font-size: 14px;
      color: var(--neutral-n2);
    }
    .number {
      font-size: 20px;
      color: var(--neutral-n1-d1);
      font-family: SiYuanMedium;
    }
  }
`

// index内容部分
export const ContentWrap = styled.div`
  display: flex;
  height: calc(100% - 159px);
  overflow: auto;
  padding-left: 16px;
  flex: 1;
`

export const PersonBox = styled.div<{ isOpen: boolean; permission?: boolean }>`
  width: ${props => (props.isOpen ? 0 : 280)}px;
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
  .icon {
    position: absolute;
    right: 6px;
    top: 16px;
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

// KanBanPerson 人员部分

export const KanBanPersonWrap = styled.div`
  padding: 16px 16px 0 0;
  height: 100%;
`

export const KanBanPersonHeader = styled.div`
  gap: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 8px;
  .input {
    flex: 1;
    border: 1px solid var(--neutral-n6-d1);
    border-radius: 6px;
    .ant-select {
      width: 100%;
    }
  }
`

export const CheckboxAll = styled(Checkbox)`
  margin-top: 16px;
  padding-left: 8px;
`

export const CheckBoxWrap = styled.div`
  height: calc(100% - 70px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  .ant-collapse {
    border: none;
    border-radius: 0px;
    background-color: transparent;
    .ant-collapse-item {
      border-bottom: none;
      .ant-collapse-header {
        padding: 0 0 0 8px;
        color: initial;
        height: 40px;
        margin-top: 4px;
        align-items: center;
        color: var(--neutral-n1-d1);
        &:hover {
          background: var(--hover-d2);
        }
        .ant-collapse-header-text {
          width: calc(100% - 16px);
        }
      }
      .ant-collapse-content {
        border: none;
        .ant-collapse-content-box {
          max-height: initial;
          padding: 0;
        }
      }
    }
  }
`

export const CollapseHeaderWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 8px;
  width: 100%;
  .left {
    width: calc(100% - 40px);
    display: flex;
    align-items: center;
    .name {
      font-family: SiYuanMedium;
      margin-left: 12px;
      display: inline-block;
      width: calc(100% - 28px);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`

export const FilterWrap = styled.div<{ state?: boolean }>`
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    color: ${props =>
      props.state ? 'var(--primary-d2) !important' : 'var(--neutral-n3)'};
  }
  &:hover {
    svg {
      color: var(--primary-d2) !important;
    }
  }
`

export const FilterContent = styled.div`
  padding: 4px 0px;
  border-radius: 6px;
  background: var(--neutral-white-d6);
  width: 200px;
  overflow-x: hidden;
  .ant-popover-placement-left,
  .ant-popover-placement-leftTop,
  .ant-popover-placement-leftBottom {
    padding-right: 0;
  }
`

export const FilterOther = styled.div`
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
`

export const FilterItem = styled.div<{ isActive?: boolean }>`
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  min-width: 120px;
  padding: 0 16px;
  .name {
    font-size: 14px;
    color: ${props =>
      props.isActive ? 'var(--primary-d2)!important' : 'var(--neutral-n2)'};
    width: calc(100% - 30px);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  &:hover {
    color: var(--neutral-n1-d1);
    background: var(--hover-d3);
  }
`

export const FilterProvider = styled.div`
  height: 1px;
  background: var(--neutral-n6-d1);
  width: calc(100% - 32px);
  margin: 8px 16px;
`

export const MemberItem = styled.div`
  height: 40px;
  padding-left: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover {
    background: var(--hover-d2);
  }
  .info {
    margin-left: 8px;
    display: flex;
    align-items: center;
    width: calc(100% - 24px);
    .name {
      margin-left: 8px;
      font-size: 14px;
      color: var(--neutral-n1-d1);
      width: calc(100% - 32px);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`

// KanBanCardGroup 人员卡片组
export const KanBanCardGroupWrap = styled.div`
  padding: 16px 16px 8px 16px;
  height: 100%;
`

export const KanBanCardGroupBox = styled(Space)`
  width: 100%;
  height: 100%;
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 8px;
  .ant-space-item {
    height: 100%;
  }
`

export const KanBanCardItem = styled.div`
  width: 302px;
  height: 100%;
  display: inline-block;
  background: var(--neutral-n8);
  padding: 16px;
  .infinite-scroll-component__outerdiv {
    height: calc(100% - 88px);
  }
  .infinite-scroll-component {
    ::-webkit-scrollbar {
      width: 0px;
    }
  }
`

export const CardItemHeader = styled.div`
  width: 100%;
  height: 88px;
  border-radius: 6px;
  background: linear-gradient(47deg, #6688ff 0%, #8ca6ff 100%);
  padding: 12px 16px;
  display: flex;
  .avatar {
    height: 32px;
    width: 32px;
    border-radius: 50%;
    border: 1px solid #dde3f3;
    margin-right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 6px;
    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: calc(100% - 40px);
    .nameBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .name {
        font-size: 14px;
        color: var(--neutral-white-d7);
        font-family: SiYuanMedium;
        width: 80%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .sub {
      font-size: 12px;
      color: var(--neutral-n8);
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .task {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .label {
        font-size: 12px;
        color: var(--neutral-n8);
      }
    }
  }
  .ant-progress-text {
    color: var(--neutral-n8);
    font-size: 12px;
  }
`

export const CardItemTaskItem = styled.div`
  min-height: 114px;
  border-radius: 6px;
  background: var(--neutral-white-d2);
  margin-top: 8px;
  padding: 16px;
`

export const TaskItemTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  .demandNumber {
    display: flex;
    align-items: center;
    img {
      width: 18px;
      height: 18px;
    }
    .label {
      font-size: 12px;
      color: var(--neutral-n3);
      margin-left: 8px;
    }
  }
  .priorityBox {
    display: flex;
    align-items: center;
    .label {
      font-size: 12px;
      color: var(--neutral-n1-d1);
      margin-left: 8px;
    }
  }
`

export const TaskItemContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
  .name {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4; // 自定义行数
    -webkit-box-orient: vertical;
    font-size: 14px;
    color: var(--neutral-n1-d1);
    white-space: normal;
    cursor: pointer;
  }
`

export const TaskItemBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .status {
    display: flex;
    align-items: center;
    .name {
      margin-left: 8px;
      font-size: 12px;
      color: var(--neutral-n2);
    }
  }
  .right {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--neutral-n2);
  }
`

export const TaskTag = styled.div<{ state?: number }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props =>
    props.state === 1
      ? 'var(--auxiliary-b1)'
      : props.state === 2
      ? 'var(--neutral-n7)'
      : 'var(--function-success)'};
`

export const HaveChangeICon = styled.div`
  position: relative;
`

export const ChangeIcon = styled.div`
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.2);
  box-shadow: 0px 2px 6px 0px rgba(24, 43, 71, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  position: absolute;
  top: 46%;
  svg {
    color: var(--neutral-white-d7);
  }
  &:hover {
    background: rgba(0, 0, 0, 0.32);
  }
`
