import CommonButton from '@/components/CommonButton'
import { HaveTabsContentWrap } from '@/components/StyleCommon'
import TabsContent from '@/components/TabsContent'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import SiteSettingDrawer from './components/SiteSettingDrawer'

const Trends = () => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const routerPath = useLocation()
  const [activeKey, setActiveKey] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  const list = [
    {
      label: t('allNotifications'),
      key: '1',
    },
    {
      label: t('unreadNotifications'),
      key: '2',
    },
    {
      label: t('readNotification'),
      key: '3',
    },
    {
      label: t('mentionMine'),
      key: '4',
    },
  ]

  //   跳转路由
  const onChangeRouter = (key: any) => {
    setActiveKey(key)
    //   拼接三级菜单路由
    navigate(`/Trends/AllNote/${key}`)
  }

  const onUpdateList = () => {
    //   获取当前路由的key
    const currentRouterKey = routerPath?.pathname?.split('/Trends/AllNote/')[1]
    onChangeRouter(currentRouterKey)
  }

  useEffect(() => {
    onUpdateList()
  }, [])

  return (
    <HaveTabsContentWrap>
      <TabsContent
        onChangeRouter={onChangeRouter}
        tabItems={list}
        activeKey={activeKey}
        tabBarExtraContent={
          <CommonButton
            type="secondaryText"
            icon="settings"
            onClick={() => setIsVisible(true)}
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
