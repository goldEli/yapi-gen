import { HaveTabsContentWrap } from '@/components/StyleCommon'
import TabsContent from '@/components/TabsContent'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const Mine = () => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const routerPath = useLocation()
  const [activeKey, setActiveKey] = useState('')
  const [resultTabList, setResultTabList] = useState<any>([
    {
      key: '1',
      label: t('mine.mineSurvey'),
      url: '/Mine/Profile',
    },
    {
      key: '2',
      label: t('mine.mineNeedDeal'),
      url: '/Mine/Carbon',
    },
    {
      key: '3',
      label: t('mine.mineCreate'),
      url: '/Mine/Create',
    },
    {
      key: '4',
      label: t('mine.mineFinish'),
      url: '/Mine/Finished',
    },
    {
      key: '5',
      label: t('mine.copyMine'),
      url: '/Mine/Agenda',
    },
    {
      key: '6',
      label: t('newlyAdd.mineExamine'),
      url: '/Mine/Examine',
    },
  ])

  //   跳转路由
  const onChangeRouter = (key: any) => {
    const url = resultTabList?.filter((i: any) => i.key === key)[0]?.url
    setActiveKey(String(key))
    //   拼接三级菜单路由
    navigate(url)
  }

  useEffect(() => {
    //   获取当前路由的key
    const currentRouter = resultTabList?.filter(
      (i: any) => i.url === routerPath?.pathname,
    )
    onChangeRouter(
      currentRouter?.length > 0 ? currentRouter[0]?.key : resultTabList[0].key,
    )
  }, [])

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

export default Mine
