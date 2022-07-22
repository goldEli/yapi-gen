import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { useModel } from '@/models'
import { useEffect } from 'react'

const Wrap = styled.div({
  height: '100%',
  display: 'flex',
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
  overflow: 'auto',
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
    div: {
      color: isActive ? '#2877FF' : '#323233',
    },
    svg: {
      color: isActive ? '#2877FF' : '#323233',
    },
  }),
)

const CompanyImg = styled.img({
  width: '100%',
  height: 88,
  marginBottom: 32,
  borderRadius: 6,
  padding: '0 16px',
})

const SideList = [
  { name: '公司信息',
    icon: 'file-text',
    path: '' },
  { name: '权限管理',
    icon: 'safety-certificate',
    path: 'permission' },
  { name: '操作日志',
    icon: 'file-protect',
    path: 'operation' },
  { name: '登录日志',
    icon: 'solution',
    path: 'loginLog' },
]

interface MenuList {
  icon: string
  name: string
  path: string
}

export default () => {
  const navigate = useNavigate()
  const { getCompanyInfo, companyInfo } = useModel('setting')
  const urlParams = new URL(window.location.href)
  const pathname = urlParams?.pathname
  const nowPath = pathname.split('/')[2] || ''

  useEffect(
    () => {
      getCompanyInfo()
    },
    [],
  )

  const onChangeActive = (value: MenuList) => {
    navigate(value.path)
  }

  return (
    <Wrap>
      <Side>
        <CompanyImg src={companyInfo.logo} />
        <MenuWrap>
          {SideList.map(item => (
            <MenuItem
              onClick={() => onChangeActive(item)}
              key={item.name}
              isActive={nowPath === item.path}
            >
              <IconFont type={item.icon} />
              <div>{item.name}</div>
            </MenuItem>
          ))}
        </MenuWrap>
      </Side>
      <Content>
        <Outlet />
      </Content>
    </Wrap>
  )
}
