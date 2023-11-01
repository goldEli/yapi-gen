import CommonIconFont from '@/components/CommonIconFont'
import { LayoutMenuWrap, MoreMenuWrap } from '../style'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useSelector } from '@store/index'
import { useLocation, useNavigate } from 'react-router-dom'

interface LayoutSecondaryMenuProps {
  width: number
}

const LayoutSecondaryMenu = (props: LayoutSecondaryMenuProps) => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const routerPath = useLocation()
  const [items, setItems] = useState<any>([])
  const { currentMenu, userInfo } = useSelector(store => store.user)
  const { projectInfo } = useSelector(store => store.project)
  const [activeKey, setActiveKey] = useState('')

  const side: any = [
    {
      name: t('corporate_information'),
      url: '/AdminManagement/CompanyInfo',
    },
    {
      name: t('organizational_information'),
      url: '/AdminManagement/OrganizationInformation',
      id: 0,
      children: [
        '/AdminManagement/StaffManagement',
        '/AdminManagement/TeamManagement',
      ],
    },
    {
      name: t('authority_management'),
      url: '/AdminManagement/PermissionManagement',
    },
    {
      name: t('safety_management'),
      url: '/AdminManagement/SafetyManagement',
      id: 1,
      children: [
        '/AdminManagement/WaterMarkManagement',
        '/AdminManagement/OperationManagement',
        '/AdminManagement/LoginManagement',
      ],
    },
    {
      name: t('system_notification'),
      url: '/AdminManagement/NoteManagement',
    },
  ]

  // 点击切换tab
  const handleModeChange = (e: any) => {
    setActiveKey(e)
    const url = items?.filter((i: any) => i.id === Number(e))[0]?.url
    navigate(url === '/Report/Review' ? '/Report/Review/List/1' : url)
  }

  useEffect(() => {
    if (currentMenu?.id && routerPath?.pathname && userInfo?.id) {
      let resultItems: any = []
      // 如果有第二级菜单显示
      if (routerPath?.pathname.includes('/ProjectDetail')) {
        // 显示项目下的菜单，例需求
        const resultMenu = [
          // { id: 'map', name: t('map'), url: '', isPermisson: true  },
          {
            id: 'iteration',
            name: t('iteration'),
            url: '',
            isPermisson:
              projectInfo?.projectPermissions?.filter((i: any) =>
                String(i.group_name).includes('迭代'),
              ).length > 0,
          },
          {
            id: 'demand',
            name: t('need'),
            url: '',
            isPermisson:
              projectInfo?.projectPermissions?.filter((i: any) =>
                String(i.group_name).includes('需求'),
              ).length > 0,
          },
          {
            id: 'defect',
            name: t('defect'),
            url: '',
            isPermisson:
              projectInfo?.projectPermissions?.filter((i: any) =>
                String(i.group_name).includes('缺陷'),
              ).length > 0,
          },
          {
            id: 'affairs',
            name: t('affairs'),
            url: '',
            isPermisson:
              projectInfo?.projectPermissions?.filter((i: any) =>
                String(i.group_name).includes('事务'),
              ).length > 0,
          },
          {
            id: 'sprint',
            name: t('sprint'),
            url: '',
            isPermisson:
              projectInfo?.projectPermissions?.filter((i: any) =>
                String(i.group_name).includes('冲刺'),
              ).length > 0,
          },
          {
            id: 'kanBan',
            name: 'Kanban',
            url: '',
            isPermisson:
              projectInfo?.projectPermissions?.filter((i: any) =>
                String(i.group_name).includes('Kanban'),
              ).length > 0,
          },
          // { id: 'gatte', name: t('ganttChart'), url: '', isPermisson: true  },
          {
            id: 'workTime',
            name: t('workingHours'),
            url: '',
            isPermisson: true,
          },
          { id: 'report', name: t('report'), url: '', isPermisson: true },
          {
            id: 'member',
            name: t('member'),
            url: '',
            isPermisson:
              projectInfo?.projectPermissions?.filter((i: any) =>
                String(i.identity).includes('b/project/member'),
              ).length > 0,
          },
          {
            id: 'set',
            name: t('setUp'),
            url: '',
            isPermisson:
              projectInfo?.projectPermissions?.filter((i: any) =>
                String(i.group_name).includes('项目设置'),
              ).length > 0,
          },
        ]
        resultItems = resultMenu?.filter((i: any) => i.isPermisson)
        setItems(resultItems)
      } else if (routerPath?.pathname.includes('/AdminManagement')) {
        // 后台管理的所有有权限的菜单
        const currentMenus: any = JSON.parse(
          JSON.stringify(currentMenu?.children || []),
        )
        // 所有菜单的地址
        const urls = currentMenus?.map((i: any) => i.url)
        side?.forEach((i: any) => {
          i.id =
            i.id ?? currentMenus?.filter((k: any) => k.url === i.url)[0]?.id
          i.isPermission = i.children
            ? [...new Set(urls)].filter((x: any) => new Set(i.children).has(x))
                ?.length > 0
            : urls.includes(i.url)
        })
        resultItems = side?.filter((i: any) => i.isPermission)
        setItems(resultItems)
      } else if (routerPath?.pathname.includes('/Statistics')) {
        const statisticsList = [
          {
            name: t('task'),
            id: 900,
            url: '/Statistics/Task',
            isPermission: true,
          },
          {
            name: t('company'),
            id: 605,
            url: '/Statistics/Company',
            isPermission:
              userInfo?.company_permissions?.filter((i: any) =>
                i.identity?.includes('b/company/statistics'),
              )?.length > 0,
          },
        ]
        resultItems = statisticsList?.filter((i: any) => i.isPermission)
        setItems(resultItems)
      } else if (currentMenu?.children?.length > 0) {
        resultItems = [...currentMenu?.children]
        setItems(resultItems)
      } else {
        setItems([])
      }
      // 数组中是否包含当期路由
      const currentHavePath = resultItems?.filter((i: any) =>
        routerPath?.pathname?.includes(i.url),
      )
      setActiveKey(
        currentHavePath?.length > 0
          ? String(currentHavePath[0]?.id)
          : String(resultItems[0]?.id),
      )
    }
  }, [currentMenu, routerPath, userInfo])

  return (
    <LayoutMenuWrap
      activeKey={activeKey}
      tabPosition="top"
      getPopupContainer={n => n}
      onChange={handleModeChange}
      width={props.width + 120}
      moreIcon={
        <MoreMenuWrap>
          <div>{t('more')}</div>
          <CommonIconFont type="down" size={16} />
        </MoreMenuWrap>
      }
      items={items.map((i: any) => {
        return {
          label: i.name,
          key: String(i.id),
        }
      })}
    />
  )
}

export default LayoutSecondaryMenu
