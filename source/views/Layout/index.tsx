import CreateAProjectForm from '@/components/CreateAProjectForm'
import CreateIteration from '@/components/CreateIteration'
import DemandDetailDrawer from '@/components/DemandDetailDrawer'
import GlobalStyle from '@/components/GlobalStyle'
import { changeLanguage, loadedAntdLocals } from '@/locals'
import { useDispatch, useSelector, store as storeAll } from '@store/index'
import { ConfigProvider, message } from 'antd'
import { ConfigProvider as KitConfigProvider } from 'ifunuikit'
import { useTranslation } from 'react-i18next'
import AddWorkItem from '@/components/AddWorkItem'
import SprintDetailDrawer from '@/components/SprintDetailDrawer'
import FlawDetailDrawer from '@/components/FlawDetailDrawer'
import DetailScreenModal from '@/components/DetailScreenModal'
import EmployeeProfileContrast from '@/components/EmployeeProfileContrast'
import DeleteConfirmGlobalModal from '@/components/DeleteConfirmGlobal'
import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { login } from '@/services/user'
import { setAffairsDetailDrawer } from '@store/affairs'
import { setFlawDetailDrawer } from '@store/flaw'
import { saveDemandDetailDrawer } from '@store/demand/demand.thunk'
import { saveAffairsDetailDrawer } from '@store/affairs/affairs.thunk'
import { saveFlawDetailDrawer } from '@store/flaw/flaw.thunk'
import { getStatus } from '@store/waterState'
import { getProjectCover } from '@store/cover/thunks'
import { getLoginDetail } from '@store/user/user.thunk'
import { getAsyncCompanyInfo } from '@store/companyInfo'
import Guide from './components/Guide'
import { changeCreateVisible } from '@store/create-propject'
import { saveScreenDetailModal } from '@store/project/project.thunk'
import { changeFreedVisibleVisible } from '@store/feedback'
import useOpenDemandDetail from '@/hooks/useOpenDemandDetail'
import { LayoutContent, LayoutHeader, LayoutWrap, MainContent } from './style'
import LayoutSideIndex from './components/LayoutSide'
import LayoutHeaderLeft from './components/LayoutHeaderLeft'
import LayoutHeaderRight from './components/LayoutHeaderRight'
import SiteDrawer from './Trends/components/SiteDrawer/SiteDrawer'
import ReportAssistantModal from './Report/Review/components/ReportAssistantModal'
import ReportDetailDrawer from './Report/Review/components/ReportDetailDrawer'
import UserSystemReport from './Report/Review/components/UserSystemReport'
import ProjectSystemReport from './Report/Review/components/ProjectSystemReport'
import LayoutSecondaryMenu from './components/LayoutSecondaryMenu'

const LayoutIndex = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // 不能删除open方法
  const [openDemandDetail, closeScreenModal] = useOpenDemandDetail()
  const {
    i18n: { language },
  } = useTranslation()
  const antdLocal = loadedAntdLocals[language]
  const language1 = useSelector(store => store.global.language)
  const { layoutSideCollapse } = useSelector(store => store.global)
  const { viewReportModal } = useSelector(store => store.workReport)
  const { loginInfo, menuPermission } = useSelector(store => store.user)
  const { projectInfo } = useSelector(store => store.project)

  const [isNextVisible, setIsNextVisible] = useState(false)
  const [leftWidth, setLeftWidth] = useState(0)
  const [rightWidth, setRightWidth] = useState(0)
  const [width, setWidth] = useState(0)

  const [reportAssistantModalObj, setReportAssistantModalObj] = useState<{
    visible: boolean
    type: 'user' | 'project'
  }>({
    visible: false,
    type: 'user',
  })

  message.config({
    duration: 0.8,
    maxCount: 1,
  })

  const init = async () => {
    if (!localStorage.getItem('agileToken')) {
      await login()
    }
  }

  // 关闭浮层类
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

  // 关闭弹窗类
  const onClose = () => {
    dispatch(changeCreateVisible(false))
    dispatch(saveScreenDetailModal({ visible: false, params: {} }))
    closeScreenModal()
    dispatch(changeFreedVisibleVisible(false))
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
  }, [])

  useEffect(() => {
    // 如果没带路由则跳转优先路由
    if (location.pathname === '/') {
      navigate('/Project')
    }
    setIsNextVisible(loginInfo.admin_first_login)
  }, [loginInfo, menuPermission])

  useEffect(() => {
    setWidth(leftWidth + rightWidth)
  }, [leftWidth, rightWidth])

  return (
    <KitConfigProvider language={language1 === 'en'} local={language as any}>
      <ConfigProvider locale={antdLocal} autoInsertSpaceInButton={false}>
        <GlobalStyle />

        <LayoutWrap id="layoutWrap">
          <LayoutSideIndex onClose={onClose} />
          <LayoutContent isOpen={layoutSideCollapse}>
            <LayoutHeader onClick={onClose}>
              <LayoutHeaderLeft onSetWidth={setLeftWidth} />
              <LayoutSecondaryMenu width={width} />
              <LayoutHeaderRight
                onSetWidth={setRightWidth}
                onChangeReportAssistantModalObj={setReportAssistantModalObj}
              />
            </LayoutHeader>
            <MainContent>
              <Outlet />
            </MainContent>
          </LayoutContent>
          {/* 引导页 */}
          <Guide
            visible={isNextVisible}
            close={() => setIsNextVisible(false)}
          />
        </LayoutWrap>

        {/* 一些全局的组件 */}
        <DeleteConfirmGlobalModal />
        <ReportAssistantModal
          close={() => {
            setReportAssistantModalObj({
              ...reportAssistantModalObj,
              visible: false,
            })
          }}
          projectId={
            !window.location.href.includes('/Report') ||
            window.location.href.includes('/Report/Performance')
              ? projectInfo?.id
              : null
          }
          visible={reportAssistantModalObj.visible}
          type={reportAssistantModalObj.type}
        />
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
        <EmployeeProfileContrast />
      </ConfigProvider>
    </KitConfigProvider>
  )
}

export default LayoutIndex
