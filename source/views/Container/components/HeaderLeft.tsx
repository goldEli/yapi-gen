/* eslint-disable react/jsx-no-leaked-render */
import { Space, Drawer, Tooltip } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import CommonIconFont from '@/components/CommonIconFont'
import MyDropdown from './MyDropdown'
import { getParamsData } from '@/tools'
import sideLogo from '/newLogo.svg'
import { setHeaderParmas, setSave } from '@store/performanceInsight'
import {
  ChildrenMenu,
  ChildrenMenuItem,
  CompanyInfo,
  DrawerCompany,
  DrawerFooter,
  DrawerHeader,
  DrawerMenu,
  DrawerMenuItem,
  Provider,
  HeaderLeftWrap,
  LogoBox,
  MenuLabel,
  CompanyCard,
  CompanyCards,
  WaitingMenu,
} from '../style'
import { CloseWrap } from '@/components/StyleCommon'
import { useDispatch, useSelector } from '@store/index'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { getCompanyList, updateCompany } from '@/services/user'
import CommonModal from '@/components/CommonModal'
import { useTranslation } from 'react-i18next'
import ItemDropdown from './ItemDropdown'
import { setCurrentMenu } from '@store/user'
import menuTag from '/menuTag.svg'
import usePressKyey from '@/hooks/usePressKyey/usePressKyey'
import { useHotkeys } from 'react-hotkeys-hook'

interface DrawerComponentProps {
  value: boolean
  onChange(value: boolean): void
}

const DrawerComponent = (props: DrawerComponentProps) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userInfo, menuPermission, currentMenu, menuIconList } = useSelector(
    store => store.user,
  )
  const [companyList, setCompanyList] = useState<any[]>([])
  const [activeId, setActiveId] = useState('')
  const [isChangeCompany, setIsChangeCompany] = useState(false)
  const [companyParams, setCompanyParams] = useState({
    companyId: '',
    companyUserId: '',
  })
  // 点击菜单
  const onChangeCurrentMenu = (item: any) => {
    dispatch(
      setHeaderParmas({
        iterate_ids: [],
        projectIds: [],
        users: [],
        time: {
          type: 1,
          time: '',
        },
        view: {
          title: '',
          value: 0,
        },
        period_time: 'one_month',
      }),
    )
    dispatch(setSave(false))
    props.onChange(false)
    const navigateUrl =
      item.children?.length > 0
        ? item.children[0].url === '/ProjectManagement/Mine'
          ? `${item.children[0].url}/Profile`
          : item.children[0].url
        : item.url
    // 如果是工作汇报则默认跳转
    navigate(item.url === '/Report' ? `${item.url}/Review` : navigateUrl)
    const resultMenu = {
      ...item,
      ...{
        icon: menuIconList?.filter((i: any) =>
          String(item.url).includes(i.key),
        )[0]?.normal,
      },
    }
    dispatch({
      type: 'user/setCurrentMenu',
      payload: resultMenu,
    })
  }

  // 点击跳转后台管理
  const onToAdmin = () => {
    props.onChange(false)
    const resultMenu = menuPermission?.menus?.filter(
      (i: any) => i.url === '/AdminManagement',
    )[0]
    if (resultMenu) {
      navigate(resultMenu?.children?.[0]?.url)
      dispatch({
        type: 'user/setCurrentMenu',
        payload: resultMenu,
      })
    }
  }

  // 获取公司列表
  const getCompanyData = async () => {
    const res2 = await getCompanyList()

    setActiveId(userInfo.company_id)
    setCompanyList(res2)
  }

  // 点击切换公司弹窗
  const onChangeCompany = async () => {
    setIsChangeCompany(true)
    getCompanyData()
  }

  // 切换公司卡片
  const onClickCompany = (value: any) => {
    setActiveId(value.id)
    setCompanyParams({
      companyId: value.id,
      companyUserId: value.companyUserId,
    })
  }

  const onConfirmChange = async () => {
    if (activeId === userInfo.company_id) return
    await updateCompany(companyParams)
    sessionStorage.removeItem('saveRouter')
    setIsChangeCompany(false)
    // 切换公司自动跳转到公司概况
    navigate('/Situation', { replace: true })
    location.reload()
  }

  return (
    <>
      {/* 切换公司 */}
      <CommonModal
        isVisible={isChangeCompany}
        title={t('components.changeCompany')}
        onClose={() => setIsChangeCompany(false)}
        onConfirm={onConfirmChange}
      >
        <CompanyCards>
          <div style={{ padding: '0 8px' }}>
            {companyList.map((i: any) => (
              <CompanyCard
                key={i.id}
                isActive={i.id === activeId}
                onClick={() => onClickCompany(i)}
              >
                <div className="info">
                  <img src={i.logo} alt="" />
                  <span>{i.name}</span>
                </div>
                {i.id === activeId && (
                  <CommonIconFont
                    type="check"
                    size={20}
                    color="var(--primary-d2)"
                  />
                )}
              </CompanyCard>
            ))}
          </div>
        </CompanyCards>
      </CommonModal>
      {/* 左侧弹层 */}
      <Drawer
        headerStyle={{ display: 'none' }}
        bodyStyle={{
          padding: '16px 0px 8px',
          background: 'var(--neutral-white-d5)',
        }}
        placement="left"
        onClose={() => props.onChange(false)}
        open={props.value}
        width={320}
      >
        <DrawerHeader>
          <LogoBox>
            <img src={sideLogo} alt="" />
            <span>IFUN Agile</span>
          </LogoBox>
          <CloseWrap
            width={32}
            height={32}
            onClick={() => props.onChange(false)}
          >
            <CommonIconFont type="close" size={20} color="var(--neutral-n2)" />
          </CloseWrap>
        </DrawerHeader>
        <DrawerCompany onClick={onChangeCompany}>
          <CompanyInfo>
            <img src={userInfo.company_logo} alt="" />
            <Tooltip title={userInfo.company_name} placement="bottomLeft">
              <div>{userInfo.company_name}</div>
            </Tooltip>
          </CompanyInfo>
          <CommonIconFont type="swap" color="var(--neutral-n2)" />
        </DrawerCompany>
        <Provider isBottom />
        {/* 其他菜单 */}
        <DrawerMenu>
          {menuPermission?.menus
            ?.filter((k: any) => k.url !== '/AdminManagement')
            .map((i: any) => (
              <DrawerMenuItem
                key={i.id}
                isActive={currentMenu?.id === i.id}
                onClick={() => onChangeCurrentMenu(i)}
              >
                <div className="menuIcon">
                  <CommonIconFont
                    type={
                      currentMenu?.id === i.id
                        ? menuIconList?.filter((k: any) =>
                            String(i.url).includes(k.key),
                          )[0]?.active
                        : menuIconList?.filter((k: any) =>
                            String(i.url).includes(k.key),
                          )[0]?.normal
                    }
                    size={24}
                  />
                </div>
                <div style={{ textAlign: 'center' }} className="label">
                  {i.name}
                </div>
              </DrawerMenuItem>
            ))}
          <WaitingMenu>
            <img src={menuTag} className="menuTag" />
            <div className="menuIcon">
              <CommonIconFont type="draft" size={24} />
            </div>
            <div className="label">{t('menu_word')}</div>
          </WaitingMenu>
        </DrawerMenu>
        {/* 后台管理 */}
        {menuPermission?.menus?.filter((i: any) => i.url === '/AdminManagement')
          ?.length > 0 && (
          <DrawerFooter onClick={onToAdmin}>
            <div>
              <CommonIconFont
                type={
                  menuIconList?.filter(
                    (i: any) => i.key === '/AdminManagement',
                  )[0].normal
                }
                size={20}
                color="var(--neutral-n2)"
              />
              <div>{t('back_stage_management')}</div>
            </div>
          </DrawerFooter>
        )}
      </Drawer>
    </>
  )
}

const HeaderLeft = () => {
  const [t] = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const { currentMenu, menuIconList, menuPermission } = useSelector(
    store => store.user,
  )
  const dispatch = useDispatch()
  const routerPath = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams) || {}
  const { type } = paramsData
  const getActive = (item: any) => {
    let state = false

    if (routerPath.pathname.includes(item.url)) {
      state = true
    }
    if (
      item.url === '/ProjectManagement/Project' &&
      !routerPath.pathname.includes('/ProjectManagement/Mine')
    ) {
      state = true
    }
    return state
  }

  useEffect(() => {
    if (menuPermission.menus?.length || routerPath) {
      let resultMenu: any
      if (routerPath.pathname === '/') {
        resultMenu = menuPermission?.menus?.filter(
          (i: any) => i.url === menuPermission.priorityUrl,
        )[0]
      } else {
        resultMenu = menuPermission?.menus?.filter((i: any) => {
          if (routerPath.pathname.includes('Sprint')) {
            return routerPath.pathname.replace('Sprint', '').includes(i.url)
          }
          if (type) {
            return '/ProjectManagement'.includes(i.url)
          }
          return routerPath.pathname.includes(i.url)
        })?.[0]
      }
      dispatch(setCurrentMenu(resultMenu))
    }
  }, [menuPermission, routerPath])

  const showTopNav: any = useMemo(() => {
    return (
      currentMenu?.children &&
      currentMenu?.children.length > 0 &&
      currentMenu?.url !== '/AdminManagement'
    )
  }, [currentMenu])

  const getMenuItemElement = (i: any) => {
    const unDropdownUrl = [
      '/Report/Review',
      '/Report/Statistics',
      '/Report/Formwork',
    ]
    if (unDropdownUrl.includes(i.url)) {
      return <span>{i.name}</span>
    }
    switch (i.url) {
      case '/ProjectManagement/Mine':
        return <MyDropdown text={i.name} />
      case '/ProjectManagement/Project':
        return <ItemDropdown text={i.name} />
      default:
        return ''
    }
  }

  const handleClickMenuItem = (url: string) => {
    if (url.includes('ProjectManagement')) {
      return
    }
    navigate(url)
  }
  const handleKeyPress = useCallback(() => {
    setIsVisible(i => !i)
  }, [])
  useHotkeys(
    '[',
    () => {
      handleKeyPress()
    },
    [],
  )

  return (
    <HeaderLeftWrap>
      <DrawerComponent value={isVisible} onChange={setIsVisible} />
      <Space size={24}>
        <CloseWrap width={32} height={32} onClick={() => setIsVisible(true)}>
          <CommonIconFont type="menu-02" size={24} color="var(--neutral-n2)" />
        </CloseWrap>
        <Space
          size={8}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '3px 0 0 0',
          }}
        >
          {currentMenu ? (
            <>
              <CommonIconFont
                type={
                  menuIconList?.filter((i: any) =>
                    String(currentMenu?.url).includes(i.key),
                  )?.[0]?.normal
                }
                size={24}
                color="var(--neutral-n3)"
              />
              <MenuLabel>{currentMenu?.name}</MenuLabel>{' '}
            </>
          ) : routerPath.pathname.includes('SiteNotifications') ? (
            <Space size={8}>
              <CommonIconFont type="bell" size={24} color="var(--neutral-n3)" />
              <MenuLabel>{t('notificationCenter')}</MenuLabel>
            </Space>
          ) : null}
        </Space>
      </Space>

      {showTopNav && (
        <ChildrenMenu>
          {currentMenu.children.map((i: any) => (
            <ChildrenMenuItem
              onClick={() => handleClickMenuItem(i.url)}
              key={i.id}
              size={8}
              isActive={getActive(i)}
            >
              {getMenuItemElement(i)}
            </ChildrenMenuItem>
          ))}
        </ChildrenMenu>
      )}
    </HeaderLeftWrap>
  )
}

export default HeaderLeft
