import React, { useState } from 'react'
import LongStoryDropdown from '../LongStoryDropdown'
import CommonIconFont from '../CommonIconFont'
import styled from '@emotion/styled'
const BreadBox = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  svg {
    margin: 0px 6px;
  }
`
const LongStroyWrap = styled.div`
  display: flex;
`
const LabelBox = styled.div`
  color: var(--neutral-n3);
  font-size: var(--font12);
  cursor: pointer;
`
const AffairTypeBox = styled.div`
  color: var(--neutral-n1-d1);
  font-size: var(--font12);
`
interface IProps {
  visible?: boolean
}
const LongStroyBread = (props: IProps) => {
  const [visible, setVisible] = useState(false)
  return (
    <div>
      <BreadBox>
        <LongStroyWrap
          onClick={() => {
            setVisible(true)
          }}
        >
          <CommonIconFont
            type="edit"
            color="var(--neutral-n3)"
          ></CommonIconFont>
          <LabelBox>添加长故事</LabelBox>
        </LongStroyWrap>
        <CommonIconFont
          type="right"
          color="var(--neutral-n1-d1)"
        ></CommonIconFont>
        <img
          src="https://dev.staryuntech.com/dev-agile/attachment/category_icon/folder.png"
          alt=""
          style={{ width: 20, marginRight: '6px' }}
        />
        <AffairTypeBox>DXKJ-0003</AffairTypeBox>
      </BreadBox>

      {visible ? <LongStoryDropdown></LongStoryDropdown> : null}
    </div>
  )
}
export default LongStroyBread
