/* eslint-disable react/jsx-handler-names */
/* eslint-disable camelcase */
import { useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { Button } from 'antd'
import { createPortal } from 'react-dom'
import { css } from '@emotion/css'
import guide_1 from '@/assets/guide_1.svg'
import guide_2 from '@/assets/guide_2.svg'
import guide_3 from '@/assets/guide_3.svg'
import guide_4 from '@/assets/guide_4.svg'
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
  gap: 10px;
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

const Next = (props: { visible: boolean; close(): void }) => {
  const [t] = useTranslation()
  const [active, setActive] = useState(0)
  const inform = [
    {
      text: 'IFUN敏捷系统将同步OA企业信息员工成员',
      img: guide_1,
    },
    {
      text: '请到设置-权限管理配置权限组系统提供了管理员、编辑者、参与者三个系统权限组还可自定义更多权限组',
      img: guide_2,
    },
    {
      text: '请在员工管理中配置用户权限',
      img: guide_3,
    },
    {
      text: '创建项目，开始项目管理',
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
          {active !== 0 && <Button onClick={prev}>上一步</Button>}
          {active !== inform.length - 1
            && <Button onClick={next}>下一步</Button>
          }
          {active === inform.length - 1 && (
            <Button onClick={() => props.close()} type="primary">
              完成
            </Button>
          )}
        </footer>
      </Dialog>
    </Container>,
    document.body,
  )
}

export default Next
