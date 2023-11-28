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
  MenusWrap,
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
  foldList: any
  onChangeCurrentMenu(row: any): void
}

// 更多的展示组件
const MorePopoverComponent = (props: MorePopoverComponentProps) => {
  const [t] = useTranslation()
  const { menuIconList, currentMenu } = useSelector(store => store.user)

  return (
    <MorePopover>
      <MoreTitle>{t('moreApplications')}</MoreTitle>
      <MorePopoverContent>
        {props.foldList?.map((i: any) => (
          <MoreItem
            onClick={() => {
              props.onChangeCurrentMenu(i)
              props.onClose()
            }}
            key={i.id}
            className={currentMenu?.url === i.url ? activeSideMenu : ''}
          >
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
            <div>
              {/* 单独处理后台得翻译 */}
              {i?.url === '/AdminManagement'
                ? t('managementBackend')
                : i?.isRegular
                ? t(i?.name)
                : i?.name}
            </div>
          </MoreItem>
        ))}
      </MorePopoverContent>
    </MorePopover>
  )
}

interface LayoutSideIndexProps {
  onClose(): void
}

const LayoutSideIndex = (props: LayoutSideIndexProps) => {
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
  // 正常显示的菜单
  const [notFoldList, setNotFoldList] = useState([])
  // 折叠菜单
  const [foldList, setFoldList] = useState([])

  // 其他系统列表
  const otherSystemList = [
    { name: 'iFun BI', url: 'https://bi.ifun.com/', icon: 'BI' },
    { name: 'iFun AI', url: 'https://iai.ifun.com/', icon: 'AI' },
    { name: 'iFun GM', url: 'https://gm.ifun.com', icon: 'GM' },
    { name: 'iFun Mail', url: 'https://imail.ifun.com/', icon: 'MI' },
    { name: 'iFun OA', url: 'https://oa.ifun.com/', icon: 'OA' },
    { name: t('toBeOpened'), url: '', icon: 'time', disable: true },
  ]

  // 计算菜单显示
  const onComputedMenu = (state: boolean, menu: any) => {
    if (!menu?.length) return
    // 获取左侧菜单剩余展示菜案高度
    const clientHeight =
      (document.getElementById('LayoutSide')?.clientHeight || 0) -
      (state ? 142 : 160)
    // 计算菜单显示区域能显示几个菜单
    const menuNumber = Math.floor(clientHeight / (state ? 48 : 72)) - 1

    // 如果显示条数大于菜单条数，则全部显示除后台管理
    if (menuNumber > menu?.length) {
      setNotFoldList(
        menuPermission.menus?.filter((k: any) => k.url !== '/AdminManagement'),
      )
      setFoldList(
        menuPermission.menus?.filter((k: any) => k.url === '/AdminManagement'),
      )
    } else {
      // 删除后台管理
      const notHave = menu?.filter((k: any) => k.url !== '/AdminManagement')
      setNotFoldList(notHave.slice(0, menuNumber))
      setFoldList(
        notHave
          .slice(menuNumber, menu?.length - 1)
          .concat(menu?.filter((k: any) => k.url === '/AdminManagement')),
      )
    }
  }

  // 切换展开折叠
  const onChangeCollapse = () => {
    setTimeout(() => {
      dispatch(setLayoutSideCollapse(!layoutSideCollapse))
      onComputedMenu(!layoutSideCollapse, menuPermission?.menus)
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
    dispatch(setProjectInfo({}))

    setTimeout(() => {
      navigate(navigateUrl)
    }, 10)
  }

  // 新开页面打开外链
  const onOpenUrl = (url: string) => {
    window.open(url)
  }

  const moreOtherSystem = (
    <MoreOtherSystemWrap>
      {otherSystemList?.map((i: any) => (
        <MoreOtherSystemItem
          key={i.name}
          disable={i.disable}
          onClick={() => {
            i.disable ? void 0 : onOpenUrl(i.url)
          }}
        >
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
      // 特殊处理老路由 !!!!!
      if (
        routerPath.pathname?.includes('/SprintProjectManagement/') ||
        routerPath.pathname?.includes('/ProjectManagement/')
      ) {
        resultMenu = menuPermission?.menus?.filter(
          (i: any) => i.url === '/Project',
        )[0]
      }
      dispatch(setCurrentMenu(resultMenu))
      onComputedMenu(layoutSideCollapse, menuPermission?.menus)
    }
  }, [menuPermission, routerPath])

  return (
    <LayoutSide
      isOpen={layoutSideCollapse}
      onClick={props.onClose}
      id="LayoutSide"
    >
      {/* 折叠状态下的 */}
      {!layoutSideCollapse && (
        <NotOpenLogoWrap>
          <MoreOtherPopover
            content={isLogoChange ? moreOtherSystem : null}
            open={isLogoChange}
            placement="rightTop"
            onOpenChange={(state: boolean) => {
              onChangeLogo(state)
            }}
            getPopupContainer={n => n}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {isLogoChange ? (
                <OtherSystemMenuNotOpen>
                  <CommonIconFont
                    type="menu-02"
                    size={24}
                    color="var(--neutral-n2)"
                  />
                </OtherSystemMenuNotOpen>
              ) : (
                <img
                  onMouseEnter={() => onChangeLogo(true)}
                  className="logo"
                  src="https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/logo/2.7.0/logo-40px.svg"
                  alt=""
                  onMouseOut={() => {
                    onChangeLogo(false)
                  }}
                />
              )}
              <img
                className="img"
                src="https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/logo/2.7.0/logo-text-40px.svg"
                alt=""
              />
            </div>
          </MoreOtherPopover>
        </NotOpenLogoWrap>
      )}

      {/* 展开的交互 */}
      {layoutSideCollapse && (
        <MoreOtherPopover
          content={isLogoChange ? moreOtherSystem : null}
          open={isLogoChange}
          placement="rightBottom"
          onOpenChange={(state: boolean) => {
            onChangeLogo(state)
          }}
        >
          {isLogoChange ? (
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
          ) : (
            <OpenLogoWrap>
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
        </MoreOtherPopover>
      )}

      {/* 占位使用 */}
      <div style={{ width: 60, height: layoutSideCollapse ? 24 : 16 }} />

      <MenusWrap isOpen={layoutSideCollapse}>
        {notFoldList?.map((i: any) => (
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
            <div>{i.isRegular ? t(i.name) : i.name}</div>
          </div>
        ))}

        {foldList?.length > 0 && (
          <Popover
            placement="right"
            destroyTooltipOnHide
            open={isPopover}
            content={
              <MorePopoverComponent
                onClose={() => setIsPopover(false)}
                foldList={foldList}
                onChangeCurrentMenu={onChangeCurrentMenu}
              />
            }
            onOpenChange={setIsPopover}
          >
            <div
              className={`${
                layoutSideCollapse ? openSideMenu : notOpenSideMenu
              } ${
                foldList?.filter((i: any) => i.url === currentMenu?.url)
                  ?.length > 0
                  ? activeSideMenu
                  : ''
              }`}
            >
              <CommonIconFont
                type={
                  foldList?.filter((i: any) => i.url === currentMenu?.url)
                    ?.length > 0
                    ? 'selections-sel'
                    : 'selections-nor'
                }
                size={24}
                color="var(--neutral-n2)"
              />
              <div>{t('more')}</div>
            </div>
          </Popover>
        )}
      </MenusWrap>

      <CollapseWrap>
        {layoutSideCollapse && (
          <CollapseWrapItem onClick={onChangeCollapse}>
            <CommonIconFont
              type={layoutSideCollapse ? 'outdent' : 'indent'}
              size={24}
            />
            <div>{layoutSideCollapse ? t('fold') : t('expand')}</div>
          </CollapseWrapItem>
        )}
        {!layoutSideCollapse && (
          <Tooltip title={layoutSideCollapse ? t('fold') : t('expand')}>
            <CloseWrap width={32} height={32} onClick={onChangeCollapse}>
              <CommonIconFont
                type={layoutSideCollapse ? 'outdent' : 'indent'}
                size={24}
              />
            </CloseWrap>
          </Tooltip>
        )}
      </CollapseWrap>
    </LayoutSide>
  )
}

export default LayoutSideIndex
