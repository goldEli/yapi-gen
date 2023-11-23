import styled from '@emotion/styled'
import React, { useEffect, useRef } from 'react'

const TabsWrapItem = styled.div<{ active: boolean }>`
  white-space: nowrap;
  z-index: 1;
  padding: 4px 16px;
  border-radius: 4px;
  cursor: pointer;
  /* background: ${props =>
    props.active ? 'var(--neutral-white-d6);' : ''}; */
  color: ${props => (props.active ? 'var(--primary-d2);' : '')};
  transition: all 0.5s;
`
const ActiveTab = styled.div`
  position: absolute;
  bottom: 3px;
  left: 2px;
  width: 80px;
  padding: 4px 16px;
  border-radius: 4px;
  height: 30px;

  background: var(--neutral-white-d6);
  transition: left 0.4s;
`
const TabsWrap = styled.div`
  position: relative;
  width: 322px;
  height: 36px;
  padding: 2px;
  display: flex;
  background-color: var(--hover-d2);
  border-radius: 4px;
`

interface Ptypes {
  tabs: any
  tabIndex: any
  changeActive(id: any): any
}

const MoveTabs = (props: Ptypes) => {
  const { tabs, tabIndex, changeActive } = props
  const tabBox = useRef<HTMLDivElement>(null)
  const tabActive = useRef<HTMLDivElement>(null)

  return (
    <TabsWrap ref={tabBox}>
      {tabs?.map((i: any) => (
        <TabsWrapItem
          onClick={() => changeActive(i.id)}
          active={tabIndex === i.id}
          key={i.id}
        >
          {i.text}
        </TabsWrapItem>
      ))}
      <ActiveTab ref={tabActive} />
    </TabsWrap>
  )
}

export default MoveTabs
