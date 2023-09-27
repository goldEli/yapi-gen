import { DragLine, MouseDom } from '@/components/StyleCommon'
import styled from '@emotion/styled'
import { Checkbox } from 'antd'

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
        padding: 0 8px;
        color: initial;
        height: 40px;
        margin-top: 4px;
        align-items: center;
      }
    }
  }
`

export const CollapseHeaderWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 8px;
  .left {
    .name {
      font-family: SiYuanMedium;
      margin-left: 12px;
    }
  }
`
