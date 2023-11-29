import CommonButton from '@/components/CommonButton'
import {
  HaveTabsContentWrap,
  TabsBarExtraButton,
} from '@/components/StyleCommon'
import TabsContent from '@/components/TabsContent'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import SiteSettingDrawer from './components/SiteSettingDrawer'
import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { Space } from 'antd'
import { useDispatch } from '@store/index'
import { changeVisible, changeVisibleFilter } from '@store/SiteNotifications'

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
  const dispatch = useDispatch()
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
          <Space size={16}>
            <TabsBarExtraButton
              onClick={() => {
                dispatch(changeVisibleFilter(true))
                dispatch(changeVisible(false))
              }}
            >
              <CommonIconFont type="filter" />
              <div>{t('filtering_notifications')}</div>
            </TabsBarExtraButton>
            <TabsBarExtraButton onClick={() => setIsVisible(true)}>
              <CommonIconFont type="settings" />
              <div>{t('notificationSettings')}</div>
            </TabsBarExtraButton>
          </Space>
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
