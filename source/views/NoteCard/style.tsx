import styled from '@emotion/styled'

export const Wrap1 = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`
export const Wrap2 = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`
export const ColorBox = styled.div<{ colors: number }>`
  padding: 0px 8px;
  background-color: ${props =>
    props.colors === 1
      ? 'rgba(250, 151, 70, 0.2)'
      : props.colors === 2
      ? ' rgba(67,186,154,0.2)'
      : 'rgba(150,151,153,0.14)'};

  height: 20px;
  border-radius: 6px 6px 6px 6px;
  height: 20px;
  font-size: 12px;
  color: #323233;
  line-height: 20px;
`
export const ColorBtn = styled.div`
  height: 22px;
  font-size: 14px;
  display: flex;
  cursor: pointer;
  align-items: center;
  gap: 8px;
  color: #646566;
  line-height: 22px;
  :hover {
    color: #6688ff;
  }
`
export const ColorBtn2 = styled.div`
  padding: 0 16px;
  height: 22px;
  font-size: 14px;
  border-right: 1px solid #ecedef;
  display: flex;
  cursor: pointer;
  align-items: center;
  gap: 8px;
  color: #bbbdbf;
  line-height: 22px;
  :hover {
    color: #6688ff;
  }
`
