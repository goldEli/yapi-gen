import { useRoutes, Navigate } from 'react-router-dom'
import { Container } from '@/views/Container'
import React from 'react'
import Loading from '@/components/Loading'
import Login from '@/views/Login'

const lazy = (
  component: () => Promise<{
    default: any
  }>,
) => {
  const LazyComponent = React.lazy(component)
  return (
    <React.Suspense fallback={<Loading />}>
      <LazyComponent />
    </React.Suspense>
  )
}

const routes = [
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: '',
    element: <Container />,
    children: [
      {
        path: 'PrivatePermission',
        element: lazy(
          () => import('@/views/ProjectManagement/PrivatePermission'),
        ),
      },
      {
        path: '/Situation',
        element: lazy(() => import('@/views/Situation')),
      },
      {
        path: '/CalendarManager',
        element: lazy(() => import('@/views/CalendarPage')),
      },
      {
        path: '/ScheduleSearch',
        element: lazy(() => import('@/views/ScheduleSearch')),
      },
      {
        path: '/Report',
        element: lazy(() => import('@/views/WorkReport')),
        children: [
          {
            // 汇报
            path: 'Review',
            element: lazy(() => import('@/views/WorkReport/Review')),
            children: [
              {
                path: '',
                element: <Navigate to="/Report/Review/List/1" />,
              },
              {
                path: 'List/:id',
                element: lazy(
                  () => import('@/views/WorkReport/Review/components/List'),
                ),
              },
            ],
          },
          {
            path: 'Statistics',
            element: lazy(() => import('@/views/WorkReport/Statistics')),
          },
          {
            path: 'Formwork',
            element: lazy(() => import('@/views/WorkReport/Formwork')),
          },
          {
            path: 'xn',
            element: lazy(() => import('@/views/PerformanceInsight')),
          },
        ],
      },
      {
        path: '/ProjectManagement',
        element: lazy(() => import('@/views/ProjectManagement')),
        children: [
          {
            path: 'Project',
            element: lazy(() => import('@/views/Project')),
          },
          {
            path: 'Mine',
            element: lazy(() => import('@/views/Mine')),
            children: [
              {
                path: 'Agenda',
                element: lazy(() => import('@/views/Mine/Agenda')),
              },
              {
                path: 'Carbon',
                element: lazy(() => import('@/views/Mine/Carbon')),
              },
              {
                path: 'Create',
                element: lazy(() => import('@/views/Mine/Create')),
              },
              {
                path: 'Finished',
                element: lazy(() => import('@/views/Mine/Finished')),
              },
              {
                path: 'Examine',
                element: lazy(() => import('@/views/Mine/Examine')),
              },
              {
                path: 'Profile',
                element: lazy(() => import('@/views/Mine/Profile')),
              },
            ],
          },
          {
            path: 'Demand',
            element: lazy(() => import('@/views/Demand')),
          },
          {
            path: 'Iteration',
            element: lazy(() => import('@/views/Iteration')),
          },
          {
            path: 'ProjectSetting',
            element: lazy(() => import('@/views/ProjectSetting')),
          },
          {
            path: 'DemandSetting',
            element: lazy(() => import('@/views/DemandSetting')),
          },
          {
            path: 'WorkFlow',
            element: lazy(() => import('@/views/Workflow')),
          },
        ],
      },
      {
        path: 'SprintProjectManagement',
        element: lazy(() => import('@/views/SprintProjectManagement')),
        children: [
          {
            path: 'KanBan',
            element: lazy(() => import('@/views/SprintProjectKanBan')),
          },
          {
            path: 'SprintReport',
            element: lazy(() => import('@/views/SprintProjectReport')),
          },
          {
            path: 'Sprint',
            element: lazy(() => import('@/views/SprintProjectSprint')),
          },
          {
            path: 'Affair',
            element: lazy(() => import('@/views/SprintProjectAffair')),
          },
          {
            path: 'Setting',
            element: lazy(() => import('@/views/SprintProjectSetting')),
          },
          {
            path: 'DemandSetting',
            element: lazy(() => import('@/views/SprintProjectDemand')),
          },
        ],
      },
      {
        path: '/AdminManagement',
        element: lazy(() => import('@/views/AdminManagement')),
        children: [
          {
            path: 'CompanyInfo',
            element: lazy(() => import('@/views/AdminManagement/CompanyInfo')),
          },
          {
            path: 'StaffManagement',
            element: lazy(
              () => import('@/views/AdminManagement/StaffManagement'),
            ),
          },
          {
            path: 'TeamManagement',
            element: lazy(
              () => import('@/views/AdminManagement/TeamManagement'),
            ),
          },
          {
            path: 'PermissionManagement',
            element: lazy(
              () => import('@/views/AdminManagement/PermissionManagement'),
            ),
          },
          {
            path: 'WaterMarkManagement',
            element: lazy(
              () => import('@/views/AdminManagement/WaterMarkManagement'),
            ),
          },
          {
            path: 'OperationManagement',
            element: lazy(
              () => import('@/views/AdminManagement/OperationManagement'),
            ),
          },
          {
            path: 'LoginManagement',
            element: lazy(
              () => import('@/views/AdminManagement/LoginManagement'),
            ),
          },
        ],
      },
      {
        path: 'MemberInfo',
        element: lazy(() => import('@/views/MemberInfo')),
        children: [
          {
            path: 'Carbon',
            element: lazy(() => import('@/views/MemberInfo/Carbon')),
          },
          {
            path: 'Create',
            element: lazy(() => import('@/views/MemberInfo/Create')),
          },
          {
            path: 'Finished',
            element: lazy(() => import('@/views/MemberInfo/Finished')),
          },
          {
            path: 'Profile',
            element: lazy(() => import('@/views/MemberInfo/Profile')),
          },
        ],
      },
      {
        path: 'SiteNotifications',
        element: lazy(() => import('@/views/SiteNotifications')),
        children: [
          {
            path: 'Setting/:id',
            element: lazy(
              () => import('../views/SiteNotifications/Setting/index'),
            ),
          },
          {
            path: 'Email/:id',
            element: lazy(
              () => import('@/views/SiteNotifications/Email/index'),
            ),
          },
          {
            path: 'AllNote/:id',
            element: lazy(
              () => import('../views/SiteNotifications/AllNotes/index'),
            ),
          },
        ],
      },
    ],
  },
]

export default () => useRoutes(routes)
