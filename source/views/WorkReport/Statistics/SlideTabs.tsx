import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
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
  .ant-tabs > .ant-tabs-nav {
    .ant-tabs-nav-wrap {
      margin: 0 16px;
    }
    .ant-tabs-nav-operations {
      display: none;
    }
  }
`

interface SlideTabsProps {
  items: any[]
}

const STEP = 1

const TAB_MARGIN = 32

const SlideTabs: React.FC<SlideTabsProps> = ({ items }: SlideTabsProps) => {
  const [xAxis, setXAxis] = useState<number>(0)
  const [showRight, setShowRight] = useState<boolean>(false)

  const nodes = useRef<Array<any>>([])
  const nodeIndex = useRef(0)
  const navWraptWidth = useRef(0)
  const navListWidth = useRef(0)

  const showLeft = useMemo(() => !!(xAxis < 0), [xAxis])

  useLayoutEffect(() => {
    nodes.current = Array.from(document.querySelectorAll('.ant-tabs-tab'))
    navWraptWidth.current =
      document.getElementsByClassName('ant-tabs-nav-wrap')[0].clientWidth
    navListWidth.current =
      document.getElementsByClassName('ant-tabs-nav-list')[0].clientWidth
  }, [])

  useEffect(() => {
    if (navListWidth.current <= navWraptWidth.current) {
      setShowRight(false)
      return
    }
    setShowRight(nodeIndex.current + STEP < nodes.current.length)
  }, [
    nodeIndex.current,
    nodes.current,
    navListWidth.current,
    navWraptWidth.current,
  ])

  const prev = () => {
    const fragment = nodes.current.slice(
      nodeIndex.current - STEP,
      nodeIndex.current,
    )
    nodeIndex.current -= STEP
    let nodeWidth = 0
    for (let index = 0; index < fragment.length; index++) {
      nodeWidth += fragment[index].clientWidth + TAB_MARGIN
    }

    setXAxis(current => {
      return current + nodeWidth
    })
  }

  const next = () => {
    const fragment = nodes.current.slice(
      nodeIndex.current,
      nodeIndex.current + STEP,
    )
    nodeIndex.current += STEP
    let nodeWidth = 0
    for (let index = 0; index < fragment.length; index++) {
      nodeWidth += fragment[index].clientWidth + TAB_MARGIN
    }
    setXAxis(current => {
      return current - nodeWidth
    })
  }

  useEffect(() => {
    const slider: any = document.getElementsByClassName('ant-tabs-nav-list')[0]
    slider.style.transform = `translateX(${xAxis}px)`
  }, [xAxis])

  const operateSlot: Record<PositionType, React.ReactNode> = {
    left: (
      <>
        {showLeft && (
          <ArrowIconBox>
            <DoubleLeftOutlined onClick={prev} />
          </ArrowIconBox>
        )}
      </>
    ),
    right: (
      <>
        {showRight && (
          <ArrowIconBox>
            <DoubleRightOutlined onClick={next} />
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
