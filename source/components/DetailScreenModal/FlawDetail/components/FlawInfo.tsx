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
  WrapRight,
} from '../style'
import CommonIconFont from '@/components/CommonIconFont'
import { ConfigWrap } from '@/components/StyleCommon'
import { detailTimeFormat } from '@/tools'
import { useTranslation } from 'react-i18next'
import { getFlawInfo } from '@store/flaw/flaw.thunk'
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
  const basicInfoDom = useRef<HTMLDivElement>(null)
  const { flawInfo } = useSelector(store => store.flaw)
  const [focus, setFocus] = useState(false)
  const [leftWidth, setLeftWidth] = useState(400)
  const { projectInfo, isDetailScreenModal } = useSelector(
    store => store.project,
  )
  const { params, visible } = isDetailScreenModal

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
        id: projectInfo?.id,
        categoryItem: {
          id: flawInfo.category,
          status: flawInfo.category_status,
        },
      }),
    )
    navigate(`/ProjectDetail/Setting/TypeConfiguration?data=${params}`)
  }

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

  // 计算高度
  const a1 = flawInfo?.isExamine ? 91 : 130
  const a2 = flawInfo?.isExamine ? 164 : 178
  const a3 = 239

  return (
    <FlawInfoWrap
      all={
        userPreferenceConfig.previewModel === 3 ||
        (params?.employeeCurrentId || 0) > 0
      }
      height={
        (params?.employeeCurrentId || 0) > 0
          ? a1
          : userPreferenceConfig.previewModel === 3
          ? a2
          : a3
      }
    >
      <FlawInfoLeft
        style={{ position: 'relative', width: `calc(100% - ${leftWidth}px)` }}
      >
        <FlawDetail
          flawInfo={flawInfo as Model.Flaw.FlawInfo}
          isInfoPage
          isPreview={(params?.employeeCurrentId || 0) > 0}
          userId={params?.employeeCurrentId}
        />
        {flawInfo.id && !params?.employeeCurrentId && (
          <div style={{ margin: '16px', background: '#f5f5f7' }}>
            <FlawInfoInfoItem>
              <FlawInfoLabel>{t('new_p1.a3')}</FlawInfoLabel>
              <FlawStatus
                pid={projectInfo.id}
                sid={flawInfo.id}
                visible={visible}
              />
            </FlawInfoInfoItem>
          </div>
        )}
        {flawInfo?.isExamine && (
          <div className="review">
            <CommonIconFont type="review" size={64} />
          </div>
        )}
        <div style={{ margin: '16px', background: '#f5f5f7' }}>
          <FlawInfoInfoItem>
            <FlawComment detail={flawInfo} isOpenInfo />
          </FlawInfoInfoItem>
        </div>
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
        <FlawBasic
          detail={flawInfo}
          onUpdate={onUpdate}
          isInfoPage
          isPreview={(params?.employeeCurrentId || 0) > 0}
        />
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
          {!params?.employeeCurrentId && (
            <ConfigWrap onClick={onToConfig}>
              <CommonIconFont type="settings" />
              <div>{t('configurationFields')}</div>
            </ConfigWrap>
          )}
        </BasicFooter>
      </WrapRight>
    </FlawInfoWrap>
  )
}

export default FlawInfo
