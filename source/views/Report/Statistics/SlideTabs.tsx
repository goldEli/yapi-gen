import { useRef, useState } from 'react'
import { Tabs } from 'antd'
import styled from '@emotion/styled'
import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons'
import { css } from '@emotion/css'

type PositionType = 'left' | 'right'

const ArrowIconBox = styled.div`
  width: 40px;
  height: 52px;
  box-shadow: 5px 0px 7px -3px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
`

const tabsWrap = css`
  width: calc(100vw - 560px);
  .ant-tabs > .ant-tabs-nav .ant-tabs-nav-wrap {
  }
`
// display: none;

interface SlideTabsProps {
  items: any[]
}

const SlideTabs: React.FC<SlideTabsProps> = ({ items }: SlideTabsProps) => {
  const [position, setPosition] = useState<PositionType[]>(['left', 'right'])
  const [leftDisable, setLeftDisable] = useState<boolean>(true)
  const [rightDisable, setRightDisable] = useState<boolean>(false)
  const xAxis = useRef(0)

  const handlePrev = () => {
    const nav: any = document.getElementsByClassName('ant-tabs-nav-list')
    const nodeCount = document.querySelectorAll('.ant-tabs-tab').length
    const nodeWidth = nav[0].firstChild?.offsetWidth

    if (xAxis.current + nodeCount * nodeWidth <= 0) {
      setLeftDisable(true)
      return
    }
    xAxis.current -= nodeWidth * 5

    nav[0].style.transform = `translateX(${xAxis.current}px)`
  }

  const handleNext = () => {
    const nav: any = document.getElementsByClassName('ant-tabs-nav-list')
    const nodeCount = document.querySelectorAll('.ant-tabs-tab').length
    const nodeWidth = nav[0].firstChild?.offsetWidth

    setLeftDisable(false)

    if (xAxis.current + nodeCount * nodeWidth <= 0) {
      return
    }

    xAxis.current -= nodeWidth * 5

    nav[0].style.transform = `translateX(${xAxis.current}px)`
  }

  const operateSlot: Record<PositionType, React.ReactNode> = {
    left: (
      <>
        {!leftDisable && (
          <ArrowIconBox>
            <DoubleLeftOutlined onClick={handlePrev} />
          </ArrowIconBox>
        )}
      </>
    ),
    right: (
      <>
        {!rightDisable && (
          <ArrowIconBox>
            <DoubleRightOutlined onClick={handleNext} />
          </ArrowIconBox>
        )}
      </>
    ),
  }

  return (
    <div className={tabsWrap}>
      <Tabs tabBarExtraContent={operateSlot} items={items} />
    </div>
  )
}

export default SlideTabs
