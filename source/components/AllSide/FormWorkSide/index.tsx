/* eslint-disable @typescript-eslint/naming-convention */
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { useState } from 'react'
import AddFormWork from '@/components/AllSide/FormWorkSide/AddFormWork'

export const TitleStyle = styled.div`
  display: flex;
  width: 100%;
  padding: 24px 24px 20px 24px;
  align-items: center;
  font-size: 14px;
  color: var(--neutral-n1-d1);
  justify-content: space-between;
  font-family: SiYuanMedium;
`
const Slide = styled.div`
  height: 44px;
  padding-left: 24px;
  font-size: 14px;
  color: var(--neutral-n1-d2);
  line-height: 44px;
  &:hover {
    cursor: pointer;
  }
`
const IconFontStyle = styled(IconFont)({
  color: 'var(--neutral-n2)',
  fontSize: '18px',
  borderRadius: '6px',
  padding: '5px',
  '&: hover': {
    background: 'var(--hover-d1)',
    color: 'var(--neutral-n1-d1)',
    cursor: 'pointer',
  },
})
const a = [
  {
    label: '工作日报',
    id: 1,
  },
  {
    label: '工作周报',
    id: 2,
  },
  {
    label: '工作月报',
    id: 3,
  },
]

const FormWorkSide = () => {
  const [isActive, setIsActive] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  return (
    <>
      <TitleStyle>
        <span>模板</span>
        <IconFontStyle type="plus" onClick={() => setIsVisible(true)} />
      </TitleStyle>
      {a.map((el, index) => {
        return (
          <Slide
            key={el.id}
            onClick={() => setIsActive(index)}
            style={{
              background:
                isActive == index
                  ? 'linear-gradient(90deg, #EBEFFF 0%, rgba(243,246,255,0) 100%)'
                  : 'none',
            }}
          >
            {el.label}
          </Slide>
        )
      })}
      <AddFormWork
        onClose={() => setIsVisible(false)}
        isVisible={isVisible}
        onConfirm={() => 12}
      />
    </>
  )
}
export default FormWorkSide
