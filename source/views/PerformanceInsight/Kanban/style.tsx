import styled from '@emotion/styled'

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
