/* eslint-disable react/jsx-no-leaked-render */
import { useDispatch, useSelector } from '@store/index'
import { createRef, useEffect, useRef, useState } from 'react'
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
import {
  detailTimeFormat,
  getIdsForAt,
  getParamsData,
  removeNull,
} from '@/tools'
import { useTranslation } from 'react-i18next'
import { getFlawCommentList, getFlawInfo } from '@store/flaw/flaw.thunk'
import { encryptPhp } from '@/tools/cryptoPhp'
import { setActiveCategory } from '@store/category'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import FlawComment from './FlawComment'
import FlawStatus from './FlawStatus'
import FlawBasic from './FlawBasic'
import FlawDetail from './FlawDetail'
import { saveScreenDetailModal } from '@store/project/project.thunk'
import CommentFooter from '@/components/CommonComment/CommentFooter'
import { getMessage } from '@/components/Message'
import { addFlawComment } from '@/services/flaw'
import { setIsUpdateAddWorkItem } from '@store/project'

const FlawInfo = () => {
  const commentDom: any = createRef()
  const [t] = useTranslation()
  const routerPath = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const basicInfoDom = useRef<HTMLDivElement>(null)
  const [searchParams] = useSearchParams()
  const { flawInfo } = useSelector(store => store.flaw)
  const [focus, setFocus] = useState(false)
  const [leftWidth, setLeftWidth] = useState(400)
  const {
    projectInfo,
    isDetailScreenModal,
    projectInfoValues,
    isUpdateAddWorkItem,
  } = useSelector(store => store.project)
  const { userPreferenceConfig } = useSelector(store => store.user)
  const { params, visible } = isDetailScreenModal

  //   刷新缺陷详情
  const onUpdate = () => {
    dispatch(getFlawInfo({ projectId: projectInfo?.id, id: flawInfo.id }))
    dispatch(setIsUpdateAddWorkItem(isUpdateAddWorkItem + 1))
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

  // 提交评论
  const onConfirmComment = async (value: any) => {
    await addFlawComment({
      projectId: projectInfo.id,
      id: flawInfo.id || 0,
      content: value.info,
      attachment: value.attachment,
      a_user_ids: getIdsForAt(value.info),
    })
    getMessage({ type: 'success', msg: t('p2.conSuccess') })
    dispatch(
      getFlawCommentList({
        projectId: projectInfo.id,
        id: flawInfo.id || 0,
        page: 1,
        pageSize: 999,
      }),
    )
    commentDom.current.cancel()
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

  useEffect(() => {
    // 判断从消息跳转到详情定位评论  只有全屏及弹窗会触发
    if (routerPath?.pathname === '/ProjectDetail/Defect' && flawInfo?.id) {
      const routerParams = getParamsData(searchParams)
      if (routerParams?.anchorPoint) {
        setTimeout(() => {
          const dom = document.getElementById('sprint-activity')
          dom?.scrollIntoView({
            behavior: 'smooth',
          })
        }, 1500)
      }
    }
  }, [routerPath, flawInfo])

  // 计算高度
  const a1 = flawInfo?.isExamine ? 91 : 130
  const a2 = flawInfo?.isExamine ? 164 : 186
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
      <div
        style={{ width: `calc(100% - ${leftWidth}px)`, position: 'relative' }}
      >
        <FlawInfoLeft style={{ width: '100%' }}>
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
            <FlawInfoInfoItem id="sprint-activity">
              <FlawComment detail={flawInfo} isOpenInfo />
            </FlawInfoInfoItem>
          </div>
        </FlawInfoLeft>
        <CommentFooter
          onRef={commentDom}
          placeholder={t('postComment')}
          personList={removeNull(projectInfoValues, 'user_name')?.map(
            (k: any) => ({
              label: k.content,
              id: k.id,
            }),
          )}
          padding="no"
          onConfirm={onConfirmComment}
          style={{ padding: '0 16px', width: '100%' }}
          maxHeight="60vh"
          hasAvatar
          isEmployee={location.pathname?.includes('/EmployeeProfile')}
        />
      </div>

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
