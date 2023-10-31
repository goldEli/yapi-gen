import { HaveTabsContentWrap } from '@/components/StyleCommon'
import TabsContent from '@/components/TabsContent'
import { useSelector } from '@store/index'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const SafetyManagement = () => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const routerPath = useLocation()
  const [activeKey, setActiveKey] = useState('')
  const [resultTabList, setResultTabList] = useState<any>([
    {
      label: t('secure_watermark'),
      key: '/AdminManagement/WaterMarkManagement',
      url: '/AdminManagement/SafetyManagement/WaterMarkManagement',
      isPermission: false,
    },
    {
      label: t('operation_log'),
      key: '/AdminManagement/OperationManagement',
      url: '/AdminManagement/SafetyManagement/OperationManagement',
      isPermission: false,
    },
    {
      label: t('log_in_log'),
      key: '/AdminManagement/LoginManagement',
      url: '/AdminManagement/SafetyManagement/LoginManagement',
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

export default SafetyManagement
