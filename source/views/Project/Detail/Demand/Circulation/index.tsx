/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable complexity */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import styled from '@emotion/styled'
import { Space, Timeline } from 'antd'
import { NameWrap, ViewWrap } from '@/components/StyleCommon'
import { useModel } from '@/models'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'

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
})

const Wrap = styled.div({
  height: 'calc(100% - 50px)',
  background: 'white',
  overflowX: 'auto',
  borderBottomLeftRadius: 6,
  borderBottomRightRadius: 6,
  padding: '0 32px',
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
  fontWeight: 400,
  color: '#323233',
})

const ContentWrap = styled.div({
  fontSize: 14,
  fontWeight: 400,
  color: '#323233',
  width: 'calc(100% - 70px)',
})

const TimeTag = styled.div({
  width: 10,
  height: 10,
  backgroundColor: 'white',
  border: '2px solid #2877ff',
  borderRadius: 100,
  color: '#2877ff',
})

const Circulation = () => {
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { getStatusLogs, statusLogs, demandInfo } = useModel('demand')
  const keys = [
    { name: '标签', key: 'tag' },
    { name: '需求分类', key: 'class' },
    { name: '评论', key: 'comment' },
    { name: '优先级', key: 'priority' },
    { name: '处理人', key: 'usersName' },
    { name: '迭代', key: 'iterateName' },
    { name: '预计开始', key: 'startTime' },
    { name: '预计结束', key: 'endTime' },
    { name: '抄送', key: 'copySendName' },
  ]

  const getLogs = async () => {
    await getStatusLogs({ projectId, demandId: demandInfo?.id, all: true })
  }

  useEffect(() => {
    getLogs()
  }, [])

  return (
    <Wrap>
      <TimeLIneWrap mode="left">
        {statusLogs?.map((i: any) => (
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
              <NameWrap style={{ marginBottom: 0, width: 24, height: 24 }}>
                {String(
                  i?.operationName?.trim().slice(0, 1),
                ).toLocaleUpperCase()}
              </NameWrap>
              <TextWrap style={{ marginLeft: 8 }}>{i?.operationName}</TextWrap>
              <TextWrap style={{ marginLeft: 32 }}>
                {i.changeType === 1
                  ? '创建需求'
                  : i.changeType === 2
                    ? '流转需求至'
                    : '申请流转至'}
              </TextWrap>
              {i.changeType === 3
                ? `【${i.statusTo?.name}】`
                : (
                    <ViewWrap style={{ marginLeft: 8 }} color={i.statusTo?.color}>
                      {i.statusTo?.name}
                    </ViewWrap>
                  )}
            </LineItem>
            {Object.keys(i.fields)?.map((m: any) => (
              <>
                {m === 'customFields' && i.fields[m] ? (
                  <>
                    {Object.values(i.fields[m])?.map((c: any, index: any) => (
                      <LineItem key={`${c?.name}_${index}`} top={16}>
                        <LabelItem>{c?.name}：</LabelItem>
                        <ContentWrap>
                          {Array.isArray(c?.value)
                            ? c?.value.join('、')
                            : c?.value || '--'}
                        </ContentWrap>
                      </LineItem>
                    ))}
                  </>
                ) : (
                  <LineItem key={m} top={16} hasTop hidden={!i.fields[m]}>
                    <LabelItem>
                      {keys?.filter((j: any) => j.key === m)[0]?.name}：
                    </LabelItem>
                    {typeof i.fields[m] === 'string'
                      && <ContentWrap>{i.fields[m]}</ContentWrap>
                    }
                    {Array.isArray(i.fields[m])
                      && (m === 'tag' ? (
                        <ContentWrap>
                          {i.fields[m]?.map((h: any) => (
                            <ViewWrap key={h.name} color={h?.color}>
                              {h.name}
                            </ViewWrap>
                          ))}
                        </ContentWrap>
                      ) : (
                        <ContentWrap>
                          <Space size={24}>
                            {i.fields[m]?.map((n: any) => (
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
                        </ContentWrap>
                      ))}
                    {m === 'priority' && (
                      <ContentWrap>
                        <span style={{ color: i.fields[m]?.color }}>
                          {i.fields[m]?.content}
                        </span>
                      </ContentWrap>
                    )}
                  </LineItem>
                )}
              </>
            ))}
            {i.changeType === 3
              && i.verifyAll?.verify?.process?.map((k: any) => (
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
                      审核人
                    </SpanWrap>
                    <SpanWrap size={12} weight={400} color="#969799">
                      {k.operator === 1
                        ? '依次审核'
                        : k.operator === 2
                          ? '与逻辑审核'
                          : '或逻辑审核'}
                    </SpanWrap>
                  </LineItem>
                  {k.verifyUsers?.map((m: any) => (
                    <div key={m.id}>
                      {i.verifyAll?.verifyStatus === 1 && (
                        <div style={{ position: 'absolute', left: -131 }}>
                          <LineItem
                            style={{ direction: 'rtl', alignItems: 'center' }}
                          >
                            <TimeTag />
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
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <NameWrap
                            style={{ marginBottom: 0, width: 24, height: 24 }}
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
                        {m.verifyStatus === 1
                          ? <SpanWrap color="#FA9746">待审核</SpanWrap>
                          : m.verifyStatus === 2
                            ? <SpanWrap color="#43BA9A">已通过</SpanWrap>
                            : <SpanWrap color="#FF5C5E">未通过</SpanWrap>
                        }
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
            {i.changeType === 3 && i.verifyAll?.verifyStatus !== 1 && (
              <LineItem top={24}>
                <SpanWrap size={16} color="#323233" weight={500}>
                  {i.verifyAll?.verifyStatus === 2
                    ? '需求流转至'
                    : '审核未通过需求状态流回'}
                </SpanWrap>
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
              </LineItem>
            )}
          </Timeline.Item>
        ))}
        <Timeline.Item />
      </TimeLIneWrap>
    </Wrap>
  )
}

export default Circulation
