/* eslint-disable no-promise-executor-return */
/* eslint-disable require-atomic-updates */
/* eslint-disable no-undefined */
/* eslint-disable camelcase */
/* eslint-disable complexity */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-duplicate-imports */
/* eslint-disable react/jsx-no-undef */
import IconFont from '@/components/IconFont'
import { useDispatch, useSelector } from '@store/index'
import { changeVisible } from '@store/SiteNotifications'
import { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
const Wrap = styled.div`
  height: 100%;
`
const TabsWrapItem = styled.div<{ active: boolean }>`
  z-index: 1;
  padding: 4px 16px;
  border-radius: 4px;
  cursor: pointer;
  /* background: ${props =>
    props.active ? 'var(--neutral-white-d6);' : ''}; */
  color: ${props => (props.active ? 'var(--primary-d2);' : '')};
  transition: all 0.5s;
`
const TabsWrap = styled.div`
  position: relative;
  padding: 2px;
  display: flex;
  background-color: var(--hover-d2);
  border-radius: 4px;
`
const ActiveTab = styled.div`
  position: absolute;
  bottom: 2px;
  left: 2px;
  width: 80px;
  padding: 4px 16px;
  border-radius: 4px;
  height: 30px;

  background: var(--neutral-white-d6);
  transition: left 0.4s;
`
const Tabs = (props: { tabsValue: any; onChange: (id: any) => void }) => {
  const [active, setActive] = useState(0)
  const tabBox = useRef<HTMLDivElement>(null)
  const tabActive = useRef<HTMLDivElement>(null)
  const changeActive = (id: string, index: number) => {
    setActive(index)
    props.onChange(id)
  }

  useEffect(() => {
    for (let i = 0; i < 3; i++) {
      tabBox.current?.children[i].addEventListener('click', e => {
        if (tabActive.current) {
          tabActive.current.style.left = `${
            (tabBox.current?.children[i] as HTMLDivElement)?.offsetLeft
          }px`
          tabActive.current.style.width = `${tabBox.current?.children[i]?.clientWidth}px`
        }
      })
    }
  }, [])
  useEffect(() => {
    const index = props.tabsValue.findIndex(
      (i: any, index: number) => index === active,
    )
    tabActive.current!.style.left = `${
      (tabBox.current?.children[index] as HTMLDivElement)?.offsetLeft === 0
        ? 2
        : (tabBox.current?.children[index] as HTMLDivElement)?.offsetLeft
    }px`

    tabActive.current!.style.width = `${
      tabBox.current?.children[index]?.clientWidth === 0
        ? 80
        : tabBox.current?.children[index]?.clientWidth
    }px`
  }, [active])
  return (
    <Wrap>
      <TabsWrap ref={tabBox}>
        {props.tabsValue.map((i: any, index: number) => (
          <TabsWrapItem
            onClick={() => changeActive(i.id, index)}
            active={active === index}
            key={i.id}
          >
            {i.text}
          </TabsWrapItem>
        ))}
        <ActiveTab ref={tabActive} />
      </TabsWrap>
    </Wrap>
  )
}

export default Tabs
