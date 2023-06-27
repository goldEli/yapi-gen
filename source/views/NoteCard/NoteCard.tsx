/* eslint-disable react/no-danger */
import React from 'react'
import { ColorBox, ColorBtn, ColorBtn2, Wrap1, Wrap2 } from './style'
import CommonButton from '@/components/CommonButton'
import CommonIconFont from '@/components/CommonIconFont'
import { Editor } from '@xyfe/uikit'
import { useTranslation } from 'react-i18next'

const NoteCard = (props: any) => {
  const [t] = useTranslation()
  const { values } = props

  const senseByte = (num: any) => {
    let text = ''
    switch (num) {
      case 1:
        text = t('system_notification')
        break
      case 2:
        text = t('daily_notification')
        break
      case 3:
        text = t('important_notification')
        break
      case 4:
        text = t('activity_notification')
        break
      case 5:
        text = t('holiday_notification')
        break

      default:
        break
    }
    return text
  }
  const computeLength = (values: any) => {
    if (values.all) {
      return (
        <div
          style={{
            height: '20px',
            fontSize: '12px',
            color: '#646566',
            lineHeight: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
          }}
        >
          {t('formWork.whole')}
        </div>
      )
    }
    if (Array.isArray(values.user_counts)) {
      let totalLength = 0

      values.user_counts?.forEach((item: any) => {
        totalLength += item.count
      })
      return totalLength
    }
  }

  const recipientArr = (values: any) => {
    if (Array.isArray(values.user_counts)) {
      return values.user_counts.map((i: any) => (
        <div
          key={i}
          style={{
            height: '20px',
            fontSize: '12px',
            color: '#646566',
            lineHeight: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
          }}
        >
          {i.name}（{i.count}）
        </div>
      ))
    }
  }
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Wrap1>
          {values.is_draft === 1 && (
            <ColorBox colors={3}>{t('draft')}</ColorBox>
          )}
          {values.is_drew_back === 1 && (
            <ColorBox colors={3}>{t('withdrawn')}</ColorBox>
          )}
          {values.is_send === 1 && <ColorBox colors={2}>{t('sent')}</ColorBox>}
          {values.send_time ? (
            <ColorBox colors={1}>{t('scheduled_notifications')}</ColorBox>
          ) : null}

          <div
            style={{
              height: '24px',
              fontSize: '16px',
              color: '#323233',
              lineHeight: '24px',
            }}
          >
            {values.title}
          </div>
          <div
            style={{
              height: '20px',
              fontSize: '12px',
              color: '#969799',
              lineHeight: '20px',
            }}
          >
            {senseByte(values.type)}
          </div>
        </Wrap1>
        <Wrap2>
          <ColorBtn2>
            <CommonIconFont type="display" /> <span>{t('all_read')}</span>
          </ColorBtn2>

          {(values.is_drew_back === 1 || values.is_draft === 1) && (
            <ColorBtn onClick={() => props.onDel(values.id)}>
              <CommonIconFont type="file-text" /> <span>{t('delete')}</span>
            </ColorBtn>
          )}
          {values.is_send === 1 && values.is_drew_back === 2 && (
            <ColorBtn onClick={() => props.onRevocation(values.id)}>
              <CommonIconFont type="return" /> <span>{t('revoke')}</span>
            </ColorBtn>
          )}
          {values.is_draft === 1 ? (
            <ColorBtn onClick={() => props.onEditDetail(values)}>
              <CommonIconFont type="file-text" /> <span>{t('edit_draft')}</span>
            </ColorBtn>
          ) : (
            <ColorBtn onClick={() => props.onShowDetail(values)}>
              <CommonIconFont type="file-text" />{' '}
              <span>{t('project.checkInfo')}</span>
            </ColorBtn>
          )}
        </Wrap2>
      </div>
      <div
        style={{
          height: '20px',
          fontSize: '12px',
          color: '#969799',
          lineHeight: '20px',
        }}
      >
        【{values.user?.name}】将于{values.expire_time}发送
      </div>

      <div
        style={{
          // height: '106px',
          background: '#F8F8FA',
          borderRadius: '6px 6px 6px 6px',
          marginTop: '8px',
          boxSizing: 'border-box',
          padding: '16px',
        }}
      >
        <div
          style={{
            // height: '22px',
            fontSize: '14px',
            color: '#323233',
            lineHeight: '22px',
          }}
        >
          <Editor value={values.content} getSuggestions={() => []} readonly />
        </div>

        <div
          onClick={() => props.onShowNumber(values.id)}
          style={{
            borderRadius: '0px 0px 0px 0px',
            borderTop: '1px solid #ECEDEF',
            marginTop: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            cursor: 'pointer',
            flexWrap: 'wrap',
            padding: '10px 0px',
          }}
        >
          <div
            style={{
              height: '20px',
              fontSize: '12px',
              color: 'var(--neutral-n2)',
              lineHeight: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderRight: '1px solid #ECEDEF',
              paddingRight: '24px',
            }}
          >
            <CommonIconFont color="var(--neutral-n4)" size={16} type="team" />(
            {computeLength(values.recipient)})
          </div>
          {recipientArr(values.recipient)}
        </div>
        {/* <div
          style={{
            height: '52px',
            borderRadius: '0px 0px 0px 0px',
            borderTop: '1px solid #ECEDEF',
            marginTop: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <div
            style={{
              height: '20px',
              fontSize: '12px',
              color: '#646566',
              lineHeight: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderRight: '1px solid #ECEDEF',
              paddingRight: '24px',
            }}
          >
            <CommonIconFont color="#646566" size={16} type="team-2" />
            持续截止时间
          </div>

          <div
            style={{
              height: '20px',
              fontSize: '12px',
              color: '#646566',
              lineHeight: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            2023年4月17日12:00:19
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default NoteCard
