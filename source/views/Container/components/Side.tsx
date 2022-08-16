/* eslint-disable multiline-ternary */
/* eslint-disable max-len */
import { useState } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/css'
import { useLocation, useNavigate } from 'react-router-dom'
import IconFont from '@/components/IconFont'
import { Panel } from './Panel'
import sideLogo from '/logo.svg'
import { useModel } from '@/models'
import { Popover } from 'antd'
import { useTranslation } from 'react-i18next'

const imgCss = css`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`
const SideWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 80px;
  background: rgba(255, 255, 255, 1);
  background-blend-mode: normal;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1;
  position: fixed;
  left: 0;
  height: 100vh;
`
const imgCSS = css`
  width: 80px;
  height: 106px;
  margin-bottom: 50px;
  object-fit: cover;
`
const SideHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const SideFooter = styled(SideHeader)`
  margin-bottom: 20px;
`

const SetHead = styled.div`
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border-radius: 50%;
  font-size: 12px;
  background: #a4acf5;
  background-blend-mode: normal;
  border: 2px solid rgba(40, 119, 255, 0.16);
  border: 1px solid #ffffff;
  color: white;
  cursor: pointer;
`
type MenuType = {
  key: string
  title: string
  icon: React.ReactElement
  path: string
  isHidden: boolean
}

const SideEach = styled.div`
  cursor: pointer;
  border-radius: 8px;
  width: 64px;
  height: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  &:hover {
    background: rgba(240, 244, 250, 1);
    color: rgba(40, 119, 255, 1);
  }
`
const activeCss = css`
  border-radius: 8px;
  width: 64px;
  height: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(240, 244, 250, 1);
  color: rgba(40, 119, 255, 1);
`

export const Side = () => {
  const [t] = useTranslation()
  const { userInfo } = useModel('user')
  const location = useLocation()
  const { pathname } = location
  const nowPath
    = (pathname.split('/')[1] ? `/${pathname.split('/')[1]}` : '') || ''

  const navigate = useNavigate()
  const [panelVisible, setPanelVisible] = useState(false)
  const onNavigation = (path: string) => {
    navigate(path)
  }

  const getIsPermission = (value: string) => {
    return !userInfo?.company_permissions?.filter((i: any) => String(i.group_name).includes(value)).length
  }

  const getMenu = () => {
    const menu: MenuType[] = [
      {
        key: '/organization',
        title: t('container.survey'),
        icon: <IconFont type="survey" style={{ fontSize: 20 }} />,
        path: '/Situation',
        isHidden: getIsPermission('概况'),
      },
      {
        key: '/organization',
        title: t('container.project'),
        icon: <IconFont type="project" style={{ fontSize: 20 }} />,
        path: '/Project',
        isHidden: getIsPermission('项目'),
      },
      {
        key: '/organization',
        title: t('container.mine'),
        icon: <IconFont type="my" style={{ fontSize: 20 }} />,
        path: '/mine',
        isHidden: getIsPermission('我的'),
      },
      {
        key: '/organization',
        title: t('container.staff'),
        icon: <IconFont type="staff" style={{ fontSize: 20 }} />,
        path: '/staff',
        isHidden: getIsPermission('员工'),
      },
    ]
    return menu
  }

  const getClassName = (path: string) => {
    if (path === '/Project') {
      return nowPath === '/Project' || nowPath === '/Detail' ? activeCss : ''
    }
    return nowPath === path ? activeCss : ''
  }

  const allEach = getMenu().map(item => (
    <SideEach
      className={getClassName(item.path)}
      key={item.path}
      onClick={() => onNavigation(item.path)}
      hidden={item.isHidden}
    >
      {item.icon}
      {item.title}
    </SideEach>
  ))

  const controlPanelVisible = () => {
    setPanelVisible(!panelVisible)
  }

  return (
    <SideWrap>
      <SideHeader>
        <img className={imgCSS} src={sideLogo} alt="1" />
        {allEach}
      </SideHeader>

      <SideFooter>
        <SideEach
          className={nowPath === '/Setting' ? activeCss : ''}
          onClick={() => navigate('/Setting')}
        >
          <IconFont type="set-default" style={{ fontSize: 20 }} />
          <span>{t('container.setting')}</span>
        </SideEach>
        <Popover
          visible={panelVisible}
          placement="rightTop"
          trigger="click"
          content={<Panel onChange={() => setPanelVisible(false)} />}
        >
          {userInfo.avatar ? (
            <img
              style={{ cursor: 'pointer' }}
              className={imgCss}
              src={userInfo.avatar}
              onClick={controlPanelVisible}
            />
          ) : (
            <SetHead onClick={controlPanelVisible}>
              {String(userInfo?.name?.trim().slice(0, 1)).toLocaleUpperCase()}
            </SetHead>
          )}
        </Popover>
      </SideFooter>
    </SideWrap>
  )
}
