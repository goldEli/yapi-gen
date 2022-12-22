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
        element: <Navigate to="/staff" />,
      },
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
            path: 'examine',
            element: lazy(() => import('@/views/Mine/Examine')),
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
        path: 'PrivatePermission',
        element: lazy(
          () => import('@/views/Project/Detail/components/PrivatePermission'),
        ),
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
            path: 'Set',
            element: lazy(() => import('@/views/Project/Detail/Setting')),
          },
          {
            path: 'MemberInfo',
            element: lazy(() => import('@/views/MemberInfo')),
            children: [
              {
                path: 'carbon',
                element: lazy(() => import('@/views/MemberInfo/Carbon')),
              },
              {
                path: 'create',
                element: lazy(() => import('@/views/MemberInfo/Create')),
              },
              {
                path: 'finished',
                element: lazy(() => import('@/views/MemberInfo/Finished')),
              },
              {
                path: 'profile',
                element: lazy(() => import('@/views/MemberInfo/Profile')),
              },
            ],
          },
          {
            path: 'Defect',
            element: lazy(() => import('@/views/Project/Detail/Defect')),
          },
          {
            path: 'Report',
            element: lazy(() => import('@/views/Project/Detail/Report')),
          },
        ],
      },
      {
        path: '/Situation',
        element: lazy(() => import('@/views/Situation')),
      },
      {
        path: '/Information',
        element: lazy(() => import('@/views/Information')),
        children: [
          {
            path: 'send/:id',
            element: lazy(() => import('@/views/Information/Send')),
          },
          {
            path: 'get/:id',
            element: lazy(() => import('@/views/Information/GetDaily')),
          },
        ],
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
          {
            path: 'universal',
            element: lazy(() => import('@/views/Setting/Universal')),
          },
        ],
      },
      {
        path: 'MemberInfo',
        element: lazy(() => import('@/views/MemberInfo')),
        children: [
          {
            path: 'carbon',
            element: lazy(() => import('@/views/MemberInfo/Carbon')),
          },
          {
            path: 'create',
            element: lazy(() => import('@/views/MemberInfo/Create')),
          },
          {
            path: 'finished',
            element: lazy(() => import('@/views/MemberInfo/Finished')),
          },
          {
            path: 'profile',
            element: lazy(() => import('@/views/MemberInfo/Profile')),
          },
        ],
      },
    ],
  },
]

export default () => useRoutes(routes)
