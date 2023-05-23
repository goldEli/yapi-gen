/* eslint-disable react/jsx-handler-names */
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { Select } from 'antd'
import styled from '@emotion/styled'
import CommonIconFont from '../CommonIconFont'
const Wrap = styled(Select)`
  margin-bottom: 10px;
`
const TypeBox = styled.div`
  color: var(--neutral-n3);
  font-size: var(--font12);
  margin-bottom: 6px;
`
const CategoryBox = styled.div`
  color: var(--neutral-n2);
  font-size: var(--font14);
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  img {
    margin-right: 4px;
    vertical-align: sub;
  }
`
const DropBox = styled.div`
  padding: 6px 16px;
  cursor: pointer;
  color: var(--primary-d2);
`
interface IProps {
  width?: number
  value?: string
  categoryClick(data: any): void
}
const CategoryDrop = (props: IProps, ref: any) => {
  const [isOpen, setIsOpen] = useState(false)
  const data = [
    {
      name: '长故事类型',
      children: [{ name: '长故事', active: false }],
      visible: true,
    },
    {
      name: '标准事务类型',
      children: [
        { name: '故事', active: false },
        { name: '任务', active: false },
      ],
      visible: true,
    },
    {
      name: '故障事务类型',
      visible: true,
      children: [
        { name: '故障', active: false },
        { name: 'BUG缺陷', active: false },
      ],
    },
    {
      name: '子任务类型',
      visible: true,
      children: [{ name: '子任务', active: false }],
    },
  ]
  const dropdownRender = () => {
    const menu = data.map(item => (
      <div key={item.name}>
        <TypeBox>{item.name}</TypeBox>
        {item.children.map(item => (
          <CategoryBox
            key={item.name}
            onClick={() => props.categoryClick(item)}
          >
            <span>
              {' '}
              <img
                style={{ width: '18px' }}
                src={
                  'https://dev.staryuntech.com/dev-agile/attachment/category_icon/folder.png'
                }
              />
              <span
                style={{
                  color: props.value === item.name ? 'var(--primary-d2)' : '',
                }}
              >
                {item.name}
              </span>
            </span>
            {props.value === item.name && (
              <CommonIconFont
                type="check"
                color={props.value === item.name ? 'var(--primary-d2)' : ''}
              ></CommonIconFont>
            )}
          </CategoryBox>
        ))}
      </div>
    ))
    return <DropBox>{menu}</DropBox>
  }
  const onBlur = () => {}
  useImperativeHandle(ref, () => {
    onBlur
  })
  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }
  return (
    <Wrap
      value={props.value ?? ''}
      placeholder="选择类别"
      dropdownRender={dropdownRender}
      style={{ width: props.width ?? 300 }}
      open={isOpen}
      onClick={toggleOpen}
    ></Wrap>
  )
}
export default forwardRef(CategoryDrop)
