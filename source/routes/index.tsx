import { Outlet, useRoutes } from 'react-router-dom'
import Home from '@/views/Home'
import Demo from '@/views/Demo'
import { Container } from '@/views/Container'
import React from 'react'

const lazy = (
  component: () => Promise<{
    default: React.ComponentType<unknown>
  }>,
) => {
  const LazyComponent = React.lazy(component)
  return (
    <React.Suspense fallback="...">
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
        path: '/staff',
        element: lazy(() => import('@/views/staff')),
      },
      {
        path: '/mine',
        element: lazy(() => import('@/views/Mine')),
        children: [
          {
            path: 'agenda',
            element: lazy(() => import('@/views/Mine/Agenda')),
          },
          {
            path: 'carbon',
            element: lazy(() => import('@/views/Mine/Carbon')),
          },
          {
            path: 'create',
            element: lazy(() => import('@/views/Mine/Create/index')),
          },
          {
            path: 'finished',
            element: lazy(() => import('@/views/Mine/Finished')),
          },
          {
            path: '',
            element: lazy(() => import('@/views/Mine/Profile')),
          },
        ],
      },
      {
        path: '/Project',
        element: lazy(() => import('@/views/Project')),
      },
      {
        path: '/Detail',
        element: lazy(() => import('@/views/Project/Detail')),
        children: [
          {
            path: 'Demand',
            element: lazy(() => import('@/views/Project/Detail/Demand')),
          },
          {
            path: 'Iteration',
            element: lazy(() => import('@/views/Project/Detail/Iteration')),
          },
          {
            path: 'Setting',
            element: lazy(() => import('@/views/Project/Detail/Setting')),
          },
        ],
      },
      {
        path: '',
        element: lazy(() => import('@/views/Situation')),
      },
      {
        path: '/Setting',
        element: lazy(() => import('@/views/Setting')),
        children: [
          {
            path: '',
            element: lazy(() => import('@/views/Setting/CompanyInfo')),
          },
          {
            path: 'permission',
            element: lazy(() => import('@/views/Setting/Permission')),
          },
          {
            path: 'operation',
            element: lazy(() => import('@/views/Setting/Operation')),
          },
          {
            path: 'loginLog',
            element: lazy(() => import('@/views/Setting/LoginLog')),
          },
        ],
      },
    ],
  },
 
]

export default () => useRoutes(routes)
