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
const lastBreadcrumb = css`
  color: var(--neutral-n3) !important;
  font-size: var(--font12) !important;
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
    ProjectAffair: t('sprintProject.transactionType'),
  }
  return (
    <Breadcrumb
      separator={
        <CommonIconFont type="right" size={14} color="var(--neutral-n1-d1)" />
      }
    >
      <Breadcrumb.Item>
        {' '}
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
      {type === 'ProjectAffair' && (
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
          <a>{t('sprintProject.projectSettings')}</a>
        </Breadcrumb.Item>
      )}

      <Breadcrumb.Item>
        <a className={lastBreadcrumb}>{maps[type] || maps.ProjectInfo}</a>
      </Breadcrumb.Item>
      {type === 'ProjectKanBan' ? (
        <Breadcrumb.Item>
          <a className={lastBreadcrumb}>列与状态</a>
        </Breadcrumb.Item>
      ) : null}
    </Breadcrumb>
  )
}
export default CommonBreadCrumd
