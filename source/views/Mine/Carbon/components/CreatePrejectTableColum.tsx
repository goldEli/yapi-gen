/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-handler-names */
import { Dropdown, Menu } from 'antd'
import { ShapeContent } from '@/components/Shape'
import { LevelContent } from '@/components/Level'
import Pop from '@/components/Popconfirm'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { css } from '@emotion/css'
import { ClickWrap, ShowWrap, StyledShape } from '@/components/StyleCommon'
import Sort from '@/components/Sort'
import { useNavigate } from 'react-router-dom'
import { ChildDemandTable } from '@/views/Project/Detail/Iteration/Demand'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const flexCss = css`
  display: flex;
  align-items: center;
`

export const useDynamicColumns = (state: any) => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const NewSort = (props: any) => {
    return (
      <Sort
        fixedKey={props.fixedKey}
        onChangeKey={state.updateOrderkey}
        nowKey={state.orderKey}
        order={state.order}
      >
        {props.children}
      </Sort>
    )
  }
  return [
    {
      width: 140,
      title: <NewSort fixedKey="id">ID</NewSort>,
      dataIndex: 'id',
      key: 'id',
      render: (text: any, record: any) => {
        return <ClickWrap>{text}</ClickWrap>
      },
    },
    {
      title: <NewSort fixedKey="name">{t('common.title')}</NewSort>,
      dataIndex: 'name',
      key: 'name',
      render: (
        text: string | number,
        record: Record<string, string | number>,
      ) => {
        return (
          <ClickWrap
            onClick={() => {
              navigate(
                `/Detail/Demand?type=info&id=${record.project_id}&demandId=${record.id}`,
              )
            }}
          >
            {text}
          </ClickWrap>
        )
      },
    },
    {
      title: (
        <NewSort fixedKey="child_story_count">
          {t('common.childDemand')}
        </NewSort>
      ),
      dataIndex: 'child_story_count',
      key: 'child_story_count',
      render: (text: string, record: any) => {
        return (
          <ChildDemandTable id={record.project_id} value={text} row={record} />
        )
      },
    },
    {
      title: <NewSort fixedKey="priority">{t('common.priority')}</NewSort>,
      dataIndex: 'priority',
      key: 'priority',
      render: (text: any, record: Record<string, string | number>) => {
        return (
          <div className={flexCss}>
            <div className={flexCss}>
              <IconFont
                type={text.icon}
                style={{
                  fontSize: 20,
                  marginRight: '10px',
                  color: text.color,
                }}
              />
              <span style={{ marginRight: '5px' }}>
                {text.content_txt || '--'}
              </span>
            </div>
            <Pop
              content={({ onHide }: { onHide(): void }) => (
                <LevelContent
                  onTap={state.updatePriority}
                  onHide={onHide}
                  record={record}
                />
              )}
              record={record}
            >
              <ShowWrap>
                <IconFont style={{ color: '#2877ff' }} type="down-icon" />
              </ShowWrap>
            </Pop>
          </div>
        )
      },
    },
    {
      title: <NewSort fixedKey="iterate_name">{t('common.iterate')}</NewSort>,
      dataIndex: 'iterate_name',
      key: 'iterate_name',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <NewSort fixedKey="tag">{t('common.tag')}</NewSort>,
      dataIndex: 'tag',
      key: 'tag',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <NewSort fixedKey="status">{t('common.status')}</NewSort>,
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: any) => {
        return (
          <Pop
            content={({ onHide }: { onHide(): void }) => {
              return (
                <ShapeContent
                  tap={state.updateStatus}
                  hide={onHide}
                  record={record}
                  row={record}
                />
              )
            }}
            record={record}
          >
            <StyledShape color={text.color}>{text.content_txt}</StyledShape>
          </Pop>
        )
      },
    },
    {
      title: <NewSort fixedKey="user_name">{t('common.createName')}</NewSort>,
      dataIndex: 'user_name',
      key: 'user_name',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <NewSort fixedKey="users_name">{t('common.dealName')}</NewSort>,
      dataIndex: 'users_name',
      key: 'users_name',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: t('common.copySend'),
      dataIndex: 'users_copysend_name',
      key: 'users_copysend_name',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <NewSort fixedKey="created_at">{t('common.createTime')}</NewSort>,
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: (
        <NewSort fixedKey="expected_start_at">
          {t('common.expectedStart')}
        </NewSort>
      ),
      dataIndex: 'expected_start_at',
      key: 'expected_start_at',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title:
        <NewSort fixedKey="expected_end_at">{t('common.expectedEnd')}</NewSort>
      ,
      dataIndex: 'expected_end_at',
      key: 'expected_end_at',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <NewSort fixedKey="updated_at">{t('common.lastTime')}</NewSort>,
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <NewSort fixedKey="finish_at">{t('common.finishTime')}</NewSort>,
      dataIndex: 'finish_at',
      key: 'finish_at',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
  ]
}
