import useOpenDemandDetail from '@/hooks/useOpenDemandDetail'
import { encryptPhp } from '@/tools/cryptoPhp'
import { setActiveCategory } from '@store/category'
import { getFlawInfo } from '@store/flaw/flaw.thunk'
import { useDispatch, useSelector } from '@store/index'
import { setIsUpdateChangeLog } from '@store/project'
import { saveScreenDetailModal } from '@store/project/project.thunk'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { detailTimeFormat } from '@/tools'
import CommonIconFont from '@/components/CommonIconFont'
import { ConfigWrap } from '@/components/StyleCommon'
import { BasicContent, BasicFooter, BasicWrap } from '../../AffairsDetail/style'
import BasicDemand from '@/components/FlawDetailDrawer/component/BasicDemand'

interface Props {
  onRef?: any
  employeeCurrentId?: number
  detail?: any
}

const FlawBasic = (props: Props) => {
  const { userPreferenceConfig } = useSelector(store => store.user)
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { projectInfo } = useSelector(store => store.project)

  // 不能删除open方法
  const [openDemandDetail, closeScreenModal] = useOpenDemandDetail()

  // 更新详情
  const onUpdate = () => {
    dispatch(getFlawInfo({ projectId: projectInfo?.id, id: props?.detail?.id }))
    dispatch(setIsUpdateChangeLog(true))
  }

  // 跳转配置
  const onToConfig = () => {
    dispatch(setActiveCategory({}))
    dispatch(saveScreenDetailModal({ visible: false, params: {} }))
    closeScreenModal()
    const params = encryptPhp(
      JSON.stringify({
        id: projectInfo?.id,
        categoryItem: {
          id: props?.detail?.category,
          status: props?.detail?.category_status,
        },
      }),
    )
    navigate(`/ProjectDetail/Setting/TypeConfiguration?data=${params}`)
  }

  // 高度计算
  const a1 = props?.detail?.isExamine ? 72 : 65
  const a2 = props?.detail?.isExamine ? 78 : 98
  const a3 = props?.detail?.isExamine ? 48 : 0
  const result =
    (props?.employeeCurrentId || 0) > 0
      ? a1
      : userPreferenceConfig.previewModel === 3
        ? a2
        : a3

  const aa = props?.detail?.id ? result : 78

  return (
    <BasicWrap height={aa} ref={props.onRef}>
      <BasicContent>
        <BasicDemand
          onUpdate={onUpdate}
          detail={props?.detail}
          hasPadding
          isInfoPage
          isPreview={(props?.employeeCurrentId || 0) > 0}
        />
      </BasicContent>
      <BasicFooter>
        <div className="textBox">
          <div>
            {t('created')}
            {detailTimeFormat(props?.detail?.createdTime as string)}
          </div>
          <span>
            {t('updated')}
            {detailTimeFormat(props?.detail?.update_at as string)}
          </span>
        </div>
        {!props?.employeeCurrentId && (
          <ConfigWrap onClick={onToConfig}>
            <CommonIconFont type="settings" />
            <div>{t('configurationFields')}</div>
          </ConfigWrap>
        )}
      </BasicFooter>
    </BasicWrap>
  )
}

export default FlawBasic
