// 需求详情-流转记录

/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
/* eslint-disable no-undefined */
import styled from '@emotion/styled'
import { Space, Spin, Timeline } from 'antd'
import { NameWrap, ViewWrap, DelWrap } from '@/components/StyleCommon'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import { useTranslation } from 'react-i18next'
import { OmitText } from '@star-yun/ui'
import NoData from '@/components/NoData'
import { useDispatch, useSelector } from '@store/index'
import { setIsRefresh } from '@store/user'
import { getStoryStatusLog } from '@/services/project/demand'
import { setIsUpdateChangeLog } from '@store/demand'

const TimeLIneWrap = styled(Timeline)({
  marginTop: 24,
  '.ant-timeline-item-label': {
    width: '102px!important',
  },
  '.ant-timeline-item-tail,.ant-timeline-item-head': {
    left: '120px!important',
  },
  '.ant-timeline-item-content': {
    borderRadius: 6,
    padding: '16px 24px',
    left: '125px!important',
    width: 'calc(100% - 151px)!important',
    background: '#F8F9FA',
  },
  '.ant-timeline-item-last .ant-timeline-item-content': {
    display: 'none!important',
  },
})

const Wrap = styled.div({
  height: 'calc(100% - 54px)',
  background: 'white',
  overflowX: 'auto',
  padding: '0 32px',
  margin: '16px 16px 0 16px',
  borderRadius: 6,
})

const TimeItem = styled.div({
  display: 'flex',
  flexDirection: 'column',
  fontWeight: 400,
  'span:first-child': {
    fontSize: 16,
    color: '#323233',
  },
  'span:last-child': {
    color: '#646566',
    fontSize: 12,
  },
})

const LineItem = styled.div<{
  top?: number
  bottom?: number
  hasTop?: boolean
}>(
  {
    display: 'flex',
  },
  ({ top, bottom, hasTop }) => ({
    marginTop: top || 0,
    marginBottom: bottom || 0,
    alignItems: hasTop ? 'flex-start' : 'center',
  }),
)

const LabelItem = styled.div({
  color: '#969799',
  fontSize: 14,
  fontWeight: 400,
  width: 70,
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
})

const SpanWrap = styled.span<{ size?: any; weight?: any; color?: any }>(
  {},
  ({ color, size, weight }) => ({
    color,
    fontSize: size || 12,
    fontWeight: weight || 400,
  }),
)

const TextWrap = styled.div({
  fontSize: 16,
  fontWeight: 'normal',
  color: '#323233',
})

const ContentWrap = styled.div({
  fontSize: 14,
  fontWeight: 400,
  color: '#323233',
  width: 'calc(100% - 70px)',
})

const Circulation = () => {
  const [t] = useTranslation()
  const [isSpin, setIsSpin] = useState(false)
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const [statusLogs, setStatusLogs] = useState<any>({
    list: undefined,
  })
  const { demandInfo, isUpdateChangeLog } = useSelector(
    (store: { demand: any }) => store.demand,
  )
  const dispatch = useDispatch()
  const { isRefresh } = useSelector((store: { user: any }) => store.user)

  const getLogs = async (state: boolean) => {
    if (state) {
      setIsSpin(true)
      const result = await getStoryStatusLog({
        projectId,
        demandId: demandInfo?.id,
        all: true,
      })
      setStatusLogs({
        list: result,
      })
      dispatch(setIsRefresh(false))
      setIsSpin(false)
    } else {
      const result = await getStoryStatusLog({
        projectId,
        demandId: demandInfo?.id,
        all: true,
      })
      setStatusLogs({
        list: result,
      })
    }
    dispatch(setIsUpdateChangeLog(false))
  }

  useEffect(() => {
    getLogs(true)
  }, [])

  useEffect(() => {
    if (isRefresh) {
      setStatusLogs([])
      getLogs(true)
    }
  }, [isRefresh])

  useEffect(() => {
    if (isUpdateChangeLog) {
      getLogs(false)
    }
  }, [isUpdateChangeLog])

  // 返回自定义值
  const getValues = (key: any, values: any) => {
    return (
      <span>
        {values?.map((n: any) => (n?.id ? n?.name : n)).join(';') || '--'}
      </span>
    )
  }

  return (
    <Wrap>
      <Spin spinning={isSpin}>
        {!!statusLogs?.list && (
          <>
            {statusLogs?.list?.length > 0 && (
              <TimeLIneWrap mode="left">
                {statusLogs.list?.map((i: any) => (
                  <Timeline.Item
                    key={i.id}
                    label={
                      <TimeItem>
                        <span>{String(i?.time).split(' ')[0]}</span>
                        <span>{String(i?.time).split(' ')[1]}</span>
                      </TimeItem>
                    }
                  >
                    <LineItem bottom={8}>
                      <NameWrap
                        style={{ marginBottom: 0, width: 24, height: 24 }}
                      >
                        {String(
                          i?.operationName?.trim().slice(0, 1),
                        ).toLocaleUpperCase()}
                      </NameWrap>
                      <TextWrap style={{ marginLeft: 8 }}>
                        {i?.operationName}
                      </TextWrap>
                      <TextWrap style={{ marginLeft: 32 }}>
                        {i.changeType === 1
                          ? t('common.createDemand')
                          : i.changeType === 2
                          ? t('newlyAdd.reviewDemandTo')
                          : t('newlyAdd.applyReviewTo')}
                      </TextWrap>
                      {i.statusTo ? (
                        <>
                          {i.changeType === 3 ? (
                            `【${i.statusTo?.name}】`
                          ) : (
                            <ViewWrap
                              style={{ marginLeft: 8 }}
                              color={i.statusTo?.color}
                            >
                              {i.statusTo?.name}
                            </ViewWrap>
                          )}
                        </>
                      ) : (
                        <DelWrap>{t('newlyAdd.statusDel')}</DelWrap>
                      )}
                    </LineItem>
                    {Object.keys(i.fields)?.map((m: any) => (
                      <LineItem key={m} top={16} hasTop hidden={!i?.fields[m]}>
                        <LabelItem>
                          <OmitText
                            width={70}
                            tipProps={{ placement: 'topLeft' }}
                          >
                            {i.fields[m]?.content_txt}：
                          </OmitText>
                        </LabelItem>
                        {(typeof i.fields[m]?.value === 'string' ||
                          i.fields[m]?.value === null) &&
                          m !== 'priority' && (
                            <ContentWrap>
                              {i.fields[m]?.value
                                ? i.fields[m]?.value
                                : m === 'class'
                                ? i.fields[m]?.value || '未分类'
                                : '--'}
                            </ContentWrap>
                          )}
                        {Array.isArray(i.fields[m]?.value) &&
                          (m === 'tag' ? (
                            <ContentWrap>
                              {i.fields[m]?.value?.length > 0
                                ? i.fields[m]?.value?.map((h: any) => (
                                    <ViewWrap key={h.name} color={h?.color}>
                                      {h.name}
                                    </ViewWrap>
                                  ))
                                : '--'}
                            </ContentWrap>
                          ) : (
                            <ContentWrap>
                              {String(m).includes('custom_') ? (
                                getValues(m, i.fields[m]?.value)
                              ) : (
                                <Space size={24}>
                                  {i.fields[m]?.value?.map((n: any) => (
                                    <div key={n.id} style={{ display: 'flex' }}>
                                      <NameWrap
                                        style={{
                                          marginBottom: 0,
                                          marginRight: 8,
                                          width: 24,
                                          height: 24,
                                        }}
                                      >
                                        {String(
                                          n?.name?.trim().slice(0, 1),
                                        ).toLocaleUpperCase()}
                                      </NameWrap>
                                      <span>{n?.name?.trim()}</span>
                                    </div>
                                  ))}
                                </Space>
                              )}
                            </ContentWrap>
                          ))}
                        {m === 'priority' && (
                          <ContentWrap>
                            <span style={{ color: i.fields[m]?.value?.color }}>
                              {i.fields[m]?.value?.content || '--'}
                            </span>
                          </ContentWrap>
                        )}
                      </LineItem>
                    ))}
                    {i.changeType === 3 &&
                      i.verifyAll?.verify.verifyType === 1 &&
                      i.verifyAll?.verify?.process?.map((k: any) => (
                        <div key={k.id}>
                          <LineItem style={{ alignItems: 'center' }} top={24}>
                            <SpanWrap
                              size={16}
                              weight={500}
                              color="#323233"
                              style={{
                                marginRight: 16,
                              }}
                            >
                              {t('newlyAdd.reviewPerson')}
                            </SpanWrap>
                            <SpanWrap size={12} weight={400} color="#969799">
                              {k.operator === 1
                                ? t('newlyAdd.sequence')
                                : k.operator === 2
                                ? t('newlyAdd.andExamine')
                                : t('newlyAdd.orExamine')}
                            </SpanWrap>
                          </LineItem>
                          {k.verifyUsers?.map((m: any) => (
                            <div key={m.id}>
                              {i.verifyAll?.verifyStatus === 1 && (
                                <div
                                  style={{ position: 'absolute', left: -131 }}
                                >
                                  <LineItem
                                    style={{
                                      direction: 'rtl',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <SpanWrap
                                      color="#323233"
                                      size={16}
                                      style={{ marginRight: 14 }}
                                    >
                                      {String(m?.time).split(' ')[0]}
                                    </SpanWrap>
                                  </LineItem>
                                  <SpanWrap
                                    color="#646566"
                                    size={12}
                                    style={{
                                      paddingRight: 25,
                                      textAlign: 'right',
                                      display: 'inherit',
                                    }}
                                  >
                                    {String(m?.time).split(' ')[1]}
                                  </SpanWrap>
                                </div>
                              )}
                              <LineItem top={16}>
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                  }}
                                >
                                  <NameWrap
                                    style={{
                                      marginBottom: 0,
                                      width: 24,
                                      height: 24,
                                    }}
                                  >
                                    {String(
                                      m.name?.trim().slice(0, 1),
                                    ).toLocaleUpperCase()}
                                  </NameWrap>
                                  <span style={{ marginLeft: 8 }}>
                                    {m.name?.trim()}
                                  </span>
                                </div>
                              </LineItem>
                              <LineItem style={{ marginLeft: 32 }}>
                                {m.verifyStatus === 1 ? (
                                  <SpanWrap color="#FA9746">
                                    {t('newlyAdd.waitExamine')}
                                  </SpanWrap>
                                ) : m.verifyStatus === 2 ? (
                                  <SpanWrap color="#43BA9A">
                                    {t('newlyAdd.passed')}
                                  </SpanWrap>
                                ) : (
                                  <SpanWrap color="#FF5C5E">
                                    {t('newlyAdd.notPass')}
                                  </SpanWrap>
                                )}
                              </LineItem>
                              <LineItem top={4} hidden={!m.verifyOpinion}>
                                <SpanWrap size={14} color="#323233">
                                  {m.verifyOpinion}
                                </SpanWrap>
                              </LineItem>
                            </div>
                          ))}
                        </div>
                      ))}
                    {i.changeType === 3 &&
                      i.verifyAll?.verify.verifyType === 2 && (
                        <div>
                          <LineItem style={{ alignItems: 'center' }} top={24}>
                            <SpanWrap
                              size={16}
                              weight={500}
                              color="#323233"
                              style={{
                                marginRight: 16,
                              }}
                            >
                              {t('newlyAdd.reviewPerson')}
                            </SpanWrap>
                          </LineItem>
                          <LineItem top={16}>
                            <div
                              style={{ display: 'flex', alignItems: 'center' }}
                            >
                              <NameWrap
                                style={{
                                  marginBottom: 0,
                                  width: 24,
                                  height: 24,
                                }}
                              >
                                {String(
                                  i.verifyAll?.verify.fixedUser.userName
                                    ?.trim()
                                    .slice(0, 1),
                                ).toLocaleUpperCase()}
                              </NameWrap>
                              <span style={{ marginLeft: 8 }}>
                                {i.verifyAll?.verify.fixedUser.userName?.trim()}
                              </span>
                            </div>
                          </LineItem>
                          <LineItem style={{ marginLeft: 32 }}>
                            {i.verifyAll?.verify.fixedUser.verifyStatus ===
                            1 ? (
                              <SpanWrap color="#FA9746">
                                {t('newlyAdd.waitExamine')}
                              </SpanWrap>
                            ) : i.verifyAll?.verify.fixedUser.verifyStatus ===
                              2 ? (
                              <SpanWrap color="#43BA9A">
                                {t('newlyAdd.passed')}
                              </SpanWrap>
                            ) : (
                              <SpanWrap color="#FF5C5E">
                                {t('newlyAdd.notPass')}
                              </SpanWrap>
                            )}
                          </LineItem>
                          <LineItem
                            top={4}
                            hidden={!i.verifyAll?.verify.fixedUser.comment}
                          >
                            <SpanWrap size={14} color="#323233">
                              {i.verifyAll?.verify.fixedUser.comment}
                            </SpanWrap>
                          </LineItem>
                        </div>
                      )}
                    {i.changeType === 3 && i.verifyAll?.verifyStatus !== 1 && (
                      <LineItem top={24}>
                        <SpanWrap size={16} color="#323233" weight={500}>
                          {i.verifyAll?.verifyStatus === 2
                            ? t('newlyAdd.demandReviewTo')
                            : t('newlyAdd.notExamineTo')}
                        </SpanWrap>
                        {(i.verifyAll?.verifyStatus === 2 ||
                          i.verifyAll?.verifyStatus === 3) &&
                          (i.statusTo || i.verifyAll?.statusFrom) && (
                            <ViewWrap
                              style={{ marginLeft: 8 }}
                              color={
                                i.verifyAll?.verifyStatus === 2
                                  ? i.statusTo?.color
                                  : i.verifyAll?.statusFrom?.color
                              }
                            >
                              {i.verifyAll?.verifyStatus === 2
                                ? i.statusTo?.name
                                : i.verifyAll?.statusFrom?.name}
                            </ViewWrap>
                          )}
                        {(i.verifyAll?.verifyStatus === 2 ||
                          i.verifyAll?.verifyStatus === 3) &&
                          !(i.statusTo || i.verifyAll?.statusFrom) && (
                            <DelWrap>{t('newlyAdd.statusDel')}</DelWrap>
                          )}
                      </LineItem>
                    )}
                  </Timeline.Item>
                ))}
                <Timeline.Item />
              </TimeLIneWrap>
            )}
            {statusLogs?.list?.length <= 0 && <NoData />}
          </>
        )}
      </Spin>
    </Wrap>
  )
}

export default Circulation
