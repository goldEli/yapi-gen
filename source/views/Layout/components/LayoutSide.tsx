/* eslint-disable react/jsx-no-leaked-render */
import { useDispatch, useSelector } from '@store/index'
import {
  LayoutSide,
  CollapseWrap,
  CollapseWrapItem,
  notOpenSideMenu,
  openSideMenu,
  MorePopover,
  MoreTitle,
  MorePopoverContent,
  MoreItem,
  activeSideMenu,
  OtherSystemMenuNotOpen,
  OtherSystemMenuOpen,
  MoreOtherSystemWrap,
  MoreOtherSystemItem,
  MoreOtherPopover,
  NotOpenLogoWrap,
  OpenLogoWrap,
} from '../style'
import { Popover, Tooltip } from 'antd'
import CommonIconFont from '@/components/CommonIconFont'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CloseWrap } from '@/components/StyleCommon'
import { setLayoutSideCollapse } from '@store/global'
import { useLocation, useNavigate } from 'react-router-dom'
import { setCurrentMenu } from '@store/user'
import { setHeaderParmas, setSave } from '@store/performanceInsight'
import { setProjectInfo } from '@store/project'
import SiteNotifications from '../Trends/SiteNotifications'
import { changeVisible, changeVisibleFilter } from '@store/SiteNotifications'

interface MorePopoverComponentProps {
  onClose(): void
}

// 更多的展示组件
const MorePopoverComponent = (props: MorePopoverComponentProps) => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { menuPermission, menuIconList } = useSelector(store => store.user)

  // 点击跳转后台管理
  const onToAdmin = () => {
    const resultMenu = menuPermission?.menus?.filter(
      (i: any) => i.url === '/AdminManagement',
    )[0]
    if (resultMenu) {
      props.onClose()
      navigate(resultMenu?.children?.[0]?.url)
      dispatch({
        type: 'user/setCurrentMenu',
        payload: resultMenu,
      })
    }
  }

  return (
    <MorePopover>
      <MoreTitle>{t('moreApplications')}</MoreTitle>
      <MorePopoverContent>
        {menuPermission.menus?.filter((k: any) => k.url === '/AdminManagement')
          ?.length > 0 && (
          <MoreItem onClick={onToAdmin}>
            <CommonIconFont
              size={24}
              color="var(--neutral-n2)"
              type={
                menuIconList?.filter((k: any) =>
                  String('/AdminManagement').includes(k.key),
                )[0]?.normal
              }
            />
            <div>
              {
                menuPermission.menus?.filter(
                  (k: any) => k.url === '/AdminManagement',
                )[0]?.name
              }
            </div>
          </MoreItem>
        )}
        <MoreItem isDisable>
          <CommonIconFont size={24} type="plus" color="var(--neutral-n2)" />
          <div>禁用</div>
        </MoreItem>
      </MorePopoverContent>
    </MorePopover>
  )
}

const LayoutSideIndex = () => {
  const [t] = useTranslation()
  const routerPath = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const childStateRef = useRef<any>()
  const { layoutSideCollapse } = useSelector(store => store.global)
  const { currentMenu, menuIconList, menuPermission } = useSelector(
    store => store.user,
  )

  const [isPopover, setIsPopover] = useState(false)
  const [isLogoChange, setIsLogoChange] = useState(false)

  // 其他系统列表
  const otherSystemList = [
    { name: 'iFun BI', url: '', icon: 'plus' },
    { name: 'iFun AI', url: '', icon: 'plus' },
    { name: 'iFun GM', url: '', icon: 'plus' },
    { name: 'iFun Mail', url: '', icon: 'plus' },
    { name: 'iFun OA', url: '', icon: 'plus' },
  ]

  // 切换展开折叠
  const onChangeCollapse = () => {
    setTimeout(() => {
      dispatch(setLayoutSideCollapse(!layoutSideCollapse))
    }, 100)
  }

  // 切换展开折叠
  const onChangeLogo = (state: boolean) => {
    setTimeout(() => {
      setIsLogoChange(state)
    }, 100)
  }

  const onChangeCurrentMenu = (item: any) => {
    // 效能洞察参数
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

    // 如果有二级菜单的则取第一条
    let navigateUrl =
      item.children?.length > 0 ? item.children[0].url : item.url

    // 如果是工作汇报则默认跳转
    if (item.url === '/Report') {
      navigateUrl = `${item.url}/Review/List/1`
    }

    // 如果是我的则默认跳转我的概况
    if (item.url === '/Mine') {
      navigateUrl = `${item.url}/Profile`
    }

    // 如果是动态则默认跳转全部
    if (item.url === '/Trends') {
      dispatch(changeVisible(false))
      dispatch(changeVisibleFilter(false))
      navigateUrl = `${item.url}/AllNote/1`
    }

    // 如果是统计则默认跳转
    if (item.url === '/Statistics') {
      navigateUrl = `${item.url}/Task`
    }

    navigate(navigateUrl)
    const resultMenu = {
      ...item,
      ...{
        icon: menuIconList?.filter((i: any) =>
          String(item.url).includes(i.key),
        )[0]?.normal,
      },
    }
    dispatch(setProjectInfo({}))
    dispatch({
      type: 'user/setCurrentMenu',
      payload: resultMenu,
    })
  }

  const moreOtherSystem = (
    <MoreOtherSystemWrap>
      {otherSystemList?.map((i: any) => (
        <MoreOtherSystemItem key={i.name}>
          <div className="box">
            <CommonIconFont type={i.icon} size={24} />
          </div>
          <div className="name">{i.name}</div>
        </MoreOtherSystemItem>
      ))}
    </MoreOtherSystemWrap>
  )

  useEffect(() => {
    // 存储当前选中的菜单信息
    if (menuPermission.menus?.length > 0 || routerPath) {
      let resultMenu = menuPermission?.menus?.filter((i: any) =>
        routerPath.pathname?.includes(i.url),
      )[0]
      dispatch(setCurrentMenu(resultMenu))
    }
  }, [menuPermission, routerPath])

  return (
    <LayoutSide isOpen={layoutSideCollapse}>
      {/* 折叠状态下的 */}
      {!layoutSideCollapse && (
        <NotOpenLogoWrap>
          {isLogoChange && (
            <MoreOtherPopover
              content={moreOtherSystem}
              open
              placement="bottomLeft"
              onOpenChange={(state: boolean) =>
                state ? void 0 : onChangeLogo(false)
              }
            >
              <OtherSystemMenuNotOpen>
                <CommonIconFont
                  type="menu-02"
                  size={24}
                  color="var(--neutral-n2)"
                />
              </OtherSystemMenuNotOpen>
            </MoreOtherPopover>
          )}
          {!isLogoChange && (
            <img
              onMouseEnter={() => onChangeLogo(true)}
              className="logo"
              src="https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/logo/2.7.0/logo-40px.svg"
              alt=""
            />
          )}
          <img
            className="img"
            src="https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/logo/2.7.0/logo-text-40px.svg"
            alt=""
          />
        </NotOpenLogoWrap>
      )}

      {/* 展开的交互 */}
      {layoutSideCollapse && (
        <>
          {isLogoChange && (
            <MoreOtherPopover
              content={moreOtherSystem}
              open
              placement="bottomLeft"
              onOpenChange={(state: boolean) =>
                state ? void 0 : onChangeLogo(false)
              }
            >
              <OtherSystemMenuOpen>
                <CommonIconFont
                  type="menu-02"
                  size={24}
                  color="var(--neutral-n2)"
                />
                <img
                  className="img"
                  src="https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/logo/2.7.0/logo-text-28px.svg"
                  alt=""
                />
              </OtherSystemMenuOpen>
            </MoreOtherPopover>
          )}
          {!isLogoChange && (
            <OpenLogoWrap onMouseEnter={() => onChangeLogo(true)}>
              <img
                className="logo"
                src="https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/logo/2.7.0/logo-28px.svg"
                alt=""
              />
              <img
                className="img"
                src="https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/logo/2.7.0/logo-text-28px.svg"
                alt=""
              />
            </OpenLogoWrap>
          )}
        </>
      )}

      {/* 占位使用 */}
      <div style={{ width: 60, height: layoutSideCollapse ? 24 : 16 }} />

      {menuPermission.menus
        ?.filter((k: any) => k.url !== '/AdminManagement')
        ?.map((i: any) => (
          <div
            key={i.id}
            onClick={() => onChangeCurrentMenu(i)}
            className={`${
              layoutSideCollapse ? openSideMenu : notOpenSideMenu
            } ${currentMenu?.url === i.url ? activeSideMenu : ''}`}
          >
            {i.url === '/Trends' && (
              <SiteNotifications ref={childStateRef} item={i} />
            )}
            {i.url !== '/Trends' && (
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
                color="var(--neutral-n2)"
              />
            )}
            <div>{i.name}</div>
          </div>
        ))}

      <Popover
        placement="right"
        destroyTooltipOnHide
        open={isPopover}
        content={<MorePopoverComponent onClose={() => setIsPopover(false)} />}
        onOpenChange={setIsPopover}
      >
        <div className={layoutSideCollapse ? openSideMenu : notOpenSideMenu}>
          <CommonIconFont type="plus" size={24} color="var(--neutral-n2)" />
          <div>{t('more')}</div>
        </div>
      </Popover>

      <CollapseWrap>
        {layoutSideCollapse && (
          <CollapseWrapItem onClick={onChangeCollapse}>
            <CommonIconFont
              type={layoutSideCollapse ? 'outdent' : 'indent'}
              size={20}
            />
            <div>{layoutSideCollapse ? t('fold') : t('expand')}</div>
          </CollapseWrapItem>
        )}
        {!layoutSideCollapse && (
          <Tooltip title={layoutSideCollapse ? t('fold') : t('expand')}>
            <CloseWrap width={32} height={32} onClick={onChangeCollapse}>
              <CommonIconFont
                type={layoutSideCollapse ? 'outdent' : 'indent'}
                size={20}
              />
            </CloseWrap>
          </Tooltip>
        )}
      </CollapseWrap>
    </LayoutSide>
  )
}

export default LayoutSideIndex
