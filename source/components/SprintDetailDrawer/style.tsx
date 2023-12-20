import styled from '@emotion/styled'
import { Dropdown, Space } from 'antd'

export const CommonItemBox = styled.div`
  background-color: white;
  padding: 16px 24px;
  margin-top: 12px;
`

export const TabsCount = styled.div`
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  background: var(--function-tag5);
  color: var(--primary-d1);
  border-radius: 10px;
  margin-left: 4px;
`

export const TargetWrap = styled.div`
  flex-wrap: wrap;
  margin-top: 16px;
  font-size: 14px;
  white-space: pre;
  .icon {
    margin-right: 8px;
    display: inline;
  }
  .label {
    font-family: SiYuanMedium;
  }
`

export const ContentWrap = styled.div<{ notHover?: any }>(
  {
    color: 'var(--neutral-n1-d1)',
    fontSize: 14,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '98%',
    wordBreak: 'break-all',
    width: '100%',
    flex: 1,
  },
  ({ notHover }) => ({
    paddingLeft: notHover ? 8 : 0,
  }),
)

export const LabelItem = styled.div`
  font-size: var(--font14);
  color: var(--neutral-n3);
  display: flex;
  align-items: center;
  height: 32px;
`

export const ShowLabel = styled.div({
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 400,
  color: 'var(--primary-d2)',
})

export const MaxLabel = styled.div<{ width: number }>`
  width: ${props => props.width}px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const InfoItem = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
  marginTop: 14,
  position: 'relative',
  minHeight: 32,
})

export const Label = styled.div`
  font-size: var(--font14);
  color: var(--neutral-n1-d1);
  font-family: SiYuanMedium;
  ::before {
    vertical-align: middle;
    margin-right: 8px;
    margin-top: -3px;
    content: '';
    display: inline-block;
    width: 3px;
    height: 16px;
    background: #6688ff;
  }
`

export const BetweenBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const Header = styled.div`
  height: 52px;
  background: var(--neutral-white-d5);
  border-bottom: 1px solid var(--neutral-n6-d2);
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const BackIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--hover-d2);
  cursor: pointer;
  &:hover {
    svg {
      color: var(--primary-d2);
    }
  }
`

export const ChangeIconGroup = styled.div`
  /* border: 1px solid var(--neutral-n6-d1); */
  border-radius: 6px;
  box-sizing: border-box;
  height: 32px;
  display: flex;
  gap: 16px;
`

export const NextWrap = styled.div`
  width: 31px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--neutral-white-d4);
  border: 1px solid var(--neutral-n6-d1);
  border-radius: 6px;
  cursor: pointer;
  svg {
    color: var(--neutral-n2);
  }
  &:hover {
    background: var(--hover-d2);
    border: 1px solid var(--hover-d2);
    svg {
      color: var(--primary-d2);
    }
  }
`

export const UpWrap = styled(NextWrap)<{ isOnly?: boolean }>`
  border-right: ${props =>
    props.isOnly ? '1px solid var(--neutral-n6-d1)' : '1px solid transparent'};
  border-top-right-radius: ${props => (props.isOnly ? '6' : '0')}px;
  border-bottom-right-radius: ${props => (props.isOnly ? '6' : '0')}px;
`

export const DownWrap = styled(NextWrap)<{ isOnly?: boolean }>`
  border-left: ${props =>
    props.isOnly ? '1px solid var(--neutral-n6-d1)' : '1px solid transparent'};
  border-top-left-radius: ${props => (props.isOnly ? '6' : '0')}px;
  border-bottom-left-radius: ${props => (props.isOnly ? '6' : '0')}px;
`

export const Content = styled.div`
  height: calc(100% - 115px);
  overflow: auto;
  padding: 16px 24px 60px;
  position: relative;
  .tabs {
    /* padding-top: 32px; */
    padding: 0 24px;
    position: sticky;
    top: -18px;
    z-index: 2;
    background: var(--neutral-white-d1);
  }
  .ant-tabs-tab {
    padding: 0 0 16px;
  }
  .ant-tabs-tab-btn {
    font-size: 14px;
    color: var(--neutral-n2);
  }
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: var(--primary-d1);
  }
`

export const ParentBox = styled(Space)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  min-height: 22px;
  margin-bottom: 16px;
`

export const DemandName = styled.div`
  .name {
    font-size: 16px;
    color: var(--neutral-n1-d1);
    margin-right: 16px;
    font-family: SiYuanMedium;
    outline: none;
    padding: 0 4px;
    cursor: pointer;
    &:hover {
      background: var(--hover-d2);
    }
  }
  .icon {
    margin-right: 16px;
    cursor: pointer;
  }
  flex-wrap: wrap;
`

export const CollapseItem = styled.div`
  margin-top: 16px;
`

export const CollapseItemTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  cursor: pointer;
  height: 28px;
  background: var(--hover-d2);
  border-radius: 4px;
  &:hover {
    background: var(--hover-d1);
  }
  span {
    font-size: var(--font12);
    color: var(--neutral-n2);
  }
`

export const ContentItem = styled.div`
  margin-bottom: 32px;
`

export const CollapseItemContent = styled.div<{ isOpen?: boolean }>`
  height: ${props => (props.isOpen ? 'auto' : 0)};
  padding-top: ${props => (props.isOpen ? 16 : 0)}px;
  overflow: hidden;
  transition: 0.2s;
  position: relative;
  .info_item_tab {
    padding: 0;
    margin: 0;
  }
`

export const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  img {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
  div,
  span {
    font-size: var(--font14);
    color: var(--neutral-n3);
    margin-right: 8px;
  }
`

export const SkeletonStatus = styled.div`
  .ant-skeleton-input {
    height: 22px;
    width: 52px;
    display: inline-block;
    min-width: inherit;
    border-radius: 4px;
    background: var(--neutral-n7);
  }
`

export const DropdownMenu = styled(Dropdown)`
  .ant-dropdown-menu-item {
    padding: 4px 16px;
  }
  .ant-dropdown-menu-item-divider {
    margin: 4px 16px;
  }
`

export const DetailFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  background: var(--neutral-white-d5);
  width: 100%;
  .textBox {
    display: flex;
    flex-direction: column;
    div {
      font-size: 12px;
      color: var(--neutral-n3);
      margin-bottom: 4px;
    }
    span {
      font-size: 12px;
      color: var(--neutral-n3);
    }
  }
`

export const StatusAndLongWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
