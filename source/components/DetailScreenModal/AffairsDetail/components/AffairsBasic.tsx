import { useDispatch, useSelector } from '@store/index'
import { useTranslation } from 'react-i18next'
import { BasicContent, BasicFooter, BasicWrap } from '../style'
import { detailTimeFormat, getProjectIdByUrl } from '@/tools'
import { Tooltip } from 'antd'
import { CloseWrap } from '@/components/StyleCommon'
import CommonIconFont from '@/components/CommonIconFont'
import { useNavigate } from 'react-router-dom'
import { getAffairsInfo } from '@store/affairs/affairs.thunk'
import { setIsUpdateChangeLog } from '@store/project'
import { setActiveCategory } from '@store/category'
import { encryptPhp } from '@/tools/cryptoPhp'
import BasicDemand from '@/components/SprintDetailDrawer/component/BasicDemand'

interface Props {
  onRef: any
}

const AffairsBasic = (props: Props) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { affairsInfo } = useSelector(store => store.affairs)

  // 更新详情
  const onUpdate = () => {
    dispatch(
      getAffairsInfo({
        projectId: getProjectIdByUrl(),
        sprintId: affairsInfo.id || 0,
      }),
    )
    dispatch(setIsUpdateChangeLog(true))
  }

  // 跳转配置
  const onToConfig = () => {
    dispatch(setActiveCategory({}))
    const params = encryptPhp(
      JSON.stringify({
        type: 'sprint',
        id: getProjectIdByUrl(),
        categoryItem: {
          id: affairsInfo.category,
          status: affairsInfo.category_status,
        },
      }),
    )
    navigate(`/SprintProjectManagement/DemandSetting?data=${params}`)
  }

  return (
    <BasicWrap ref={props.onRef}>
      <BasicContent>
        <BasicDemand
          onUpdate={onUpdate}
          detail={affairsInfo}
          isOpen
          hasPadding
          isInfoPage
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
        <Tooltip title={t('configurationFields')}>
          <CloseWrap width={32} height={32} onClick={onToConfig}>
            <CommonIconFont type="settings" />
          </CloseWrap>
        </Tooltip>
      </BasicFooter>
    </BasicWrap>
  )
}

export default AffairsBasic
