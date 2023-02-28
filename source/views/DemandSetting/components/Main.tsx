import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import React from 'react'
import TabsDragging from './TabsDragging'
const TitleStyle = styled.div`
  display: flex;
  align-items: center;
  color: var(--neutral-n1-d1);
  margin: 20px 0 16px 0;
`
const Main = () => {
  const [list, setList] = React.useState<any>(() =>
    [1, 2, 3, 4, 5].map(v => ({
      key: v,
      children: `Item ${v}`,
    })),
  )
  const onChangeDragging = (item: any) => {
    setList(
      list.map((el: any) => ({
        ...el,
        active: el.children === item ? true : false,
      })),
    )
  }
  return (
    <div>
      <TitleStyle>
        <CommonIconFont type="down-icon" size={14} color="var(--neutral-n3)" />
        <span>基本信息</span>
      </TitleStyle>
      <TabsDragging
        onChange={(item: any) => onChangeDragging(item)}
        list={list}
        setList={setList}
      />
    </div>
  )
}
export default Main
