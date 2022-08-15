/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-handler-names */
import { ShapeContent } from '@/components/Shape'
import { LevelContent } from '@/components/Level'
import PopConfirm from '@/components/Popconfirm'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import Sort from '@/components/Sort'
import { OmitText } from '@star-yun/ui'
import { useModel } from '@/models'
import { useTranslation } from 'react-i18next'
import { ClickWrap } from '@/components/StyleCommon'

const StatusWrap = styled.div<{ color?: string }>(
  {
    height: 22,
    borderRadius: 6,
    padding: '0 8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'fit-content',
    cursor: 'pointer',
  },
  ({ color }) => ({
    color,
    border: `1px solid ${color}`,
  }),
)

const PriorityWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  div: {
    color: '#323233',
    fontSize: 14,
    marginLeft: 8,
  },
  '.icon': {
    marginLeft: 8,
    visibility: 'hidden',
    fontSize: 16,
    color: '#2877ff',
  },
  '.priorityIcon': {
    fontSize: 16,
  },
  '&: hover': {
    '.icon': {
      visibility: 'visible',
    },
  },
})

export const useDynamicColumns = (state: any) => {
  const [t] = useTranslation()
  const { projectInfo } = useModel('project')

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
      width: 160,
      title: <NewSort fixedKey="id">ID</NewSort>,
      dataIndex: 'id',
      key: 'id',
      render: (text: string, record: any) => {
        return (
          <ClickWrap
            onClick={() => state.onClickItem(record)}
            isClose={record.status?.content === '已关闭'}
          >
            {text}
          </ClickWrap>
        )
      },
    },
    {
      title: <NewSort fixedKey="name">{t('common.title')}</NewSort>,
      dataIndex: 'name',
      key: 'name',
      render: (text: string | number, record: any) => {
        return (
          <ClickWrap
            isName
            isClose={record.status?.content === '已关闭'}
            onClick={() => state.onClickItem(record)}
          >
            <OmitText width={200}>{text}</OmitText>
          </ClickWrap>
        )
      },
    },
    {
      title: <NewSort fixedKey="status">{t('common.status')}</NewSort>,
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: any) => {
        return (
          <PopConfirm
            content={({ onHide }: { onHide(): void }) => {
              return (
                <ShapeContent
                  tap={value => state.onChangeStatus(value)}
                  hide={onHide}
                  row={record}
                  record={{
                    id: record.id,
                    project_id: state.projectId,
                    status: {
                      id: record.status.id,
                      can_changes: record.status.can_changes,
                    },
                  }}
                />
              )
            }}
            record={record}
          >
            <StatusWrap color={text.color}>{text.content_txt}</StatusWrap>
          </PopConfirm>
        )
      },
    },
    {
      title: <NewSort fixedKey="priority">{t('common.priority')}</NewSort>,
      dataIndex: 'priority',
      key: 'priority',
      render: (text: any, record: Record<string, string | number>) => {
        return (
          <PopConfirm
            content={({ onHide }: { onHide(): void }) => {
              return (
                <LevelContent
                  onTap={item => state.onChangeState(item)}
                  onHide={onHide}
                  record={{ project_id: state.projectId, id: record.id }}
                />
              )
            }}
            record={record}
          >
            <PriorityWrap>
              <IconFont
                type={text.icon}
                style={{
                  fontSize: 16,
                  color: text.color,
                }}
              />
              <div>
                <span>{text.content_txt || '--'}</span>
                <IconFont className="icon" type="down-icon" />
              </div>
            </PriorityWrap>
          </PopConfirm>
        )
      },
    },
    {
      title:
        <NewSort fixedKey="child_story_count">{t('common.demand')}</NewSort>
      ,
      dataIndex: 'demand',
      key: 'child_story_count',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <NewSort fixedKey="iterate_name">{t('common.iterate')}</NewSort>,
      dataIndex: 'iteration',
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
      title: <NewSort fixedKey="user_name">{t('common.createName')}</NewSort>,
      dataIndex: 'userName',
      key: 'user_name',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: t('common.dealName'),
      dataIndex: 'dealName',
      key: 'users_name',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title:
        <NewSort fixedKey="users_copysend_name">{t('common.copySend')}</NewSort>
      ,
      dataIndex: 'usersCopySendName',
      key: 'users_copysend_name',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <NewSort fixedKey="created_at">{t('common.createTime')}</NewSort>,
      dataIndex: 'time',
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
      dataIndex: 'expectedStart',
      key: 'expected_start_at',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title:
        <NewSort fixedKey="expected_end_at">{t('common.expectedEnd')}</NewSort>
      ,
      dataIndex: 'expectedEnd',
      key: 'expected_end_at',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <NewSort fixedKey="updated_at">{t('common.lastTime')}</NewSort>,
      dataIndex: 'updatedTime',
      key: 'updated_at',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <NewSort fixedKey="finish_at">{t('common.finishTime')}</NewSort>,
      dataIndex: 'finishTime',
      key: 'finish_at',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
  ]
}
