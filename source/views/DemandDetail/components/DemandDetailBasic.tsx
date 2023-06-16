import BasicDemand from '@/components/DemandDetailDrawer/BasicDemand'
import { detailTimeFormat, getParamsData } from '@/tools'
import { useDispatch, useSelector } from '@store/index'
import { getAffairsInfo } from '@store/affairs/affairs.thunk'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { BasicContent, BasicFooter, BasicWrap, TitleWrap } from '../style'
import { CloseWrap } from '@/components/StyleCommon'
import CommonIconFont from '@/components/CommonIconFont'
import { Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getDemandInfo } from '@store/demand/demand.thunk'
import { getCommentList } from '@/services/demand'
import { changeRestScroll } from '@store/scroll'
import DemandComment from '@/components/DemandDetailDrawer/DemandComment'
import moment from 'moment'
import { encryptPhp } from '@/tools/cryptoPhp'
interface Props {
  onRef: any
}

const DemandDetailBasic = (props: Props) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { id, demandId } = paramsData
  const { demandInfo } = useSelector(store => store.demand)
  const isRest = useSelector(store => store.scroll.isRest)
  const [activeTabs, setActiveTabs] = useState(1)
  const [commentTotal, setCommentTotal] = useState(0)

  // 更新详情
  const onUpdate = () => {
    dispatch(getDemandInfo({ projectId: id, id: demandId }))
  }

  // 跳转配置
  const onToConfig = () => {
    //
    const params = encryptPhp(
      JSON.stringify({
        type: 4,
        id: id,
        categoryName: '特效',
        pageIdx: 'DemandDetail',
      }),
    )
    navigate(`/ProjectManagement/ProjectSetting?data=${params}`)
  }

  const getList = async () => {
    const result = await getCommentList({
      projectId: id,
      demandId,
      page: 1,
      pageSize: 999,
    })
    setCommentTotal(result?.list?.length)
  }

  useEffect(() => {
    getList()
  }, [])

  const onScrollBottom = () => {
    dispatch(changeRestScroll(false))
  }

  useEffect(() => {
    isRest ? onScrollBottom() : null
  }, [isRest])

  return (
    <BasicWrap ref={props.onRef}>
      <BasicContent>
        <TitleWrap activeTabs={activeTabs}>
          <div className="leftWrap" onClick={() => setActiveTabs(1)}>
            {t('newlyAdd.basicInfo')}
          </div>
          <div className="rightWrap" onClick={() => setActiveTabs(2)}>
            {t('common.comment')}{' '}
            {commentTotal > 99 ? `${commentTotal}+` : commentTotal}
          </div>
        </TitleWrap>
        {activeTabs === 1 && (
          <BasicDemand
            detail={demandInfo}
            onUpdate={onUpdate}
            isOpen
            isInfoPage
          />
        )}
        {activeTabs === 2 && (
          <DemandComment
            isOpen={activeTabs === 2}
            detail={demandInfo}
            isOpenInfo
          />
        )}
      </BasicContent>

      <BasicFooter>
        <div className="textBox">
          <div>已创建：{detailTimeFormat(demandInfo.createdTime)}</div>
          <span>
            更新日期：
            {detailTimeFormat(demandInfo.update_at)}
          </span>
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
