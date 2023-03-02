import { encryptPhp } from '@/tools/cryptoPhp'
import { useSelector } from '@store/index'
import { Breadcrumb } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'

const MyBreadcrumb = (props: any) => {
  const navigate = useNavigate()
  const location = useLocation()
  const projectInfo = useSelector(state => state.project.projectInfo)

  return (
    <Breadcrumb separator=">">
      <Breadcrumb.Item>
        <a onClick={() => navigate('/ProjectManagement/Project')}>项目</a>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <a
          onClick={() => {
            const params = encryptPhp(JSON.stringify({ id: projectInfo.id }))
            navigate(`/ProjectManagement/Demand?data=${params}`)
          }}
        >
          <img
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '4px',
              marginRight: '4px',
              verticalAlign: 'middle',
            }}
            src={projectInfo.cover}
            alt=""
          />
          <span>{projectInfo.name}</span>
        </a>
      </Breadcrumb.Item>
      {location.pathname === '/ProjectManagement/ProjectSetting' && (
        <Breadcrumb.Item>
          <a>项目设置</a>
        </Breadcrumb.Item>
      )}
      {location.pathname === '/ProjectManagement/ProjectSetting' &&
      props.setName ? (
        <Breadcrumb.Item>{props.setName}</Breadcrumb.Item>
      ) : null}
      {location.pathname === '/ProjectManagement/Demand' && props.demand ? (
        <Breadcrumb.Item>
          <img
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '4px',
              marginRight: '4px',
              verticalAlign: 'middle',
            }}
            src={props.demand.cover}
            alt=""
          />
          <span>{props.demand.name}</span>
        </Breadcrumb.Item>
      ) : null}
    </Breadcrumb>
  )
}

export default MyBreadcrumb
