import CommonButton from '@/components/CommonButton'
import { HaveTabsContentWrap } from '@/components/StyleCommon'
import TabsContent from '@/components/TabsContent'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import SiteSettingDrawer from './components/SiteSettingDrawer'
import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
const IconWrap = styled.span`
  /* color: var(--neutral-n2); */
  font-size: var(--font14);
  display: flex;
  align-items: center;
  .anticon {
    margin-right: 4px;
  }
`
const Trends = () => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const routerPath = useLocation()
  const [activeKey, setActiveKey] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  const list = [
    {
      label: (
        <IconWrap>
          <CommonIconFont type="bell" size={16}></CommonIconFont>{' '}
          {t('allNotifications')}{' '}
        </IconWrap>
      ),
      key: '1',
    },
    {
      label: (
        <IconWrap>
          <CommonIconFont type="bell-notification" size={16}></CommonIconFont>{' '}
          {t('unreadNotifications')}{' '}
        </IconWrap>
      ),
      key: '2',
    },
    {
      label: (
        <IconWrap>
          <CommonIconFont type="bell-off" size={16}></CommonIconFont>{' '}
          {t('readNotification')}{' '}
        </IconWrap>
      ),
      key: '3',
    },
    {
      label: (
        <IconWrap>
          <CommonIconFont type="mention" size={16}></CommonIconFont>{' '}
          {t('mentionMine')}{' '}
        </IconWrap>
      ),
      key: '4',
    },
  ]
  //   跳转路由
  const onChangeRouter = (key: any) => {
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
