/* eslint-disable react/jsx-no-leaked-render */
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
  HiddenText,
  ListNameWrap,
} from '@/components/StyleCommon'
import Sort from '@/components/Sort'
import ChildDemandTable from '@/components/ChildDemandTable'
import { useTranslation } from 'react-i18next'
import { OmitText } from '@star-yun/ui'
import { openDetail } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
import { message, Progress, Tooltip } from 'antd'
import DemandProgress from '@/components/DemandProgress'
import { useModel } from '@/models'

const flexCss = css`
  display: flex;
  align-items: center;
  cursor: pointer;
`

export const useDynamicColumns = (state: any) => {
  const [t] = useTranslation()
  const { colorList } = useModel('project')
  const { userInfo } = useModel('user')

  const onToDetail = (item: any) => {
    const params = encryptPhp(
      JSON.stringify({
        type: 'info',
        id: item.project_id,
        demandId: item.id,
      }),
    )
    if (item.project?.isPublic !== 1 && !item.project?.isUserMember) {
      message.warning(t('common.notCheckInfo'))
    } else {
      openDetail(`/Detail/Demand?data=${params}`)
    }
  }

  const onExamine = () => {
    message.warning(t('newlyAdd.underReview'))
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

  const onUpdate = () => {
    state.init(true)
  }

  const arr = [
    {
      width: 100,
      title: <NewSort fixedKey="id">ID</NewSort>,
      dataIndex: 'id',
      key: 'id',
      render: (text: string, record: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ClickWrap
              onClick={() => onToDetail(record)}
              isClose={record.status?.is_end === 1}
            >
              {text}
            </ClickWrap>
            {record.isExamine && (
              <IconFont
                type="review"
                style={{
                  fontSize: 46,
                }}
              />
            )}
          </div>
        )
      },
    },
    {
      title: <NewSort fixedKey="name">{t('common.title')}</NewSort>,
      dataIndex: 'name',
      key: 'name',
      render: (text: string | number, record: any) => {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Tooltip
              placement="top"
              getPopupContainer={node => node}
              title={record.categoryRemark}
            >
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
            <Tooltip title={text} getPopupContainer={node => node}>
              <ListNameWrap
                isName
                isClose={record.status?.is_end === 1}
                onClick={() => onToDetail(record)}
              >
                {text}
              </ListNameWrap>
            </Tooltip>
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
                  type={text?.icon}
                  style={{
                    fontSize: 20,
                    marginRight: '8px',
                    color: text?.color,
                  }}
                />
                <span style={{ marginRight: '5px' }}>
                  {text?.content_txt || '--'}
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
      title: <NewSort fixedKey="class">{t('newlyAdd.demandClass')}</NewSort>,
      dataIndex: 'class',
      key: 'class',
      width: 120,
      render: (text: string) => {
        return (
          <HiddenText>
            <OmitText
              width={120}
              tipProps={{
                getPopupContainer: node => node,
              }}
            >
              {text || '--'}
            </OmitText>
          </HiddenText>
        )
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
              return record.isExamine ? null : (
                <ShapeContent
                  tap={(value: any) => state.updateStatus(value)}
                  hide={onHide}
                  record={record}
                  row={record}
                />
              )
            }}
            record={record}
          >
            <StyledShape
              style={{ width: 'fit-content' }}
              onClick={record.isExamine ? onExamine : void 0}
              color={text?.status.color}
            >
              {text?.status.content}
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
      title: (
        <NewSort fixedKey="schedule">{t('newlyAdd.demandProgress')}</NewSort>
      ),
      dataIndex: 'schedule',
      key: 'schedule',
      width: 120,
      render: (text: string, record: any, index: any) => {
        return (
          <>
            {record?.usersNameIds?.includes(userInfo?.id) &&
            record.status.is_start !== 1 &&
            record.status.is_end !== 1 ? (
              <div style={{ cursor: 'pointer' }}>
                <DemandProgress
                  value={record.schedule}
                  row={record}
                  onUpdate={onUpdate}
                  listLength={state.listLength}
                  index={index}
                />
              </div>
            ) : (
              <Progress
                strokeColor="#43BA9A"
                style={{ color: '#43BA9A', cursor: 'not-allowed' }}
                width={38}
                type="circle"
                percent={record.schedule}
                format={percent => (percent === 100 ? '100%' : `${percent}%`)}
                strokeWidth={8}
              />
            )}
          </>
        )
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
      title: (
        <NewSort fixedKey="expected_end_at">{t('common.expectedEnd')}</NewSort>
      ),
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

  const getArr = () => {
    const result: any = []
    state.plainOptions3?.forEach((element: any) => {
      result.unshift({
        width: 200,
        title: <NewSort fixedKey={element.value}>{element.label}</NewSort>,
        dataIndex: element.value,
        key: element.value,
        render: (text: any) => {
          return (
            <span>
              {text?.value
                ? Array.isArray(text?.value)
                  ? text?.value?.join('、')
                  : text?.value
                : '--'}
            </span>
          )
        },
      })
    })

    return arr.slice(0, -5).concat(result.concat(arr.slice(-5)))
  }

  return getArr()
}
