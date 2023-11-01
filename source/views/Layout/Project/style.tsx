import styled from '@emotion/styled'
import { Divider, Space } from 'antd'

// 主体布局样式
export const ProjectIndexWrap = styled.div`
  padding: 0 24px;
  background: var(--neutral-white-d1);
`

// 头部搜索样式
export const HeaderFilterWrap = styled.div`
  padding: 20px 0;
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
  border: ${props =>
    props.isActive
      ? '1px solid var(--neutral-n2)!important'
      : '1px solid var(--neutral-n5)'};
  font-size: 14px;
  color: ${props =>
    props.isActive ? 'var(--neutral-white-d1)!important' : 'var(--neutral-n2)'};
  background: ${props =>
    props.isActive ? 'var(--neutral-n2)!important' : 'transparent'};
  cursor: pointer;
  &:hover {
    background-color: #ebedf0;
    border: 1px solid #ebedf0;
    color: var(--neutral-n1-d1);
  }
`

export const HeaderBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
`

export const FilterLeftWrap = styled(Space)`
  display: flex;
  align-items: center;
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
