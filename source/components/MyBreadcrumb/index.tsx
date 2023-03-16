/* eslint-disable complexity */
import { encryptPhp } from '@/tools/cryptoPhp'
import { useSelector } from '@store/index'
import { Breadcrumb } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import CommonIconFont from '../CommonIconFont'
import IconFont from '../IconFont'

const MyBreadcrumb = (props: any) => {
  const navigate = useNavigate()
  const location = useLocation()
  const projectInfo = useSelector(state => state.project.projectInfo)

  return (
    <Breadcrumb
      separator={
        <CommonIconFont type="right" size={14} color="var(--neutral-n1-d1)" />
      }
    >
      <Breadcrumb.Item>
        <a
          onClick={() => navigate('/ProjectManagement/Project')}
          style={{ color: 'var(--neutral-n1-d1)' }}
        >
          项目
        </a>
      </Breadcrumb.Item>
      {projectInfo.name ? (
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
            <span style={{ color: 'var(--neutral-n1-d1)' }}>
              {projectInfo.name}
            </span>
          </a>
        </Breadcrumb.Item>
      ) : null}

      {location.pathname === '/ProjectManagement/ProjectSetting' && (
        <Breadcrumb.Item>
          <a
            onClick={() => {
              const params = encryptPhp(
                JSON.stringify({
                  id: projectInfo.id,
                  pageIdx: 'info',
                  type: 0,
                }),
              )
              navigate(`/ProjectManagement/ProjectSetting?data=${params}`)
            }}
            style={{ color: 'var(--neutral-n1-d1)' }}
          >
            项目设置
          </a>
        </Breadcrumb.Item>
      )}
      {location.pathname.includes('ProjectManagement/MemberInfo') && (
        <Breadcrumb.Item>
          <a style={{ color: 'var(--neutral-n1-d1)' }}>项目设置</a>
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
      {location.pathname.includes('ProjectManagement/MemberInfo') ||
      (location.pathname.includes('MemberInfo/Profile') && props.user) ? (
        <Breadcrumb.Item>
          <span>{props.user.name}的详情</span>
        </Breadcrumb.Item>
      ) : null}
    </Breadcrumb>
  )
}

export default MyBreadcrumb
