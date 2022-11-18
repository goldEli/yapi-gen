/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable complexity */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/naming-convention */
import { Input, message, Space, Timeline } from 'antd'
import {
  CategoryWrap,
  ViewWrap,
  NameWrap,
  DelWrap,
} from '@/components/StyleCommon'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import CommonModal from '@/components/CommonModal'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { useModel } from '@/models'
import { useTranslation } from 'react-i18next'
import { OmitText } from '@star-yun/ui'

const TimelineWrap = styled(Timeline)({
  '.ant-timeline-item-last > .ant-timeline-item-content': {
    minHeight: 'auto',
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
  color: '#646566',
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
  color: color || '#969799',
  fontSize: size || 12,
  marginRight: right || 0,
  marginLeft: left || 0,
  marginTop: top || 0,
}))

const ContentWrap = styled.div({
  width: '70%',
})

interface Props {
  isVisible: boolean
  onClose(): void
  item?: any
  isEdit?: boolean
  onUpdate(): void
}

const EditExamine = (props: Props) => {
  const [t] = useTranslation()
  const { colorList } = useModel('project')
  const { getVerifyInfo, verifyInfo, updateVerifyOperation } = useModel('mine')
  const [value, setValue] = useState('')

  const getInfo = async () => {
    await getVerifyInfo({
      id: props?.isEdit ? props?.item?.storyVerifyId : props?.item?.id,
    })
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

  const onConfirm = () => {
    updateMethod(2)
  }

  const onRefuse = () => {
    updateMethod(3)
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

  return (
    <CommonModal
      isVisible={props.isVisible}
      title={t('newlyAdd.examine')}
      onClose={onClose}
      hasFooter={
        props?.isEdit &&
        props?.item?.status === 1 && (
          <FooterWrap size={16}>
            <Button onClick={onClose}>{t('common.cancel')}</Button>
            <Button onClick={onRefuse}>{t('newlyAdd.refuse')}</Button>
            <Button type="primary" onClick={onConfirm}>
              {t('newlyAdd.adopt')}
            </Button>
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
          paddingRight: 20,
        }}
      >
        <ItemWrap>
          <div>{props?.item?.demandId}</div>
          <CategoryWrap
            color={verifyInfo?.categoryColor}
            bgColor={
              colorList?.filter(i => i.key === verifyInfo?.categoryColor)[0]
                ?.bgColor
            }
          >
            {verifyInfo?.categoryName}
          </CategoryWrap>
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
                        <span>
                          {verifyInfo.fields[m]?.value
                            ?.map((i: any) => i)
                            .join('、') || '--'}
                        </span>
                      ) : (
                        <span>
                          {verifyInfo.fields[m]?.value
                            ?.map((i: any) => i.name?.trim())
                            .join('、') || '--'}
                        </span>
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
            color: '#323233',
            fontSize: 14,
            marginBottom: 16,
            fontWeight: 500,
          }}
        >
          {t('newlyAdd.reviewProcess')}
        </div>
        {verifyInfo?.verify && (
          <TimelineWrap>
            {verifyInfo?.verify?.verifyType === 1 && (
              <>
                {verifyInfo?.verify?.process?.map((k: any, index: any) => (
                  <Timeline.Item key={index}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <WrapBox size={16} color="#323233" right={16}>
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
                            <WrapBox size={14} color="#323233">
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
                  <WrapBox size={16} color="#323233" right={16}>
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
                        <WrapBox size={14} color="#323233">
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

            <Timeline.Item style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <WrapBox size={16} color="#323233" right={8}>
                  {t('newlyAdd.circulationTo')}
                </WrapBox>
                {verifyInfo?.to ? (
                  <ViewWrap color={verifyInfo?.to?.color}>
                    {verifyInfo?.to?.content}
                  </ViewWrap>
                ) : (
                  <DelWrap>{t('newlyAdd.statusDel')}</DelWrap>
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
