import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMemo, useCallback, useEffect, useState } from 'react'
import { setProjectInfo, setProjectInfoValues } from '@store/project'
import { useDispatch, useSelector } from '@store/index'
import { getProjectInfo, getProjectInfoValues } from '@/services/project'
import { saveScreenDetailModal } from '@store/project/project.thunk'
import useOpenDemandDetail from '@/hooks/useOpenDemandDetail'
import { encryptPhp } from '@/tools/cryptoPhp'

const BackWrap = styled.div`
  display: flex;
  align-items: baseline;
  div {
    display: flex;
    align-items: center;
    padding: 0 8px;
    height: 21px;
    border-radius: 4px;
    background: var(--selected);
    &:hover {
      background: var(--auxiliary-b6);
      cursor: pointer;
    }
  }
  div span {
    color: var(--primary-d1);
    padding-left: 2px;
    font-size: 12px;
  }
  .icon {
    font-size: 14px;
  }
  .line {
    display: inline-block;
    width: 1px;
    height: 12px;
    background: var(--neutral-n4);
    margin: 0 8px;
  }
`
// 冲刺和迭代的url
const urlAll = [
  '/ProjectDetail/Demand',
  '/ProjectDetail/Iteration',
  '/ProjectDetail/Defect',
  '/ProjectDetail/KanBan',
  '/ProjectDetail/Affair',
  '/ProjectDetail/Sprint',
  '/ProjectDetail/WorkHours',
  '/ProjectDetail/Performance',
  '/ProjectDetail/KanBan',
]

const Back = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const projectInfo = useSelector(state => state.project.projectInfo)
  const [openDemandDetail, closeScreenModal] = useOpenDemandDetail()
  const { userPreferenceConfig } = useSelector(store => store.user)
  const { isDetailScreenModal } = useSelector(store => store.project)
  const { visible, params } = isDetailScreenModal
  const [html, setHtml] = useState<any>('')

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

  // 关闭全屏详情弹层
  const onCloseModal = () => {
    dispatch(saveScreenDetailModal({ visible: false, params: {} }))
    closeScreenModal()
  }
  //   返回
  const onBack = useCallback(() => {
    const backUrl = localStorage.getItem('projectRouteDetail') || ''
    if (backUrl && userPreferenceConfig.previewModel === 2) {
      getInfo()
      onCloseModal()
      const params = encryptPhp(JSON.stringify({ id: projectInfo.id }))
      if (projectInfo.projectType === 1) {
        // 之前需求迭代跳转统一跳到了需求，需要区分迭代是迭代的，需求是需求的
        location.pathname.includes('/ProjectDetail/Iteration')
          ? navigate(`/ProjectDetail/Iteration?data=${params}`)
          : navigate(`/ProjectDetail/Demand?data=${params}`)
        return
      }
      navigate(`/ProjectDetail/Affair?data=${params}`)
    } else if (urlAll.includes(location.pathname)) {
      navigate('/Project')
    }
    localStorage.removeItem('projectRouteDetail')
  }, [])
  useEffect(() => {
    const backUrl = localStorage.getItem('projectRouteDetail') || ''
    if (backUrl && userPreferenceConfig.previewModel === 2 && visible) {
      setHtml(
        <BackWrap onClick={onBack}>
          <div>
            <IconFont className="icon" type="return" />
            <span>返回</span>
          </div>
          <span className="line" />
        </BackWrap>,
      )
      return
    } else if (urlAll.includes(location.pathname) && !backUrl && !visible) {
      setHtml(
        <BackWrap onClick={onBack}>
          <div>
            <IconFont className="icon" type="return" />
            <span>返回</span>
          </div>
          <span className="line" />
        </BackWrap>,
      )
      return
    }
    setHtml(<div />)
  }, [visible, location.pathname, localStorage.getItem('projectRouteDetail')])
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{html}</>
}
export default Back
