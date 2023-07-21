import React from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { css } from '@emotion/css'
import { encryptPhp } from '@/tools/cryptoPhp'
import { Breadcrumb } from 'antd'
import { useSelector } from '@store/index'
import { getParamsData } from '@/tools'
import CommonIconFont from './CommonIconFont'
import { t } from 'i18next'
import { useTranslation } from 'react-i18next'
interface IProps {
  item?: any
}
interface mapsInterface {
  [key: string]: string
}
const lastBreadcrumb = css``

const customBread = css`
  li a {
    color: var(--neutral-n1-d1) !important;
  }
  li:last-child a {
    color: var(--neutral-n3) !important;
    font-size: var(--font12) !important;
  }
`
const breadStyle = css`
  span {
    &:hover {
      text-decoration: underline !important;
      text-decoration-color: var(--neutral-n1-d1) !important;
      padding-bottom: 4px !important;
    }
  }
`
const CommonBreadCrumd: React.FC = (props: IProps) => {
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { type } = paramsData
  const [t] = useTranslation()
  const navigate = useNavigate()
  const projectInfo = useSelector(state => state.project.projectInfo)

  const maps: mapsInterface = {
    ProjectInfo: t('sprintProject.projectInformation'),
    ProjectMember: t('sprintProject.projectMember'),
    ProjectRole: t('sprintProject.projectRole'),
    ProjectNotify: t('sprintProject.notificationConfiguration'),
    ProjectKanBan: t('sprintProject.kanbanConfiguration'),
    ProjectHome: t('sprintProject.homeConfiguration'),
    ProjectAffair: t('newlyAdd.demandSet'),
    work: t('newlyAdd.demandSet'),
  }
  return (
    <Breadcrumb
      className={customBread}
      separator={
        <CommonIconFont type="right" size={14} color="var(--neutral-n1-d1)" />
      }
    >
      <Breadcrumb.Item>
        {' '}
        <a
          className={breadStyle}
          onClick={() => navigate('/ProjectManagement/Project')}
          style={{ color: 'var(--neutral-n1-d1)' }}
        >
          <span>{t('title.project') as string}</span>
        </a>
      </Breadcrumb.Item>
      {projectInfo.name ? (
        <Breadcrumb.Item>
          <a
            onClick={() => {
              const params = encryptPhp(JSON.stringify({ id: projectInfo.id }))
              navigate(`/SprintProjectManagement/Affair?data=${params}`)
            }}
            className={breadStyle}
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
      {(type === 'ProjectAffair' || type === 'work') && (
        <Breadcrumb.Item
          onClick={() => {
            const params = encryptPhp(
              JSON.stringify({
                id: projectInfo.id,
                pageIdx: 'info',
                type: 'ProjectInfo',
              }),
            )
            navigate(`/SprintProjectManagement/Setting?data=${params}`)
          }}
        >
          <a style={{ color: 'var(--neutral-n1-d1)' }}>
            {t('sprintProject.projectSettings')}
          </a>
        </Breadcrumb.Item>
      )}

      <Breadcrumb.Item
        onClick={() => {
          if (type === 'work') {
            navigate(-1)
          }
        }}
      >
        <a className={lastBreadcrumb}>{maps[type] || maps.ProjectInfo}</a>
      </Breadcrumb.Item>
      {type === 'work' && (
        <Breadcrumb.Item>
          <a className={lastBreadcrumb}>
            {t('sprintProject.configureWorkflow')}
          </a>
        </Breadcrumb.Item>
      )}

      {type === 'ProjectKanBan' ? (
        <Breadcrumb.Item>
          <a className={lastBreadcrumb}>
            {t('sprintProject.columnsAndStatus')}
          </a>
        </Breadcrumb.Item>
      ) : null}
    </Breadcrumb>
  )
}
export default CommonBreadCrumd
