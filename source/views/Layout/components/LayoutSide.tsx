/* eslint-disable react/jsx-no-leaked-render */
import { useDispatch, useSelector } from '@store/index'
import {
  LayoutSide,
  LogoWrap,
  CollapseWrap,
  CollapseWrapItem,
  notOpenSideMenu,
  openSideMenu,
  FeedBadge,
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
} from '../style'
import { Badge, Popover, Tooltip } from 'antd'
import CommonIconFont from '@/components/CommonIconFont'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CloseWrap } from '@/components/StyleCommon'
import { setLayoutSideCollapse } from '@store/global'
import { useLocation } from 'react-router-dom'
import { setCurrentMenu } from '@store/user'

// 更多的展示组件
const MorePopoverComponent = () => {
  const [t] = useTranslation()
  const { menuPermission, menuIconList } = useSelector(store => store.user)
  return (
    <MorePopover>
      <MoreTitle>{t('moreApplications')}</MoreTitle>
      <MorePopoverContent>
        {menuPermission.menus?.filter((k: any) => k.url === '/AdminManagement')
          ?.length > 0 && (
          <MoreItem>
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
  const dispatch = useDispatch()
  const { layoutSideCollapse } = useSelector(store => store.global)
  const { currentMenu, menuIconList, menuPermission } = useSelector(
    store => store.user,
  )

  const [isPopover, setIsPopover] = useState(false)
  const [isLogoChange, setIsLogoChange] = useState(false)

  // 其他的固定菜单
  const otherMenu: any = [
    { name: '动态', url: '/Trends' },
    { name: '我的', url: '/Mine' },
  ]

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
      {isLogoChange && (
        <>
          <MoreOtherPopover
            content={moreOtherSystem}
            open
            placement="bottomLeft"
            onOpenChange={(state: boolean) =>
              state ? void 0 : onChangeLogo(false)
            }
          >
            {layoutSideCollapse && (
              <OtherSystemMenuOpen>
                <CommonIconFont
                  type="menu-02"
                  size={24}
                  color="var(--neutral-n2)"
                />
                <div>其他系统</div>
              </OtherSystemMenuOpen>
            )}
            {!layoutSideCollapse && (
              <OtherSystemMenuNotOpen>
                <CommonIconFont
                  type="menu-02"
                  size={24}
                  color="var(--neutral-n2)"
                />
              </OtherSystemMenuNotOpen>
            )}
          </MoreOtherPopover>
          {/* 占位使用 */}
          <div style={{ width: 60, height: layoutSideCollapse ? 12 : 20 }} />
        </>
      )}
      {!isLogoChange && (
        <LogoWrap
          onMouseEnter={() => onChangeLogo(true)}
          isOpen={layoutSideCollapse}
        />
      )}
      {menuPermission.menus
        ?.filter((k: any) => k.url !== '/AdminManagement')
        .concat(otherMenu)
        ?.map((i: any) => (
          <div
            key={i.id}
            className={`${
              layoutSideCollapse ? openSideMenu : notOpenSideMenu
            } ${currentMenu?.url === i.url ? activeSideMenu : ''}`}
          >
            {/* 动态并且是折叠状态 */}
            {i.url === '/Trends' && !layoutSideCollapse && (
              <Badge size="small" offset={[-2, 1]} count={100}>
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
              </Badge>
            )}
            {/* 状态并且是展开状态 */}
            {i.url === '/Trends' && layoutSideCollapse && (
              <>
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
                <FeedBadge size="small" offset={[-2, 1]} count={100} />
              </>
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
        content={<MorePopoverComponent />}
        onOpenChange={setIsPopover}
      >
        <div className={layoutSideCollapse ? openSideMenu : notOpenSideMenu}>
          <CommonIconFont type="plus" size={24} color="var(--neutral-n2)" />
          <div>更多</div>
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
