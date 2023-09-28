import { Progress } from 'antd'
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

interface TaskListGroupProps {
  item: any
  onChangeData(obj: any): void
}

const TaskListGroup = (props: TaskListGroupProps) => {
  const { item } = props
  const [page, setPage] = useState(1)

  // 待审核数据加载更多
  const fetchMoreData = async () => {
    const newPage = page + 1
    setPage(newPage)
    console.log('加载更多')
  }

  return (
    <InfiniteScroll
      dataLength={item.stories?.list?.length}
      next={fetchMoreData}
      hasMore={item.stories?.list?.length < item?.stories?.pager?.total}
      loader={null}
      scrollableTarget="scrollableDiv"
      style={{
        overflowY: 'auto',
        overflowX: 'hidden',
        height: '100%',
      }}
      height="100%"
    >
      {item.stories?.list?.map((k: any) => (
        <CardItemTaskItem key={k.id}>
          <TaskItemTop>
            <div className="demandNumber">
              <img className="img" src={k?.project_category?.attachment_path} />
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
                  k?.category_status?.status?.is_start === 1 &&
                  k?.category_status?.status?.is_end === 2
                    ? 1
                    : k?.category_status?.status?.is_end === 1 &&
                      k?.category_status?.status?.is_start === 2
                    ? 2
                    : k?.category_status?.status?.is_start === 2 &&
                      k?.category_status?.status?.is_end === 2
                    ? 3
                    : 0
                }
              />
              <div className="name">{k?.category_status?.status?.content}</div>
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
    </InfiniteScroll>
  )
}

interface KanBanCardGroupProps {
  leftWidth: number
}

const KanBanCardGroup = (props: KanBanCardGroupProps) => {
  const dataList = [
    {
      id: 42,
      name: 'gravel',
      avatar:
        'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1551751383370940418/2023-06-05/79a18410-5c26-46ba-91d9-0f0c158a18a1.jpeg',
      department_id: '1536623731029880833',
      job_id: '1542006731630149634',
      departments: [
        {
          id: '1622899318493040642',
          name: '成都定星科技',
          parent_id: 0,
        },
        {
          id: '1536623731029880833',
          name: '1',
          parent_id: '1622899318493040642',
        },
      ],
      overall_schedule: 65.18,
      stories: {
        list: [
          {
            id: 1006008,
            project_id: 483,
            name: '需要审核的需求',
            info: '',
            expected_end_at: '2023-09-10',
            category_id: 814,
            finish_at: null,
            priority: 13321,
            project_type: 2,
            is_bug: 2,
            is_public: 3,
            story_prefix_key: 'WFCCXM--KF-9',
            attachments: [
              {
                id: 668,
                path: 'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/22669459/dev/1_15245_3.jpg/file/1695871301942/1_15245_3.jpg',
                name: '1_15245_3.jpg',
                ext: 'jpg',
                size: 129127,
                created_at: '2023-09-28 11:21:43',
              },
              {
                id: 669,
                path: 'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/22669459/dev/1000_0.jpeg/file/1695871306849/1000_0.jpeg',
                name: '1000_0.jpeg',
                ext: 'jpeg',
                size: 10896,
                created_at: '2023-09-28 11:21:47',
              },
            ],
            user_schedule: {
              story_id: 1006008,
              user_id: 42,
              schedule: 0,
              total_task_time: 0,
              is_normal: 2,
            },
            category_status: {
              id: 2583,
              is_start: 2,
              is_end: 2,
              status_id: 13325,
              status: {
                id: 13325,
                project_id: 483,
                company_id: '1504303190303051778',
                content: '实现中',
                color: '#2877FF',
                sort: 30,
                content_txt: '',
                group_content_txt: '',
              },
            },
            config_priority: {
              id: 13321,
              content: '中',
              sort: 30,
              color: '#2877FF',
              icon: 'middle',
              identity: 'priority',
              content_txt: '中',
              group_content_txt: '',
            },
            project_category: {
              id: 814,
              name: '需要审核',
              is_bug: 2,
              attachment_path:
                'https://agile-api.dev.staryuntech.com/attachment/category_icon/picture.png',
            },
          },
          {
            id: 1006004,
            project_id: 483,
            name: '子任务1',
            info: '',
            expected_end_at: '2023-08-24',
            category_id: 644,
            finish_at: null,
            priority: 13321,
            project_type: 2,
            is_bug: 2,
            is_public: 3,
            story_prefix_key: 'WFCCXM--KF-8',
            attachments: [
              {
                id: 671,
                path: 'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/22669459/dev/1000_0.jpeg/file/1695873764653/1000_0.jpeg',
                name: '1000_0.jpeg',
                ext: 'jpeg',
                size: 10896,
                created_at: '2023-09-28 12:02:47',
              },
            ],
            user_schedule: {
              story_id: 1006004,
              user_id: 42,
              schedule: 17,
              total_task_time: 14400,
              is_normal: 2,
            },
            category_status: {
              id: 2021,
              is_start: 2,
              is_end: 2,
              status_id: 13325,
              status: {
                id: 13325,
                project_id: 483,
                company_id: '1504303190303051778',
                content: '实现中',
                color: '#2877FF',
                sort: 30,
                content_txt: '',
                group_content_txt: '',
              },
            },
            config_priority: {
              id: 13321,
              content: '中',
              sort: 30,
              color: '#2877FF',
              icon: 'middle',
              identity: 'priority',
              content_txt: '中',
              group_content_txt: '',
            },
            project_category: {
              id: 644,
              name: '子任务',
              is_bug: 2,
              attachment_path:
                'https://agile-api.dev.staryuntech.com/attachment/category_icon/message.png',
            },
          },
          {
            id: 1006003,
            project_id: 483,
            name: '长故事1',
            info: '',
            expected_end_at: '2023-08-31',
            category_id: 643,
            finish_at: '2023-08-31 17:17:15',
            priority: 13321,
            project_type: 2,
            is_bug: 2,
            is_public: 3,
            story_prefix_key: 'WFCCXM--KF-7',
            attachments: [],
            user_schedule: {
              story_id: 1006003,
              user_id: 42,
              schedule: 100,
              total_task_time: 21600,
              is_normal: 2,
            },
            category_status: {
              id: 2019,
              is_start: 2,
              is_end: 1,
              status_id: 13326,
              status: {
                id: 13326,
                project_id: 483,
                company_id: '1504303190303051778',
                content: '已实现',
                color: '#43BA9A',
                sort: 20,
                content_txt: '',
                group_content_txt: '',
              },
            },
            config_priority: {
              id: 13321,
              content: '中',
              sort: 30,
              color: '#2877FF',
              icon: 'middle',
              identity: 'priority',
              content_txt: '中',
              group_content_txt: '',
            },
            project_category: {
              id: 643,
              name: '长故事',
              is_bug: 2,
              attachment_path:
                'https://agile-api.dev.staryuntech.com/attachment/category_icon/pencil.png',
            },
          },
          {
            id: 1005991,
            project_id: 483,
            name: '新建一个需求',
            info: '',
            expected_end_at: '2023-08-31',
            category_id: 645,
            finish_at: null,
            priority: 13321,
            project_type: 2,
            is_bug: 2,
            is_public: 3,
            story_prefix_key: 'WFCCXM--KF-6',
            attachments: [],
            user_schedule: {
              story_id: 1005991,
              user_id: 42,
              schedule: 0,
              total_task_time: 10800,
              is_normal: 1,
            },
            category_status: {
              id: 2024,
              is_start: 2,
              is_end: 2,
              status_id: 13325,
              status: {
                id: 13325,
                project_id: 483,
                company_id: '1504303190303051778',
                content: '实现中',
                color: '#2877FF',
                sort: 30,
                content_txt: '',
                group_content_txt: '',
              },
            },
            config_priority: {
              id: 13321,
              content: '中',
              sort: 30,
              color: '#2877FF',
              icon: 'middle',
              identity: 'priority',
              content_txt: '中',
              group_content_txt: '',
            },
            project_category: {
              id: 645,
              name: '需求',
              is_bug: 2,
              attachment_path:
                'https://agile-api.dev.staryuntech.com/attachment/category_icon/security.png',
            },
          },
          {
            id: 1005989,
            project_id: 483,
            name: '新建一个逾期的事务',
            info: '',
            expected_end_at: '2023-08-21',
            category_id: 645,
            finish_at: null,
            priority: 13321,
            project_type: 2,
            is_bug: 2,
            is_public: 3,
            story_prefix_key: 'WFCCXM--KF-5',
            attachments: [],
            user_schedule: {
              story_id: 1005989,
              user_id: 42,
              schedule: 0,
              total_task_time: -3600,
              is_normal: 1,
            },
            category_status: {
              id: 2024,
              is_start: 2,
              is_end: 2,
              status_id: 13325,
              status: {
                id: 13325,
                project_id: 483,
                company_id: '1504303190303051778',
                content: '实现中',
                color: '#2877FF',
                sort: 30,
                content_txt: '',
                group_content_txt: '',
              },
            },
            config_priority: {
              id: 13321,
              content: '中',
              sort: 30,
              color: '#2877FF',
              icon: 'middle',
              identity: 'priority',
              content_txt: '中',
              group_content_txt: '',
            },
            project_category: {
              id: 645,
              name: '需求',
              is_bug: 2,
              attachment_path:
                'https://agile-api.dev.staryuntech.com/attachment/category_icon/security.png',
            },
          },
        ],
        pager: {
          total: 11,
          page: 1,
          pagesize: 10,
        },
      },
      position: {
        id: '1542006731630149634',
        name: 'php工程师',
      },
    },
  ]

  //   加载更多修改数组
  const onChangeData = (value: any) => {
    //
  }

  return (
    <KanBanCardGroupWrap style={{ width: `calc(100% - ${props.leftWidth}px)` }}>
      <KanBanCardGroupBox size={16}>
        {dataList?.map((i: any) => (
          <KanBanCardItem key={i.id}>
            <CardItemHeader>
              <div className="avatar">
                <img src={i.avatar} />
              </div>
              <div className="content">
                <div className="nameBox">
                  <div className="name">
                    {i.name}（{i?.position?.name}）
                  </div>
                </div>
                <div className="sub">
                  {i?.departments?.map((i: any) => i.name)?.join(' - ')}
                </div>
                <div className="task">
                  <div className="label">{i?.stories?.pager?.total}项任务</div>
                  <Progress
                    strokeColor="var(--function-success)"
                    style={{
                      color: 'var(--function-success)',
                      width: 94,
                      paddingRight: 8,
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
            <TaskListGroup item={i} onChangeData={onChangeData} />
          </KanBanCardItem>
        ))}
      </KanBanCardGroupBox>
    </KanBanCardGroupWrap>
  )
}

export default KanBanCardGroup
