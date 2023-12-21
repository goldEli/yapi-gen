import styled from '@emotion/styled'

export const ToolTable = styled.table`
  border-collapse: collapse;
  border: 1;
`
export const HightLightTd = styled.td<{ light?: boolean }>`
  border: 1px solid rgb(232 232 232);
  cursor: pointer;
  padding: 2px 2px;
  width: 10px;
  height: 10px;

  background-color: ${({ light }) => (light ? '#617EF2' : '#D5D6D9')};
`
