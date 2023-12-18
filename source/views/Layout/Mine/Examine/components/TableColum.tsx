// 审核列表字段

import Sort from '@/components/Sort'
import { ClickWrap } from '@/components/StyleCommon'
import { OmitText } from '@star-yun/ui'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { Tooltip } from 'antd'
import MultipleAvatar from '@/components/MultipleAvatar'
import CommonIconFont from '@/components/CommonIconFont'
import { copyLink } from '@/tools'
const CircleWrap = styled.div({
  width: 6,
  height: 6,
  borderRadius: '50%',
  marginRight: 8,
})

const StatusWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
})

const statusColor = ['#FA9746', '#43BA9A', '#FF5C5E']

export const useDynamicColumns = (state: any) => {
  const [t] = useTranslation()

  const NewSort = (propsSort: any) => {
    return (
      <Sort
        fixedKey={propsSort.fixedKey}
        onChangeKey={state.onUpdateOrderkey}
        nowKey={state?.orderKey}
        order={state?.order}
      >
        {propsSort.children}
      </Sort>
    )
  }
  const onCopy = (text: string) => {
    copyLink(text, t('copysuccess'), t('copyfailed'))
  }
  const arr = [
    {
      width: 140,
      title: <NewSort fixedKey="story_prefix_key">{t('serialNumber')}</NewSort>,
      dataIndex: 'storyPrefixKey',
      key: 'prefix_key',
      render: (text: string, record: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ClickWrap className="canClickDetail">
              <div className="text" onClick={() => state.onClickItem(record)}>
                {record.storyPrefixKey}
              </div>
              <div className="icon">
                <CommonIconFont
                  color="var(--neutral-n4)"
                  type="copy"
                  size={20}
                  onClick={() => onCopy(text)}
                />
              </div>
            </ClickWrap>
          </div>
        )
      },
    },
    {
      title: <NewSort fixedKey="story_name">{t('common.title')}</NewSort>,
      dataIndex: 'demandName',
      key: 'story_name',
      render: (text: string | number, record: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip placement="top" title={record.categoryName}>
              <img
                src={record.categoryAttachment}
                style={{
                  width: '18px',
                  height: '18px',
                  marginRight: '8px',
                }}
                alt=""
              />
            </Tooltip>
            <ClickWrap
              className="canClickDetail "
              onClick={() => state.onClickItem(record)}
            >
              <OmitText
                width={200}
                tipProps={{
                  getPopupContainer: node => node,
                }}
              >
                <span className="controlMaxWidth">{text}</span>
              </OmitText>
            </ClickWrap>
            {record.is_handover === 1 && (
              <div
                style={{
                  fontSize: '12px',
                  lineHeight: '20px',
                  textAlign: 'center',
                  color: '#FA9746',
                  minWidth: '60px',
                  height: '20px',
                  background: 'rgba(250,151,70,0.1)',
                  borderRadius: '10px 6px 6px 10px',
                  marginLeft: '4px',
                }}
              >
                {t('quitAndHandover')}
              </div>
            )}
          </div>
        )
      },
    },
    {
      title: t('common.dealName'),
      dataIndex: 'usersName',
      key: 'users_name',
      render: (text: string, record: any) => {
        return (
          <MultipleAvatar
            max={3}
            list={record.usersInfo?.map((i: any) => ({
              id: i.id,
              name: i.name,
              avatar: i.avatar,
            }))}
          />
        )
      },
    },
    {
      title: <NewSort fixedKey="user_name">{t('newlyAdd.submitName')}</NewSort>,
      dataIndex: 'userName',
      key: 'user_name',
      render: (text: string, record: any) => {
        return (
          <MultipleAvatar
            max={3}
            list={[
              {
                name: record?.userName,
                id: record?.userId,
                avatar: record?.userAvatar,
              },
            ]}
          />
        )
      },
    },

    {
      title: t('newlyAdd.reviewStatus'),
      dataIndex: 'statusFromTo',
      key: 'status_from_to',
      width: 300,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: (
        <NewSort fixedKey="verify_status">
          {t('newlyAdd.examineStatus')}
        </NewSort>
      ),
      dataIndex: 'status',
      key: 'verify_status',
      render: (text: any, record: any) => {
        return (
          <div onClick={() => state.onChangeOperation(record)}>
            <StatusWrap>
              <CircleWrap
                style={{
                  background: statusColor[text - 1],
                }}
              />
              <ClickWrap colorState={text === 1} style={{ display: 'inline' }}>
                {text === 1
                  ? t('newlyAdd.waitExamine')
                  : text === 2
                  ? t('newlyAdd.passed')
                  : t('newlyAdd.notPass')}
              </ClickWrap>
            </StatusWrap>
          </div>
        )
      },
    },
    {
      title: (
        <NewSort fixedKey="verify_at">{t('newlyAdd.examineTime')}</NewSort>
      ),
      dataIndex: 'verifyTime',
      key: 'verify_at',
      width: 220,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: (
        <NewSort fixedKey="verify_opinion">
          {t('newlyAdd.examineReason')}
        </NewSort>
      ),
      dataIndex: 'reason',
      key: 'verify_opinion',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
  ]

  let resultArr: any
  if (state.activeTab) {
    resultArr = arr.filter(
      (i: any) => i.key !== 'verify_opinion' && i.key !== 'user_name',
    )
  }

  return state.activeTab ? resultArr : arr
}
