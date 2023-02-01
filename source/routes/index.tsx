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
        path: '/Project',
        element: lazy(() => import('@/views/Project')),
      },
    ],
  },
]

export default () => useRoutes(routes)
