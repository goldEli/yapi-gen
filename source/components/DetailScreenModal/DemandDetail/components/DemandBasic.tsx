import { useDispatch, useSelector } from '@store/index'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { BasicContent, BasicFooter, BasicWrap, TitleWrap } from '../style'
import { Tooltip } from 'antd'
import { detailTimeFormat, getProjectIdByUrl } from '@/tools'
import CommonIconFont from '@/components/CommonIconFont'
import { CloseWrap } from '@/components/StyleCommon'
import BasicDemand from '@/components/DemandDetailDrawer/BasicDemand'
import DemandComment from '@/components/DemandDetailDrawer/DemandComment'
import { getDemandInfo } from '@store/demand/demand.thunk'
import { setActiveCategory } from '@store/category'
import { encryptPhp } from '@/tools/cryptoPhp'
import { changeRestScroll } from '@store/scroll'
import { setIsUpdateAddWorkItem } from '@store/project'
import CommonProgress from '@/components/CommonProgress'

interface Props {
  onRef: any
}
const DemandBasic = (props: Props) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { demandInfo, demandCommentList } = useSelector(store => store.demand)
  const { isUpdateAddWorkItem } = useSelector(store => store.project)
  const isRest = useSelector(store => store.scroll.isRest)
  const [activeTabs, setActiveTabs] = useState(1)

  // 更新详情
  const onUpdate = () => {
    dispatch(setIsUpdateAddWorkItem(isUpdateAddWorkItem + 1))
  }

  // 跳转配置
  const onToConfig = () => {
    dispatch(setActiveCategory({}))
    const params = encryptPhp(
      JSON.stringify({
        type: 4,
        id: getProjectIdByUrl(),
        pageIdx: 'DemandDetail',
        categoryItem: {
          id: demandInfo.category,
          status: demandInfo.category_status,
        },
      }),
    )
    navigate(`/ProjectManagement/ProjectSetting?data=${params}`)
  }

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
            {demandCommentList.list.length > 99
              ? `${demandCommentList.list.length}+`
              : demandCommentList.list.length}
          </div>
        </TitleWrap>
        {activeTabs === 1 && (
          <>
            <CommonProgress isTable={false} />
            <BasicDemand
              detail={demandInfo}
              onUpdate={onUpdate}
              isOpen
              isInfoPage
            />
          </>
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
          <div>
            {t('created')}
            {detailTimeFormat(demandInfo.createdTime)}
          </div>
          <span>
            {t('updated')}
            {detailTimeFormat(demandInfo.update_at)}
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

export default DemandBasic
