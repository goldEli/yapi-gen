import { useDispatch, useSelector } from '@store/index'
import { useEffect, useRef, useState } from 'react'
import {
  BasicFooter,
  FlawInfoInfoItem,
  FlawInfoLabel,
  FlawInfoLeft,
  FlawInfoWrap,
  SprintDetailDragLine,
  SprintDetailMouseDom,
  TitleWrap,
  WrapRight,
} from '../style'
import CommonIconFont from '@/components/CommonIconFont'
import { Tooltip } from 'antd'
import { CloseWrap, ConfigWrap } from '@/components/StyleCommon'
import { detailTimeFormat } from '@/tools'
import { useTranslation } from 'react-i18next'
import { getFlawCommentList, getFlawInfo } from '@store/flaw/flaw.thunk'
import { encryptPhp } from '@/tools/cryptoPhp'
import { setActiveCategory } from '@store/category'
import { useNavigate } from 'react-router-dom'
import FlawComment from './FlawComment'
import FlawStatus from './FlawStatus'
import FlawBasic from './FlawBasic'
import FlawDetail from './FlawDetail'
import { saveScreenDetailModal } from '@store/project/project.thunk'

const FlawInfo = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const LeftDom = useRef<HTMLDivElement>(null)
  const basicInfoDom = useRef<HTMLDivElement>(null)
  const { flawInfo, flawCommentList } = useSelector(store => store.flaw)
  const [focus, setFocus] = useState(false)
  const [leftWidth, setLeftWidth] = useState(400)
  const [activeTabs, setActiveTabs] = useState(1)
  const { projectInfo } = useSelector(store => store.project)

  //   刷新缺陷详情
  const onUpdate = () => {
    dispatch(getFlawInfo({ projectId: projectInfo?.id, id: flawInfo.id }))
  }

  // 跳转配置
  const onToConfig = () => {
    dispatch(setActiveCategory({}))
    dispatch(saveScreenDetailModal({ visible: false, params: {} }))
    const params = encryptPhp(
      JSON.stringify({
        type: 4,
        id: projectInfo?.id,
        pageIdx: 'DemandDetail',
        categoryItem: {
          id: flawInfo.category,
          status: flawInfo.category_status,
        },
      }),
    )
    navigate(`/ProjectManagement/ProjectSetting?data=${params}`)
  }
  useEffect(() => {
    if (flawInfo?.id && projectInfo?.id) {
      dispatch(
        getFlawCommentList({
          projectId: projectInfo?.id,
          id: flawInfo.id || 0,
          page: 1,
          pageSize: 999,
        }),
      )
    }
  }, [flawInfo])
  // 拖动线条
  const onDragLine = () => {
    document.onmousemove = e => {
      setFocus(true)

      setLeftWidth(window.innerWidth - e.clientX)
    }
    document.onmouseup = () => {
      document.onmousemove = null
      document.onmouseup = null
      setFocus(false)
    }
  }
  const { userPreferenceConfig } = useSelector(store => store.user)
  return (
    <FlawInfoWrap
      all={userPreferenceConfig.previewModel === 3}
      h={userPreferenceConfig.previewModel === 3}
    >
      <FlawInfoLeft
        style={{ position: 'relative', width: `calc(100% - ${leftWidth}px)` }}
      >
        <FlawDetail flawInfo={flawInfo as Model.Flaw.FlawInfo} isInfoPage />
        {flawInfo.id && (
          <div style={{ margin: '16px', background: '#f5f5f7' }}>
            <FlawInfoInfoItem>
              <FlawInfoLabel>{t('new_p1.a3')}</FlawInfoLabel>
              <FlawStatus pid={projectInfo.id} sid={flawInfo.id} />
            </FlawInfoInfoItem>
          </div>
        )}
        {flawInfo?.isExamine && (
          <div className="review">
            <CommonIconFont type="review" size={64} />
          </div>
        )}
      </FlawInfoLeft>
      <WrapRight
        ref={basicInfoDom}
        style={{ position: 'relative', width: leftWidth }}
      >
        <SprintDetailMouseDom
          active={focus}
          onMouseDown={onDragLine}
          style={{ left: 0 }}
        >
          <SprintDetailDragLine active={focus} className="line" />
        </SprintDetailMouseDom>
        <TitleWrap activeTabs={activeTabs}>
          <div className="leftWrap" onClick={() => setActiveTabs(1)}>
            {t('newlyAdd.basicInfo')}
          </div>
          <div className="rightWrap" onClick={() => setActiveTabs(2)}>
            {t('common.comment')}{' '}
            {flawCommentList?.list?.length > 99
              ? `${flawCommentList?.list?.length}+`
              : flawCommentList?.list?.length}
          </div>
        </TitleWrap>
        {activeTabs === 1 && (
          <FlawBasic detail={flawInfo} onUpdate={onUpdate} isOpen isInfoPage />
        )}
        {activeTabs === 2 && (
          <FlawComment isOpen={activeTabs === 2} detail={flawInfo} isOpenInfo />
        )}
        <BasicFooter style={{ width: '94%' }}>
          <div className="textBox">
            <div>
              {t('created')}
              {detailTimeFormat(flawInfo.createdTime as string)}
            </div>
            <span>
              {t('updated')} {detailTimeFormat(flawInfo.update_at as string)}
            </span>
          </div>
          <ConfigWrap onClick={onToConfig}>
            <CommonIconFont type="settings" />
            <div>{t('configurationFields')}</div>
          </ConfigWrap>
        </BasicFooter>
      </WrapRight>
    </FlawInfoWrap>
  )
}

export default FlawInfo
