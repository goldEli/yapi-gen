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
            element: lazy(() => import('@/views/Project')),
          },
          {
            path: 'StaffManagement',
            element: lazy(() => import('@/views/Demand')),
          },
          {
            path: 'TeamManagement',
            element: lazy(() => import('@/views/Iteration')),
          },
          {
            path: 'PermissionManagement',
            element: lazy(() => import('@/views/ProjectSetting')),
          },
          {
            path: 'WaterMarkManagement',
            element: lazy(() => import('@/views/ProjectSetting')),
          },
          {
            path: 'OperationManagement',
            element: lazy(() => import('@/views/ProjectSetting')),
          },
          {
            path: 'LoginManagement',
            element: lazy(() => import('@/views/ProjectSetting')),
          },
        ],
      },
      {
        path: '/LogManagement',
        element: lazy(() => import('@/views/LogManagement')),
      },
    ],
  },
]

export default () => useRoutes(routes)
