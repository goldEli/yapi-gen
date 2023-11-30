/* eslint-disable no-undefined */
// 需求详情-流转记录

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
import NewLoadingTransition from '@/components/NewLoadingTransition'
import StateTag from '@/components/StateTag'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import { getStoryStatusLog } from '@/services/demand'
import { setIsUpdateChangeLog } from '@store/project'
import { ComputedWrap } from '../style'

const TimeLIneWrap = styled(Timeline)({
  marginTop: 24,
  '.ant-timeline-item-head-blue': {
    borderColor: 'var(--neutral-n5)!important',
  },
  '& :first-child .ant-timeline-item-head-blue': {
    borderColor: 'var(--primary-d1)!important',
  },
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
    background: 'var(--hover-d2)',
  },
  '.ant-timeline-item-last .ant-timeline-item-content': {
    display: 'none!important',
  },
})

const TimeItem = styled.div({
  display: 'flex',
  flexDirection: 'column',
  fontWeight: 400,
  'span:first-child': {
    fontSize: 14,
    color: 'var(--neutral-n1-d2)',
  },
  'span:last-child': {
    color: 'var(--neutral-n2)',
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

    alignItems: hasTop ? 'flex-start' : 'center',
  }),
)

const LabelItem = styled.div({
  color: 'var(--neutral-n3)',
  fontSize: 14,
  fontWeight: 400,
  minWidth: 70,
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
  fontSize: 14,
  fontWeight: 'normal',
  color: 'var(--neutral-n1-d2)',
})

const ContentWrap = styled.div({
  fontSize: 14,
  fontWeight: 400,
  color: 'var(--neutral-n1-d2)',
  width: 'calc(100% - 70px)',
})

interface Props {
  activeKey: string
}

const Circulation = (props: Props) => {
  const [t] = useTranslation()
  const [isSpin, setIsSpin] = useState(false)
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { projectInfo } = useSelector(store => store.project)
  const { id } = paramsData || { id: projectInfo.id }
  const [statusLogs, setStatusLogs] = useState<any>({
    list: undefined,
  })
  const { isUpdateChangeLog } = useSelector(store => store.project)
  const dispatch = useDispatch()
  const { isRefresh } = useSelector(store => store.user)
  const { demandInfo } = useSelector(store => store.demand)

  const getLogs = async (state: boolean) => {
    if (state) {
      setIsSpin(true)
      const result = await getStoryStatusLog({
        projectId: id,
        demandId: demandInfo.id,
        all: true,
      })
      setStatusLogs({
        list: result,
      })
      dispatch(setIsRefresh(false))
      setIsSpin(false)
    } else {
      const result = await getStoryStatusLog({
        projectId: id,
        demandId: demandInfo.id,
        all: true,
      })
      setStatusLogs({
        list: result,
      })
    }
    dispatch(setIsUpdateChangeLog(false))
  }

  useEffect(() => {
    if (props.activeKey === '5') {
      getLogs(true)
    }
  }, [props.activeKey])

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
  const { userPreferenceConfig } = useSelector(store => store.user)
  return (
    <ComputedWrap
      all={userPreferenceConfig.previewModel === 3}
      style={{ overflow: 'auto' }}
    >
      <Spin indicator={<NewLoadingTransition />} spinning={isSpin}>
        {!!statusLogs?.list && (
          <>
            {statusLogs?.list?.length > 0 && (
              <TimeLIneWrap mode="left" reverse>
                <Timeline.Item />
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
                      <CommonUserAvatar name={i?.operationName?.trim()} />
                      <TextWrap style={{ marginLeft: 32 }}>
                        {/* TODO: 优化changeType */}
                        {i.changeType === 1
                          ? t('common.createDemand')
                          : i.changeType === 2
                          ? t('newlyAdd.reviewDemandTo')
                          : i.changeType === 4
                          ? t('newlyAdd.demandBackflowTo')
                          : t('newlyAdd.applyReviewTo')}
                      </TextWrap>
                      {/* tag */}
                      {i.statusTo ? (
                        <div style={{ marginLeft: 8 }}>
                          {i.changeType === 3 ? (
                            `【${i.statusTo?.name}】`
                          ) : (
                            <StateTag
                              name={i.statusTo?.name}
                              state={
                                i?.is_start === 1 && i?.is_end === 2
                                  ? 1
                                  : i?.is_end === 1 && i?.is_start === 2
                                  ? 2
                                  : i?.is_start === 2 && i?.is_end === 2
                                  ? 3
                                  : 0
                              }
                            />
                          )}
                        </div>
                      ) : (
                        <DelWrap>{t('newlyAdd.statusDel')}</DelWrap>
                      )}
                    </LineItem>
                    {/* field */}
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
                        {/* 时间评论字段值 */}
                        {(typeof i.fields[m]?.value === 'string' ||
                          i.fields[m]?.value === null) &&
                          m !== 'priority' && (
                            <ContentWrap>
                              {i.fields[m]?.value
                                ? i.fields[m]?.value
                                : m === 'class'
                                ? i.fields[m]?.value ||
                                  t('newlyAdd.unclassified')
                                : '--'}
                            </ContentWrap>
                          )}
                        {/* 用户数组 */}
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
                                      <CommonUserAvatar
                                        name={n?.name?.trim()}
                                      />
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
                    {/* TODO: 取消审核时间 */}
                    {i.changeType === 4 && (
                      <LineItem top={16}>
                        <LabelItem>
                          <OmitText
                            width={157}
                            tipProps={{ placement: 'topLeft' }}
                          >
                            {t('newlyAdd.cancelExamineTime')}：
                          </OmitText>
                        </LabelItem>
                        <SpanWrap size={14} color="var(--neutral-n3)">
                          {i.time}
                        </SpanWrap>
                      </LineItem>
                    )}
                    {i.changeType === 3 &&
                      i.verifyAll?.verify.verifyType === 1 &&
                      i.verifyAll?.verify?.process?.map((k: any) => (
                        <div key={k.id}>
                          <LineItem style={{ alignItems: 'center' }} top={24}>
                            <SpanWrap
                              size={16}
                              weight={500}
                              color="var(--neutral-n1-d2)"
                              style={{
                                marginRight: 16,
                              }}
                            >
                              {t('newlyAdd.reviewPerson')}
                            </SpanWrap>
                            <SpanWrap
                              size={12}
                              weight={400}
                              color="var(--neutral-n3)"
                            >
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
                                      color="var(--neutral-n1-d2)"
                                      size={16}
                                      style={{ marginRight: 14 }}
                                    >
                                      {String(m?.time).split(' ')[0]}
                                    </SpanWrap>
                                  </LineItem>
                                  <SpanWrap
                                    color="var(--neutral-n2)"
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
                                  <CommonUserAvatar name={m.name?.trim()} />
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
                                <SpanWrap
                                  size={14}
                                  color="var(--neutral-n1-d2)"
                                >
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
                              color="var(--neutral-n1-d2)"
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
                              <CommonUserAvatar
                                name={i.verifyAll?.verify.fixedUser.userName?.trim()}
                              />
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
                            <SpanWrap size={14} color="var(--neutral-n1-d2)">
                              {i.verifyAll?.verify.fixedUser.comment}
                            </SpanWrap>
                          </LineItem>
                        </div>
                      )}
                    {i.changeType === 3 && i.verifyAll?.verifyStatus !== 1 && (
                      <LineItem top={24}>
                        <SpanWrap
                          size={16}
                          color="var(--neutral-n1-d2)"
                          weight={500}
                        >
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
              </TimeLIneWrap>
            )}
            {statusLogs?.list?.length <= 0 && <NoData />}
          </>
        )}
      </Spin>
    </ComputedWrap>
  )
}

export default Circulation
