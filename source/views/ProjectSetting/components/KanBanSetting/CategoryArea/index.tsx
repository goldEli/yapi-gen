import React from 'react'
import styled from '@emotion/styled'
import CommonButton from '@/components/CommonButton'
import IconFont from '@/components/IconFont'

interface CategoryAreaProps {
  data: Model.KanbanConfig.Category
  children: React.ReactNode
  showTitle: boolean
}

const CategoryAreaBox = styled.div`
  width: 100%;
  display: flex;
  gap: 16px;
  flex-direction: column;
`
const TitleArea = styled.div<{ visible: boolean }>`
  visibility: ${props => (props.visible ? 'visible' : 'hidden')};
  display: flex;
  align-items: center;
  gap: 8px;
`

const IconImg = styled.img`
  width: 20px;
  height: 20px;
`

const Text = styled.div`
  font-size: 14px;
  font-family: SiYuanMedium;
  color: var(--neutral-n1-d1);
  padding-right: 8px;
`

const IconWrap = styled(IconFont)`
  font-size: 14px;
  color: var(--neutral-n3);
`

const CategoryArea: React.FC<CategoryAreaProps> = props => {
  return (
    <CategoryAreaBox>
      <TitleArea visible={props.showTitle}>
        <IconWrap type="down-icon" />
        <IconImg src={props.data.attachment_path} />
        <Text>{props.data.name}</Text>
        <CommonButton type="secondary">编辑工作流</CommonButton>
      </TitleArea>
      {props.children}
    </CategoryAreaBox>
  )
}

export default CategoryArea
