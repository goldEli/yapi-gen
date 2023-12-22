import styled from '@emotion/styled'
import { CloseWrap, SelectWrapBedeck } from '@/components/StyleCommon'

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  padding: 20px 24px 20px 24px;
`
export const ContentWrap = styled.div`
  display: flex;
  height: calc(100vh - 135px);
  position: relative;
`

export const Left = styled.div<{ active: boolean }>`
  position: relative;
  width: 316px;
  box-sizing: border-box;
  height: 100%;
  border-right: ${props =>
    props.active ? '1px solid transparent' : '1px solid var(--neutral-n6-d1)'};
  .header {
    display: flex;
    justify-content: space-between;
    padding: 0px 24px;
  }
  padding-bottom: 52px;
`
export const TabsWrap = styled.div`
  width: 128px;
  height: 32px;
  box-sizing: border-box;
  padding-left: 2px;
  margin-bottom: 16px;
  border-radius: 4px 4px 4px 4px;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: var(--neutral-n2);
  cursor: pointer;
  position: relative;
  background: var(--hover-d2);
  .tab1 {
    width: 60px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    z-index: 2;
  }
  .tab2 {
    line-height: 28px;
    text-align: center;
    width: 68px;
    height: 28px;
    z-index: 2;
  }
  .active {
    color: var(--primary-d2);
    font-family: SiYuanMedium;
  }
  .move {
    background: #ffffff;
    position: absolute;
    width: 56px;
    height: 28px;
    transition: all 0.4s;
    border-radius: 4px;
  }

  .left {
    transform: translateX(56px);
    width: 68px;
  }
`

export const RightIcon = styled.div`
  width: 90px;
  height: 32px;
  display: flex;
  align-items: center;
  .line {
    width: 1px;
    height: 16px;
    opacity: 1;
    background-color: var(--neutral-n6-d1);
    margin: 0px 10px;
  }
  .filter {
    width: 120px;
    padding: 4px 0px;
    background: #ffffff;
    box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
    border-radius: 6px 6px 6px 6px;
    cursor: pointer;
    .item {
      height: 32px;
      padding: 0px 16px;
      font-size: 14px;
      font-family: SiYuanRegular;
      font-weight: 400;
      color: var(--neutral-n2);
      display: flex;
      align-items: center;
      justify-content: space-between;
      white-space: nowrap;
      &:hover {
        background: var(--hover-d3);
      }
    }
    .active {
      color: var(--primary-d2);
      svg {
        color: var(--primary-d2);
      }
    }
  }
`

export const IconBox = styled(CloseWrap)<{ isActive?: boolean }>`
  font-size: 20px;
  cursor: pointer;
  padding: 6px;
  svg {
    color: ${props =>
      props.isActive ? 'var(--neutral-n1-d1)' : 'var(--neutral-n3)'};
  }
  background: ${props => (props.isActive ? 'var(--hover-d1)' : 'white')};
  &:hover {
    background: var(--hover-d1);
    svg {
      color: var(--neutral-n1-d1);
    }
  }
  &:active {
    background: var(--neutral-n6-d1);
    svg {
      color: var(--neutral-n1-d1);
    }
  }
`

export const TabItemWrap = styled.div`
  height: 100%;
  padding: 0px 24px;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  .ant-spin-nested-loading img {
    margin-top: 200px;
  }
`

export const Right = styled.div`
  overflow-x: scroll;
  overflow-y: hidden;
  height: 100%;
  flex: 1;
  .header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 24px;
    padding-left: 24px;
  }
  .ant-spin-nested-loading img.spinImg {
    margin-top: 120px;
  }
`
export const SelectWrapForList = styled(SelectWrapBedeck)`
  margin-left: 16px;
  .ant-select-focused:not(.ant-select-disabled).ant-select:not(
      .ant-select-customize-input
    )
    .ant-select-selector {
    box-shadow: 0 0 0 0px;
  }
  .ant-select-selection-placeholder {
    color: var(--neutral-n4);
  }
`
export const CategorySelectWrap = styled.div`
  min-width: 296px;
  height: 32px;
  display: flex;
  align-items: center;
  border: 1px solid var(--active);
  border-radius: 6px;
  margin-left: 16px;
  padding-left: 12px;
  box-sizing: border-box;
  .title {
    font-size: 14;
    white-space: nowrap;
    margin-right: 16px;
  }
`
export const ClearButton = styled.div`
  width: 56px;
  height: 22px;
  font-size: 14px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: var(--primary-d2);
  line-height: 22px;
  margin-left: 24px;
  white-space: nowrap;
  cursor: pointer;
`
export const DragContent = styled.div`
  height: 100%;
  overflow-y: scroll;
  padding-bottom: 50px;
  background: var(--neutral-n8);
`
