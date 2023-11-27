/* eslint-disable no-lonely-if */
import CommonIconFont from '@/components/CommonIconFont'
import { LayoutMenuWrap, MoreMenuWrap } from '../style'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from '@store/index'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
import { setIterateInfo } from '@store/iterate'
import {
  getProjectInfoStore,
  getProjectInfoValuesStore,
  saveScreenDetailModal,
} from '@store/project/project.thunk'

const LayoutSecondaryMenu = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const routerPath = useLocation()
  const [searchParams] = useSearchParams()

  const { layoutSecondaryMenuLeftWidth, layoutSecondaryMenuRightWidth } =
    useSelector(store => store.global)
  const { currentMenu, userInfo } = useSelector(store => store.user)
  const { projectInfo } = useSelector(store => store.project)
  const [items, setItems] = useState<any>([])
  const [paramsData, setParamsData] = useState<any>({})
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
    dispatch(saveScreenDetailModal({ visible: false, params: {} }))
    setActiveKey(e)
    // 匹配跳转的数据
    const currentObj = items?.filter(
      (i: any) => i.id === Number(e) || i.id === e,
    )
    const url = currentObj[0]?.url
    let resultUrl: any
    if (url === '/Report/Review') {
      resultUrl = '/Report/Review/List/1'
    } else if (
      paramsData?.id &&
      routerPath?.pathname.includes('/ProjectDetail')
    ) {
      dispatch(setIterateInfo({}))
      const newParamsData = {
        ...paramsData,
        ...{ isOpenScreenDetail: false },
      }
      const params = encryptPhp(JSON.stringify(newParamsData))
      dispatch(getProjectInfoStore({ projectId: paramsData?.id }))
      dispatch(getProjectInfoValuesStore({ projectId: paramsData?.id }))
      resultUrl = `${url}?data=${params}`
    } else {
      // 特殊处理下后台管理跳转地址
      resultUrl =
        url?.includes('/AdminManagement') && currentObj[0]?.children?.length > 0
          ? String(currentObj[0]?.children[0])?.replace('/AdminManagement', url)
          : url
    }
    navigate(resultUrl)
  }

  useEffect(() => {
    let resultItems: any = []
    if (currentMenu?.id && routerPath?.pathname && userInfo?.id) {
      if (
        (projectInfo?.id && routerPath?.pathname.includes('/ProjectDetail')) ||
        // 特殊处理老路由 !!!!!
        (projectInfo?.id &&
          routerPath?.pathname.includes('/SprintProjectManagement')) ||
        (projectInfo?.id && routerPath?.pathname.includes('/ProjectManagement'))
      ) {
        setParamsData(getParamsData(searchParams))
        // 显示项目下的菜单，例需求 oldKey 是特殊处理老路由得key
        const resultMenu = [
          // { id: 'map', name: t('map'), url: '', isPermisson: true  },
          {
            id: 'iteration',
            oldKey: 'Iteration',
            name: t('sprintProject.iteration'),
            url: '/ProjectDetail/Iteration',
            isPermisson:
              projectInfo?.projectPermissions?.filter((i: any) =>
                String(i.group_name).includes('迭代'),
              ).length > 0,
          },
          {
            id: 'demand',
            oldKey: 'Demand',
            name: t('need'),
            url: '/ProjectDetail/Demand',
            isPermisson:
              projectInfo?.projectPermissions?.filter((i: any) =>
                String(i.group_name).includes('需求'),
              ).length > 0,
          },
          {
            id: 'defect',
            oldKey: 'Defect',
            name: t('defect1'),
            url: '/ProjectDetail/Defect',
            isPermisson:
              projectInfo?.projectPermissions?.filter((i: any) =>
                String(i.group_name).includes('缺陷'),
              ).length > 0,
          },
          {
            id: 'affairs',
            oldKey: 'Affair',
            name: t('affairs'),
            url: '/ProjectDetail/Affair',
            isPermisson:
              projectInfo?.projectPermissions?.filter((i: any) =>
                String(i.group_name).includes('事务'),
              ).length > 0,
          },
          {
            id: 'sprint',
            oldKey: 'Sprint',
            name: t('sprint2'),
            url: '/ProjectDetail/Sprint',
            isPermisson:
              projectInfo?.projectPermissions?.filter((i: any) =>
                String(i.group_name).includes('冲刺'),
              ).length > 0,
          },
          {
            id: 'kanBan',
            name: 'Kanban',
            url: '/ProjectDetail/KanBan',
            isPermisson:
              projectInfo?.projectPermissions?.filter((i: any) =>
                String(i.group_name).includes('Kanban'),
              ).length > 0,
          },
          // { id: 'gatte', name: t('ganttChart'), url: '', isPermisson: true  },
          {
            id: 'workTime',
            name: t('workingHours'),
            url: '/ProjectDetail/WorkHours',
            isPermisson: true,
          },
          {
            id: 'report',
            name: t('version2.report'),
            url: '/ProjectDetail/Performance',
            isPermisson: true,
          },
          {
            id: 'member',
            name: t('member'),
            url: '/ProjectDetail/Member',
            isPermisson:
              projectInfo?.projectPermissions?.filter((i: any) =>
                String(i.identity).includes('b/project/member'),
              ).length > 0,
          },
          {
            id: 'set',
            oldKey: 'Setting',
            name: t('setUp'),
            url: '/ProjectDetail/Setting/ProjectInfo',
            isPermisson:
              projectInfo?.projectPermissions?.filter((i: any) =>
                String(i.group_name).includes('项目设置'),
              ).length > 0,
          },
        ]

        resultItems = resultMenu?.filter((i: any) => i.isPermisson)
        setItems(resultItems)
      } else {
        if (routerPath?.pathname.includes('/AdminManagement')) {
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
              ? [...new Set(urls)].filter((x: any) =>
                  new Set(i.children).has(x),
                )?.length > 0
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
      }
      // 数组中是否包含当期路由
      let currentHavePath: any
      if (routerPath?.pathname.includes('/ChildLevel')) {
        currentHavePath = resultItems?.filter((i: any) => i.id === 'report')
      } else if (routerPath?.pathname.includes('/ProjectDetail/MemberInfo')) {
        currentHavePath = resultItems?.filter((i: any) => i.id === 'member')
      } else {
        currentHavePath = resultItems?.filter(
          (i: any) =>
            routerPath?.pathname?.includes(i.url) ||
            // 特殊处理老路由 !!!!!
            routerPath?.pathname?.includes(i.oldKey),
        )
      }
      setActiveKey(
        currentHavePath?.length > 0 ? String(currentHavePath[0]?.id) : '0',
      )
    }
  }, [currentMenu, routerPath, userInfo, projectInfo])

  return (
    <LayoutMenuWrap
      style={{
        width:
          layoutSecondaryMenuLeftWidth && layoutSecondaryMenuRightWidth
            ? `calc(100% - ${
                layoutSecondaryMenuLeftWidth +
                layoutSecondaryMenuRightWidth +
                120
              }px)`
            : 'auto',
      }}
      activeKey={activeKey}
      tabPosition="top"
      getPopupContainer={n => n}
      onChange={handleModeChange}
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
