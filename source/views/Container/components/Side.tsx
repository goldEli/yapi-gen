import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/css'
import { useLocation, useNavigate } from 'react-router-dom'
import IconFont from '@/components/IconFont'
import { Panel } from './Panel'
import sideLogo from '@/assets/side_logo.svg'
import { useModel } from '@/models'

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
  margin-bottom: 50px;
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
type MenuType = {
  key: string
  title: string
  icon: React.ReactElement
  path: string
}
const getMenu = () => {
  const menu: MenuType[] = [
    {
      key: '/organization',
      title: '概况',
      icon: <IconFont type="survey" style={{ fontSize: 20 }} />,
      path: '',
    },
    {
      key: '/organization',
      title: '项目',
      icon: <IconFont type="project" style={{ fontSize: 20 }} />,
      path: '/Project',
    },
    {
      key: '/organization',
      title: '我的',
      icon: <IconFont type="my" style={{ fontSize: 20 }} />,
      path: '/mine',
    },
    {
      key: '/organization',
      title: '员工',
      icon: <IconFont type="staff" style={{ fontSize: 20 }} />,
      path: '/staff',
    },
  ]
  return menu
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
  const [userData, setUserData] = useState<any>({})
  const { getUserDetail } = useModel('user')
  const location = useLocation()
  const { pathname } = location
  const nowPath
    = (pathname.split('/')[1] ? `/${pathname.split('/')[1]}` : '') || ''

  const navigate = useNavigate()
  const [panelVisible, setPanelVisible] = useState(false)
  const onNavigation = (path: string) => {
    navigate(path)
  }
  const init = async () => {
    const res = await getUserDetail()

    setUserData(res)
  }
  useEffect(() => {
    init()
  }, [])
  const allEach = getMenu().map(item => (
    <SideEach
      className={nowPath === item.path ? activeCss : ''}
      key={item.path}
      onClick={() => onNavigation(item.path)}
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
          onClick={() => navigate('/Setting')}

          // className={'/' + nowPath === item.path ? activeCss : ''}
        >
          <IconFont type="set-default" style={{ fontSize: 20 }} />
          <span>设置</span>
        </SideEach>
        <SetHead onClick={controlPanelVisible}>{userData?.name}</SetHead>
      </SideFooter>
      <Panel visible={panelVisible} />
    </SideWrap>
  )
}
