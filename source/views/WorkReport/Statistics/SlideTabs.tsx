import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Tabs } from 'antd'
import styled from '@emotion/styled'
import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons'
import { css } from '@emotion/css'

type PositionType = 'left' | 'right'

const IconContainer = styled.div`
  width: 40px;
  height: 52px;
  box-shadow: 5px 0px 7px -3px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
`

const tabsWrap = css`
  width: 100%;
  .ant-tabs > .ant-tabs-nav {
    .ant-tabs-nav-wrap {
      background: pink;
    }
    .ant-tabs-nav-list {
      background: #6688ff;
      .ant-tabs-tab {
        color: #ffffff;
      }
      .ant-tabs-tab.ant-tabs-tab-active {
        color: #323233;
      }
    }
    .ant-tabs-nav-operations {
      display: none;
    }
  }
`
// .ant-tabs-nav-wrap {
//   // margin-left: 16px;
// }
// .ant-tabs-nav-wrap::after {
//   box-shadow: none;
// }
interface SlideTabsProps {
  onChange?(value: string): void
  defaultValue: string
  items: any[]
}

const STEP = 1
const TAB_MARGIN = 32

const SlideTabs: React.FC<SlideTabsProps> = ({
  items,
  defaultValue,
  onChange,
}: SlideTabsProps) => {
  const [xAxis, setXAxis] = useState<number>(0)
  const [activeKey, setActiveKey] = useState<string>('1')
  const [viewRight, setViewRight] = useState<number>(0)
  const [slidRight, setSlidRight] = useState<number>(0)
  const nodes = useRef<Array<any>>([])
  const nodeIndex = useRef(0)
  const showLeft = useMemo(() => !!(xAxis < 0), [xAxis])

  const showRight = useMemo(() => {
    return slidRight > viewRight
  }, [viewRight, slidRight])

  useLayoutEffect(() => {
    nodes.current = Array.from(document.querySelectorAll('.ant-tabs-tab'))
  }, [])

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

  const resize = () => {
    const { right } = document
      .getElementsByClassName('ant-tabs-nav-wrap')[0]
      .getBoundingClientRect()
    const { right: sliderRight } = document
      .getElementsByClassName('ant-tabs-nav-list')[0]
      .getBoundingClientRect()
    setViewRight(right)
    setSlidRight(sliderRight)
  }
  useEffect(() => {
    const slider: any = document.getElementsByClassName('ant-tabs-nav-list')[0]
    slider.style.transform = `translateX(${xAxis}px)`
    resize()
  }, [xAxis])

  useEffect(() => {
    resize()
  }, [])

  useLayoutEffect(() => {
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  const handleChange = (key: string) => {
    setActiveKey(key)
    onChange?.(key)
  }

  const onTabScroll = (val: any) => {
    // console.log('val', val)
  }

  const operateSlot: Record<PositionType, React.ReactNode> = {
    left: (
      <>
        {showLeft && (
          <IconContainer>
            <DoubleLeftOutlined onClick={prev} />
          </IconContainer>
        )}
      </>
    ),
    right: (
      <>
        {showRight && (
          <IconContainer>
            <DoubleRightOutlined onClick={next} />
          </IconContainer>
        )}
      </>
    ),
  }

  return (
    <div className={tabsWrap}>
      <Tabs
        tabBarExtraContent={operateSlot}
        items={items}
        activeKey={activeKey}
        onChange={handleChange}
        onTabScroll={onTabScroll}
      />
    </div>
  )
}

export default SlideTabs
