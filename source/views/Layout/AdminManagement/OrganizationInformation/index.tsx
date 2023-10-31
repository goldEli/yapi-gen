import { HaveTabsContentWrap } from '@/components/StyleCommon'
import TabsContent from '@/components/TabsContent'
import { useSelector } from '@store/index'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const OrganizationInformation = () => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const routerPath = useLocation()
  const [activeKey, setActiveKey] = useState('')
  const [resultTabList, setResultTabList] = useState<any>([
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
  ])
  const { currentMenu } = useSelector(store => store.user)

  //   跳转路由
  const onChangeRouter = (key: any) => {
    const url = resultTabList?.filter((i: any) => i.key === key)[0]?.url
    setActiveKey(key)
    //   拼接三级菜单路由
    navigate(url)
  }

  useEffect(() => {
    if (currentMenu?.id) {
      const urls = currentMenu?.children?.map((k: any) => k.url)
      const resultList = resultTabList?.map((i: any) => ({
        ...i,
        isPermission: urls?.includes(String(i.key)),
      }))
      setResultTabList(resultList?.filter((i: any) => i.isPermission))
      //   获取当前路由的key
      const currentRouter = resultList?.filter(
        (i: any) => i.url === routerPath?.pathname,
      )
      onChangeRouter(
        currentRouter?.length > 0 ? currentRouter[0]?.key : resultList[0].key,
      )
    }
  }, [currentMenu?.id])

  return (
    <HaveTabsContentWrap>
      <TabsContent
        onChangeRouter={onChangeRouter}
        tabItems={resultTabList}
        activeKey={activeKey}
      />
      <Outlet />
    </HaveTabsContentWrap>
  )
}

export default OrganizationInformation
