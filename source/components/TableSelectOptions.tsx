import React from 'react'

import styled from '@emotion/styled'
import IconFont from './IconFont'
import { useSelector } from '@store/index'
const SelectOptions = styled.div`
  position: absolute;
  top: 40px;
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
interface IProps {
  roleName: string
  callBack(data: Model.Sprint.ProjectSettings): void
}
const TableSelectOptions = (props: IProps) => {
  const { projectRoleList } = useSelector(state => state.sprint)
  return (
    <SelectOptions>
      {projectRoleList?.map((item, index) => (
        <SelectItem
          key={index}
          onClick={() => {
            props.callBack(item)
          }}
        >
          <span className={props.roleName === item.name ? 'activity' : ''}>
            {item.name}
          </span>
          {props.roleName === item.name && (
            <IconFont
              type="check"
              style={{ marginLeft: '30px' }}
              className={props.roleName === item.name ? 'activity' : ''}
            ></IconFont>
          )}
        </SelectItem>
      ))}
    </SelectOptions>
  )
}
export default TableSelectOptions
