// 初次进入项目引导

/* eslint-disable react/jsx-handler-names */
/* eslint-disable camelcase */
import { useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { createPortal } from 'react-dom'
import { css } from '@emotion/css'

const imgBoxCss = css`
  box-sizing: border-box;
  position: relative;
  height: 494px;
`
const footerCss = css`
  position: absolute;
  bottom: 0px;
  height: 80px;
  display: flex;
  justify-content: end;
  box-sizing: border-box;
  padding-right: 24px;
  align-items: center;
  gap: 16px;
  width: 100%;
`
const Container = styled.div`
  z-index: 9999;
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(135, 136, 137, 0.6);
`

const ImgWrap = styled.div`
  position: absolute;
  transition: opacity 5s;
`
const activeCss = css`
  opacity: 1;
`
const noCss = css`
  opacity: 0;
`

const textBoxCss = css`
  box-sizing: border-box;
  padding: 24px 24px 0px 24px;
  .title {
    height: 26px;
    font-size: 18px;
    font-family: SiYuanMedium;
    font-weight: 500;
    color: var(--neutral-n1-d1);
    line-height: 26px;
  }
  .desc {
    height: 22px;
    font-size: 14px;
    font-family: MiSans-Regular, MiSans;
    font-weight: 400;
    color: var(--neutral-n2);
    line-height: 22px;
    margin-top: 8px;
  }
`

const RightButton = styled.div`
  width: 88px;
  height: 32px;
  background: var(--auxiliary-b1);
  border-radius: 6px 6px 6px 6px;
  text-align: center;
  line-height: 32px;
  font-size: 14px;
  font-family: MiSans-Regular, MiSans;
  font-weight: 400;
  color: var(--auxiliary-text-t1-d1);
  cursor: pointer;
`

const LeftButton = styled.div`
  width: 93px;
  height: 32px;
  background: var(--auxiliary-b4);
  border-radius: 6px 6px 6px 6px;
  font-size: 14px;
  font-family: MiSans-Regular, MiSans;
  font-weight: 400;
  color: var(--auxiliary-text-t2-d1);
  line-height: 32px;
  text-align: center;
  cursor: pointer;
`

const GuideModal = (props: {
  close(): void
  inform: any[]
  width: number
  height: number
}) => {
  const Dialog = styled.div`
    width: ${props?.width}px;
    height: ${props?.height}px;
    background: var(--neutral-white-d5);
    position: absolute;
    border-radius: 6px;
    left: 50%;
    top: 50%;
    z-index: 99;
    transform: translate(-50%, -50%);
  `
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(true)

  const filterData = useMemo(() => {
    const filterActive = props?.inform.filter((item, index) => index === active)
    return filterActive.map(item => (
      <div key={item.key}>
        <div className={textBoxCss}>
          <div className="title">{item.title}</div>
          <div className="desc">{item.desc}</div>
          {item.extra ? <div className="desc">{item.extra}</div> : null}
        </div>
      </div>
    ))
  }, [active])

  const ImgData = useMemo(() => {
    // todo 待解决不能渐变问题
    return (
      <div className={imgBoxCss}>
        {props?.inform?.map(k => (
          <ImgWrap key={k.key} className={active === k.key ? activeCss : noCss}>
            <img src={k.img} width={props?.width} />
          </ImgWrap>
        ))}
      </div>
    )
  }, [active])

  const next = () => {
    let index = active
    index++
    if (index >= props?.inform?.length) {
      setActive(0)
      props?.close?.()
      setVisible(false)
    }
    setActive(index)
  }

  return visible ? (
    createPortal(
      <Container>
        <Dialog>
          {ImgData}
          {filterData}
          <footer className={footerCss}>
            <LeftButton
              onClick={() => {
                setActive(0)
                props?.close?.()
                setVisible(false)
              }}
            >
              跳过 {`(${active + 1}/${props?.inform?.length})`}
            </LeftButton>
            <RightButton onClick={next}>
              {active + 1 === props?.inform?.length ? '开始工作' : '下一步'}
            </RightButton>
          </footer>
        </Dialog>
      </Container>,
      document.body,
    )
  ) : (
    <div></div>
  )
}

export default GuideModal
