import React from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/css'
import { Outlet, useRoutes } from 'react-router-dom'
import IconFont from '@/components/IconFont'

const SideWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 80px;
  background: rgba(255, 255, 255, 1);
  background-blend-mode: normal;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1;
`
const imgCSS = css`
  width: 80px;
  height: 106px;
`
const SideHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const SideFooter = styled(SideHeader)`
  margin-bottom: 20px;
`
const Main = styled.div`
  background: rgba(245, 247, 250, 1);
  flex: 1;
`
const SetHead = styled.div`
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border-radius: 50%;
  font-size: 12px;
  background: rgba(40, 119, 255, 1);
  background-blend-mode: normal;
  border: 2px solid rgba(40, 119, 255, 0.16);
  border: 1px solid rgba(40, 119, 255, 1);
  color: white;
`
const getMenu = () => {
  const menu: any = [
    {
      key: '/organization',
      title: '概况',
      icon: <IconFont type="more" style={{ fontSize: 20 }} />,
    },
    {
      key: '/organization',
      title: '项目',
      icon: <IconFont type="more" style={{ fontSize: 20 }} />,
    },
    {
      key: '/organization',
      title: '我的',
      icon: <IconFont type="more" style={{ fontSize: 20 }} />,
    },
    {
      key: '/organization',
      title: '员工',
      icon: <IconFont type="more" style={{ fontSize: 20 }} />,
    },
  ]
  return menu
}
const SideEach = styled.div`
  border-radius: 8px;
  width: 64px;
  height: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &:hover {
    background: rgba(240, 244, 250, 1);
    color: rgba(40, 119, 255, 1);
  }
`

export const Side = () => {
  const AllEach = getMenu().map(item => (
    <SideEach>
      {item.icon}
      {item.title}
    </SideEach>
  ))
  return (
    <SideWrap>
      <SideHeader>
        <img className={imgCSS} src="" alt="1" />
        {AllEach}
      </SideHeader>

      <SideFooter>
        <SideEach>
          <IconFont type="more" style={{ fontSize: 20 }} />
          <span>设置</span>
        </SideEach>
        <SetHead>何飞</SetHead>
      </SideFooter>
    </SideWrap>
  )
}
