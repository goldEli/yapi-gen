import BasicDemand from '@/components/SprintDetailDrawer/component/BasicDemand'
import { detailTimeFormat, getParamsData } from '@/tools'
import { useDispatch, useSelector } from '@store/index'
import { getAffairsInfo } from '@store/affairs/affairs.thunk'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { BasicContent, BasicFooter, BasicWrap } from '../style'
import { CloseWrap } from '@/components/StyleCommon'
import CommonIconFont from '@/components/CommonIconFont'
import { Tooltip } from 'antd'
import { encryptPhp } from '@/tools/cryptoPhp'
import { setActiveCategory } from '@store/category'
import { useTranslation } from 'react-i18next'
interface Props {
  onRef: any
}

const SprintDetailBasic = (props: Props) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { id } = paramsData
  const { affairsInfo } = useSelector(store => store.affairs)
  const navigate = useNavigate()
  // 更新详情
  const onUpdate = () => {
    // dispatch(getAffairsInfo({ projectId: id, sprintId: affairsInfo.id || 0 }))
  }

  // 跳转配置
  const onToConfig = () => {
    dispatch(setActiveCategory({}))
    const params = encryptPhp(
      JSON.stringify({
        type: 'sprint',
        id: id,
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

export default SprintDetailBasic
