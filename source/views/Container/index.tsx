/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import { changeLanguage, loadedAntdLocals } from '@/locals'
import { login } from '@/services/user'
import { getAsyncCompanyInfo } from '@store/companyInfo'
import { useDispatch, useSelector, store as storeAll } from '@store/index'
import { getStatus } from '@store/waterState'
import { message, ConfigProvider } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ConfigProvider as KitConfigProvider } from 'ifunuikit'
import styled from '@emotion/styled'
import { getLoginDetail } from '@store/user/user.thunk'
import HeaderLeft from './components/HeaderLeft'
import HeaderRight from './components/HeaderRight'
import GlobalStyle from '@/components/GlobalStyle'
import Guide from './components/Guide'
import { getProjectCover } from '@store/cover/thunks'
import CreateAProjectForm from '@/components/CreateAProjectForm'
import CreateIteration from '@/components/CreateIteration'
import DemandDetailDrawer from '@/components/DemandDetailDrawer'
import SiteDrawer from '../SiteNotifications/components/SiteDrawer/SiteDrawer'
import ReportDetailDrawer from '../WorkReport/Review/components/ReportDetailDrawer'
import UserSystemReport from '../WorkReport/Review/components/UserSystemReport'
import { saveDemandDetailDrawer } from '@store/demand/demand.thunk'
import AddWorkItem from '@/components/AddWorkItem'
import SprintDetailDrawer from '@/components/SprintDetailDrawer'
import FlawDetailDrawer from '@/components/FlawDetailDrawer'
import DeleteConfirmGlobalModal from '@/components/DeleteConfirmGlobal'
import { changeCreateVisible } from '@store/create-propject'
import { changeFreedVisibleVisible } from '@store/feedback'
import { setAffairsDetailDrawer } from '@store/affairs'
import { setFlawDetailDrawer } from '@store/flaw'
import { saveAffairsDetailDrawer } from '@store/affairs/affairs.thunk'
import { saveFlawDetailDrawer } from '@store/flaw/flaw.thunk'
import DetailScreenModal from '@/components/DetailScreenModal'
import { saveScreenDetailModal } from '@store/project/project.thunk'
import useOpenDemandDetail from '@/hooks/useOpenDemandDetail'
import ProjectSystemReport from '../WorkReport/Review/components/ProjectSystemReport'

const LayoutWrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`

const HeaderWrap = styled.div`
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0px 1px 9px 0px rgba(20, 37, 98, 0.05);
  background: var(--neutral-white-d2);
  z-index: 200;
  min-width: 800px;
`

export const Content = styled.div`
  height: calc(100vh - 56px);
  width: 100%;

  display: flex;
`

export const Container = () => {
  const language1 = useSelector(store => store.global.language)
  const { viewReportModal } = useSelector(store => store.workReport)
  const location = useLocation()
  const dispatch = useDispatch()
  const [isNextVisible, setIsNextVisible] = useState(false)
  // 不能删除open方法
  const [openDemandDetail, closeScreenModal] = useOpenDemandDetail()
  const { loginInfo, menuPermission } = useSelector(store => store.user)
  const {
    i18n: { language },
  } = useTranslation()
  const antdLocal = loadedAntdLocals[language]
  const navigate = useNavigate()

  message.config({
    duration: 0.8,
    maxCount: 1,
  })

  const init = async () => {
    if (!localStorage.getItem('agileToken')) {
      await login()
    }
  }

  const onCloseDemandDetail = (e: any) => {
    if (
      !storeAll.getState().demand.isDemandDetailDrawerVisible &&
      !storeAll.getState().affairs.affairsDetailDrawer.visible &&
      !storeAll.getState().flaw.flawDetailDrawer.visible
    ) {
      return
    }
    if (
      typeof e.target?.parentElement?.className !== 'string' ||
      typeof e.target?.className !== 'string' ||
      (!e.target?.parentElement?.className?.includes('canClickDetail') &&
        !e.target?.className?.includes('canClickDetail') &&
        (!storeAll.getState().demand.isDemandDetailDrawerVisible ||
          !storeAll.getState().affairs.affairsDetailDrawer.visible ||
          !storeAll.getState().flaw.flawDetailDrawer.visible))
    ) {
      dispatch({
        type: 'demand/setIsDemandDetailDrawerVisible',
        payload: false,
      })
      dispatch(setAffairsDetailDrawer({ visible: false, params: {} }))
      dispatch(setFlawDetailDrawer({ visible: false, params: {} }))
      dispatch(saveDemandDetailDrawer({}))
      dispatch(saveAffairsDetailDrawer({}))
      dispatch(saveFlawDetailDrawer({}))
    }
  }

  useEffect(() => {
    document
      .getElementById('layoutWrap')
      ?.addEventListener('click', onCloseDemandDetail)
    return document
      .getElementById('layoutWrap')
      ?.addEventListener('click', onCloseDemandDetail)
  }, [document.getElementById('layoutWrap')])

  useEffect(() => {
    const languageParams =
      (localStorage.getItem('language') as 'zh' | 'en') ||
      ((new URLSearchParams(location.search).get('language') || 'zh') as
        | 'zh'
        | 'en')
    localStorage.setItem('language', languageParams)
    changeLanguage(languageParams)
    init()
    dispatch(getStatus())
    dispatch(getProjectCover())
    dispatch(getLoginDetail())
    dispatch(getAsyncCompanyInfo())
    // dispatch(getProjectCover())
  }, [])

  useEffect(() => {
    // 如果没带路由则跳转优先路由
    if (location.pathname === '/') {
      let navigateUrl = menuPermission.priorityUrl
      // 如果是项目管理
      if (menuPermission.priorityUrl === '/ProjectManagement') {
        const currentObject = menuPermission?.menus?.filter(
          (i: any) => i.url === '/ProjectManagement',
        )?.[0]

        const firstUrl = currentObject?.children?.[0]?.url
        if (firstUrl === '/ProjectManagement/Mine') {
          navigateUrl = '/ProjectManagement/Mine/Profile'
        } else {
          navigateUrl = firstUrl
        }
      } else if (menuPermission.priorityUrl === '/AdminManagement') {
        const children = menuPermission?.menus?.filter(
          (i: any) => i.url === '/AdminManagement',
        )
        navigateUrl = children?.[0]?.url
      }
      if (!navigateUrl) {
        navigate('/ProjectManagement/Project')
        return
      }
      navigate(navigateUrl)
    }
    setIsNextVisible(loginInfo.admin_first_login)
  }, [loginInfo, menuPermission])

  return (
    <KitConfigProvider language={language1 === 'en'} local={language as any}>
      <ConfigProvider locale={antdLocal} autoInsertSpaceInButton={false}>
        <GlobalStyle />
        <DeleteConfirmGlobalModal />
        <LayoutWrap id="layoutWrap">
          <HeaderWrap
            onClick={() => {
              dispatch(changeCreateVisible(false))
              dispatch(saveScreenDetailModal({ visible: false, params: {} }))
              closeScreenModal()
              dispatch(changeFreedVisibleVisible(false))
            }}
          >
            <HeaderLeft />
            <HeaderRight />
          </HeaderWrap>
          <Content>
            <Outlet />
          </Content>
          <Guide
            visible={isNextVisible}
            close={() => setIsNextVisible(false)}
          />
        </LayoutWrap>

        <CreateAProjectForm />
        <CreateIteration />
        <DemandDetailDrawer />
        {viewReportModal.type === 1 ? <ReportDetailDrawer /> : null}
        {viewReportModal.type === 2 ? <UserSystemReport /> : null}
        {viewReportModal.type === 3 ? <ProjectSystemReport /> : null}
        <SiteDrawer />
        <AddWorkItem />
        <SprintDetailDrawer />
        <FlawDetailDrawer />
        <DetailScreenModal />
      </ConfigProvider>
    </KitConfigProvider>
  )
}
