import { useDispatch, useSelector } from '@store/index'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { BasicContent, BasicFooter, BasicWrap, TitleWrap } from '../style'
import { Tooltip } from 'antd'
import { detailTimeFormat } from '@/tools'
import CommonIconFont from '@/components/CommonIconFont'
import { CloseWrap, ConfigWrap } from '@/components/StyleCommon'
import BasicDemand from '@/components/DemandDetailDrawer/BasicDemand'
import DemandComment from '@/components/DemandDetailDrawer/DemandComment'
import { setActiveCategory } from '@store/category'
import { encryptPhp } from '@/tools/cryptoPhp'
import { changeRestScroll } from '@store/scroll'
import { setIsUpdateAddWorkItem } from '@store/project'
import CommonProgress from '@/components/CommonProgress'
import { saveScreenDetailModal } from '@store/project/project.thunk'

interface Props {
  onRef: any
}
const DemandBasic = (props: Props) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { demandInfo, demandCommentList } = useSelector(store => store.demand)
  const { isUpdateAddWorkItem, projectInfo, isDetailScreenModal } = useSelector(
    store => store.project,
  )
  const { params } = isDetailScreenModal
  const { userInfo } = useSelector(store => store.user)
  const isRest = useSelector(store => store.scroll.isRest)
  const [activeTabs, setActiveTabs] = useState(1)
  const isCanEdit =
    projectInfo.projectPermissions?.length > 0 &&
    projectInfo.projectPermissions?.filter(
      (i: any) => i.identity === 'b/story/update',
    )?.length > 0
  // 更新详情
  const onUpdate = () => {
    dispatch(setIsUpdateAddWorkItem(isUpdateAddWorkItem + 1))
  }

  // 跳转配置
  const onToConfig = () => {
    dispatch(setActiveCategory({}))
    dispatch(saveScreenDetailModal({ visible: false, params: {} }))
    const params1 = encryptPhp(
      JSON.stringify({
        id: projectInfo.id,
        categoryItem: {
          id: demandInfo.category,
          status: demandInfo.category_status,
        },
      }),
    )
    navigate(`/ProjectDetail/Setting/TypeConfiguration?data=${params1}`)
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
            <CommonProgress
              isTable={false}
              update={demandInfo}
              percent={demandInfo?.schedule}
              id={demandInfo?.id}
              hasEdit={
                !!isCanEdit &&
                demandInfo?.user
                  ?.map((i: any) => i?.user?.id)
                  ?.includes(userInfo?.id) &&
                !params?.employeeCurrentId
              }
              type="demand"
              project_id={demandInfo?.projectId}
              onConfirm={onUpdate}
            />
            <BasicDemand
              detail={demandInfo}
              onUpdate={onUpdate}
              isOpen
              isInfoPage
              isPreview={(params?.employeeCurrentId || 0) > 0}
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
        {!params?.employeeCurrentId && (
          <ConfigWrap onClick={onToConfig}>
            <CommonIconFont type="settings" />
            <div>{t('configurationFields')}</div>
          </ConfigWrap>
        )}
      </BasicFooter>
    </BasicWrap>
  )
}

export default DemandBasic
