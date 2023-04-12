import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons'
import { Space } from 'antd'
import styled from '@emotion/styled'
import { css } from '@emotion/css'

const IconContainer = styled.div`
  width: 40px;
  height: 52px;
  box-shadow: 5px 0px 7px -3px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
`

const tabsContainer = css`
  display: flex;
`
const TabsWrap = styled.div`
  width: 100%;
  height: 52px;
  display: flex;
  flex: auto;
  align-self: stretch;
  overflow: hidden;
  white-space: nowrap;
  transform: translate(0);
  border-bottom: 1px solid #f0f0f0;
`
const TabSlider = styled.div`
  position: relative;
  display: flex;
  transition: opacity 0.3s;
`

const TabItem = styled.div`
  height: 52px;
  padding: 12px 0;
  cursor: pointer;
  position: relative;
  display: inline-flex;
  align-items: center;
  color: ${(props: any) =>
    props.theme ? 'var(--primary-d1)' : 'var(--neutral-n2)'};
  border-bottom: ${(props: any) =>
    props.theme ? '2px solid var(--primary-d1)' : 'none'};
`

interface SlideTabsProps {
  onChange?(value: string): void
  defaultValue?: string
  items: any[]
}

const STEP = 1
const TAB_MARGIN = 32

const SlideTabs: React.FC<SlideTabsProps> = ({
  items,
  defaultValue = '1',
  onChange,
}: SlideTabsProps) => {
  const [xAxis, setXAxis] = useState<number>(0)
  const [activeKey, setActiveKey] = useState<string>(defaultValue)
  const [viewRectOffset, setViewRectOffset] = useState<number>(0)
  const [sliderRectOffset, setSliderRectOffset] = useState<number>(0)
  const nodes = useRef<Array<any>>([])
  const nodeIndex = useRef<number>(0)
  const showLeft = useMemo(() => !!(xAxis < 0), [xAxis])

  const showRight = useMemo(() => {
    return sliderRectOffset > viewRectOffset
  }, [viewRectOffset, sliderRectOffset])

  useLayoutEffect(() => {
    nodes.current = Array.from(document.querySelectorAll('.tab-item'))
  }, [])

  const prev = () => {
    const segment = nodes.current.slice(
      nodeIndex.current - STEP,
      nodeIndex.current,
    )
    nodeIndex.current -= STEP

    const nodeWidth = segment.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.clientWidth + TAB_MARGIN,
      0,
    )

    setXAxis(current => {
      return current + nodeWidth
    })
  }

  const next = () => {
    const segment = nodes.current.slice(
      nodeIndex.current,
      nodeIndex.current + STEP,
    )
    nodeIndex.current += STEP
    const nodeWidth = segment.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.clientWidth + TAB_MARGIN,
      0,
    )

    setXAxis(current => {
      return current - nodeWidth
    })
  }

  const updateBounding = () => {
    const { right } = document
      .getElementsByClassName('tabs-wrap')[0]
      .getBoundingClientRect()
    const { right: sliderRight } = document
      .getElementsByClassName('tabs-list')[0]
      .getBoundingClientRect()
    setViewRectOffset(right)
    setSliderRectOffset(sliderRight)
  }

  useEffect(() => {
    updateBounding()
  }, [xAxis])

  useLayoutEffect(() => {
    window.addEventListener('resize', updateBounding)
    return () => {
      window.removeEventListener('resize', updateBounding)
    }
  }, [])

  const handleClick = (key: string) => {
    setActiveKey(key)
    onChange?.(key)
  }

  const isActive = useCallback(
    (key: string) => {
      return activeKey === key
    },
    [activeKey],
  )

  return (
    <div className={tabsContainer}>
      {showLeft ? (
        <IconContainer>
          <DoubleLeftOutlined onClick={prev} />
        </IconContainer>
      ) : null}
      <TabsWrap className="tabs-wrap">
        <TabSlider
          className="tabs-list"
          style={{ transform: `translateX(${xAxis}px` }}
        >
          <Space size={TAB_MARGIN}>
            {items.map(item => (
              <TabItem
                className="tab-item"
                theme={isActive(item.key)}
                key={item.key}
                onClick={() => handleClick(item.key)}
              >
                {item.label}
              </TabItem>
            ))}
          </Space>
        </TabSlider>
      </TabsWrap>
      {showRight ? (
        <IconContainer>
          <DoubleRightOutlined onClick={next} />
        </IconContainer>
      ) : null}
    </div>
  )
}

export default SlideTabs
