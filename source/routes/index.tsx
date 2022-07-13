import { useRoutes } from 'react-router-dom'
import Home from '@/views/Home'
import Demo from '@/views/Demo'
import Project from '@/views/Project'

const routes = [
  { path: '/', element: <Home /> },
  { path: '/Demo', element: <Demo /> },
  { path: '/Project', element: <Project /> },
]

export default () => useRoutes(routes)
