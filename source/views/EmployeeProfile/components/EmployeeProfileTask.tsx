/* eslint-disable no-undefined */
import { useSelector } from '@store/index'
import {
  LoadingMore,
  TagWrap,
  TaskContent,
  TaskItemBox,
  TaskItemBoxs,
  TaskItemGroup,
  TaskItemPerson,
  TaskItemWrap,
  TaskWrap,
} from '../style'
import { useEffect, useRef, useState } from 'react'
import {
  getMemberOverviewMoreStoryList,
  getMemberOverviewStoryList,
} from '@/services/employeeProfile'
import NoData from '@/components/NoData'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import UploadAttach from '@/components/UploadAttach'
import CommonIconFont from '@/components/CommonIconFont'
import { Spin } from 'antd'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import useOpenDemandDetail from '@/hooks/useOpenDemandDetail'
import { getMessage } from '@/components/Message'
import { useTranslation } from 'react-i18next'

interface TaskItemContentProps {
  row: any
  // 当前人员的id
  id: number
}

const TaskItemContent = (props: TaskItemContentProps) => {
  const [t] = useTranslation()
  const { row, id } = props
  const tagRef = useRef<HTMLDivElement>(null)
  const [currentStatus, setCurrentStatus] = useState<any>({})
  const [tagWidth, setTagWidth] = useState<number>(0)
  const [openDemandDetail] = useOpenDemandDetail()

  const statusList = [
    {
      key: 2,
      name: t('completed'),
      bgColor: 'rgba(150,151,153,0.14)',
    },
    {
      key: 3,
      name: t('toBePlanned'),
      bgColor: ' rgba(102,136,255,0.2)',
    },
    {
      key: 4,
      name: t('inProgress'),
      bgColor: 'rgba(67,186,154,0.2)',
    },
    {
      key: 5,
      name: t('overdue'),
      bgColor: 'rgba(250,151,70,0.2)',
    },
  ]

  // 跳转详情
  const onToDetail = (item: any) => {
    if (item?.is_public !== 1 && item?.is_project_member !== 1) {
      getMessage({
        msg: t(
          'youAreNotAMemberOfTheCurrentProjectAndDoNotHavePermissionToView',
        ),
        type: 'warning',
      })
      return
    }
    openDemandDetail(
      { ...item, ...{ projectId: item.project_id, employeeCurrentId: id } },
      item.project_id,
      item.id,
      item.project_type === 2 ? 1 : item.is_bug === 1 ? 2 : 3,
      true,
      true,
    )
  }

  useEffect(() => {
    if (tagRef.current) {
      setTagWidth(tagRef.current.clientWidth + 11 || 0)
    }
  }, [tagRef])

  useEffect(() => {
    setCurrentStatus(statusList?.filter((i: any) => i.key === row.status)[0])
  }, [])

  return (
    <>
      <TagWrap
        ref={tagRef}
        style={{
          background: currentStatus?.bgColor,
        }}
      >
        {row.status === 5
          ? t('overdueTime', { day: Math.ceil(row.overdue_time / 86400) })
          : currentStatus?.name}
      </TagWrap>
      <TaskContent style={{ width: `calc(100% - ${tagWidth}px)` }}>
        <div className="nameBox" onClick={() => onToDetail(row)}>
          <div
            className="left"
            style={{ width: row.status === 5 ? '80%' : '100%' }}
          >
            <div className="name">
              【{row.story_prefix_key}】{row.name}
            </div>
            <div className="schedules">
              ({row.schedules.schedule}%{' '}
              {Math.abs(
                Math.floor((row.schedules.total_task_time / 3600) * 100) / 100,
              )}
              h)
            </div>
          </div>
          {row.status === 5 && (
            <div className="right">
              {t('timeOverdue', { time: row.expected_end_at })}
            </div>
          )}
        </div>
        <div className="info" onClick={() => onToDetail(row)}>
          {row.info || '--'}
        </div>
        <UploadAttach
          onlyView
          defaultList={row?.attachments?.map((i: any) => ({
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
      </TaskContent>
    </>
  )
}

interface TaskItemProps {
  item: any
  onChangeData(arr: any, id: number): void
}

const TaskItem = (props: TaskItemProps) => {
  const [t] = useTranslation()
  const { item, onChangeData } = props
  const [page, setPage] = useState(1)
  const { filterParams } = useSelector(store => store.employeeProfile)
  const [moreLoading, setMoreLoading] = useState(false)

  // 点击加载更多
  const onLoadingMore = async () => {
    setMoreLoading(true)
    const newPage = page + 1
    setPage(newPage)
    const response = await getMemberOverviewMoreStoryList({
      ...filterParams,
      ...{ page: newPage, user_id: item.id },
    })
    onChangeData(response, item.id)
    setMoreLoading(false)
  }

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
        {item.story?.length > 0 &&
          item.story?.map((j: any) => (
            <TaskItemBox key={j.id}>
              <TaskItemContent row={j} id={item.id} />
              {j.is_star === 1 && (
                <div className="icon">
                  <CommonIconFont type="star" color="#FA9746" size={14} />
                </div>
              )}
            </TaskItemBox>
          ))}
        {item.story?.length <= 0 && (
          <div style={{ color: 'var(--neutral-n3)' }}>{t('noTasksYet')}</div>
        )}
      </TaskItemGroup>
      {item.story_total > item.story?.length && (
        <LoadingMore onClick={onLoadingMore}>
          {moreLoading && (
            <img
              width={16}
              style={{ marginRight: 4 }}
              src="https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/shareLoading.gif"
            />
          )}
          {t('loadMoreTasksForThisMember')}
        </LoadingMore>
      )}
    </TaskItemWrap>
  )
}

const EmployeeProfileTask = () => {
  const { filterParams, taskDrawerUpdate } = useSelector(
    store => store.employeeProfile,
  )
  const [loading, setLoading] = useState(false)
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })

  // 获取任务列表
  const getTaskList = async () => {
    const response = await getMemberOverviewStoryList(filterParams)
    setDataList({ list: response })
    setLoading(false)
  }

  // 修改数据
  const onChangeData = (arr: any, id: number) => {
    setDataList({
      list: dataList?.list?.map((i: any) => ({
        ...i,
        ...{ story: i.id === id ? [...i.story, ...arr] : i.story },
      })),
    })
  }

  useEffect(() => {
    if (filterParams.status) {
      setDataList({ list: undefined })
      setLoading(true)
      //调用任务接口
      getTaskList()
    }
  }, [filterParams])

  useEffect(() => {
    if (taskDrawerUpdate.id) {
      //更新数据
      setDataList({
        list: dataList?.list?.map((i: any) => ({
          ...i,
          ...{
            story:
              i.id === taskDrawerUpdate?.id
                ? i.story?.map((j: any) =>
                    j.id === taskDrawerUpdate?.detailId
                      ? { ...j, is_star: taskDrawerUpdate?.state }
                      : j,
                  )
                : i.story,
          },
        })),
      })
    }
  }, [taskDrawerUpdate])

  return (
    <TaskWrap>
      <Spin
        spinning={loading}
        indicator={<NewLoadingTransition />}
        size="large"
      >
        <TaskItemBoxs>
          {!!dataList?.list &&
            (dataList?.list?.length > 0 ? (
              dataList?.list?.map((i: any) => (
                <TaskItem item={i} key={i.id} onChangeData={onChangeData} />
              ))
            ) : (
              <NoData />
            ))}
        </TaskItemBoxs>
      </Spin>
    </TaskWrap>
  )
}

export default EmployeeProfileTask
