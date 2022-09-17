/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-handler-names */
import { ShapeContent } from '@/components/Shape'
import { LevelContent } from '@/components/Level'
import Pop from '@/components/Popconfirm'
import IconFont from '@/components/IconFont'
import { css } from '@emotion/css'
import {
  ClickWrap,
  ShowWrap,
  StyledShape,
  CategoryWrap,
} from '@/components/StyleCommon'
import Sort from '@/components/Sort'
import ChildDemandTable from '@/components/ChildDemandTable'
import { useTranslation } from 'react-i18next'
import { OmitText } from '@star-yun/ui'
import { openDetail } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
import { message } from 'antd'
import review from '/review.png'
import DemandProgress from '@/components/DemandProgress'

const flexCss = css`
  display: flex;
  align-items: center;
  cursor: pointer;
`

export const useDynamicColumns = (state: any) => {
  const [t] = useTranslation()

  const onToDetail = (item: any) => {
    const params = encryptPhp(
      JSON.stringify({
        type: 'info',
        id: item.project_id,
        demandId: item.id,
      }),
    )
    if (state.showOpen) {
      if (item.project?.is_public !== 1 && !item.project?.user_ismember) {
        message.warning(t('common.notCheckInfo'))
      } else {
        openDetail(`/Detail/Demand?data=${params}`)
      }
    } else {
      openDetail(`/Detail/Demand?data=${params}`)
    }
  }

  const onExamine = () => {
    message.warning('该需求正在审核中，现在不能流转操作')
  }

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
      render: (text: string, record: any) => {
        return (
          <ClickWrap
            onClick={() => onToDetail(record)}
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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CategoryWrap
              color="#43BA9A"
              bgColor="#EDF7F4"
              style={{ marginLeft: 0 }}
            >
              软件需求
            </CategoryWrap>
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
              <OmitText width={200}>{text}</OmitText>
              <IconFont
                type="review"
                style={{
                  fontSize: 46,
                  position: 'absolute',
                  left: -20,
                  top: 0,
                }}
              />
            </ClickWrap>
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
      dataIndex: 'demand',
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
                    fontSize: 16,
                    marginRight: '8px',
                    color: text.color,
                  }}
                />
                <span style={{ marginRight: '5px' }}>
                  {text.content_txt || '--'}
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
      title: <NewSort fixedKey="status">{t('common.status')}</NewSort>,
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: any) => {
        return (
          <Pop
            content={({ onHide }: { onHide(): void }) => {
              return record.isExamine
                ? null
                : (
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
            <StyledShape
              onClick={record.isExamine ? onExamine : void 0}
              color={text.color}
            >
              {text.content_txt}
            </StyledShape>
          </Pop>
        )
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
      title: <NewSort fixedKey="users_name">需求进度</NewSort>,
      dataIndex: 'progress',
      key: 'progress',
      width: 80,
      render: (text: string, record: any) => {
        return <DemandProgress value={60} row={record} />
      },
    },
    {
      title: t('common.copySend'),
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
