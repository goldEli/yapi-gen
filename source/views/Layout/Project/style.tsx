import styled from '@emotion/styled'
import { Divider } from 'antd'

// 主体布局样式
export const ProjectIndexWrap = styled.div`
  padding: 0 24px;
  height: 100%;
  background: var(--neutral-white-d1);
`

export const ProjectWrap = styled.div`
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
`

// 头部搜索样式
export const HeaderFilterWrap = styled.div`
  display: flex;
  flex-direction: column;
`

export const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const StatusGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

export const StatusItems = styled.div<{ isActive?: boolean }>`
  height: 32px;
  line-height: 32px;
  border-radius: 4px;
  padding: 0 8px;
  font-size: 14px;
  color: ${props =>
    props.isActive ? 'var(--primary-d2)!important' : 'var(--neutral-n2)'};
  background: ${props =>
    props.isActive ? 'var(--selected)!important' : 'var(--neutral-n7)'};
  cursor: pointer;
  &:hover {
    background: var(--neutral-n7);
    color: var(--primary-d2);
  }
`

export const HeaderBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
`

export const FilterLeftWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  .ant-checkbox-group-item {
    padding: 0 8px;
  }
`

export const FilterRightWrap = styled.div`
  display: flex;
  align-items: center;
`

export const ResetWrap = styled.div`
  font-size: 14px;
  color: var(--primary-d2);
  cursor: pointer;
`

export const DividerWrap = styled(Divider)`
  height: 20px;
  margin: 0 0 0 8px;
`

export const Wrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
`

export const Content = styled.div<{ isGrid: boolean }>(
  {
    width: '100%',
    height: 'calc(100% - 64px)',
  },
  ({ isGrid }) => ({
    padding: isGrid ? '0px 24px 24px 16px' : '16px 16px 0 16px',
  }),
)

export const RightCreateWrap = styled.div`
  display: flex;
  justify-content: center;
`

export const ActionTabsWrap = styled.div`
  padding-top: 16px;
  height: 100%;
`

export const ActionTabsMenuWrap = styled.div`
  width: 100%;
  display: flex;
  background-color: #f0f0f5;
  height: 66px;
  border-radius: 6px 6px 6px 6px;
  align-items: flex-end;
  padding: 0px 16px;
  box-sizing: border-box;
`

export const TabMenuItem = styled.div<{
  isActive?: boolean
}>`
  height: 54px;
  margin-right: 12px;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  background: ${props =>
    props?.isActive ? 'var(--neutral-white-d2)' : 'var(--neutral-n6-d1)'};
  padding: 0px 12px;
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  border-radius: 6px 6px 0px 0px;
  border-top: 2px solid;
  max-width: 172px;
  min-width: 80px;
  .label {
    color: var(--neutral-n1-d1);
    font-family: SiYuanMedium;
    font-size: 14px;
    max-width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .number {
    color: var(--neutral-n2);
    font-size: 12px;
  }
`

export const ActionTabsContent = styled.div`
  height: calc(100% - 118px);
`

export const MoreButton = styled.div`
  width: 40px;
  height: 40px;
  &:hover {
    background: var(--neutral-n9);
    box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
    svg {
      color: var(--primary-d2);
    }
  }
  border-radius: 20px 20px 20px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 7px;
`

export const AddItemModal = styled.div`
  width: 320px;
  background: var(--neutral-white-d5);
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  border-radius: 6px 6px 6px 6px;
  padding: 24px;
  box-sizing: border-box;
  .titles {
    color: var(--neutral-n1-d1);
    font-family: SiYuanMedium;
    font-size: 14px;
    user-select: none;
  }
  .footer {
    display: flex;
    justify-content: flex-end;
  }
`
