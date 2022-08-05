/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react-hooks/exhaustive-deps */
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import { useModel } from '@/models'
import { useEffect } from 'react'
import { getIsPermission } from '@/tools/index'
import { useTranslation } from 'react-i18next'

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
    paddingLeft: 65,
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
      div: {
        color: '#2877FF',
      },
      svg: {
        color: '#2877FF',
      },
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

interface MenuList {
  icon: string
  name: string
  path: string
}

const Setting = () => {
  const [t] = useTranslation()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { getCompanyInfo, companyInfo } = useModel('setting')
  const nowPath = pathname.split('/')[2] || ''
  const { userInfo } = useModel('user')

  useEffect(() => {
    getCompanyInfo()
  }, [])

  const onChangeActive = (value: MenuList) => {
    navigate(value.path)
  }

  const sideList = [
    {
      name: t('setting.companyInfo'),
      icon: 'file-text',
      path: '',
      isHidden: false,
    },
    {
      name: t('setting.permissionManagement'),
      icon: 'safety-certificate',
      path: 'permission',
      isHidden: getIsPermission(
        userInfo?.company_permissions,
        'b/company/role',
      ),
    },
    {
      name: t('setting.operationLog'),
      icon: 'file-protect',
      path: 'operation',
      isHidden: getIsPermission(
        userInfo?.company_permissions,
        'b/company/operate_logs',
      ),
    },
    {
      name: t('setting.loginLog'),
      icon: 'solution',
      path: 'loginLog',
      isHidden: getIsPermission(
        userInfo?.company_permissions,
        'b/company/login_logs',
      ),
    },
  ]

  return (
    <Wrap>
      <Side>
        <CompanyImg src={companyInfo.logo} />
        <MenuWrap>
          {sideList.map(item => (
            <MenuItem
              onClick={() => onChangeActive(item)}
              key={item.name}
              isActive={nowPath === item.path}
              hidden={item.isHidden}
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

export default Setting
