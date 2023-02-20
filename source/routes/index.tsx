import { Navigate, useRoutes } from 'react-router-dom'
import { Container } from '@/views/Container'
import React from 'react'
import Loading from '@/components/Loading'

const lazy = (
  component: () => Promise<{
    default: React.ComponentType<unknown>
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
        path: '/',
        element: <Navigate to="/Project" />,
      },
      {
        path: '/Situation',
        element: lazy(() => import('@/views/Situation')),
      },
      {
        path: '/ProjectManagement',
        element: lazy(() => import('@/views/ProjectManagement')),
        children: [
          {
            path: 'Project',
            element: lazy(() => import('@/views/Project')),
            children: [
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
            ],
          },
          {
            path: 'Mine',
            element: lazy(() => import('@/views/Mine')),
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
        path: '/LogManagement',
        element: lazy(() => import('@/views/LogManagement')),
      },
      {
        path: '/project-management-optimization',
        element: lazy(() => import('@/views/TestPage')),
      },
    ],
  },
]

export default () => useRoutes(routes)
