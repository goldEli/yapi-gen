/* eslint-disable require-unicode-regexp */
// 需求详情-右侧

/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable camelcase */
/* eslint-disable complexity */
/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable max-lines */
/* eslint-disable react/no-danger */
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getParamsData } from '@/tools'
import { getCommentList, getDemandInfo } from '@/services/demand'
import { setDemandInfo } from '@store/demand'
import { useDispatch, useSelector } from '@store/index'
import BasicDemand from '@/components/DemandDetailDrawer/BasicDemand'
import DemandComment from '@/components/DemandDetailDrawer/DemandComment'

const WrapRight = styled.div({
  width: '100%',
  minWidth: '370px',
  overflowY: 'auto',
  height: '100%',
  padding: '16px 10px 10px 24px',
  position: 'relative',
  overflowX: 'hidden',
})

const TitleWrap = styled.div<{ activeTabs?: any }>(
  {
    height: 24,
    borderRadius: 4,
    margin: '8px 0 24px 0',
    display: 'flex',
    width: 'fit-content',
    div: {
      padding: '0 12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      fontWeight: 400,
      height: 24,
      width: 'fit-content',
      cursor: 'pointer',
    },
  },
  ({ activeTabs }) => ({
    '.leftWrap': {
      color: activeTabs === 1 ? 'var(--primary-d2)' : 'var(--neutral-n3)',
      border:
        activeTabs === 1
          ? '1px solid var(--primary-d2)'
          : '1px solid var(--neutral-n6-d1)',
      borderRadius: '4px 0 0 4px',
      borderRight: activeTabs === 1 ? '' : 'none',
    },
    '.rightWrap': {
      color: activeTabs === 2 ? 'var(--primary-d2)' : 'var(--neutral-n3)',
      border:
        activeTabs === 2
          ? '1px solid var(--primary-d2)'
          : '1px solid var(--neutral-n6-d1)',
      borderLeft: activeTabs === 2 ? '' : 'none',
      borderRadius: '0 4px 4px 0',
    },
  }),
)

const ButtonWrap = styled.div({
  width: '92%',
  background: 'white',
  paddingBottom: 7,
})

export const TextareaWrap = styled.div({
  marginTop: 67,
  textAlign: 'right',
  marginBottom: 20,
  position: 'relative',
  paddingRight: 20,
  overflow: 'hidden',
  '.ant-input': {
    padding: '8px 8px 40px 8px',
  },
  '.ant-input:focus,.ant-input:active': {
    boxShadow: 'none',
  },
  [ButtonWrap.toString()]: {
    position: 'absolute',
    right: 28,
    bottom: 1,
  },
})

const NewWrapRight = () => {
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { demandId } = paramsData
  const [activeTabs, setActiveTabs] = useState(1)
  const { demandInfo } = useSelector(store => store.demand)
  const [commentTotal, setCommentTotal] = useState(0)
  const dispatch = useDispatch()

  const getList = async () => {
    const result = await getCommentList({
      projectId,
      demandId,
      page: 1,
      pageSize: 999,
    })
    setCommentTotal(result?.list?.length)
  }

  const onChangeTabs = (val: any) => {
    setActiveTabs(val)
  }

  const onUpdate = async () => {
    const result = await getDemandInfo({ projectId, id: demandId })
    dispatch(setDemandInfo(result))
  }

  useEffect(() => {
    getList()
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
      }}
    >
      {demandInfo?.isExamine ? (
        <IconFont
          type="review"
          style={{
            fontSize: 64,
            position: 'absolute',
            top: -42,
            left: -37,
            zIndex: 1,
          }}
        />
      ) : null}
      <WrapRight>
        <TitleWrap activeTabs={activeTabs}>
          <div className="leftWrap" onClick={() => onChangeTabs(1)}>
            {t('newlyAdd.basicInfo')}
          </div>
          <div className="rightWrap" onClick={() => onChangeTabs(2)}>
            {t('common.comment')}{' '}
            {commentTotal > 99 ? `${commentTotal}+` : commentTotal}
          </div>
        </TitleWrap>
        {activeTabs === 1 && (
          <BasicDemand detail={demandInfo} onUpdate={onUpdate} isOpen />
        )}
        {activeTabs === 2 && (
          <DemandComment
            isOpen={activeTabs === 2}
            detail={demandInfo}
            isOpenInfo
          />
        )}
      </WrapRight>
    </div>
  )
}

export default NewWrapRight
