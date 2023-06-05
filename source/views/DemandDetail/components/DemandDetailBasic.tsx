import BasicDemand from '@/components/DemandDetailDrawer/BasicDemand'
import { getParamsData } from '@/tools'
import { useDispatch, useSelector } from '@store/index'
import { getAffairsInfo } from '@store/affairs/affairs.thunk'
import { useSearchParams } from 'react-router-dom'
import { BasicContent, BasicFooter, BasicWrap } from '../style'
import { CloseWrap } from '@/components/StyleCommon'
import CommonIconFont from '@/components/CommonIconFont'
import { Tooltip } from 'antd'

interface Props {
  onRef: any
}

const DemandDetailBasic = (props: Props) => {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { id, sprintId } = paramsData
  const { affairsInfo } = useSelector(store => store.affairs)
  // 更新详情
  const onUpdate = () => {
    dispatch(getAffairsInfo({ projectId: id, sprintId }))
  }

  // 跳转配置
  const onToConfig = () => {
    //
  }

  return (
    <BasicWrap ref={props.onRef}>
      <BasicContent>
        <BasicDemand
          onUpdate={onUpdate}
          detail={affairsInfo}
          isOpen
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

export default DemandDetailBasic
