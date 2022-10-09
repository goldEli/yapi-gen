/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-handler-names */
import { ShapeContent } from '@/components/Shape'
import { LevelContent } from '@/components/Level'
import PopConfirm from '@/components/Popconfirm'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import Sort from '@/components/Sort'
import { OmitText } from '@star-yun/ui'
import { CategoryWrap, ClickWrap, StatusWrap } from '@/components/StyleCommon'
import { useTranslation } from 'react-i18next'
import { useModel } from '@/models'
import ChildDemandTable from '@/components/ChildDemandTable'
import { message, Tooltip } from 'antd'
import DemandProgress from './DemandProgress'

const PriorityWrap = styled.div<{ isShow?: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
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
  },
  ({ isShow }) => ({
    cursor: isShow ? 'pointer' : 'inherit',
    '&: hover': {
      '.icon': {
        visibility: isShow ? 'visible' : 'hidden',
      },
    },
  }),
)

export const useDynamicColumns = (state: any) => {
  const [t] = useTranslation()
  const { projectInfo, colorList } = useModel('project')
  const isCanEdit
    = projectInfo.projectPermissions?.length > 0
    || projectInfo.projectPermissions?.filter((i: any) => i.name === '编辑需求')
      ?.length > 0

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

  const onExamine = () => {
    message.warning('该需求正在审核中，现在不能流转操作')
  }

  const onUpdate = () => {
    state.onUpdate(true)
  }

  const arr = [
    {
      width: 100,
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
      width: 340,
      render: (text: string | number, record: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip placement="topLeft" title={record.categoryRemark}>
              <CategoryWrap
                color={record.categoryColor}
                bgColor={
                  colorList?.filter(
                    (k: any) => k.key === record.categoryColor,
                  )[0]?.bgColor
                }
                style={{ marginLeft: 0 }}
              >
                {record.category}
              </CategoryWrap>
            </Tooltip>
            <ClickWrap
              style={{
                position: 'relative',
                height: 46,
                lineHeight: '46px',
              }}
              isName
              isClose={record.status?.content === '已关闭'}
              onClick={() => state.onClickItem(record)}
            >
              <OmitText width={160}>{text}</OmitText>
              {record.isExamine && (
                <IconFont
                  type="review"
                  style={{
                    fontSize: 46,
                    position: 'absolute',
                    left: -20,
                    top: 0,
                  }}
                />
              )}
            </ClickWrap>
          </div>
        )
      },
    },
    {
      title: <NewSort fixedKey="status">{t('common.status')}</NewSort>,
      dataIndex: 'status',
      key: 'status',
      width: 180,
      render: (text: any, record: any) => {
        return (
          <PopConfirm
            content={({ onHide }: { onHide(): void }) => {
              return isCanEdit && !record.isExamine ? (
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
              ) : null
            }}
            record={record}
          >
            <StatusWrap
              onClick={record.isExamine ? onExamine : void 0}
              isShow={isCanEdit || record.isExamine}
              style={{
                color: text?.status.color,
                border: `1px solid ${text?.status.color}`,
              }}
            >
              {text?.status.content}
            </StatusWrap>
          </PopConfirm>
        )
      },
    },
    {
      title: <NewSort fixedKey="priority">{t('common.priority')}</NewSort>,
      dataIndex: 'priority',
      key: 'priority',
      width: 180,
      render: (text: any, record: Record<string, string | number>) => {
        return (
          <PopConfirm
            content={({ onHide }: { onHide(): void }) => {
              return isCanEdit ? (
                <LevelContent
                  onTap={item => state.onChangeState(item)}
                  onHide={onHide}
                  record={{ project_id: state.projectId, id: record.id }}
                />
              ) : null
            }}
            record={record}
          >
            <PriorityWrap isShow={isCanEdit}>
              <IconFont
                className="priorityIcon"
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
      title: (
        <NewSort fixedKey="child_story_count">
          {t('common.childDemand')}
        </NewSort>
      ),
      dataIndex: 'demand',
      key: 'child_story_count',
      width: 200,
      render: (text: string, record: any) => {
        return state.showChildCOntent
          ? <ChildDemandTable value={text} row={record} />
          : <span>{text || '--'}</span>

      },
    },
    {
      title: <NewSort fixedKey="iterate_name">{t('common.iterate')}</NewSort>,
      dataIndex: 'iteration',
      key: 'iterate_name',
      width: 120,
      render: (text: string) => {
        return <OmitText width={120}>{text || '--'}</OmitText>
      },
    },
    {
      title: <NewSort fixedKey="tag">{t('common.tag')}</NewSort>,
      dataIndex: 'tag',
      key: 'tag',
      width: 120,
      render: (text: string) => {
        return <OmitText width={120}>{text || '--'}</OmitText>
      },
    },

    {
      title: <NewSort fixedKey="user_name">{t('common.createName')}</NewSort>,
      dataIndex: 'userName',
      key: 'user_name',
      width: 120,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: t('common.dealName'),
      dataIndex: 'dealName',
      key: 'users_name',
      width: 200,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <NewSort fixedKey="schedule">需求进度</NewSort>,
      dataIndex: 'schedule',
      key: 'schedule',
      width: 120,
      render: (text: string, record: any) => {
        return (
          <DemandProgress
            value={record.schedule}
            row={record}
            onUpdate={onUpdate}
          />
        )
      },
    },
    {
      title: t('common.copySend'),
      dataIndex: 'usersCopySendName',
      key: 'users_copysend_name',
      width: 200,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <NewSort fixedKey="created_at">{t('common.createTime')}</NewSort>,
      dataIndex: 'time',
      key: 'created_at',
      width: 200,
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
      width: 200,
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
      width: 200,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <NewSort fixedKey="updated_at">{t('common.lastTime')}</NewSort>,
      dataIndex: 'updatedTime',
      key: 'updated_at',
      width: 200,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <NewSort fixedKey="finish_at">{t('common.finishTime')}</NewSort>,
      dataIndex: 'finishTime',
      key: 'finish_at',
      width: 200,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
  ]

  const getArr = () => {
    const result: any = []
    projectInfo?.plainOptions3?.forEach((element: any) => {
      result.unshift({
        width: 200,
        title: <NewSort fixedKey={element.value}>{element.label}</NewSort>,
        dataIndex: element.value,
        key: element.value,
        render: (text: any, record: any) => {
          return <span>{text?.value || '--'}</span>
        },
      })
    })

    return arr.slice(0, -5).concat(result.concat(arr.slice(-5)))
  }

  return getArr()
}
