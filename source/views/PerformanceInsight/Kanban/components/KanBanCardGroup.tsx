import { Progress } from 'antd'
import {
  CardItemHeader,
  CardItemTaskItem,
  KanBanCardGroupBox,
  KanBanCardGroupWrap,
  KanBanCardItem,
} from '../style'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useState } from 'react'

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
      dataLength={item.story?.length}
      next={fetchMoreData}
      hasMore={item.story?.length < item?.story_total}
      loader={null}
      scrollableTarget="scrollableDiv"
      style={{
        overflowY: 'auto',
        overflowX: 'hidden',
        height: '100%',
      }}
      height="100%"
    >
      {item.story?.map((k: any) => (
        <CardItemTaskItem key={k.id}>{k.name}</CardItemTaskItem>
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
      id: 39,
      name: ' 汪志君',
      avatar:
        'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504303190676344834/2023-01-30/1622381402%281%29.jpg',
      position: {
        id: '1531919689278222338',
        name: '颠三倒四',
      },
      departments: [
        {
          id: '1622899318493040642',
          name: '成都定星科技',
          parent_id: 0,
        },
        {
          id: '1572411155857059841',
          name: '开发部',
          parent_id: '1622899318493040642',
        },
        {
          id: '1582640361156829185',
          name: '测试部门',
          parent_id: '1572411155857059841',
        },
        {
          id: 1666636259793043456,
          name: '测试部门主管',
          parent_id: '1582640361156829185',
        },
      ],
      story_total: 74,
      story: [
        {
          id: 1006129,
          project_id: 490,
          name: '1111111223232----',
          info: '',
          expected_end_at: null,
          finish_at: null,
          priority: 0,
          project_type: 1,
          is_bug: 2,
          is_public: 2,
          story_prefix_key: 'DWWCSDD-10',
          config_priority: null,
          schedules: {
            schedule: 38,
            total_task_time: 11628,
          },
          attachments: [
            {
              id: 667,
              path: 'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/22669459/dev/wwww2.jpeg/file/1695376482698/wwww2.jpeg',
              name: 'wwww2.jpeg',
              ext: 'jpeg',
              size: 127647,
              created_at: '2023-09-22 17:54:43',
            },
          ],
          overdue_time: 0,
          is_project_member: 1,
          status: 3,
        },
        {
          id: 1006113,
          project_id: 527,
          name: '0915测试',
          info: '',
          expected_end_at: '2023-09-14',
          finish_at: null,
          priority: 0,
          project_type: 2,
          is_bug: 2,
          is_public: 2,
          story_prefix_key: 'CSSY202309-1',
          config_priority: null,
          schedules: {
            schedule: 0,
            total_task_time: 0,
          },
          attachments: [],
          overdue_time: 921968,
          is_project_member: 2,
          status: 5,
        },
        {
          id: 1006111,
          project_id: 321,
          name: '测试长名字测试长名字测试长名字测试长名字测试长名字测试长名字测试长名字测试长名字测试长名字测试长名字测试长名字测试长名字测试长名字测试长名字测试长名字测试长名字测试长名字测试长名字测试长名字测试长',
          info: '',
          expected_end_at: '2023-09-12',
          finish_at: null,
          priority: 0,
          project_type: 1,
          is_bug: 2,
          is_public: 2,
          story_prefix_key: 'CSXM（JXL）-14',
          config_priority: null,
          schedules: {
            schedule: 0,
            total_task_time: 0,
          },
          attachments: [],
          overdue_time: 1094768,
          is_project_member: 1,
          status: 5,
        },
        {
          id: 1006092,
          project_id: 524,
          name: 'hahahah',
          info: '',
          expected_end_at: null,
          finish_at: null,
          priority: 0,
          project_type: 1,
          is_bug: 1,
          is_public: 1,
          story_prefix_key: 'DWWCSQX-5',
          config_priority: null,
          schedules: {
            schedule: 0,
            total_task_time: 0,
          },
          attachments: [],
          overdue_time: 0,
          is_project_member: 2,
          status: 3,
        },
        {
          id: 1006091,
          project_id: 524,
          name: '121212',
          info: '',
          expected_end_at: null,
          finish_at: null,
          priority: 0,
          project_type: 1,
          is_bug: 1,
          is_public: 1,
          story_prefix_key: 'DWWCSQX-4',
          config_priority: null,
          schedules: {
            schedule: 0,
            total_task_time: 0,
          },
          attachments: [],
          overdue_time: 0,
          is_project_member: 2,
          status: 3,
        },
        {
          id: 1006090,
          project_id: 524,
          name: '121212',
          info: '',
          expected_end_at: null,
          finish_at: null,
          priority: 0,
          project_type: 1,
          is_bug: 1,
          is_public: 1,
          story_prefix_key: 'DWWCSQX-3',
          config_priority: null,
          schedules: {
            schedule: 0,
            total_task_time: 0,
          },
          attachments: [],
          overdue_time: 0,
          is_project_member: 2,
          status: 3,
        },
        {
          id: 1006089,
          project_id: 524,
          name: '12112',
          info: '',
          expected_end_at: null,
          finish_at: null,
          priority: 0,
          project_type: 1,
          is_bug: 1,
          is_public: 1,
          story_prefix_key: 'DWWCSQX-2',
          config_priority: null,
          schedules: {
            schedule: 0,
            total_task_time: 0,
          },
          attachments: [],
          overdue_time: 0,
          is_project_member: 2,
          status: 3,
        },
        {
          id: 1006088,
          project_id: 524,
          name: '1121212',
          info: '',
          expected_end_at: null,
          finish_at: null,
          priority: 0,
          project_type: 1,
          is_bug: 1,
          is_public: 1,
          story_prefix_key: 'DWWCSQX-1',
          config_priority: null,
          schedules: {
            schedule: 0,
            total_task_time: 0,
          },
          attachments: [],
          overdue_time: 0,
          is_project_member: 2,
          status: 3,
        },
        {
          id: 1006060,
          project_id: 487,
          name: '小匠测试',
          info: '',
          expected_end_at: '2023-09-29',
          finish_at: null,
          priority: 0,
          project_type: 1,
          is_bug: 2,
          is_public: 1,
          story_prefix_key: 'XUEDDXM-16',
          config_priority: null,
          schedules: {
            schedule: 0,
            total_task_time: 0,
          },
          attachments: [],
          overdue_time: 0,
          is_project_member: 2,
          status: 3,
        },
        {
          id: 1006038,
          project_id: 327,
          name: '工时统计2',
          info: '',
          expected_end_at: '2023-08-29',
          finish_at: null,
          priority: 0,
          project_type: 1,
          is_bug: 2,
          is_public: 1,
          story_prefix_key: 'AGILE-1-16',
          config_priority: null,
          schedules: {
            schedule: 0,
            total_task_time: 0,
          },
          attachments: [],
          overdue_time: 2304368,
          is_project_member: 2,
          status: 5,
        },
        {
          id: 1006037,
          project_id: 327,
          name: '工时统计1',
          info: '',
          expected_end_at: '2023-08-29',
          finish_at: null,
          priority: 0,
          project_type: 1,
          is_bug: 2,
          is_public: 1,
          story_prefix_key: 'AGILE-1-15',
          config_priority: null,
          schedules: {
            schedule: 0,
            total_task_time: 0,
          },
          attachments: [],
          overdue_time: 2304368,
          is_project_member: 2,
          status: 5,
        },
        {
          id: 1006030,
          project_id: 327,
          name: 'BBBB',
          info: '',
          expected_end_at: '2023-08-25',
          finish_at: null,
          priority: 0,
          project_type: 1,
          is_bug: 2,
          is_public: 1,
          story_prefix_key: 'AGILE-1-14',
          config_priority: null,
          schedules: {
            schedule: 0,
            total_task_time: 0,
          },
          attachments: [],
          overdue_time: 2649968,
          is_project_member: 2,
          status: 5,
        },
        {
          id: 1006010,
          project_id: 483,
          name: '新增一个审核222',
          info: '',
          expected_end_at: '2023-09-08',
          finish_at: null,
          priority: 0,
          project_type: 2,
          is_bug: 2,
          is_public: 3,
          story_prefix_key: 'WFCCXM--KF-11',
          config_priority: null,
          schedules: {
            schedule: 0,
            total_task_time: 0,
          },
          attachments: [],
          overdue_time: 1440368,
          is_project_member: 1,
          status: 5,
        },
        {
          id: 1006009,
          project_id: 483,
          name: '新增一个审核111',
          info: '',
          expected_end_at: '2023-09-09',
          finish_at: null,
          priority: 0,
          project_type: 2,
          is_bug: 2,
          is_public: 3,
          story_prefix_key: 'WFCCXM--KF-10',
          config_priority: null,
          schedules: {
            schedule: 0,
            total_task_time: 0,
          },
          attachments: [],
          overdue_time: 1353968,
          is_project_member: 1,
          status: 5,
        },
        {
          id: 1005982,
          project_id: 490,
          name: '1211212',
          info: '',
          expected_end_at: '2023-09-03',
          finish_at: null,
          priority: 0,
          project_type: 1,
          is_bug: 1,
          is_public: 2,
          story_prefix_key: 'DWWCSDD-5',
          config_priority: null,
          schedules: {
            schedule: 5,
            total_task_time: 21600,
          },
          attachments: [],
          overdue_time: 1872368,
          is_project_member: 1,
          status: 5,
        },
      ],
    },
    {
      id: 42,
      name: 'gravel',
      avatar:
        'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1551751383370940418/2023-06-05/79a18410-5c26-46ba-91d9-0f0c158a18a1.jpeg',
      position: {
        id: '1542006731630149634',
        name: 'php工程师',
      },
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
      story_total: 32,
      story: [
        {
          id: 1006095,
          project_id: 62,
          name: 'bug111111111111',
          info: '',
          expected_end_at: null,
          finish_at: null,
          priority: 0,
          project_type: 1,
          is_bug: 1,
          is_public: 1,
          story_prefix_key: 'WFSYCSGZC-7',
          config_priority: null,
          schedules: {
            schedule: 0,
            total_task_time: 0,
          },
          attachments: [],
          overdue_time: 0,
          is_project_member: 1,
          status: 3,
        },
        {
          id: 1006009,
          project_id: 483,
          name: '新增一个审核111',
          info: '',
          expected_end_at: '2023-09-09',
          finish_at: null,
          priority: 0,
          project_type: 2,
          is_bug: 2,
          is_public: 3,
          story_prefix_key: 'WFCCXM--KF-10',
          config_priority: null,
          schedules: {
            schedule: 43,
            total_task_time: 3600,
          },
          attachments: [],
          overdue_time: 1353968,
          is_project_member: 1,
          status: 5,
        },
        {
          id: 1006008,
          project_id: 483,
          name: '需要审核的需求',
          info: '',
          expected_end_at: '2023-09-10',
          finish_at: null,
          priority: 0,
          project_type: 2,
          is_bug: 2,
          is_public: 3,
          story_prefix_key: 'WFCCXM--KF-9',
          config_priority: null,
          schedules: {
            schedule: 0,
            total_task_time: 0,
          },
          attachments: [],
          overdue_time: 1267568,
          is_project_member: 1,
          status: 5,
        },
        {
          id: 1006004,
          project_id: 483,
          name: '子任务1',
          info: '',
          expected_end_at: '2023-08-24',
          finish_at: null,
          priority: 0,
          project_type: 2,
          is_bug: 2,
          is_public: 3,
          story_prefix_key: 'WFCCXM--KF-8',
          config_priority: null,
          schedules: {
            schedule: 0,
            total_task_time: 0,
          },
          attachments: [],
          overdue_time: 2736368,
          is_project_member: 1,
          status: 5,
        },
        {
          id: 1006003,
          project_id: 483,
          name: '长故事1',
          info: '',
          expected_end_at: '2023-08-31',
          finish_at: '2023-08-31 17:17:15',
          priority: 0,
          project_type: 2,
          is_bug: 2,
          is_public: 3,
          story_prefix_key: 'WFCCXM--KF-7',
          config_priority: null,
          schedules: {
            schedule: 100,
            total_task_time: 21600,
          },
          attachments: [],
          overdue_time: 0,
          is_project_member: 1,
          status: 2,
        },
        {
          id: 1005991,
          project_id: 483,
          name: '新建一个需求',
          info: '',
          expected_end_at: '2023-08-31',
          finish_at: null,
          priority: 0,
          project_type: 2,
          is_bug: 2,
          is_public: 3,
          story_prefix_key: 'WFCCXM--KF-6',
          config_priority: null,
          schedules: {
            schedule: 0,
            total_task_time: 10800,
          },
          attachments: [],
          overdue_time: 0,
          is_project_member: 1,
          status: 4,
        },
        {
          id: 1005989,
          project_id: 483,
          name: '新建一个逾期的事务',
          info: '',
          expected_end_at: '2023-08-21',
          finish_at: null,
          priority: 0,
          project_type: 2,
          is_bug: 2,
          is_public: 3,
          story_prefix_key: 'WFCCXM--KF-5',
          config_priority: null,
          schedules: {
            schedule: 0,
            total_task_time: -3600,
          },
          attachments: [],
          overdue_time: 0,
          is_project_member: 1,
          status: 4,
        },
        {
          id: 1005988,
          project_id: 509,
          name: '1111111111',
          info: '',
          expected_end_at: '2023-08-24',
          finish_at: '2023-08-31 17:22:07',
          priority: 0,
          project_type: 2,
          is_bug: 2,
          is_public: 1,
          story_prefix_key: 'CCXMCSSWCS-2',
          config_priority: null,
          schedules: {
            schedule: 100,
            total_task_time: 75600,
          },
          attachments: [],
          overdue_time: 580928,
          is_project_member: 1,
          status: 5,
        },
        {
          id: 1003366,
          project_id: 509,
          name: '1111111111111111',
          info: '',
          expected_end_at: null,
          finish_at: '2023-08-11 01:23:34',
          priority: 0,
          project_type: 2,
          is_bug: 2,
          is_public: 1,
          story_prefix_key: 'CCXMCSSWCS-1',
          config_priority: null,
          schedules: [],
          attachments: [],
          overdue_time: 0,
          is_project_member: 1,
          status: 2,
        },
        {
          id: 1003224,
          project_id: 483,
          name: '4444444555555',
          info: '',
          expected_end_at: '2023-08-31',
          finish_at: null,
          priority: 0,
          project_type: 2,
          is_bug: 2,
          is_public: 3,
          story_prefix_key: 'WFCCXM--KF-4',
          config_priority: null,
          schedules: {
            schedule: 100,
            total_task_time: 4424400,
          },
          attachments: [],
          overdue_time: 0,
          is_project_member: 1,
          status: 4,
        },
        {
          id: 1003222,
          project_id: 483,
          name: '4444444555555',
          info: '',
          expected_end_at: null,
          finish_at: null,
          priority: 0,
          project_type: 2,
          is_bug: 2,
          is_public: 3,
          story_prefix_key: 'WFCCXM--KF-3',
          config_priority: null,
          schedules: [],
          attachments: [],
          overdue_time: 0,
          is_project_member: 1,
          status: 2,
        },
        {
          id: 1003221,
          project_id: 483,
          name: '333333333',
          info: '',
          expected_end_at: '2023-09-08',
          finish_at: null,
          priority: 0,
          project_type: 2,
          is_bug: 2,
          is_public: 3,
          story_prefix_key: 'WFCCXM--KF-2',
          config_priority: null,
          schedules: [],
          attachments: [],
          overdue_time: 1440368,
          is_project_member: 1,
          status: 5,
        },
        {
          id: 1003201,
          project_id: 321,
          name: 'test',
          info: '',
          expected_end_at: '2023-08-03',
          finish_at: null,
          priority: 0,
          project_type: 1,
          is_bug: 2,
          is_public: 2,
          story_prefix_key: 'CSXM（JXL）-13',
          config_priority: null,
          schedules: [],
          attachments: [],
          overdue_time: 4550768,
          is_project_member: 1,
          status: 5,
        },
        {
          id: 1003158,
          project_id: 483,
          name: '11111',
          info: '',
          expected_end_at: '2023-09-10',
          finish_at: null,
          priority: 0,
          project_type: 2,
          is_bug: 2,
          is_public: 3,
          story_prefix_key: 'WFCCXM--KF-1',
          config_priority: null,
          schedules: [],
          attachments: [],
          overdue_time: 1267568,
          is_project_member: 1,
          status: 5,
        },
        {
          id: 1003156,
          project_id: 321,
          name: '需求层级测试3',
          info: '',
          expected_end_at: '2023-08-31',
          finish_at: null,
          priority: 0,
          project_type: 1,
          is_bug: 2,
          is_public: 2,
          story_prefix_key: 'CSXM（JXL）-6',
          config_priority: null,
          schedules: {
            schedule: 0,
            total_task_time: 0,
          },
          attachments: [],
          overdue_time: 2131568,
          is_project_member: 1,
          status: 5,
        },
      ],
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
                  <div className="label">{i?.story_total}项任务</div>
                  <Progress
                    strokeColor="var(--function-success)"
                    style={{
                      color: 'var(--function-success)',
                      width: 94,
                      paddingRight: 8,
                    }}
                    type="line"
                    percent={100}
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
