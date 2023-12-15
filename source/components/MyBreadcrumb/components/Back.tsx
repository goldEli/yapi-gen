import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from '@store/index'
import { useTranslation } from 'react-i18next'
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
  '/ProjectDetail/IterationDetail',
]

const Back = (props: { headerParmas: boolean; onBackSecond(): void }) => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { userPreferenceConfig } = useSelector(store => store.user)
  const { isDetailScreenModal, projectInfo } = useSelector(
    store => store.project,
  )
  const { visible, params } = isDetailScreenModal
  const [html, setHtml] = useState<any>('')

  //   返回
  const onBack = useCallback(() => {
    const backUrl = localStorage.getItem('projectRouteDetail') || ''
    if (backUrl && userPreferenceConfig.previewModel === 2) {
      props?.onBackSecond()
    } else if (
      location.pathname === '/ProjectDetail/IterationDetail' &&
      urlAll.includes(location.pathname)
    ) {
      const params = encryptPhp(JSON.stringify({ id: projectInfo.id }))
      navigate(`/ProjectDetail/Iteration?data=${params}`)
    } else if (urlAll.includes(location.pathname) && props.headerParmas) {
      navigate('/Project')
    }
    localStorage.removeItem('projectRouteDetail')
  }, [])

  useEffect(() => {
    const backUrl = localStorage.getItem('projectRouteDetail') || ''
    if (
      (backUrl && userPreferenceConfig.previewModel === 2 && visible) ||
      (urlAll.includes(location.pathname) && props.headerParmas)
    ) {
      setHtml(
        <BackWrap onClick={onBack}>
          <div>
            <IconFont className="icon" type="return" />
            <span>{t('returnNew')}</span>
          </div>
          <span className="line" />
        </BackWrap>,
      )
      return
    }
    setHtml(<div />)
  }, [
    visible,
    location.pathname,
    localStorage.getItem('projectRouteDetail'),
    params,
  ])
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{html}</>
}
export default Back
