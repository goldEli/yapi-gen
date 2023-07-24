/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-no-leaked-render */
import { useTranslation } from 'react-i18next'
import { TimelineWrap, WrapBox } from './style'
import { Timeline } from 'antd'
import CommonUserAvatar from '../CommonUserAvatar'
import StateTag from '../StateTag'
import { DelWrap } from '../StyleCommon'

interface VerifyProcessProps {
  info?: any
}

const VerifyProcess = (props: VerifyProcessProps) => {
  const [t] = useTranslation()

  // status: 审核状态(待审核、已通过、未通过)，type: 审核类型(依次、与、或), list: 所有人列表
  const getStatusText = (status: any, type: any, list: any) => {
    let statusValue: any
    const hasPass = list?.filter((i: any) => i.status === 2)
    const hasNotPass = list?.filter((i: any) => i.status === 3)
    if (
      type === 1 ||
      status === hasNotPass[0]?.status ||
      status === hasPass[0]?.status ||
      (type === 2 && (hasPass.length <= 0 || hasNotPass.length <= 0)) ||
      (hasPass.length <= 0 && hasNotPass.length <= 0)
    ) {
      statusValue =
        status === 1
          ? t('newlyAdd.waitExamine')
          : status === 2
          ? t('newlyAdd.passed')
          : t('newlyAdd.notPass')
    } else if (type === 2) {
      if (hasNotPass.length > 0 && status !== hasNotPass[0]?.status) {
        statusValue = '--'
      }
    } else {
      if (status !== hasPass[0]?.status) {
        statusValue = '--'
      }
    }
    return statusValue === '--' ? (
      <span>{statusValue}</span>
    ) : (
      <span
        style={{
          color:
            status === 1 ? '#FA9746' : status === 2 ? '#43BA9A' : '#FF5C5E',
        }}
      >
        {statusValue}
      </span>
    )
  }

  return (
    <>
      <div
        style={{
          color: 'var(--neutral-n1-d1)',
          fontSize: 14,
          marginBottom: 16,
          fontFamily: 'SiYuanMedium',
        }}
      >
        {t('newlyAdd.reviewProcess')}
      </div>
      {/* 审核部分 */}
      {props.info?.verify && (
        <TimelineWrap reverse>
          {/* verifyType 依次审核? */}
          {props.info?.verify?.verifyType === 1 && (
            <>
              {props.info?.verify?.process?.map((k: any, index: any) => (
                <Timeline.Item key={index}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <WrapBox size={16} color="var(--neutral-n1-d1)" right={16}>
                      {t('newlyAdd.reviewPerson')}
                    </WrapBox>
                    <WrapBox>
                      {k.operator === 1
                        ? t('newlyAdd.sequence')
                        : k.operator === 2
                        ? t('newlyAdd.andExamine')
                        : t('newlyAdd.orExamine')}
                    </WrapBox>
                  </div>
                  {k.verifyUsers?.map((i: any) => (
                    <div key={i.id}>
                      <div
                        style={{
                          marginTop: 8,
                          display: 'flex',
                          alignItems: 'start',
                        }}
                      >
                        <CommonUserAvatar />
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginLeft: 8,
                          }}
                        >
                          <WrapBox size={14} color="var(--neutral-n1-d1)">
                            {i.userName}
                          </WrapBox>
                          <div
                            style={{
                              fontSize: 12,
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            {getStatusText(i.status, k.operator, k.verifyUsers)}
                            {i.status !== 1 && (
                              <WrapBox left={16}>{i.time}</WrapBox>
                            )}
                          </div>
                        </div>
                      </div>
                      <WrapBox top={4} color="var(--neutral-n2)">
                        {i.remark}
                      </WrapBox>
                    </div>
                  ))}
                </Timeline.Item>
              ))}
            </>
          )}
          {props.info?.verify?.verifyType !== 1 && (
            <Timeline.Item>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <WrapBox size={16} color="var(--neutral-n1-d1)" right={16}>
                  {t('newlyAdd.reviewPerson')}
                </WrapBox>
              </div>
              {props.info?.fixedUser?.map((k: any) => (
                <div key={k.id}>
                  <div
                    style={{
                      marginTop: 8,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <CommonUserAvatar />
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginLeft: 8,
                      }}
                    >
                      <WrapBox size={14} color="var(--neutral-n1-d1)">
                        {k.userName}
                      </WrapBox>
                      <div
                        style={{
                          fontSize: 12,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <span
                          style={{
                            color:
                              k.status === 1
                                ? '#FA9746'
                                : k.status === 2
                                ? '#43BA9A'
                                : '#FF5C5E',
                          }}
                        >
                          {k.status === 1
                            ? t('newlyAdd.waitExamine')
                            : k.status === 2
                            ? t('newlyAdd.passed')
                            : t('newlyAdd.notPass')}
                        </span>
                        {k.status !== 1 && (
                          <WrapBox left={16}>{k.time}</WrapBox>
                        )}
                      </div>
                    </div>
                  </div>
                  <WrapBox top={4}>{k.remark}</WrapBox>
                </div>
              ))}
            </Timeline.Item>
          )}
          {/* TODO: 取消审核 */}
          {props.info.verifyStatus === 4 && (
            <Timeline.Item style={{ marginBottom: 16 }}>
              <WrapBox size={16} color="var(--neutral-n1-d1)" right={16}>
                {t('newlyAdd.reviewPerson')}
              </WrapBox>
              <div
                style={{
                  marginTop: 8,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <CommonUserAvatar />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: 8,
                  }}
                >
                  <WrapBox size={14} color="var(--neutral-n1-d1)">
                    {props.info.cancel_verify.user_name}
                  </WrapBox>
                  <div
                    style={{
                      fontSize: 12,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        color: 'var(--neutral-n4)',
                      }}
                    >
                      {t('newlyAdd.cancelExamine')}
                    </span>
                    <WrapBox left={16}>
                      {props.info.cancel_verify.created_at}
                    </WrapBox>
                  </div>
                </div>
              </div>
            </Timeline.Item>
          )}
          {/* TODO: 需求流回至 */}
          <Timeline.Item>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/*  优化：取消审核label  */}
              {props.info.verifyStatus === 4 ? (
                <WrapBox size={16} color="var(--neutral-n1-d1)" right={8}>
                  {t('newlyAdd.demandBackflowTo')}
                </WrapBox>
              ) : (
                <WrapBox size={16} color="var(--neutral-n1-d1)" right={8}>
                  {t('newlyAdd.circulationTo')}
                </WrapBox>
              )}
              {/*  优化：取消审核tag  */}
              {props.info.verifyStatus === 4 ? (
                <StateTag
                  name={props.info?.from?.content}
                  state={
                    props.info?.from?.is_start === 1 &&
                    props.info?.from?.is_end === 2
                      ? 1
                      : props.info?.from?.is_end === 1 &&
                        props.info?.from?.is_start === 2
                      ? 2
                      : props.info?.from?.is_start === 2 &&
                        props.info?.from?.is_end === 2
                      ? 3
                      : 0
                  }
                />
              ) : (
                <>
                  {props.info?.to ? (
                    <StateTag
                      name={props.info?.to?.content}
                      state={
                        props.info?.to?.is_start === 1 &&
                        props.info?.to?.is_end === 2
                          ? 1
                          : props.info?.to?.is_end === 1 &&
                            props.info?.to?.is_start === 2
                          ? 2
                          : props.info?.to?.is_start === 2 &&
                            props.info?.to?.is_end === 2
                          ? 3
                          : 0
                      }
                    />
                  ) : (
                    <DelWrap>{t('newlyAdd.statusDel')}</DelWrap>
                  )}
                </>
              )}
            </div>
          </Timeline.Item>
        </TimelineWrap>
      )}
    </>
  )
}

export default VerifyProcess
