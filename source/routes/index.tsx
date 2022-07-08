import { useRoutes } from 'react-router-dom'
import About from '@/views/About'
import Home from '@/views/Home'

const routes = [
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
]

export default () => useRoutes(routes)
