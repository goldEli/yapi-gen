// 编辑审核

/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable complexity */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/naming-convention */
import { Input, message, Space, Timeline } from 'antd'
import { ViewWrap, NameWrap, DelWrap } from '@/components/StyleCommon'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import CommonModal from '@/components/CommonModal'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { OmitText } from '@star-yun/ui'
import { useDispatch, useSelector } from '@store/index'
import { getAsyncVerifyInfo } from '@store/mine'
import { updateVerifyOperation } from '@/services/mine'
import CommonButton from '@/components/CommonButton'

const TimelineWrap = styled(Timeline)({
  '.ant-timeline-item-last > .ant-timeline-item-content': {
    minHeight: 'auto',
  },
  '.ant-timeline-item:last-child > .ant-timeline-item-tail': {
    display: 'none',
  },
  '.ant-timeline-item-last': {
    paddingBottom: '0!important',
  },
})

const FooterWrap = styled(Space)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  height: 80,
  paddingRight: 20,
})

const ItemWrap = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: 16,
})

const LabelWrap = styled.div({
  color: 'var(--neutral-n2)',
  fontSize: 14,
  fontWeight: 400,
  width: 100,
})

const WrapBox = styled.div<{
  color?: any
  size?: any
  right?: any
  left?: any
  top?: any
}>({}, ({ color, size, right, left, top }) => ({
  color: color || 'var(--neutral-n3)',
  fontSize: size || 12,
  marginRight: right || 0,
  marginLeft: left || 0,
  marginTop: top || 0,
}))

const ContentWrap = styled.div({
  width: '70%',
  '.hasPerson': {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
})

interface Props {
  isVisible: boolean
  onClose(): void
  item?: any
  isEdit?: boolean
  onUpdate(): void
}

const EditExamine = (props: Props) => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const { verifyInfo } = useSelector(store => store.mine)
  const [value, setValue] = useState('')

  const getInfo = async () => {
    dispatch(
      getAsyncVerifyInfo({
        id: props?.isEdit ? props?.item?.storyVerifyId : props?.item?.id,
      }),
    )
  }

  useEffect(() => {
    getInfo()
  }, [])

  const onClose = () => {
    props?.onClose()
    setTimeout(() => {
      setValue('')
    }, 100)
  }

  const updateMethod = async (status: any) => {
    try {
      await updateVerifyOperation({
        id: props?.item?.id,
        projectId: props?.item?.projectId,
        status,
        remark: value,
      })
      message.success(t('newlyAdd.editExamineSuccess'))
      onClose()
      props?.onUpdate()
    } catch (error) {
      //
    }
  }

  const onConfirm = async () => {
    await updateMethod(2)
  }

  const onRefuse = async () => {
    await updateMethod(3)
  }

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

  // 返回自定义值
  const getValues = (key: any, values: any) => {
    return (
      <span>
        {values?.map((n: any) => (n?.id ? n?.name : n)).join(';') || '--'}
      </span>
    )
  }

  return (
    <CommonModal
      isVisible={props.isVisible}
      title={t('newlyAdd.examine')}
      onClose={onClose}
      hasFooter={
        props?.isEdit &&
        props?.item?.status === 1 && (
          <FooterWrap size={16}>
            <CommonButton type="light" onClick={onClose}>
              {t('common.cancel')}
            </CommonButton>
            <CommonButton type="light" onClick={onRefuse}>
              {t('newlyAdd.refuse')}
            </CommonButton>
            <CommonButton type="primary" onClick={onConfirm}>
              {t('newlyAdd.adopt')}
            </CommonButton>
          </FooterWrap>
        )
      }
      isShowFooter={
        !props?.isEdit || (props?.isEdit && props?.item?.status !== 1)
      }
    >
      <div
        style={{
          maxHeight: props?.isEdit && props?.item?.status === 1 ? 464 : 544,
          overflowY: 'auto',
          padding: 20,
        }}
      >
        <ItemWrap>
          <div>{props?.item?.demandId}</div>

          <div
            style={{
              height: '24px',
              background: 'var(--neutral-n8)',
              borderRadius: '6px 6px 6px 6px',
              padding: '2px 8px',
              display: 'flex',
              alignItems: 'center',
              marginLeft: '16px',
            }}
          >
            <img
              style={{
                width: '18px',
                height: '18px',
              }}
              src={verifyInfo?.category_attachment}
              alt=""
            />
            <span
              style={{
                height: '20px',
                fontSize: '12px',
                fontWeight: 400,
                color: 'var(--neutral-n2)',
                lineHeight: '20px',
              }}
            >
              {verifyInfo?.categoryName}
            </span>
          </div>
        </ItemWrap>
        <ItemWrap>
          <LabelWrap>{t('common.title')}</LabelWrap>
          <ContentWrap>{verifyInfo?.demandName}</ContentWrap>
        </ItemWrap>
        <ItemWrap>
          <LabelWrap>{t('newlyAdd.reviewStatus')}</LabelWrap>
          <ContentWrap>{verifyInfo?.statusFromTo || '--'}</ContentWrap>
        </ItemWrap>
        {verifyInfo?.id
          ? Object.keys(verifyInfo?.fields)?.map((m: any) => (
              <ItemWrap key={m} hidden={!verifyInfo?.fields[m]}>
                <LabelWrap>
                  <OmitText width={80} tipProps={{ placement: 'topLeft' }}>
                    {verifyInfo.fields[m]?.title}
                  </OmitText>
                </LabelWrap>
                {(typeof verifyInfo.fields[m]?.value === 'string' ||
                  verifyInfo.fields[m]?.value === null) &&
                  m !== 'priority' && (
                    <ContentWrap>
                      {verifyInfo.fields[m]?.value
                        ? verifyInfo.fields[m]?.value
                        : m === 'class'
                        ? verifyInfo.fields[m]?.value || '未分类'
                        : '--'}
                    </ContentWrap>
                  )}
                {Array.isArray(verifyInfo.fields[m]?.value) &&
                  (m === 'tag' ? (
                    <ContentWrap>
                      {verifyInfo.fields[m]?.value?.length > 0
                        ? verifyInfo.fields[m]?.value?.map((h: any) => (
                            <ViewWrap key={h.name} color={h?.color}>
                              {h.name}
                            </ViewWrap>
                          ))
                        : '--'}
                    </ContentWrap>
                  ) : (
                    <ContentWrap>
                      {String(m).includes('custom_') ? (
                        getValues(m, verifyInfo.fields[m]?.value)
                      ) : (
                        <div className="hasPerson">
                          {verifyInfo.fields[m]?.value?.map((n: any) => (
                            <div
                              key={n.id}
                              style={{
                                display: 'flex',
                                margin: '0 24px 8px 0',
                              }}
                            >
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
                        </div>
                      )}
                    </ContentWrap>
                  ))}
                {m === 'priority' && (
                  <ContentWrap>
                    {verifyInfo.fields[m]?.value?.id
                      ? verifyInfo.fields[m]?.value?.content
                      : '--'}
                  </ContentWrap>
                )}
              </ItemWrap>
            ))
          : null}

        <ItemWrap>
          <LabelWrap>{t('newlyAdd.submitName')}</LabelWrap>
          <ContentWrap>{verifyInfo?.userName || '--'}</ContentWrap>
        </ItemWrap>
        <ItemWrap>
          <LabelWrap>{t('newlyAdd.submitTime')}</LabelWrap>
          <ContentWrap>{verifyInfo?.time || '--'}</ContentWrap>
        </ItemWrap>
        {props?.isEdit && props?.item?.status === 1 && (
          <ItemWrap>
            <LabelWrap>{t('newlyAdd.examineReason')}</LabelWrap>
            <Input.TextArea
              style={{ width: 256 }}
              autoSize={{ minRows: 3, maxRows: 5 }}
              placeholder={t('newlyAdd.pleaseExamine')}
              value={value}
              onChange={e => setValue(e.target.value)}
            />
          </ItemWrap>
        )}
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
        {verifyInfo?.verify && (
          <TimelineWrap reverse>
            {/* verifyType 依次审核? */}
            {verifyInfo?.verify?.verifyType === 1 && (
              <>
                {verifyInfo?.verify?.process?.map((k: any, index: any) => (
                  <Timeline.Item key={index}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <WrapBox
                        size={16}
                        color="var(--neutral-n1-d1)"
                        right={16}
                      >
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
                            alignItems: 'center',
                          }}
                        >
                          <NameWrap>
                            {String(
                              i.userName?.trim().slice(0, 1),
                            ).toLocaleUpperCase()}
                          </NameWrap>
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
                              {getStatusText(
                                i.status,
                                k.operator,
                                k.verifyUsers,
                              )}
                              {i.status !== 1 && (
                                <WrapBox left={16}>{i.time}</WrapBox>
                              )}
                            </div>
                          </div>
                        </div>
                        <WrapBox top={4}>{i.remark}</WrapBox>
                      </div>
                    ))}
                  </Timeline.Item>
                ))}
              </>
            )}
            {verifyInfo?.verify?.verifyType !== 1 && (
              <Timeline.Item>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <WrapBox size={16} color="var(--neutral-n1-d1)" right={16}>
                    {t('newlyAdd.reviewPerson')}
                  </WrapBox>
                </div>
                {verifyInfo?.fixedUser?.map((k: any) => (
                  <div key={k.id}>
                    <div
                      style={{
                        marginTop: 8,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <NameWrap>
                        {String(
                          k.userName?.trim().slice(0, 1),
                        ).toLocaleUpperCase()}
                      </NameWrap>
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
            {verifyInfo.verifyStatus === 4 && (
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
                  <NameWrap>
                    {String(
                      verifyInfo.cancel_verify.user_name.trim().slice(0, 1),
                    ).toLocaleUpperCase()}
                  </NameWrap>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginLeft: 8,
                    }}
                  >
                    <WrapBox size={14} color="var(--neutral-n1-d1)">
                      {verifyInfo.cancel_verify.user_name}
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
                        {verifyInfo.cancel_verify.created_at}
                      </WrapBox>
                    </div>
                  </div>
                </div>
              </Timeline.Item>
            )}
            {/* TODO: 需求流回至 */}
            <Timeline.Item style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {/*  优化：取消审核label  */}
                {verifyInfo.verifyStatus === 4 ? (
                  <WrapBox size={16} color="var(--neutral-n1-d1)" right={8}>
                    {t('newlyAdd.demandBackflowTo')}
                  </WrapBox>
                ) : (
                  <WrapBox size={16} color="var(--neutral-n1-d1)" right={8}>
                    {t('newlyAdd.circulationTo')}
                  </WrapBox>
                )}
                {/*  优化：取消审核tag  */}
                {verifyInfo.verifyStatus === 4 ? (
                  <ViewWrap color={verifyInfo?.from?.color}>
                    {verifyInfo?.from?.content}
                  </ViewWrap>
                ) : (
                  <>
                    {verifyInfo?.to ? (
                      <ViewWrap color={verifyInfo?.to?.color}>
                        {verifyInfo?.to?.content}
                      </ViewWrap>
                    ) : (
                      <DelWrap>{t('newlyAdd.statusDel')}</DelWrap>
                    )}
                  </>
                )}
              </div>
            </Timeline.Item>
          </TimelineWrap>
        )}
      </div>
    </CommonModal>
  )
}

export default EditExamine
