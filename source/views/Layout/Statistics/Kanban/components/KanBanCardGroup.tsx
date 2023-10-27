import { Progress, Tooltip } from 'antd'
import {
  CardItemHeader,
  CardItemTaskItem,
  KanBanCardGroupBox,
  KanBanCardGroupWrap,
  KanBanCardItem,
  TaskItemBottom,
  TaskItemContent,
  TaskItemTop,
  TaskTag,
} from '../style'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useState } from 'react'
import PriorityIcon from '@/components/PriorityIcon'
import UploadAttach from '@/components/UploadAttach'
import { getPerformanceInsightKanBanListMore } from '@/services/performanceInsight'
import useOpenDemandDetail from '@/hooks/useOpenDemandDetail'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import NoData from '@/components/NoData'
import { useTranslation } from 'react-i18next'

interface TaskListGroupProps {
  item: any
  filterParams: any
  onChangeData(obj: any): void
}

const TaskListGroup = (props: TaskListGroupProps) => {
  const { item, filterParams } = props
  const [page, setPage] = useState(1)
  const [openDemandDetail] = useOpenDemandDetail()

  // 待审核数据加载更多
  const fetchMoreData = async () => {
    const newPage = page + 1
    setPage(newPage)
    const response = await getPerformanceInsightKanBanListMore({
      ...filterParams,
      user: item.id,
      project_ids: [
        ...new Set(
          filterParams?.user_ids?.map((i: any) => String(i)?.split('_')[0]),
        ),
      ],
      page: newPage,
    })
    // props.onChangeData({
    //   ...item,
    //   stories: {
    //     ...item.stories,
    //     list: [...item.stories?.list, ...response?.list],
    //   },
    // })
    props.onChangeData({
      ...item,
      stories: [...item.stories, ...response?.list],
    })
  }

  // 任务详情
  const onClickItem = (row: any) => {
    openDemandDetail(
      { ...row, ...{ projectId: row.project_id, notCanOperation: true } },
      row.project_id,
      row.id,
      row.project_type === 2 ? 1 : row.is_bug === 1 ? 2 : 3,
      true,
    )
  }

  return (
    <InfiniteScroll
      dataLength={item.stories?.length || 0}
      next={fetchMoreData}
      hasMore={item.stories?.length < item?.user_story_totals}
      loader={null}
      scrollableTarget="scrollableDiv"
      style={{
        overflowY: 'auto',
        overflowX: 'hidden',
        height: '100%',
      }}
      height="100%"
    >
      {item.stories?.length > 0 &&
        item.stories?.map((k: any) => (
          <CardItemTaskItem key={k.id}>
            <TaskItemTop>
              <div className="demandNumber">
                <img
                  className="img"
                  src={k?.project_category?.attachment_path}
                />
                <span className="label">{k?.story_prefix_key}</span>
              </div>
              <div className="priorityBox">
                <PriorityIcon
                  icon={k?.config_priority?.icon}
                  color={k?.config_priority?.color}
                />
                <span className="label">{k?.config_priority?.content_txt}</span>
              </div>
            </TaskItemTop>
            <TaskItemContent>
              <div
                className="name"
                style={{ marginBottom: k?.attachments?.length > 0 ? '4px' : 0 }}
                onClick={() => onClickItem(k)}
              >
                {k?.name}
              </div>
              <UploadAttach
                onlyView
                size="small"
                defaultList={k?.attachments?.map((i: any) => ({
                  url: i.path,
                  id: i.id,
                  size: Math.abs(i.size),
                  time: '--',
                  name: i.name || '--',
                  suffix: i.ext,
                  username: '--',
                }))}
                onChangeAttachment={() => {
                  //
                }}
              />
            </TaskItemContent>
            <TaskItemBottom>
              <div className="status">
                <TaskTag
                  state={
                    k?.category_status?.is_start === 1 &&
                    k?.category_status?.is_end === 2
                      ? 1
                      : k?.category_status?.is_end === 1 &&
                        k?.category_status?.is_start === 2
                      ? 2
                      : k?.category_status?.is_start === 2 &&
                        k?.category_status?.is_end === 2
                      ? 3
                      : 0
                  }
                />
                <div className="name">
                  {k?.category_status?.status?.content}
                </div>
              </div>
              <div className="right">
                <div>{k?.user_schedule?.schedule ?? 0}%</div>
                <div>
                  {k?.user_schedule?.total_task_time
                    ? Math.abs(
                        Math.floor(
                          (k?.user_schedule?.total_task_time / 3600) * 100,
                        ) / 100,
                      )
                    : 0}
                  h
                </div>
              </div>
            </TaskItemBottom>
          </CardItemTaskItem>
        ))}
      {item.stories?.length <= 0 && <NoData />}
    </InfiniteScroll>
  )
}

interface KanBanCardGroupProps {
  filterParams: any
  kanBanData: {
    list: any
    total: number
  }
  onChangeKanBanData(item: any): void
}

const KanBanCardGroup = (props: KanBanCardGroupProps) => {
  const { kanBanData, onChangeKanBanData } = props
  const [t] = useTranslation()
  return (
    <KanBanCardGroupWrap>
      <KanBanCardGroupBox size={16}>
        {kanBanData?.list?.map((i: any) => (
          <KanBanCardItem key={i.id}>
            <CardItemHeader>
              <div className="avatar">
                <CommonUserAvatar avatar={i.avatar} size="large" />
              </div>
              <div className="content">
                <div className="nameBox">
                  <Tooltip
                    trigger={['hover']}
                    placement="topLeft"
                    title={`${i.name}（${i?.position?.name || '--'}）`}
                    getPopupContainer={n => n}
                  >
                    <div className="name">
                      {i.name}（{i?.position?.name || '--'}）
                    </div>
                  </Tooltip>
                </div>
                <Tooltip
                  trigger={['hover']}
                  placement="topLeft"
                  getPopupContainer={n => n}
                  title={i?.departments?.map((i: any) => i.name)?.join(' - ')}
                >
                  <div className="sub">
                    {i?.departments?.map((i: any) => i.name)?.join(' - ')}
                  </div>
                </Tooltip>
                <div className="task">
                  <div className="label">
                    {t('taskTotal', { count: i?.user_story_totals })}
                  </div>
                  <Progress
                    strokeColor="var(--function-success)"
                    style={{
                      color: 'var(--function-success)',
                      width: 94,
                      paddingRight: String(i?.overall_schedule).split('.')[1]
                        ? 14
                        : 0,
                    }}
                    type="line"
                    percent={i?.overall_schedule}
                    format={percent =>
                      percent === 100 ? '100%' : `${percent}%`
                    }
                    strokeWidth={4}
                  />
                </div>
              </div>
            </CardItemHeader>
            <TaskListGroup
              item={i}
              onChangeData={onChangeKanBanData}
              filterParams={props.filterParams}
            />
          </KanBanCardItem>
        ))}
      </KanBanCardGroupBox>
    </KanBanCardGroupWrap>
  )
}

export default KanBanCardGroup
