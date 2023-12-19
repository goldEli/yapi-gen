import React, { useState } from 'react'

import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import { Popover } from 'antd'
import IconFont from '../IconFont'
const SelectOptions = styled.div`
  /* position: absolute;
  top: 40px;
  left: 0px; */
  min-width: 120px;
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
  /* padding-left: 16px; */
  padding: 0 8px 0 16px;
  &:hover {
    background: var(--hover-d3);
  }
  .activity {
    color: var(--primary-d2);
  }
`

const TextWrap = styled.span`
  /* display: flex;
  align-items: center; */
  cursor: pointer;
  .dropdownIcon {
    visibility: hidden;
  }
`
interface IProps {
  roleName: string
  callBack(data: Model.Sprint.ProjectSettings): void
}
const UpdateUserDepartment = (props: IProps) => {
  const { departmentList = [] } = useSelector(state => state.user)
  const [isVisible, setIsVisible] = useState(false)

  const onClick = (item: any) => {
    setIsVisible(false)
    props.callBack(item)
  }
  if (departmentList.length === 0) {
    return <div>{props.roleName}</div>
  }
  return (
    <Popover
      getPopupContainer={n => n}
      open={isVisible}
      onOpenChange={visible => setIsVisible(visible)}
      trigger={['hover']}
      content={
        <SelectOptions>
          {departmentList?.map((item: any, index: any) => (
            <SelectItem key={index} onClick={() => onClick(item)}>
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
      }
    >
      <TextWrap>
        {props.roleName}
        <IconFont
          className="dropdownIcon"
          style={{ color: 'var(--neutral-n4)', marginLeft: 12 }}
          type="down-icon"
        />
      </TextWrap>
    </Popover>
  )
}
export default UpdateUserDepartment
