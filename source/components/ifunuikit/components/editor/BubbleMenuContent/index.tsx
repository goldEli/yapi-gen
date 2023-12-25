// 选中文字后展示的菜单
import React from 'react'
import styled from '@emotion/styled'

interface BubbleMenuContentProps {
  children: React.ReactNode
}

const BubbleMenuContentBox = styled.div`
  height: 44px;
  background: #ffffff;
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  border-radius: 6px 6px 6px 6px;
  opacity: 1;
  border: 1px solid #ebeced;
  transform: translateX(80px);
`

const BubbleMenuContent: React.FC<BubbleMenuContentProps> = props => {
  return <BubbleMenuContentBox>{props.children}</BubbleMenuContentBox>
}

export default BubbleMenuContent
