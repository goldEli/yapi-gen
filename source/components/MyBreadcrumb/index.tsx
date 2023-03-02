import { Breadcrumb } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'

const MyBreadcrumb = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Breadcrumb>
      <Breadcrumb.Item>项目</Breadcrumb.Item>
      <Breadcrumb.Item>
        <a onClick={() => navigate('/ProjectManagement/Project')}>项目名称</a>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <a>项目设置</a>
      </Breadcrumb.Item>
      <Breadcrumb.Item>An Application</Breadcrumb.Item>
    </Breadcrumb>
  )
}

export default MyBreadcrumb
