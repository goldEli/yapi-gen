import styled from '@emotion/styled'

export const Wrap = styled.div`
  position: relative;
  padding-top: 56px;
  height: 100%;
  padding-bottom: 100px;
`

export const MyHead = styled.div`
  margin-bottom: 8px;
  height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 24px;
  border-bottom: 1px solid var(--neutral-n6-d1);
`

export const MyIconModeWrap = styled.div`
  width: 88px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 5px 0;
`

export const MyIconMode = styled.div<{ active?: boolean; tap: any }>`
  display: flex;
  cursor: pointer;
  /* cursor: pointer; */
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  transition: all 0.5s;
  background: ${props =>
    props.active ? 'var(--primary-d1)' : 'var(--hover-d2)'};
  border-radius: 6px 6px 6px 6px;
  svg {
    color: ${props =>
      props.active ? 'var(--auxiliary-text-t1-d1)' : 'var(--neutral-n1-d1)'};
  }
  :hover {
    svg {
      color: ${props =>
        props.active ? 'var(--neutral-white-d7)' : 'var(--primary-d2)'};
    }
  }
`

export const MyIconModeText = styled.div`
  text-align: center;
  height: 22px;
  font-size: 14px;
  font-weight: 400;
  color: var(--neutral-n1-d1);
  line-height: 22px;
  margin-top: 8px;
`

export const MyIconModeTextWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 0 12px;
  margin-bottom: 24px;
  /* justify-content: center; */
`

export const ResetB = styled.div`
  height: 22px;
  font-size: 14px;
  font-family: SiYuanRegular;
  font-weight: 400;
  color: var(--neutral-n3);
  line-height: 22px;
  cursor: pointer;
  :hover {
    color: var(--auxiliary-text-t2-d2);
  }
`

export const InfoWrap = styled.div``

export const InfoWrapItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0 24px;
  justify-content: space-between;
  height: 40px;
  transition: all 0.3s;
  span {
    font-size: 14px;
    color: var(--neutral-n2);
  }
  :hover {
    background-color: var(--hover-d3);
    span {
      color: var(--neutral-n1-d1);
    }
  }
`
