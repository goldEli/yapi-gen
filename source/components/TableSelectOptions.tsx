import React from 'react'

import styled from '@emotion/styled'
import IconFont from './IconFont'
const SelectOptions = styled.div`
  position: absolute;
  top: 30px;
  left: 0px;
  width: 120px;
  background: #ffffff;
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  border-radius: 6px 6px 6px 6px;
  opacity: 1;
  padding: 4px 0px;
  z-index: 9;
`
const SelectItem = styled.div`
  height: 32px;
  cursor: pointer;
  color: var(--neutral-n2);
  font-size: var(--font14);
  display: flex;
  align-items: center;
  padding-left: 16px;
  &:hover {
    background: var(--hover-d3);
  }
  .activity {
    color: var(--primary-d2);
  }
`
interface IProps {}
const TableSelectOptions = (props: IProps) => {
  return (
    <SelectOptions>
      {['管理员', '编辑者', '参与者'].map((item, index) => (
        <SelectItem>
          <span className={index === 1 ? 'activity' : ''}>{item}</span>
          {index === 1 && (
            <IconFont
              type="check"
              style={{ marginLeft: '30px' }}
              className={index === 1 ? 'activity' : ''}
            ></IconFont>
          )}
        </SelectItem>
      ))}
    </SelectOptions>
  )
}
export default TableSelectOptions
