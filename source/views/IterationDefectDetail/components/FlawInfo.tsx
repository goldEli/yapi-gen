import {
  FlawInfoInfoItem,
  FlawInfoLabel,
  FlawInfoLeft,
  FlawInfoTextWrap,
  FlawInfoWrap,
  TitleWrap,
  WrapRight,
} from '../style'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '@store/index'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import { getFlawCommentList, getFlawInfo } from '@store/flaw/flaw.thunk'
import FlawDetail from './FlawDetail'
import BasicDemand from './BasicDemand'
import { useEffect, useState } from 'react'

const FlawInfo = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { id, flawId } = paramsData
  const { flawInfo, flawCommentList } = useSelector(store => store.flaw)
  const [activeTabs, setActiveTabs] = useState(1)

  //   刷新缺陷详情
  const onUpdate = () => {
    dispatch(getFlawInfo({ projectId: id, id: flawId }))
  }

  useEffect(() => {
    dispatch(
      getFlawCommentList({
        projectId: id,
        id: flawId,
        page: 1,
        pageSize: 999,
      }),
    )
  }, [])

  return (
    <FlawInfoWrap>
      <FlawInfoLeft>
        <FlawDetail flawInfo={flawInfo} onUpdate={onUpdate} />
        <FlawInfoInfoItem>
          <FlawInfoLabel>{t('new_p1.a3')}</FlawInfoLabel>
          {/* <DemandStatus pid={projectId} sid={flawInfo.id} /> */}
        </FlawInfoInfoItem>
      </FlawInfoLeft>
      <WrapRight>
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
          <BasicDemand
            detail={flawInfo}
            onUpdate={onUpdate}
            isOpen
            isInfoPage
          />
        )}
        {activeTabs === 2 && (
          <div>12</div>
          //   <DemandComment
          //     isOpen={activeTabs === 2}
          //     detail={demandInfo}
          //     isOpenInfo
          //   />
        )}
      </WrapRight>
    </FlawInfoWrap>
  )
}

export default FlawInfo
