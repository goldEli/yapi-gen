import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Space } from 'antd'
import styled from '@emotion/styled'
import { css } from '@emotion/css'
import IconFont from '@/components/IconFont'

const IconContainer = styled.div<{ position: string }>`
  width: 40px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${(props: any) =>
    props.position === 'left'
      ? '5px 0px 7px -3px rgba(0,0,0,0.12)'
      : '-5px 0px 7px -3px rgba(0,0,0,0.12)'};
  &:hover .anticon {
    color: var(--primary-d2);
  }
`

const tabsContainer = css`
  display: flex;
  margin-top: 8px;
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
`
const TabBarLine = styled.div`
  width: 100%;
  height: 3px;
  background: var(--primary-d1);
  opacity: 1;
  position: absolute;
  bottom: 0;
  visibility: ${(props: any) => (props.theme ? 'visible' : 'hidden')};
  opacity: ${(props: any) => (props.theme ? '1' : '0')};
  transition: all 0.2s linear;
  transition-delay: 0s;
`

interface SlideTabsProps {
  onChange?(value: string): void
  activeKey: number | string
  items: any[]
}

const STEP = 1
const TAB_MARGIN = 32

const SlideTabs: React.FC<SlideTabsProps> = ({
  items,
  activeKey,
  onChange,
}: SlideTabsProps) => {
  const [xAxis, setXAxis] = useState<number>(0)
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

  const next = (val = 0) => {
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

  const handleClick = (index: number, key: string) => {
    // const { right } = nodes.current[index].getBoundingClientRect()
    // if (right > viewRectOffset) {
    //   next(right - viewRectOffset)
    // }
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
        <IconContainer position="left">
          <IconFont type="left-02" onClick={prev} />
        </IconContainer>
      ) : null}
      <TabsWrap className="tabs-wrap">
        <TabSlider
          className="tabs-list"
          style={{ transform: `translateX(${xAxis}px` }}
        >
          <Space size={TAB_MARGIN}>
            {items.map((item, index) => (
              <TabItem
                className="tab-item"
                theme={isActive(item.key)}
                key={item.key}
                onClick={() => handleClick(index, item.key)}
              >
                {item.label}
                <TabBarLine theme={isActive(item.key)} />
              </TabItem>
            ))}
          </Space>
        </TabSlider>
      </TabsWrap>
      {showRight ? (
        <IconContainer position="right">
          <IconFont type="right-02" onClick={() => next()} />
        </IconContainer>
      ) : null}
    </div>
  )
}

export default SlideTabs
