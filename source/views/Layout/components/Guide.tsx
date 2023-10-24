// 初次进入项目引导

/* eslint-disable react/jsx-handler-names */
/* eslint-disable camelcase */
import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import {
  Container,
  Dialog,
  imgBoxCss,
  footerCss,
  ButtonWrapBorder,
  ButtonWrap,
} from '../style'

const Guide = (props: { visible: boolean; close(): void }) => {
  const [t] = useTranslation()
  const [active, setActive] = useState(0)
  const inform = [
    {
      text: t('container.text1'),
      img: 'https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/guide_1.svg',
    },
    {
      text: t('container.text2'),
      img: 'https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/guide_2.svg',
    },
    {
      text: t('container.text3'),
      img: 'https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/guide_3.svg',
    },
    {
      text: t('container.text4'),
      img: 'https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/guide_4.svg',
    },
  ]
  const filterData = useMemo(() => {
    const filterActive = inform.filter((item, index) => index === active)
    return filterActive.map(item => (
      <div key={item.text}>
        <div className={imgBoxCss}>
          <img src={item.img} alt="12" />
        </div>
      </div>
    ))
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
        {filterData}
        <footer className={footerCss}>
          {active !== 0 && (
            <ButtonWrapBorder onClick={prev}>
              {t('container.next')}
            </ButtonWrapBorder>
          )}
          {active !== inform.length - 1 && (
            <ButtonWrap onClick={next}>{t('container.prev')}</ButtonWrap>
          )}
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

export default Guide
