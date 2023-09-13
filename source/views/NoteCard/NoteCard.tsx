/* eslint-disable react/no-danger */
import React, { useEffect, useState } from 'react'
import { ColorBox, ColorBtn, ColorBtn2, Wrap1, Wrap2 } from './style'
import CommonButton from '@/components/CommonButton'
import CommonIconFont from '@/components/CommonIconFont'
import { Editor } from 'ifunuikit'
import { useTranslation } from 'react-i18next'
import { Popover } from 'antd'
import { getReadMyAllSysNoticeNumber } from '@/services/sysNotice'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import IconFont from '@/components/IconFont'
import { ListItem } from '@/components/NewAddUserModal/NewAddUserModalForTandD/NewAddUserModalForTandD'
import styled from '@emotion/styled'
import { CloseWrap } from '@/components/StyleCommon'

const MyDiv = styled.div`
  width: 480px;
  height: 320px;
  padding-bottom: 16px;
  /* 修改滚动条轨道的背景色 */
  & ::-webkit-scrollbar-thumb {
    background-color: var(--neutral-n6-d1);
    :hover {
      background-color: var(--neutral-n5);
    }
  }
  & ::-webkit-scrollbar {
    width: 4px;
  }
`
const ReadCard = (props: any) => {
  const [t] = useTranslation()
  const [value, setValue] = useState<any>({})
  const init = async () => {
    const data = await getReadMyAllSysNoticeNumber(props.id)
    setValue(data)
  }

  useEffect(() => {
    init()
  }, [props.id])

  return (
    <MyDiv>
      <div
        style={{
          height: '56px',
          // backgroundColor: '#ebeced',
          lineHeight: '56px',
          color: 'black',
          fontFamily: 'SiYuanMedium',
          padding: ' 0px 20px',
          borderRadius: '6px 6px 0px 0px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>{t('message_receiver_list')}</span>
        <CloseWrap onClick={() => props.onClose()} width={32} height={32}>
          <IconFont
            style={{ fontSize: 20, color: 'var(--neutral-n2)' }}
            type="close"
          />
        </CloseWrap>
      </div>
      <div
        style={{
          display: 'flex',
        }}
      >
        <div
          style={{
            height: '255px',
            flex: 1,
            padding: ' 0px 4px 0px 24px',
            borderRight: '1px solid #ebeced',
          }}
        >
          <div
            style={{
              paddingLeft: '2px',
            }}
          >
            <span
              style={{
                fontFamily: 'SiYuanMedium',
                fontSize: '14px',
              }}
            >
              {value?.unread ?? 0}
            </span>
            <span
              style={{
                fontFamily: 'SiYuanMedium',
                fontSize: '12px',
              }}
            >
              {t('person_unread')}
            </span>
          </div>
          <div
            style={{
              overflow: 'scroll',
              height: '235px',
            }}
          >
            {value?.list
              ?.filter((i: any) => i.read === 0)
              .map((el: any) => {
                return (
                  <div
                    style={{
                      margin: '6px 0 ',
                    }}
                    key={el.user.id}
                  >
                    <CommonUserAvatar
                      name={el.user.name}
                      fontSize={14}
                      avatar={el.user.avatar}
                    />
                  </div>
                )
              })}
          </div>
        </div>
        <div
          style={{
            height: '255px',
            flex: 1,
            padding: ' 0px 4px 0px 24px',
          }}
        >
          <div
            style={{
              paddingLeft: '2px',
            }}
          >
            <span
              style={{
                fontFamily: 'SiYuanMedium',
                fontSize: '14px',
              }}
            >
              {value?.read ?? 0}
            </span>
            <span
              style={{
                fontFamily: 'SiYuanMedium',
                fontSize: '12px',
              }}
            >
              {t('person_read')}
            </span>
          </div>
          <div
            style={{
              overflow: 'scroll',
              height: '235px',
            }}
          >
            {value?.list
              ?.filter((i: any) => i.read === 1)
              .map((el: any) => {
                return (
                  <div
                    style={{
                      margin: '6px 0 ',
                    }}
                    key={el.user.id}
                  >
                    <CommonUserAvatar
                      name={el.user.name}
                      fontSize={14}
                      avatar={el.user.avatar}
                    />
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </MyDiv>
  )
}

const NoteCard = (props: any) => {
  const [popoverVisible, setPopoverVisible] = useState(false)

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
          marginBottom: '10px',
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
              fontFamily: 'SiYuanMedium',
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
          {values.send_time && values.is_send !== 1 ? (
            <div
              style={{
                color: '#bbbdbf',
                borderRight: '1px solid #ecedef',
                paddingRight: '16px',
              }}
            >
              {t('to_be_released')}
            </div>
          ) : (
            <Popover
              open={popoverVisible}
              onOpenChange={setPopoverVisible}
              placement="bottomLeft"
              trigger="click"
              destroyTooltipOnHide
              getPopupContainer={n => (props.isShow ? n : document.body)}
              content={
                <ReadCard
                  onClose={() => setPopoverVisible(false)}
                  id={props.values.id}
                />
              }
            >
              <ColorBtn2>
                <CommonIconFont type="display" />{' '}
                <span>
                  {values.unread_count === 0
                    ? t('all_read')
                    : `${values.unread_count}${t('unread')}`}
                </span>
              </ColorBtn2>
            </Popover>
          )}

          {(values.is_drew_back === 1 || values.is_draft === 1) && (
            <ColorBtn onClick={() => props.onDel(values.id)}>
              <CommonIconFont type="delete" /> <span>{t('p2.delete')}</span>
            </ColorBtn>
          )}
          {values.is_send === 1 && (
            <ColorBtn onClick={() => props.onRevocation(values.id)}>
              <CommonIconFont type="return" /> <span>{t('revoke')}</span>
            </ColorBtn>
          )}

          {values.is_draft === 1 ? (
            <ColorBtn onClick={() => props.onEditDetail(values)}>
              <CommonIconFont type="edit" /> <span>{t('edit_draft')}</span>
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
        {values.send_time
          ? t('other.send', { name: values.user?.name, time: values.send_time })
          : t('other.send1', {
              name: values.user?.name,
              time: values.created_at,
            })}
      </div>

      <div
        style={{
          // height: '106px',
          background: '#F8F8FA',
          borderRadius: '6px 6px 6px 6px',
          marginTop: '8px',
          boxSizing: 'border-box',
          padding: '16px',
          paddingTop: '0px',
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
          <Editor
            color="transparent"
            value={values.content}
            getSuggestions={() => []}
            readonly
          />
        </div>

        <div
          onClick={() => props.onShowNumber(values.id)}
          style={{
            borderRadius: '0px 0px 0px 0px',
            borderTop: '1px solid #ECEDEF',
            // marginTop: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            flexWrap: 'wrap',
            paddingTop: '10px',
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
      </div>
    </div>
  )
}

export default NoteCard
