/* eslint-disable complexity */
import { encryptPhp } from '@/tools/cryptoPhp'
import { useSelector, useDispatch } from '@store/index'
import { Breadcrumb } from 'antd'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import CommonIconFont from '../CommonIconFont'
import { getParamsData } from '@/tools'
import { useTranslation } from 'react-i18next'
import { css } from '@emotion/css'
import useOpenDemandDetail from '@/hooks/useOpenDemandDetail'
import { saveScreenDetailModal } from '@store/project/project.thunk'
const breadStyle = css`
  span {
    &:hover {
      text-decoration: underline !important;
      text-decoration-color: var(--neutral-n1-d1) !important;
      padding-bottom: 4px !important;
    }
  }
`
const MyBreadcrumb = (props: any) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [t] = useTranslation()
  const projectInfo = useSelector(state => state.project.projectInfo)
  // 不能删除open方法
  const [openDemandDetail, closeScreenModal] = useOpenDemandDetail()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { type } = paramsData ?? {}
  console.log('yyyyyy----', type)
  const dispatch = useDispatch()

  // 关闭全屏详情弹层
  const onCloseModal = () => {
    dispatch(saveScreenDetailModal({ visible: false, params: {} }))
    closeScreenModal()
  }

  return type === 'AdminManagement' ? (
    <Breadcrumb
      separator={
        <CommonIconFont type="right" size={14} color="var(--neutral-n1-d1)" />
      }
    >
      <Breadcrumb.Item>
        <a
          style={{ color: 'var(--neutral-n1-d1)' }}
          onClick={() => navigate('/AdminManagement/StaffManagement')}
          className={breadStyle}
        >
          <span> {t('staff.companyStaff')}</span>
        </a>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <span>
          {props.user.name}
          {t('details_of')}
        </span>
      </Breadcrumb.Item>
    </Breadcrumb>
  ) : (
    <Breadcrumb
      separator={
        <CommonIconFont type="right" size={14} color="var(--neutral-n1-d1)" />
      }
    >
      <Breadcrumb.Item>
        <a
          onClick={() => {
            onCloseModal()
            navigate('/ProjectManagement/Project')
          }}
          style={{ color: 'var(--neutral-n1-d1)' }}
          className={breadStyle}
        >
          <span>{t('title.project') as string}</span>
        </a>
      </Breadcrumb.Item>
      {projectInfo.name ? (
        <Breadcrumb.Item>
          <a
            className={breadStyle}
            onClick={() => {
              const params = encryptPhp(JSON.stringify({ id: projectInfo.id }))
              onCloseModal()
              if (projectInfo.projectType === 1) {
                // 之前需求迭代跳转统一跳到了需求，需要区分迭代是迭代的，需求是需求的
                location.pathname.includes('/ProjectManagement/Iteration')
                  ? navigate(`/ProjectManagement/Iteration?data=${params}`)
                  : navigate(`/ProjectManagement/Demand?data=${params}`)
                return
              }
              navigate(`/SprintProjectManagement/Affair?data=${params}`)
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

      {type === 4 ||
        (type === 'isMember' && (
          <Breadcrumb.Item>
            <a
              onClick={() => {
                const params = encryptPhp(
                  JSON.stringify({
                    id: projectInfo.id,
                    pageIdx: 'main',
                    type: 0,
                  }),
                )

                navigate(`/ProjectManagement/ProjectSetting?data=${params}`)
              }}
              className={breadStyle}
              style={{ color: 'var(--neutral-n1-d1)' }}
            >
              <span>{t('project.projectSet') as string}</span>
            </a>
          </Breadcrumb.Item>
        ))}
      {location.pathname.includes('ProjectManagement/MemberInfo') && (
        <Breadcrumb.Item>
          <a style={{ color: 'var(--neutral-n1-d1)' }} className={breadStyle}>
            <span>{t('project.projectSet') as string}</span>
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
              {/* {t('sprintProject.demandSetting') as string} */}
              {t('newlyAdd.demandSet') as string}
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a style={{ color: 'var(--neutral-n3)' }}>
              {' '}
              {t('sprintProject.configureWorkflow') as string}
            </a>
          </Breadcrumb.Item>
        </>
      )}
      {location.pathname === '/ProjectManagement/ProjectSetting' &&
      props.setName ? (
        <Breadcrumb.Item> {props.setName}</Breadcrumb.Item>
      ) : null}
      {location.pathname === '/ProjectManagement/Demand' && props.demand ? (
        <Breadcrumb.Item>
          <img
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '4px',
              marginRight: '4px',
              marginBottom: '4px',
              verticalAlign: 'middle',
            }}
            src={props.demand.cover}
            alt=""
          />
          <span>{props.demand.name}</span>
        </Breadcrumb.Item>
      ) : null}
      {location.pathname.includes('/MemberInfo') ||
      (location.pathname.includes('MemberInfo/Profile') && props.user) ? (
        <Breadcrumb.Item>
          <span>
            {props.user.name}
            {t('details_of')}
          </span>
        </Breadcrumb.Item>
      ) : null}
      {type === 5 ? (
        <Breadcrumb.Item>
          <span>{t('other.colOrStatus')}</span>
        </Breadcrumb.Item>
      ) : null}
    </Breadcrumb>
  )
}

export default MyBreadcrumb
