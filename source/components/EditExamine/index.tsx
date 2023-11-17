// 编辑审核

/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable complexity */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/naming-convention */
import { Input, Space, Tooltip } from 'antd'
import { ViewWrap } from '@/components/StyleCommon'
import CommonModal from '@/components/CommonModal'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { OmitText } from '@star-yun/ui'
import { useDispatch, useSelector } from '@store/index'
import { getAsyncVerifyInfo, setVerifyInfo } from '@store/mine'
import { updateVerifyOperation } from '@/services/mine'
import CommonButton from '@/components/CommonButton'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import { getMessage } from '@/components/Message'
import VerifyProcess from '@/components/VerifyProcess'
import { setIsUpdateAddWorkItem } from '@store/project'

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
  const { isUpdateAddWorkItem } = useSelector(store => store.project)
  const [value, setValue] = useState('')

  const getInfo = async () => {
    dispatch(
      getAsyncVerifyInfo({
        id: props?.isEdit ? props?.item?.storyVerifyId : props?.item?.id,
      }),
    )
  }

  useEffect(() => {
    dispatch(setVerifyInfo({}))
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
      getMessage({
        msg: t('newlyAdd.editExamineSuccess') as string,
        type: 'success',
      })
      onClose()
      props?.onUpdate()
      // 用于更新在需求、缺陷、事务更新列表
      dispatch(setIsUpdateAddWorkItem(isUpdateAddWorkItem + 1))
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
          padding: '20px 16px 20px 20px',
        }}
      >
        <ItemWrap>
          <LabelWrap>{t('serialNumber')}</LabelWrap>
          <ContentWrap>
            <Tooltip title={verifyInfo?.categoryName}>
              <img
                style={{
                  width: '18px',
                  height: '18px',
                }}
                src={verifyInfo?.category_attachment}
                alt=""
              />
            </Tooltip>
            <span
              style={{
                height: '22px',
                fontSize: '14px',
                fontFamily: 'SiYuanMedium',
                color: 'var(--neutral-n1-d1)',
                lineHeight: '22px',
                marginLeft: 8,
              }}
            >
              {verifyInfo?.storyPrefixKey}
            </span>
          </ContentWrap>
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
                              <CommonUserAvatar name={n?.name?.trim()} />
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
              style={{ width: 386 }}
              autoSize={{ minRows: 3, maxRows: 5 }}
              placeholder={t('newlyAdd.pleaseExamine')}
              value={value}
              onChange={e => setValue(e.target.value)}
            />
          </ItemWrap>
        )}
        {/* 审核部分 */}
        <VerifyProcess info={verifyInfo} />
      </div>
    </CommonModal>
  )
}

export default EditExamine
