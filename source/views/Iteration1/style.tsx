import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'

export const Content = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px 16px 0 0px;
`

export const IterationContent = styled.div`
  display: flex;
  height: calc(100% - 52px);
  margin-top: 20px;
  padding-left: 24px;
`

// 迭代列表样式
export const IterationListBox = styled.div<{ isShowLeft: boolean }>(
  {
    width: 274,
    borderRight: '1px solid var(--neutral-n6-d1)',
    padding: '0px 24px 0px 0',
    background: 'white',
    height: '100%',
    '.ant-space-item': {
      display: 'flex',
    },
  },
  ({ isShowLeft }) => ({
    display: isShowLeft ? 'block' : 'none',
  }),
)

export const TopWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: 'white',
})

export const IconWrap = styled(IconFont)<{ isActive: any }>(
  {
    fontSize: 20,
    color: 'var(--neutral-n3)',
    cursor: 'pointer',
    padding: 8,
    borderRadius: 6,
    '&: hover': {
      color: 'var(--neutral-n1-d1)',
      background: 'var(--hover-d3)',
    },
  },
  ({ isActive }) => ({
    color: isActive ? 'var(--neutral-n1-d1)' : 'var(--neutral-n3)',
    background: isActive ? 'var(--hover-d3)' : 'white',
  }),
)

export const SortItem = styled.div<{ isActive: boolean }>(
  {
    width: '100%',
    height: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: 14,
    cursor: 'pointer',
    margin: '4px 0',
    padding: '0 16px',
    '.icon': {
      marginLeft: 24,
    },
    '&:hover': {
      color: 'var(--neutral-n1-d1)',
      background: 'var(--hover-d3)',
    },
  },
  ({ isActive }) => ({
    color: isActive ? 'var(--primary-d2)!important' : 'var(--neutral-n2)',
  }),
)

export const CardGroups = styled.div({
  height: 'calc(100% - 60px)',
  width: '100%',
  overflowY: 'scroll',
  '::-webkit-scrollbar': {
    width: 0,
  },
})

export const CardWrap = styled.div<{ active?: boolean }>`
  height: 104px;
  border-radius: 6px;
  box-sizing: border-box;
  border: ${props =>
    props.active
      ? '1px solid var(--primary-d1)'
      : '1px solid var(--neutral-n6-d1)'};
  background: var(--neutral-white-d4);
  padding: 16px 0;
  position: relative;
  margin-top: 16px;
  cursor: pointer;
  .ant-progress-text {
    font-size: var(--font12);
    color: var(--neutral-n2);
  }
  .dropdownicon {
    position: absolute;
    top: 10;
    right: 6;
  }
  &:hover {
    border: 1px solid var(--primary-d1);
    .dropdownIcon {
      visibility: visible;
    }
    .info {
      color: var(--primary-d1);
    }
  }
`

export const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
`

export const TitleWrap = styled.div`
  font-size: var(--font14);
  color: var(--neutral-n1-d1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px 0 16px;
  .name {
    max-width: 130px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-family: SiYuanMedium;
  }
`

export const TimeWrap = styled.div`
  font-size: var(--font12);
  color: var(--neutral-n4);
`

export const ToDetailBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 4px 0;
  padding: 0 16px;
`

export const StatusBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
`

export const DetailWrap = styled.div`
  font-size: var(--font12);
  color: var(--neutral-n4);
  cursor: pointer;
`
