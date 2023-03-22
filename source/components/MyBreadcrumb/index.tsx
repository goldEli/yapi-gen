/* eslint-disable complexity */
import { encryptPhp } from '@/tools/cryptoPhp'
import { useSelector } from '@store/index'
import { Breadcrumb } from 'antd'
import { t } from 'i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import CommonIconFont from '../CommonIconFont'

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
          {t('title.project') as string}
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
                marginBottom: '4px',
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
            {t('project.projectSet') as string}
          </a>
        </Breadcrumb.Item>
      )}
      {location.pathname.includes('ProjectManagement/MemberInfo') && (
        <Breadcrumb.Item>
          <a style={{ color: 'var(--neutral-n1-d1)' }}>
            {t('project.projectSet') as string}
          </a>
        </Breadcrumb.Item>
      )}
      {location.pathname.includes('ProjectManagement/WorkFlow') && (
        <>
          <Breadcrumb.Item>
            <a
              style={{ color: 'var(--neutral-n1-d1)' }}
              onClick={() => navigate(-1)}
            >
              需求设置
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a style={{ color: 'var(--neutral-n3)' }}>配置工作流</a>
          </Breadcrumb.Item>
        </>
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
          <span>
            {props.user.name}
            {t('details_of')}
          </span>
        </Breadcrumb.Item>
      ) : null}
    </Breadcrumb>
  )
}

export default MyBreadcrumb
