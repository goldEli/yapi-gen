import styled from '@emotion/styled'
export const Wrap = styled.div`
  height: 100%;
  width: 100%;
  padding: 20px 16px 0 16px;
`
export const HeaderWrap = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;
  justify-content: space-between;
`
export const OperateWrap = styled.div`
  display: flex;
  align-items: center;
  button {
    margin-left: 16px;
  }
`

export const TableWrap = styled.div`
  min-height: 200px;
`

export const OperateLabelText = styled.span<{ color: string }>`
  color: ${props => props.color};
  font-size: var(--font14);
  margin-left: 12px;
  cursor: pointer;
`
