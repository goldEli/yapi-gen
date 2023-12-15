/* eslint-disable react/jsx-no-leaked-render */
import { useDispatch, useSelector } from '@store/index'
import {
  LayoutSide,
  notOpenSideMenu,
  MorePopover,
  MoreTitle,
  MorePopoverContent,
  MoreItem,
  activeSideMenu,
  OtherSystemMenuNotOpen,
  MoreOtherSystemWrap,
  MoreOtherSystemItem,
  MoreOtherPopover,
  NotOpenLogoWrap,
  MenusWrap,
} from '../style'
import { Popover } from 'antd'
import CommonIconFont from '@/components/CommonIconFont'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { setCurrentMenu } from '@store/user'
import { setHeaderParmas, setSave } from '@store/performanceInsight'
import { setProjectInfo } from '@store/project'
import SiteNotifications from '../Trends/SiteNotifications'
import { changeVisible, changeVisibleFilter } from '@store/SiteNotifications'
import NoticePopover from './NoticePopover'
import useNoticePopoverTitle from './NoticePopover/hooks/useNoticeTitle'
import { PopoverWrap, overlayClassNameStyle } from './NoticePopover/style'
import { divide } from 'lodash'
interface MorePopoverComponentProps {
  onClose(): void
  foldList: any
  onChangeCurrentMenu(row: any): void
}

// 更多的展示组件
const MorePopoverComponent = (props: MorePopoverComponentProps) => {
  const [t] = useTranslation()
  const { menuIconList, currentMenu } = useSelector(store => store.user)
  // 按照固定的位置排序
  const order = ['/Report', '/CalendarManager', '/AdminManagement']
  const resultList = props.foldList?.sort(
    (a: any, b: any) => order.indexOf(a.url) - order.indexOf(b.url),
  )

  return (
    <MorePopover>
      <MoreTitle>{t('moreApplications')}</MoreTitle>
      <MorePopoverContent>
        {resultList?.map((i: any) => (
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
  const popoverRef: any = useRef(null)
  const { currentMenu, menuIconList, menuPermission } = useSelector(
    store => store.user,
  )

  const [isPopover, setIsPopover] = useState(false)
  const [isLogoChange, setIsLogoChange] = useState(false)
  // 正常显示的菜单
  const [notFoldList, setNotFoldList] = useState([])
  // 折叠菜单
  const [foldList, setFoldList] = useState([])
  const [msgVisible, setMsgVisible] = useState(false)
  const { TitleBox, close } = useNoticePopoverTitle(setMsgVisible, popoverRef)
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
  const onComputedMenu = (menu: any) => {
    if (!menu?.length) return
    // 获取左侧菜单剩余展示菜案高度
    const clientHeight =
      (document.getElementById('LayoutSide')?.clientHeight || 0) - 128
    // 计算菜单显示区域能显示几个菜单 --  -1是为了增加更多菜单显示
    const menuNumber = Math.floor(clientHeight / 72) - 1

    // 需要放入更多的菜单
    const foldMenuList = ['/Report', '/CalendarManager', '/AdminManagement']

    // 如果显示条数大于菜单条数，则全部显示除后台管理
    if (menuNumber > menu?.length) {
      setNotFoldList(
        menuPermission.menus?.filter(
          (k: any) => !foldMenuList?.includes(k.url),
        ),
      )
      setFoldList(
        menuPermission.menus?.filter((k: any) => foldMenuList?.includes(k.url)),
      )
    } else {
      // 删除后台管理
      const notHave = menu?.filter((k: any) => !foldMenuList?.includes(k.url))
      setNotFoldList(notHave.slice(0, menuNumber))
      setFoldList(
        notHave
          .slice(menuNumber, menu?.length - 1)
          .concat(menu?.filter((k: any) => foldMenuList?.includes(k.url))),
      )
    }
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

    // 如果是我的则默认跳转我的待办
    if (item.url === '/Mine') {
      navigateUrl = `${item.url}/Carbon`
    }

    // 如果是动态则默认跳转全部
    if (item.url === '/Trends') {
      setMsgVisible(true)

      dispatch(changeVisible(false))
      dispatch(changeVisibleFilter(false))
      return
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
      onComputedMenu(menuPermission?.menus)
    }
  }, [menuPermission, routerPath])

  useEffect(() => {
    // 在组件加载后，给根容器添加点击事件监听器
    document.addEventListener('click', handleClickOutside)

    return () => {
      // 组件卸载时，移除点击事件监听器
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const handleClickOutside = (event: any) => {
    // 判断被点击的元素是否是 Popover 相关的元素
    // if (popoverRef.current && !popoverRef.current.contains(event.target) && msgVisible) {
    //   setMsgVisible(false)
    // } else {
    //   setMsgVisible(true)
    // }
  }
  return (
    <LayoutSide onClick={props.onClose} id="LayoutSide">
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
                src="https://mj-system-1308485183.cos.accelerate.myqcloud.com/logo/2.7.0/logo-40px.svg"
                alt=""
                onMouseOut={() => {
                  onChangeLogo(false)
                }}
              />
            )}
            <img
              className="img"
              src="https://mj-system-1308485183.cos.accelerate.myqcloud.com/logo/2.7.0/logo-text-40px.svg"
              alt=""
            />
          </div>
        </MoreOtherPopover>
      </NotOpenLogoWrap>

      {/* 占位使用 */}
      <div style={{ width: 60, height: 16 }} />

      <MenusWrap>
        {/* {notFoldList?.map((i: any) => (
          <div
            key={i.id}
            onClick={() => onChangeCurrentMenu(i)}
            className={`${notOpenSideMenu} ${currentMenu?.url === i.url ? activeSideMenu : ''
              }`}
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
        ))} */}
        {notFoldList.map((i: any) => {
          if (i.id === 1) {
            return (
              <PopoverWrap
                key={i.id}
                overlayClassName={overlayClassNameStyle}
                ref={popoverRef}
                content={
                  <NoticePopover
                    onHistoryStatics={() => {
                      navigate('Trends/AllNote/1')
                      popoverRef?.current?.props?.onPopupVisibleChange(false)
                      setMsgVisible(false)
                    }}
                    onClose={() => {
                      popoverRef?.current?.props?.onPopupVisibleChange(false)
                    }}
                  ></NoticePopover>
                }
                title={TitleBox}
                trigger="click"
                placement="right"
                destroyTooltipOnHide
              >
                <div
                  key={i.id}
                  onClick={() => onChangeCurrentMenu(i)}
                  className={`${notOpenSideMenu} ${
                    currentMenu?.url === i.url ? activeSideMenu : ''
                  }`}
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
              </PopoverWrap>
            )
          }
          return (
            <div
              key={i.id}
              onClick={() => onChangeCurrentMenu(i)}
              className={`${notOpenSideMenu} ${
                currentMenu?.url === i.url ? activeSideMenu : ''
              }`}
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
          )
        })}
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
              className={`${notOpenSideMenu} ${
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
    </LayoutSide>
  )
}

export default LayoutSideIndex
