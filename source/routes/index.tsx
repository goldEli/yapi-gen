import { useRoutes } from 'react-router-dom'
import { Container } from '@/views/Container'
import React from 'react'
import Loading from '@/components/Loading'

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
        path: '/Report',
        element: lazy(() => import('@/views/Report')),
        children: [
          {
            path: 'Formwork',
            element: lazy(() => import('@/views/FormWork')),
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
            path: 'FormWork',
            element: lazy(() => import('@/views/FormWork')),
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
          {
            path: 'MemberInfo',
            element: lazy(() => import('@/views/FormWork')),
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
        ],
      },
      {
        path: 'SiteNotifications',
        element: lazy(() => import('@/views/SiteNotifications')),
        children: [
          {
            path: 'Setting',
            element: lazy(
              () => import('../views/SiteNotifications/Setting/index'),
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
      {
        path: '/LogManagement',
        element: lazy(() => import('@/views/LogManagement')),
        children: [
          {
            path: 'send/:id',
            element: lazy(() => import('@/views/LogManagement/Send')),
          },
          {
            path: 'get/:id',
            element: lazy(() => import('@/views/LogManagement/GetDaily')),
          },
        ],
      },
    ],
  },
]

export default () => useRoutes(routes)
