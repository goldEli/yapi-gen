/* eslint-disable react/jsx-handler-names */
/* eslint-disable camelcase */
import { useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { Button } from 'antd'
import { createPortal } from 'react-dom'
import { css } from '@emotion/css'
import guide_1 from '/guide_1.svg'
import guide_2 from '/guide_2.svg'
import guide_3 from '/guide_3.svg'
import guide_4 from '/guide_4.svg'
import { useTranslation } from 'react-i18next'

const imgBoxCss = css`
  /* height: 448px; */
  box-sizing: border-box;
  /* padding: 0px 0px 65px 0px; */
`
const footerCss = css`
  display: flex;
  justify-content: end;
  height: 75px;
  box-sizing: border-box;
  padding-right: 53px;
  align-items: center;
  gap: 24px;
`
const Container = styled.div`
  z-index: 10;
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(135, 136, 137, 0.6);
`
const Dialog = styled.div`
  width: 900px;
  /* height: 600px; */
  background: rgba(245, 246, 247, 1);
  position: absolute;
  border-radius: 6px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`

const ButtonWrap = styled.div({
  height: 30,
  width: 68,
  borderRadius: 6,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontSize: 12,
  fontWeight: 400,
  background: '#2877ff',
  cursor: 'pointer',
})

const ButtonWrapBorder = styled.div({
  height: 30,
  width: 68,
  borderRadius: 6,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#2877ff',
  fontSize: 12,
  fontWeight: 400,
  background: 'white',
  cursor: 'pointer',
  border: '1px solid #2877ff',
})

const Next = (props: { visible: boolean; close(): void }) => {
  const [t] = useTranslation()
  const [active, setActive] = useState(0)
  const inform = [
    {
      text: t('container.text1'),
      img: guide_1,
    },
    {
      text: t('container.text2'),
      img: guide_2,
    },
    {
      text: t('container.text3'),
      img: guide_3,
    },
    {
      text: t('container.text4'),
      img: guide_4,
    },
  ]
  const filterData = useMemo(() => {
    const filterActive = inform.filter((item, index) => index === active)
    return filterActive.map(item => (
      <div key={item.text}>
        {/* <div className={textCss}>{item.text}</div> */}
        <div className={imgBoxCss}>
          <img src={item.img} alt="12" />
        </div>
      </div>
    ))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  const next = () => {
    let index = active
    index++
    setActive(index)
  }

  const prev = () => {
    let index = active
    index--
    setActive(index)
  }
  if (!props.visible) {
    return null
  }
  return createPortal(
    <Container>
      <Dialog>
        {/* <header>头</header> */}
        {filterData}
        <footer className={footerCss}>
          {active !== 0 && (
            <ButtonWrapBorder onClick={prev}>
              {t('container.next')}
            </ButtonWrapBorder>
          )}
          {active !== inform.length - 1
            && <ButtonWrap onClick={next}>{t('container.prev')}</ButtonWrap>
          }
          {active === inform.length - 1 && (
            <ButtonWrap onClick={() => props.close()}>
              {t('container.finish')}
            </ButtonWrap>
          )}
        </footer>
      </Dialog>
    </Container>,
    document.body,
  )
}

export default Next
