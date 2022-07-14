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
        path: '/Project',
        element: lazy(() => import('@/views/Project')),
      },
      {
        path: '/Detail',
        element: lazy(() => import('@/views/Project/Detail')),
      },
    ],
  },
  { path: '/home', element: <Home /> },
  { path: '/Demo', element: <Demo /> },
]

export default () => useRoutes(routes)
