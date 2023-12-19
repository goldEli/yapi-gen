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
  .project_category_activity {
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
  category: string
  callBack(data: Model.Sprint.ProjectSettings): void
}
const ProjectClasss = (props: IProps) => {
  // const projectClasss = [
  //   { id: 1, name: '游戏项目' },
  //   { id: 2, name: '冲刺项目' },
  //   { id: 3, name: '迭代项目' },
  // ]
  const { category = '我关注的' } = props
  const { projectCategory = [] } = useSelector(state => state.project)
  const [isVisible, setIsVisible] = useState(false)

  const onClick = (item: any) => {
    setIsVisible(false)
    props.callBack(item)
  }
  if (projectCategory.length === 0) {
    return <div>{category ?? '--'}</div>
  }
  return (
    <Popover
      getPopupContainer={n => n}
      open={isVisible}
      onOpenChange={visible => setIsVisible(visible)}
      trigger={['hover']}
      content={
        <SelectOptions>
          {projectCategory?.map((item: any, index: any) => (
            <SelectItem key={index} onClick={() => onClick(item)}>
              <span
                className={
                  category === item.name
                    ? 'project_category_activity'
                    : 'project_category'
                }
              >
                {item.name}
              </span>
              {category === item.name && (
                <IconFont
                  type="check"
                  style={{ marginLeft: '30px' }}
                  className={
                    category === item.name ? 'project_category_activity' : ''
                  }
                ></IconFont>
              )}
            </SelectItem>
          ))}
        </SelectOptions>
      }
    >
      <TextWrap className="project_category">
        {category}
        <IconFont
          className="dropdownIcon"
          style={{ color: 'var(--neutral-n4)', marginLeft: 12 }}
          type="down-icon"
        />
      </TextWrap>
    </Popover>
  )
}
export default ProjectClasss
