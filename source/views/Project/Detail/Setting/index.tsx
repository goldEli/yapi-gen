import styled from '@emotion/styled'
import posterImg from '@/assets/poster.png'
import IconFont from '@/components/IconFont'
import ProjectInfo from './components/ProjectInfo'
import ProjectMember from './components/ProjectMember'
import ProjectSet from './components/ProjectSet'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const Wrap = styled.div({
  display: 'flex',
  height: 'calc(100% - 64px)',
})

const Side = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '16px 0',
  width: 220,
  background: 'white',
  height: '100%',
  img: {
    width: '100%',
    height: 88,
    marginBottom: 32,
    borderRadius: 6,
    padding: '0 16px',
  },
})

const Content = styled.div({
  width: 'calc(100% - 220px)',
  height: '100%',
})

const MenuWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})

const MenuItem = styled.div<{ isActive: boolean }>(
  {
    width: '100%',
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxSizing: 'border-box',
    div: {
      fontSize: 14,
      fontWeight: 400,
      color: '#323233',
      marginLeft: 8,
    },
    svg: {
      fontSize: 16,
      color: '#323233',
    },
    '&:hover': {
      background: '#F0F4FA',
      borderRight: '3px solid #2877FF',
      color: '#2877FF',
    },
  },
  ({ isActive }) => ({
    borderRight: isActive ? '3px solid #2877FF' : '3px solid white',
    background: isActive ? '#F0F4FA' : 'white',
  }),
)

const SideList = [
  { name: '项目信息', icon: 'file-text', content: <ProjectInfo /> },
  { name: '项目成员', icon: 'team', content: <ProjectMember /> },
  { name: '项目权限组', icon: 'lock', content: <ProjectSet /> },
]

export default () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const activeTabs = Number(searchParams.get('type')) || 0
  return (
    <Wrap>
      <Side>
        <img src={posterImg} alt="" />
        <MenuWrap>
          {SideList.map((item, index) => (
            <MenuItem
              onClick={() => navigate(`/Detail/Setting?type=${index}`)}
              key={item.name}
              isActive={index === activeTabs}
            >
              <IconFont type={item.icon} />
              <div>{item.name}</div>
            </MenuItem>
          ))}
        </MenuWrap>
      </Side>
      <Content>{SideList[activeTabs].content}</Content>
    </Wrap>
  )
}
