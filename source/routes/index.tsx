import { useRoutes } from 'react-router-dom'
import Home from '@/views/Home'
import Demo from '@/views/Demo'

const routes = [
  { path: '/', element: <Home /> },
  { path: '/Demo', element: <Demo /> }
]

export default () => useRoutes(routes)
