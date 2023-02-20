import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import React from 'react'
import SideDragging from '../components/SideDragging'

const LeftSideContainer = styled.div`
  width: 232px;
  height: 100%;
  border-right: 1px solid var(--neutral-n6-d2);
  padding: 0 16px;
`
const TeamAdd = styled.div`
  width: 100%;
  padding: 0 16px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:hover {
    cursor: pointer;
  }
`
const TiamTitleText = styled.span`
  font-size: var(--font14);
  font-weight: 500;
  color: var(--neutral-n1-d1);
`
const IconFontStyle = styled(IconFont)`
  font-size: 18px;
  color: var(--neutral-n2);
`
const LeftSide = () => {
  const childStyle = {
    width: '200px',
    height: '44px',
    hoverColor: `var(--hover-d2)`,
    activeColor: `var(--gradient)`,
  }
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
    <LeftSideContainer>
      <TeamAdd>
        <TiamTitleText>团队管理</TiamTitleText>
        <IconFontStyle type="plus"></IconFontStyle>
      </TeamAdd>
      <SideDragging
        onChange={(item: any) => onChangeDragging(item)}
        list={list}
        setList={setList}
        childStyle={childStyle}
      />
    </LeftSideContainer>
  )
}
export default LeftSide
