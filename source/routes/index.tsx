import { useRoutes } from 'react-router-dom'
import Home from '@/views/Home'
import Demo from '@/views/Demo'
import Project from '@/views/Project'
import Yangyi from '@/views/Yangyi'

const routes = [
  { path: '/', element: <Home /> },
  { path: '/Demo', element: <Demo /> },
  { path: '/Project', element: <Project /> },
  { path: '/Yangyi', element: <Yangyi /> },
]

export default () => useRoutes(routes)
