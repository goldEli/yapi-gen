import {
  BasicFooter,
  FlawInfoInfoItem,
  FlawInfoLabel,
  FlawInfoLeft,
  FlawInfoWrap,
  TitleWrap,
  WrapRight,
} from '../style'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '@store/index'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { detailTimeFormat, getParamsData } from '@/tools'
import { getFlawCommentList, getFlawInfo } from '@store/flaw/flaw.thunk'
import FlawDetail from './FlawDetail'
import BasicFlaw from './BasicFlaw'
import { useEffect, useRef, useState } from 'react'
import { Tooltip } from 'antd'
import { CloseWrap } from '@/components/StyleCommon'
import CommonIconFont from '@/components/CommonIconFont'
import FlawComment from './FlawComment'
import FlawStatus from './FlawStatus'
import { encryptPhp } from '@/tools/cryptoPhp'
import {
  SprintDetailDragLine,
  SprintDetailMouseDom,
} from '@/views/SprintProjectDetail/style'
import { setActiveCategory } from '@store/category'

const FlawInfo = () => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const basicInfoDom = useRef<HTMLDivElement>(null)
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { id } = paramsData
  const { flawInfo, flawCommentList } = useSelector(store => store.flaw)
  const [activeTabs, setActiveTabs] = useState(1)
  const [focus, setFocus] = useState(false)
  const [leftWidth, setLeftWidth] = useState(400)
  //   刷新缺陷详情
  const onUpdate = () => {
    dispatch(getFlawInfo({ projectId: id, id: flawInfo.id }))
  }

  // 跳转配置
  const onToConfig = () => {
    dispatch(setActiveCategory({}))
    const params = encryptPhp(
      JSON.stringify({
        type: 4,
        id: id,
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
    dispatch(
      getFlawCommentList({
        projectId: id,
        id: flawInfo.id || 0,
        page: 1,
        pageSize: 999,
      }),
    )
  }, [])
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
  return (
    <FlawInfoWrap>
      <FlawInfoLeft
        style={{ position: 'relative', width: `calc(100% - ${leftWidth}px)` }}
      >
        <FlawDetail
          flawInfo={flawInfo as Model.Flaw.FlawInfo}
          onUpdate={onUpdate}
        />
        {flawInfo.id && (
          <FlawInfoInfoItem>
            <FlawInfoLabel>{t('new_p1.a3')}</FlawInfoLabel>
            <FlawStatus pid={id} sid={flawInfo.id} />
          </FlawInfoInfoItem>
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
          <BasicFlaw detail={flawInfo} onUpdate={onUpdate} isOpen isInfoPage />
        )}
        {activeTabs === 2 && (
          <FlawComment isOpen={activeTabs === 2} detail={flawInfo} />
        )}
        <BasicFooter>
          <div className="textBox">
            <div>
              已创建：{detailTimeFormat(flawInfo.createdTime as string)}
            </div>
            <span>
              更新日期： {detailTimeFormat(flawInfo.update_at as string)}
            </span>
          </div>
          <Tooltip title="配置字段">
            <CloseWrap width={32} height={32} onClick={onToConfig}>
              <CommonIconFont type="settings" />
            </CloseWrap>
          </Tooltip>
        </BasicFooter>
      </WrapRight>
    </FlawInfoWrap>
  )
}

export default FlawInfo
