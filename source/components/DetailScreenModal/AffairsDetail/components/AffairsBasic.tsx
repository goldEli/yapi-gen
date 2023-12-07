import { useDispatch, useSelector } from '@store/index'
import { useTranslation } from 'react-i18next'
import { BasicContent, BasicFooter, BasicWrap } from '../style'
import { detailTimeFormat } from '@/tools'
import { Tooltip } from 'antd'
import { CloseWrap, ConfigWrap } from '@/components/StyleCommon'
import CommonIconFont from '@/components/CommonIconFont'
import { useNavigate } from 'react-router-dom'
import { getAffairsInfo } from '@store/affairs/affairs.thunk'
import { setIsUpdateChangeLog } from '@store/project'
import { setActiveCategory } from '@store/category'
import { encryptPhp } from '@/tools/cryptoPhp'
import BasicDemand from '@/components/SprintDetailDrawer/component/BasicDemand'
import { saveScreenDetailModal } from '@store/project/project.thunk'
import useOpenDemandDetail from '@/hooks/useOpenDemandDetail'

interface Props {
  onRef: any
  employeeCurrentId?: number
}

const AffairsBasic = (props: Props) => {
  const { userPreferenceConfig } = useSelector(store => store.user)
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { affairsInfo } = useSelector(store => store.affairs)
  const { projectInfo } = useSelector(store => store.project)

  // 不能删除open方法
  const [openDemandDetail, closeScreenModal] = useOpenDemandDetail()

  // 更新详情
  const onUpdate = () => {
    dispatch(
      getAffairsInfo({
        projectId: projectInfo.id,
        sprintId: affairsInfo.id || 0,
      }),
    )
    dispatch(setIsUpdateChangeLog(true))
  }

  // 跳转配置
  const onToConfig = () => {
    dispatch(setActiveCategory({}))
    dispatch(saveScreenDetailModal({ visible: false, params: {} }))
    closeScreenModal()
    const params = encryptPhp(
      JSON.stringify({
        id: projectInfo.id,
        categoryItem: {
          id: affairsInfo.category,
          status: affairsInfo.category_status,
        },
      }),
    )
    navigate(`/ProjectDetail/Setting/TypeConfiguration?data=${params}`)
  }

  return (
    <BasicWrap
      a={
        userPreferenceConfig.previewModel === 3 ||
        (props?.employeeCurrentId || 0) > 0
      }
      b={affairsInfo?.isExamine}
      ref={props.onRef}
    >
      <BasicContent>
        <BasicDemand
          onUpdate={onUpdate}
          detail={affairsInfo}
          isOpen
          hasPadding
          isInfoPage
          isPreview={(props?.employeeCurrentId || 0) > 0}
        />
      </BasicContent>
      <BasicFooter>
        <div className="textBox">
          <div>
            {t('created')}
            {detailTimeFormat(affairsInfo.createdTime as string)}
          </div>
          <span>
            {t('updated')}
            {detailTimeFormat(affairsInfo.update_at as string)}
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

export default AffairsBasic
