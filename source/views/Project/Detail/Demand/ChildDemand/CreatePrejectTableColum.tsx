/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-handler-names */
import { Dropdown, Menu } from 'antd'
import { ShapeContent } from '@/components/Shape'
import { LevelContent } from '@/components/Level'
import PopConfirm from '@/components/Popconfirm'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import Sort from '@/components/Sort'
import { OmitText } from '@star-yun/ui'
import { getIsPermission } from '@/tools/index'
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
  const hasEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/update',
  )
  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/delete',
  )

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

  const menu = (item: any) => {
    let menuItems = [
      {
        key: '1',
        label:
          <div onClick={e => state.onEdit(e, item)}>{t('common.edit')}</div>
        ,
      },
      {
        key: '2',
        label:
          <div onClick={() => state.onDelete(item)}>{t('common.del')}</div>
        ,
      },
    ]

    if (hasEdit) {
      menuItems = menuItems.filter((i: any) => i.key !== '1')
    }

    if (hasDel) {
      menuItems = menuItems.filter((i: any) => i.key !== '2')
    }

    return <Menu items={menuItems} />
  }

  return [
    {
      width: 200,
      align: 'center',
      title: <NewSort fixedKey="id">ID</NewSort>,
      dataIndex: 'id',
      key: 'id',
      render: (text: any, record: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {hasEdit && hasDel
              ? null
              : (
                  <Dropdown
                    overlay={menu(record)}
                    trigger={['hover']}
                    placement="bottomRight"
                    getPopupContainer={node => node}
                  >
                    {state.rowIconFont()}
                  </Dropdown>
                )}
            <div style={{ marginLeft: 32 }}>{text}</div>
          </div>
        )
      },
    },
    {
      title: <NewSort fixedKey="name">标题</NewSort>,
      dataIndex: 'name',
      key: 'name',
      render: (
        text: string | number,
        record: Record<string, string | number>,
      ) => {
        return (
          <ClickWrap onClick={() => state.onClickItem(record)}>
            <OmitText width={200}>{text}</OmitText>
          </ClickWrap>
        )
      },
    },
    {
      title: <NewSort fixedKey="status">状态</NewSort>,
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
            <StatusWrap color={text.color}>{text.content}</StatusWrap>
          </PopConfirm>
        )
      },
    },
    {
      title: <NewSort fixedKey="priority">优先级</NewSort>,
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
                <span>{text.content || '--'}</span>
                <IconFont className="icon" type="down-icon" />
              </div>
            </PriorityWrap>
          </PopConfirm>
        )
      },
    },
    {
      title: <NewSort fixedKey="child_story_count">需求</NewSort>,
      dataIndex: 'demand',
      key: 'child_story_count',
    },
    {
      title: <NewSort fixedKey="iterate_name">迭代</NewSort>,
      dataIndex: 'iteration',
      key: 'iterate_name',
    },
    {
      title: <NewSort fixedKey="tag">标签</NewSort>,
      dataIndex: 'tag',
      key: 'tag',
    },

    {
      title: <NewSort fixedKey="user_name">创建人</NewSort>,
      dataIndex: 'userName',
      key: 'user_name',
    },
    {
      title: '处理人',
      dataIndex: 'dealName',
      key: 'users_name',
    },
    {
      title: <NewSort fixedKey="users_copysend_name">抄送人</NewSort>,
      dataIndex: 'usersCopySendName',
      key: 'users_copysend_name',
    },
    {
      title: <NewSort fixedKey="created_at">创建时间</NewSort>,
      dataIndex: 'time',
      key: 'created_at',
    },
    {
      title: <NewSort fixedKey="expected_start_at">预计开始时间</NewSort>,
      dataIndex: 'expectedStart',
      key: 'expected_start_at',
    },
    {
      title: <NewSort fixedKey="expected_end_at">预计结束时间</NewSort>,
      dataIndex: 'expectedEnd',
      key: 'expected_end_at',
    },
    {
      title: <NewSort fixedKey="updated_at">最后修改时间</NewSort>,
      dataIndex: 'updatedTime',
      key: 'updated_at',
    },
    {
      title: <NewSort fixedKey="finish_at">完成时间</NewSort>,
      dataIndex: 'finishTime',
      key: 'finish_at',
    },
  ]
}
