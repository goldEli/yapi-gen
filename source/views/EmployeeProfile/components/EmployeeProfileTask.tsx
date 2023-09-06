/* eslint-disable no-undefined */
import { useSelector } from '@store/index'
import {
  TagWrap,
  TaskItemBox,
  TaskItemGroup,
  TaskItemPerson,
  TaskItemWrap,
  TaskWrap,
} from '../style'
import { useEffect, useState } from 'react'
import { getMemberOverviewStoryList } from '@/services/employeeProfile'
import NoData from '@/components/NoData'
import CommonUserAvatar from '@/components/CommonUserAvatar'

interface TaskItemContentProps {
  row: any
}

const TaskItemContent = (props: TaskItemContentProps) => {
  const { row } = props
  const [tagWidth, setTagWidth] = useState<number>(0)

  useEffect(() => {
    const dom = document.createElement('div')
    dom.innerText = `逾期${Math.ceil(row.overdue_time / 86400)}天`
    console.log(dom.offsetWidth, 'dom.clientWidthdom.clientWidth', dom)
  }, [row])

  return (
    <>
      <TagWrap>逾期{Math.ceil(row.overdue_time / 86400)}天</TagWrap>
    </>
  )
}

interface TaskItemProps {
  item: any
}

const TaskItem = (props: TaskItemProps) => {
  const { currentKey } = useSelector(store => store.employeeProfile)
  const { item } = props
  return (
    <TaskItemWrap>
      <TaskItemPerson>
        <CommonUserAvatar avatar={item.avatar} size="large" />
        <div className="info">
          <div className="name">
            {item.name}（{item.position.name}）
          </div>
          <div className="sub">
            {item.departments?.map((i: any) => i.name)?.join(' - ')}
          </div>
        </div>
      </TaskItemPerson>
      <TaskItemGroup>
        {item.story?.map((j: any) => (
          <TaskItemBox key={j.id}>
            <TaskItemContent row={j} />
            {/* <TagWrap>逾期{Math.ceil(j.overdue_time / 86400)}天</TagWrap> */}
            {/* <div className="top">
              <div className="topLeft">
                <div className="tag">
                  逾期{Math.ceil(j.overdue_time / 86400)}天
                </div>
                <div className="name">
                  【{j.story_prefix_key}】{j.name}
                </div>
                <div className="schedules">
                  ({j.schedules.schedule}%{' '}
                  {Math.abs(
                    Math.floor((j.schedules.total_task_time / 3600) * 100) /
                      100,
                  )}
                  h)
                </div>
              </div>
              <div className="topRight">{j.expected_end_at}逾期</div>
            </div>
            <div className='bottom'></div> */}
          </TaskItemBox>
        ))}
      </TaskItemGroup>
    </TaskItemWrap>
  )
}

const EmployeeProfileTask = () => {
  const { filterParams } = useSelector(store => store.employeeProfile)
  const [dataList, setDataList] = useState<any>({
    // list: undefined,
    list: [
      {
        id: 707,
        name: '飞飞',
        avatar:
          'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1551758466375991298/2023-04-27/studios_3.webp',
        position: {
          // id: 1542006731630149634,
          name: 'php工程师',
        },
        departments: [
          {
            // id: 1622899318493040642,
            name: '成都定星科技',
            parent_id: 0,
          },
          {
            // id: 1542006488750587906,
            name: 'php',
            // parent_id: 1622899318493040642,
          },
        ],
        story_total: 2,
        story: [
          {
            id: 1009074,
            name: '测试消息通知-FL222',
            info: '<p>测试消息通知-FL222</p>',
            expected_end_at: '2023-08-31',
            category_status_id: 5908,
            project_type: 1,
            is_bug: 2,
            finish_at: '2023-08-23 15:28:09',
            story_prefix_key: 'CC-CS-FL-0-39',
            is_star: 1,
            overdue_time: 7200,
            schedules: {
              schedule: 100,
              total_task_time: 7200,
            },
          },
          {
            id: 1006942,
            name: '事务11111233333333',
            info: '<p>事务11111233333222</p>',
            expected_end_at: '2023-07-31',
            category_status_id: 5902,
            project_type: 1,
            is_bug: 2,
            finish_at: '2023-08-23 15:24:25',
            story_prefix_key: 'CC-CS-FL-0-38',
            is_star: 1,
            overdue_time: 0,
            schedules: {
              schedule: 80,
              total_task_time: 3600,
            },
          },
        ],
      },
    ],
  })

  // 获取任务列表
  const getTaskList = async () => {
    const response = await getMemberOverviewStoryList(filterParams)
    console.log(response, '1212response')
    setDataList({ list: response.list || [] })
  }

  useEffect(() => {
    if (filterParams.status) {
      //调用任务接口
      // getTaskList()
    }
  }, [filterParams])

  return (
    <TaskWrap>
      {dataList?.list && dataList?.list?.length > 0 ? (
        dataList?.list?.map((i: any) => <TaskItem item={i} key={i.id} />)
      ) : (
        <NoData />
      )}
    </TaskWrap>
  )
}

export default EmployeeProfileTask
