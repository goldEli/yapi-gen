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
import { getProjectInfo, getProjectInfoValues } from '@/services/project'
import { setProjectInfo, setProjectInfoValues } from '@store/project'
import Back from './components/Back'
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
  const dispatch = useDispatch()

  // 关闭全屏详情弹层
  const onCloseModal = () => {
    dispatch(saveScreenDetailModal({ visible: false, params: {} }))
    closeScreenModal()
  }
  const getProjectInfoValuesData = async () => {
    const result = await getProjectInfoValues({ projectId: projectInfo.id })
    dispatch(setProjectInfoValues(result))
  }
  const getInfo = async () => {
    getProjectInfoValuesData()
    const result = await getProjectInfo({
      projectId: projectInfo.id,
      isBug: location.pathname.includes('/Defect') ? 1 : 2,
    })
    dispatch(setProjectInfo(result))
  }

  return (
    <div style={{display:'flex',alignItems:'align-items: baseline;'}}>
      <Back headerParmas={props.headerParmas || false}/>
    <Breadcrumb
      separator={
        <CommonIconFont type="right" size={14} color="var(--neutral-n1-d1)" />
      }
    >
      <Breadcrumb.Item>
        <a
          onClick={() => {
            onCloseModal()
            navigate('/Project')
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
              getInfo()
              const params = encryptPhp(JSON.stringify({ id: projectInfo.id }))
              onCloseModal()
              if (projectInfo.projectType === 1) {
                // 之前需求迭代跳转统一跳到了需求，需要区分迭代是迭代的，需求是需求的
                location.pathname.includes('/ProjectDetail/Iteration')
                  ? navigate(`/ProjectDetail/Iteration?data=${params}`)
                  : navigate(`/ProjectDetail/Demand?data=${params}`)
                return
              }
              navigate(`/ProjectDetail/Affair?data=${params}`)
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

      {type === 4 ? (
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

              navigate(`/ProjectDetail/Setting/ProjectInfo?data=${params}`)
            }}
            className={breadStyle}
            style={{ color: 'var(--neutral-n1-d1)' }}
          >
            <span>{t('project.projectSet') as string}</span>
          </a>
        </Breadcrumb.Item>
      ) : null}
      {location.pathname.includes('/ProjectDetail/Setting/') &&
      props.setName ? (
        <Breadcrumb.Item>{props.setName}</Breadcrumb.Item>
      ) : null}
      {location.pathname === '/ProjectDetail/Demand' && props.demand ? (
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
          <span>{props?.demand?.name}</span>
        </Breadcrumb.Item>
      ) : null}
      {location.pathname.includes('/ProjectDetail/MemberInfo/') &&
      props.user ? (
        <Breadcrumb.Item>
          <span>
            {props?.user?.name}
            {t('details_of')}
          </span>
        </Breadcrumb.Item>
      ) : null}
      {location.pathname.includes('/ProjectDetail/Setting/KanBanSettings') ? (
        <Breadcrumb.Item>
          <span>{t('other.colOrStatus')}</span>
        </Breadcrumb.Item>
      ) : null}
    </Breadcrumb>
    </div>
  )
}

export default MyBreadcrumb
