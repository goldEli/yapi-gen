import styled from '@emotion/styled'
// index

export const Wrap = styled.div`
  width: 100%;
`

export const ContentWrap = styled.div`
  display: flex;
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

export const Card = styled.div`
  height: 64px;
  border-radius: 6px;
  padding: 16px;
  border: 1px solid var(--neutral-n6-d1);
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
