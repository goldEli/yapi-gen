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

const SafetyManagement = () => {
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
      ]
      const urls = currentMenu?.children?.map((k: any) => k.url)
      const resultList = list?.map((i: any) => ({
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
        resultList,
      )
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
  )
}

export default SafetyManagement
