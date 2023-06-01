import React, { useState, useEffect, useRef } from 'react'
import LongStoryDropdown from '../LongStoryDropdown'
import CommonIconFont from '../CommonIconFont'
import styled from '@emotion/styled'
const BreadBox = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  position: relative;
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
const HasStroyWrap = styled.div`
  display: flex;
`
interface IProps {
  longStroy?: any
}
const LongStroyBread = (props: IProps) => {
  const [visible, setVisible] = useState(false)
  const [showEditIcon, setShowEditIcon] = useState(false)
  const { longStroy } = props
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])
  const handleClickOutside = (event: { target: any }) => {
    console.log(
      'handleClickOutside',
      event.target,
      ref.current,
      typeof event.target,
    )
    if (ref.current && !ref.current.contains(event.target)) {
      setVisible(false)
    }
  }

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <BreadBox>
        {longStroy ? (
          <LongStroyWrap>
            {showEditIcon ? (
              <CommonIconFont
                type="edit"
                color="var(--neutral-n3)"
                onMouseLeave={() => {
                  setShowEditIcon(false)
                }}
                onClick={() => setVisible(true)}
              ></CommonIconFont>
            ) : (
              <img
                src="https://dev.staryuntech.com/dev-agile/attachment/category_icon/folder.png"
                alt=""
                onMouseEnter={() => {
                  console.log('onMouseEnter')
                  setShowEditIcon(true)
                }}
                onMouseLeave={() => {
                  console.log('onMouseLeave')
                  setShowEditIcon(false)
                }}
                style={{ width: 20, marginRight: '6px' }}
              />
            )}
            <LabelBox>{longStroy.sn}</LabelBox>
          </LongStroyWrap>
        ) : (
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
        )}
        <CommonIconFont
          type="right"
          color="var(--neutral-n1-d1)"
        ></CommonIconFont>
        <img
          src="https://dev.staryuntech.com/dev-agile/attachment/category_icon/folder.png"
          alt=""
          style={{ width: 20, marginRight: '6px' }}
        />
        <AffairTypeBox title="EWEWEWEWEWEWEW">DXKJ-0003</AffairTypeBox>
      </BreadBox>
      {visible ? <LongStoryDropdown></LongStoryDropdown> : null}
    </div>
  )
}
export default LongStroyBread
