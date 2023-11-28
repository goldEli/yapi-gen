/* eslint-disable react/jsx-no-useless-fragment */
import { HaveTabsContentWrap } from '@/components/StyleCommon'
import TabsContent from '@/components/TabsContent'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const Content = styled.div({
  width: '100%',
  height: 'calc(100% - 38px)',
  background: 'var(--neutral-white-d1)',
})

const OrganizationInformation = () => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const routerPath = useLocation()
  const [activeKey, setActiveKey] = useState('')
  const [resultTabList, setResultTabList] = useState<any>([])
  const { currentMenu, isRefresh } = useSelector(store => store.user)

  //   跳转路由
  const onChangeRouter = (key: any, arr?: any) => {
    const url = (arr ?? resultTabList)?.filter((i: any) => i.key === key)[0]
      ?.url
    //   拼接三级菜单路由
    navigate(url)
  }

  useEffect(() => {
    if (currentMenu?.id || isRefresh) {
      const list = [
        {
          label: t('staff_management'),
          key: '/AdminManagement/StaffManagement',
          url: '/AdminManagement/OrganizationInformation/StaffManagement',
          isPermission: false,
        },
        {
          label: t('team_management'),
          key: '/AdminManagement/TeamManagement',
          url: '/AdminManagement/OrganizationInformation/TeamManagement',
          isPermission: false,
        },
      ]
      const urls = currentMenu?.children?.map((k: any) => k.url)
      const resultList = list?.map((i: any) => ({
        ...i,
        isPermission: urls?.includes(String(i.key)),
      }))
      setResultTabList(resultList?.filter((i: any) => i.isPermission))
    }
  }, [currentMenu?.id, isRefresh])

  useEffect(() => {
    //   获取当前路由的key
    const currentRouter = resultTabList?.filter(
      (i: any) => i.url === routerPath?.pathname,
    )
    setActiveKey(
      currentRouter?.length > 0 ? currentRouter[0]?.key : resultTabList[0]?.key,
    )
  }, [routerPath])

  return (
    <>
      {routerPath?.pathname?.includes('/MemberInfo') ? (
        <Outlet />
      ) : (
        <HaveTabsContentWrap>
          <TabsContent
            onChangeRouter={onChangeRouter}
            tabItems={resultTabList}
            activeKey={activeKey}
          />
          <Content>
            <Outlet />
          </Content>
        </HaveTabsContentWrap>
      )}
    </>
  )
}

export default OrganizationInformation
