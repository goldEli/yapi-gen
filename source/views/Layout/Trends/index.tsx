import CommonButton from '@/components/CommonButton'
import { HaveTabsContentWrap } from '@/components/StyleCommon'
import TabsContent from '@/components/TabsContent'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import SiteSettingDrawer from './components/SiteSettingDrawer'
import { TabTitleWrap } from '../style'
import NotFound from '@/components/ErrorPage/404'

const Trends = () => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const routerPath = useLocation()
  const [activeKey, setActiveKey] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  const tabList = [
    {
      label: <TabTitleWrap>{t('pm')}</TabTitleWrap>,
      key: '1',
    },
    {
      label: <TabTitleWrap>{t('systematic_notification')}</TabTitleWrap>,
      key: '2',
    },
    // {
    //   label: <TabTitleWrap>{t('schedule_management')}</TabTitleWrap>,
    //   key: '3',
    // },
    {
      label: <TabTitleWrap>{t('work_report')}</TabTitleWrap>,
      key: '4',
    },
  ]
  //   跳转路由
  const onChangeRouter = (key: any) => {
    //   拼接三级菜单路由
    navigate(`/Trends/AllNote/${key}`)
  }

  useEffect(() => {
    if (routerPath.pathname === '/Trends/AllNote/1') {
      setActiveKey('1')
    } else {
      //   获取当前路由的key
      const currentRouterKey =
        routerPath?.pathname?.split('/Trends/AllNote/')[1]
      setActiveKey(currentRouterKey)
    }
  }, [routerPath])

  if (activeKey !== '1' && activeKey !== '2' && activeKey !== '4') {
    return <NotFound />
  }

  return (
    <HaveTabsContentWrap>
      <TabsContent
        onChangeRouter={onChangeRouter}
        tabItems={tabList}
        activeKey={activeKey}
        tabBarExtraContent={
          <CommonButton
            size="small"
            type="extraText"
            icon="settings"
            onClick={() => setIsVisible(true)}
            style={{ position: 'relative', marginTop: -7, padding: '0px 8px' }}
          >
            {t('notificationSettings')}
          </CommonButton>
        }
      />
      <SiteSettingDrawer
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
      />
      <Outlet />
    </HaveTabsContentWrap>
  )
}

export default Trends
