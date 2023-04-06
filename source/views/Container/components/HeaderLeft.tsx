import { Space, Drawer, Tooltip } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import CommonIconFont from '@/components/CommonIconFont'
import MyDropdown from './MyDropdown'
import sideLogo from '/newLogo.svg'
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
import { useLocation, useNavigate } from 'react-router-dom'
import { getCompanyList, updateCompany } from '@/services/user'
import CommonModal from '@/components/CommonModal'
import { useTranslation } from 'react-i18next'
import ItemDropdown from './ItemDropdown'
import { setCurrentMenu } from '@store/user'
import menuTag from '/menuTag.svg'
import { cloneDeep } from 'lodash'

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

  const mockMenuPermission = useMemo(() => {
    if (menuPermission.menus) {
      const menus = menuPermission?.menus && cloneDeep(menuPermission.menus)
      menus.push({
        id: 'log',
        url: '/Report',
        permission: '',
        name: '工作汇报',
        children: [
          {
            // company_id: 1504303190303051800,
            // created_at: '-0001-11-30 00:00:00',
            id: 'log-1',
            name: '汇报',
            // p_menu: '日志管理',
            permission: '',
            status: 1,
            // updated_at: '2023-02-20 15:03:10',
            url: '/Report/Statistics',
          },
          {
            // company_id: 1504303190303051800,
            // created_at: '-0001-11-30 00:00:00',
            id: 'log-1',
            name: '统计',
            // p_menu: '日志管理',
            permission: '',
            status: 1,
            // updated_at: '2023-02-20 15:03:10',
            url: '/Report/Statistics',
          },
          {
            // company_id: 1504303190303051800,
            // created_at: '-0001-11-30 00:00:00',
            id: 'log-1',
            name: '模板',
            // p_menu: '日志管理',
            permission: '',
            status: 1,
            // updated_at: '2023-02-20 15:03:10',
            url: '/Report/FormWork',
          },
        ],
      })
      return {
        priorityUrl: '"/ProjectManagement"',
        menus,
      }
    }
    return {}
  }, [menuPermission])

  // 点击菜单
  const onChangeCurrentMenu = (item: any) => {
    props.onChange(false)
    const navigateUrl =
      item.children?.length > 0
        ? item.children[0].url === '/ProjectManagement/Mine'
          ? `${item.children[0].url}/Profile`
          : item.children[0].url
        : item.url
    // 如果是日志则默认跳转
    navigate(item.url === '/LogManagement' ? `${item.url}/Send/1` : navigateUrl)
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
    const resultMenu = mockMenuPermission?.menus?.filter(
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
    setCompanyList(res2.data)
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
          <Space size={12} style={{ flexWrap: 'wrap' }}>
            {mockMenuPermission?.menus
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
          </Space>
        </DrawerMenu>
        {/* 后台管理 */}
        {mockMenuPermission?.menus?.filter(
          (i: any) => i.url === '/AdminManagement',
        )?.length > 0 && (
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
  const [isVisible, setIsVisible] = useState(false)
  const { currentMenu, menuIconList, menuPermission } = useSelector(
    store => store.user,
  )
  const dispatch = useDispatch()
  const routerPath = useLocation()

  const mockMenuPermission = useMemo(() => {
    if (menuPermission.menus) {
      const menus = menuPermission?.menus && cloneDeep(menuPermission.menus)
      menus.push({
        id: 'log',
        url: '/Report',
        permission: '',
        name: '日志管理',
        children: [
          {
            // company_id: 1504303190303051800,
            // created_at: '-0001-11-30 00:00:00',
            id: 'log-1',
            name: '汇报',
            // p_menu: '日志管理',
            permission: '',
            status: 1,
            // updated_at: '2023-02-20 15:03:10',
            url: '/Report/Statistics',
          },
          {
            // company_id: 1504303190303051800,
            // created_at: '-0001-11-30 00:00:00',
            id: 'log-1',
            name: '统计',
            // p_menu: '日志管理',
            permission: '',
            status: 1,
            // updated_at: '2023-02-20 15:03:10',
            url: '/Report/Statistics',
          },
          {
            // company_id: 1504303190303051800,
            // created_at: '-0001-11-30 00:00:00',
            id: 'log-1',
            name: '模板',
            // p_menu: '日志管理',
            permission: '',
            status: 1,
            // updated_at: '2023-02-20 15:03:10',
            url: '/Report/FormWork',
          },
        ],
      })
      return {
        priorityUrl: '"/ProjectManagement"',
        menus,
      }
    }
    return {}
  }, [menuPermission])

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
    if (mockMenuPermission.menus?.length || routerPath) {
      let resultMenu: any
      if (routerPath.pathname === '/') {
        resultMenu = mockMenuPermission?.menus?.filter(
          (i: any) => i.url === mockMenuPermission.priorityUrl,
        )[0]
      } else {
        resultMenu = mockMenuPermission?.menus?.filter((i: any) =>
          routerPath.pathname.includes(i.url),
        )?.[0]
      }
      dispatch(setCurrentMenu(resultMenu))
    }
  }, [mockMenuPermission, routerPath])

  return (
    <HeaderLeftWrap>
      <DrawerComponent value={isVisible} onChange={setIsVisible} />
      <Space size={24}>
        <CommonIconFont
          type="menu-02"
          size={24}
          color="var(--neutral-n2)"
          onClick={() => setIsVisible(true)}
        />
        <Space size={8}>
          <CommonIconFont
            type={
              menuIconList?.filter((i: any) =>
                String(currentMenu?.url).includes(i.key),
              )?.[0]?.normal
            }
            size={24}
            color="var(--neutral-n3)"
          />
          <MenuLabel>{currentMenu?.name}</MenuLabel>
          {routerPath.pathname.includes('SiteNotifications') && (
            <Space size={8}>
              <CommonIconFont type="bell" size={24} color="var(--neutral-n3)" />
              <MenuLabel>通知中心</MenuLabel>
            </Space>
          )}
        </Space>
      </Space>
      {currentMenu?.url === '/ProjectManagement' && (
        <ChildrenMenu>
          {currentMenu?.children?.map((i: any) => (
            <ChildrenMenuItem key={i.id} size={8} isActive={getActive(i)}>
              {i.url === '/ProjectManagement/Mine' && (
                <MyDropdown text={i.name} />
              )}
              {i.url !== '/ProjectManagement/Mine' && (
                <ItemDropdown text={i.name} />
              )}
            </ChildrenMenuItem>
          ))}
        </ChildrenMenu>
      )}
    </HeaderLeftWrap>
  )
}

export default HeaderLeft
