import styled from '@emotion/styled'
import { Space } from 'antd'

// 需求详情主页样式
export const Wrap = styled.div`
  height: 100%;
  display: flex;
  padding-top: 20px;
  flex-direction: column;
  .tabs {
    padding: 0 24px;
  }
  .ant-tabs-nav {
    margin-bottom: 8px;
  }
  .ant-tabs-tab {
    padding: 16px 0;
  }
  .ant-tabs-tab-btn {
    font-size: 14px;
    color: var(--neutral-n2);
  }
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: var(--primary-d1);
  }
`

export const DetailTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  padding: 0 24px;
`

export const ButtonGroup = styled(Space)`
  display: flex;
  align-items: center;
`

export const DetailTitle = styled.div`
  display: flex;
  /* border-bottom: 1px solid var(--neutral-n6-d1); */
  padding: 20px 0px 6px;
  width: calc(100% - 48px);
  margin-left: 24px;
`

export const DetailText = styled.div`
  flex-wrap: wrap;
  .name {
    font-size: 16px;
    color: var(--neutral-n1-d1);
    margin-right: 16px;
    font-family: SiYuanMedium;
    outline: none;
  }
  .icon {
    margin-right: 16px;
    cursor: pointer;
  }
`

export const DetailTabItem = styled.div`
  display: flex;
  align-items: center;
`

export const ItemNumber = styled.div<{ isActive?: boolean }>`
  margin-left: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props =>
    props.isActive ? 'var(--primary-d1)' : 'var(--function-tag5)'};
  color: ${props =>
    props.isActive ? 'var(--neutral-white-d7)' : 'var(--primary-d1)'};
`

export const ComputedWrap = styled.div`
  height: calc(100vh - 229px);
`

// 迭代概况样式

export const TopWrap = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  margin: '16px 0',
})

export const SurveyWrap = styled.div({
  height: 268,
  borderRadius: 6,
  background: 'white',
  display: 'flex',
  flexDirection: 'column',
})

export const OverviewTitle = styled.div({
  fontSize: 14,
  lineHeight: '14px',
  color: 'var(--neutral-n1-d1)',
  fontFamily: 'SiYuanMedium',
  paddingLeft: 8,
  borderLeft: '3px solid var(--primary-d2)',
  marginBottom: 22,
})

export const SurveyContent = styled.div({
  width: '100%',
  height: 220,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  overflow: 'auto',
})

export const SurveyBox = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  borderRadius: 6,
  padding: 30,
  width: '232px',
  height: '220px',
  background: 'rgba(67,186,154,0.05)',
})

export const TargetWrap = styled.div({
  height: 220,
  overflow: 'auto',
  color: 'var(--neutral-n2)',
  fontSize: 14,

  background: 'var(--neutral-n9)',
  padding: '16px',
  borderRadius: '4px',
})

export const BottomWrap = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: 12,
})

export const DiagramWrap = styled.div({
  width: '60%',
  height: 430,
  borderRadius: 6,
})

export const StatusWrap = styled.div({
  width: '39.2%',
  height: 430,
  borderRadius: 6,
})

export const ChartWrap = styled.div({
  height: 340,
  marginTop: 24,
  background: 'var(--neutral-n9)',
  borderRadius: '4px',
  padding: '16px',
})

export const OverviewWrap = styled.div({
  overflow: 'auto',
  height: 'calc(100vh - 229px)',
  '.ant-spin-nested-loading, .ant-spin-container': {
    height: 'auto!important',
  },
})
