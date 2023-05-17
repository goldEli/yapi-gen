import React from 'react'

import styled from '@emotion/styled'
const SelectOptions = styled.div`
  position: absolute;
  top: 6px;
  left: 10px;
  width: 120px;
  /* height: 136px; */
  background: #ffffff;
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  border-radius: 6px 6px 6px 6px;
  opacity: 1;
  padding: 10px 16px;
`
const SelectItem = styled.div`
  height: 20px;
`
interface IProps {}
const TableSelectOptions = (props: IProps) => {
  return (
    <SelectOptions>
      {[1, 2, 3].map(item => (
        <SelectItem>{item}</SelectItem>
      ))}
    </SelectOptions>
  )
}
export default TableSelectOptions
