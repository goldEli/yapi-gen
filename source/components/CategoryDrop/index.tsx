/* eslint-disable max-statements-per-line */
/* eslint-disable react/jsx-handler-names */
import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { Select } from 'antd'
import styled from '@emotion/styled'
import CommonIconFont from '../CommonIconFont'
import NoData from '../NoData'
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
interface childProps {
  name: string
  id: number
}
interface item {
  name: string
  id: number
  children: childProps[]
}
interface IProps {
  width?: number
  value?: string
  onChangeCallBack?(data: childProps): void
  onClearCallback?(): void
  options: item[]
}
const CategoryDrop = (props: IProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { options, onClearCallback, onChangeCallBack } = props
  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }
  return (
    <Wrap
      value={props.value ?? ''}
      placeholder="选择类别"
      dropdownRender={() => {
        const menu = options?.map(item => (
          <div key={item.name}>
            <TypeBox>{item.name}</TypeBox>
            {item.children.map(item => (
              <CategoryBox
                key={item.name}
                onClick={() => onChangeCallBack && onChangeCallBack(item)}
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
                      color:
                        props.value === item.name ? 'var(--primary-d2)' : '',
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
        return <DropBox>{menu ? menu : <NoData></NoData>}</DropBox>
      }}
      style={{ width: props.width ?? 300 }}
      open={isOpen}
      onClick={toggleOpen}
      allowClear
      onClear={() => {
        setIsOpen(false)
        onClearCallback && onClearCallback()
      }}
    ></Wrap>
  )
}
export default forwardRef(CategoryDrop)