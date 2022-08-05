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
import { ShowWrap, StyledShape } from '@/components/StyleCommon'
import Sort from '@/components/Sort'
import { useNavigate } from 'react-router-dom'
import { ChildDemandTable } from '@/views/Project/Detail/Iteration/Demand'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const flexCss = css`
  display: flex;
  align-items: center;
`

const SetHead = styled.div`
  margin-left: 32px;
  margin-right: 12px;
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border-radius: 50%;
  font-size: 12px;
  background: rgba(40, 119, 255, 1);
  background-blend-mode: normal;
  border: 2px solid rgba(40, 119, 255, 0.16);
  border: 1px solid rgba(40, 119, 255, 1);
  color: white;
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

  const MoreWrap = (record: any) => {
    const [isMoreVisible, setIsMoreVisible] = useState(false)
    const menu = (
      <Menu
        items={[
          {
            key: '1',
            label: (
              <span onClick={() => state.showEdit(record)}>
                {t('common.edit')}
              </span>
            ),
          },
          {
            key: '2',
            label: (
              <span onClick={() => state.showDel(record)}>
                {t('common.del')}
              </span>
            ),
          },
        ]}
      />
    )
    return (
      <ShowWrap>
        <Dropdown
          key={isMoreVisible.toString()}
          visible={isMoreVisible}
          onVisibleChange={visible => setIsMoreVisible(visible)}
          trigger={['hover']}
          overlay={menu}
          placement="bottomLeft"
          getPopupContainer={node => node}
        >
          <IconFont
            type="more"
            style={{ color: 'rgba(40, 119, 255, 1)', fontSize: 20 }}
          />
        </Dropdown>
      </ShowWrap>
    )
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
          <div className={flexCss}>
            <MoreWrap record={record} />
            <SetHead>{text}</SetHead>
            <span>{text}</span>
          </div>
        )
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
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => {
              navigate(
                `/Detail/Demand?type=info&id=${record.project_id}&demandId=${record.id}`,
              )
            }}
          >
            {text}
          </div>
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
                  {text.content || '--'}
                </span>
              </div>

              <ShowWrap>
                <IconFont style={{ color: '#2877ff' }} type="down-icon" />
              </ShowWrap>
            </div>
          </Pop>
        )
      },
    },
    {
      title: <NewSort fixedKey="iterate_name">{t('common.iterate')}</NewSort>,
      dataIndex: 'iterate_name',
      key: 'iterate_name',
    },
    {
      title: <NewSort fixedKey="tag">标签</NewSort>,
      dataIndex: 'tag',
      key: 'tag',
    },
    {
      title: <NewSort fixedKey="status">状态</NewSort>,
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
                />
              )
            }}
            record={record}
          >
            <StyledShape color={text.color}>{text.content}</StyledShape>
          </Pop>
        )
      },
    },
    {
      title: <NewSort fixedKey="user_name">创建人</NewSort>,
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: '处理人',
      dataIndex: 'users_name',
      key: 'users_name',
    },
    {
      title: '抄送人',
      dataIndex: 'users_copysend_name',
      key: 'users_copysend_name',
    },
    {
      title: <NewSort fixedKey="created_at">创建时间</NewSort>,
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: <NewSort fixedKey="expected_start_at">预计开始时间</NewSort>,
      dataIndex: 'expected_start_at',
      key: 'expected_start_at',
    },
    {
      title: <NewSort fixedKey="expected_end_at">预计结束时间</NewSort>,
      dataIndex: 'expected_end_at',
      key: 'expected_end_at',
    },
    {
      title: <NewSort fixedKey="updated_at">最后修改时间</NewSort>,
      dataIndex: 'updated_at',
      key: 'updated_at',
    },
    {
      title: <NewSort fixedKey="finish_at">完成时间</NewSort>,
      dataIndex: 'finish_at',
      key: 'finish_at',
    },
  ]
}
