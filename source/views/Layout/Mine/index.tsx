import { HaveTabsContentWrap } from '@/components/StyleCommon'
import TabsContent from '@/components/TabsContent'
import styled from '@emotion/styled'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const Content = styled.div({
  width: '100%',
  height: 'calc(100% - 38px)',
  background: 'var(--neutral-white-d1)',
})

const Mine = () => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const routerPath = useLocation()
  const [activeKey, setActiveKey] = useState('')

  const list = [
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
  ]

  //   跳转路由
  const onChangeRouter = (key: any) => {
    const url = list?.filter((i: any) => i.key === key)[0]?.url
    //   拼接三级菜单路由
    navigate(url)
  }

  useEffect(() => {
    if (routerPath.pathname === '/Mine/Profile') {
      setActiveKey('1')
    } else {
      //   获取当前路由的key
      const currentRouter = list?.filter(
        (i: any) => i.url === routerPath?.pathname,
      )
      setActiveKey(
        String(currentRouter?.length > 0 ? currentRouter[0]?.key : list[0].key),
      )
    }
  }, [routerPath])

  return (
    <HaveTabsContentWrap>
      <TabsContent
        onChangeRouter={onChangeRouter}
        tabItems={list}
        activeKey={activeKey}
      />
      <Content>
        <Outlet />
      </Content>
    </HaveTabsContentWrap>
  )
}

export default Mine
