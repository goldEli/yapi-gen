import BasicDemand from '@/components/SprintDetailDrawer/component/BasicDemand'
import { getParamsData } from '@/tools'
import { useDispatch, useSelector } from '@store/index'
import { getAffairsInfo } from '@store/affairs/affairs.thunk'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { BasicContent, BasicFooter, BasicWrap } from '../style'
import { CloseWrap } from '@/components/StyleCommon'
import CommonIconFont from '@/components/CommonIconFont'
import { Tooltip } from 'antd'
import { encryptPhp } from '@/tools/cryptoPhp'
interface Props {
  onRef: any
}

const SprintDetailBasic = (props: Props) => {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { id, sprintId } = paramsData
  const { affairsInfo } = useSelector(store => store.affairs)
  const navigate = useNavigate()
  // 更新详情
  const onUpdate = () => {
    dispatch(getAffairsInfo({ projectId: id, sprintId }))
  }

  // 跳转配置
  const onToConfig = () => {
    console.log(111)
    //
    const params = encryptPhp(
      JSON.stringify({
        type: 'sprint',
        id: 631,
        categoryName: '需求',
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
          <div>已创建：5天</div>
          <span>更新日期：4分钟前</span>
        </div>
        <Tooltip title="配置字段">
          <CloseWrap width={32} height={32} onClick={onToConfig}>
            <CommonIconFont type="settings" />
          </CloseWrap>
        </Tooltip>
      </BasicFooter>
    </BasicWrap>
  )
}

export default SprintDetailBasic
