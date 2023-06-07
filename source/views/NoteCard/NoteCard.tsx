/* eslint-disable react/no-danger */
import React from 'react'
import { ColorBox, ColorBtn, ColorBtn2, Wrap1, Wrap2 } from './style'
import CommonButton from '@/components/CommonButton'
import CommonIconFont from '@/components/CommonIconFont'

const NoteCard = (props: any) => {
  const { values } = props

  const senseByte = (num: any) => {
    let text = ''
    switch (num) {
      case 1:
        text = '系统更新'
        break
      case 2:
        text = '日常通知'
        break
      case 3:
        text = '重要通知'
        break
      case 4:
        text = '活动通知'
        break
      case 5:
        text = '放假通知'
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
          全员
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
          {values.is_draft === 1 && <ColorBox colors={3}>草稿</ColorBox>}
          {values.is_drew_back === 1 && <ColorBox colors={3}>已撤回</ColorBox>}
          {values.is_send === 1 && <ColorBox colors={2}>已发送</ColorBox>}
          {values.send_time ? <ColorBox colors={1}>定时通知</ColorBox> : null}

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
            <CommonIconFont type="display" /> <span>全部已读</span>
          </ColorBtn2>
          {values.is_draft === 1 && (
            <ColorBtn onClick={() => props.onDel(values.id)}>
              <CommonIconFont type="file-text" /> <span>删除</span>
            </ColorBtn>
          )}
          {values.is_drew_back === 1 && (
            <ColorBtn onClick={() => props.onDel(values.id)}>
              <CommonIconFont type="file-text" /> <span>删除</span>
            </ColorBtn>
          )}
          {values.is_send === 1 && (
            <ColorBtn onClick={() => props.onRevocation(values.id)}>
              <CommonIconFont type="return" /> <span>撤回</span>
            </ColorBtn>
          )}
          {values.is_draft === 1 ? (
            <ColorBtn onClick={() => props.onEditDetail(values)}>
              <CommonIconFont type="file-text" /> <span>编辑草稿</span>
            </ColorBtn>
          ) : (
            <ColorBtn onClick={() => props.onShowDetail(values)}>
              <CommonIconFont type="file-text" /> <span>查看详情</span>
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
        【{values.user.name}】将于{values.send_time}发送
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
          dangerouslySetInnerHTML={{
            __html: values.content,
          }}
        />

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
