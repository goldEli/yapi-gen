import NewLoadingTransition from '@/components/NewLoadingTransition'
import {
  AssignTaskWrap,
  CanClick,
  ItemWrap,
  LoadingMore,
  ProjectItem,
  ProjectTypeBox,
  SpinWrap,
  StatusBox,
  TaskItem,
  TimeName,
} from './style'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import _ from 'lodash'
import { Skeleton } from 'antd'
import NoData from '@/components/NoData'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from '@store/index'
import { encryptPhp } from '@/tools/cryptoPhp'
import moment from 'moment'
import { getRecentProject } from '@/services/project'
const GroupItems = (props: any) => {
  const { row, onOpenExamine, onClickItem, tabActive, onCancel } = props
  const [page, setPage] = useState(1)
  // 加载更多的loading
  const [moreLoading, setMoreLoading] = useState(false)
  const navigate = useNavigate()
  const [t] = useTranslation()
  // 点击加载更多
  const onLoadingMore = async () => {
    setMoreLoading(true)
    // 调用更多接口
    setPage(page + 1)
    setMoreLoading(false)
  }
  // 项目-点击跳转详情
  const onClickProject = async (row: any) => {
    onCancel()
    const params = encryptPhp(
      JSON.stringify({
        id: row?.actionable.id,
        type: row?.actionable.project_type === 2 ? 'sprint' : 'iteration',
      }),
    )

    navigate(
      `${
        row.defaultHomeMenu
          ? row.defaultHomeMenu
          : `/ProjectDetail/${
              row?.actionable.project_type === 2 ? 'Affair' : 'Demand'
            }`
      }?data=${params}`,
    )
  }
  return (
    <>
      {row?.map((i: any) => (
        <ProjectItem
          key={i.id}
          // local={language}
          style={{ alignItems: 'center' }}
        >
          <div
            className="left"
            onClick={() => onClickProject(i)}
            style={{ alignItems: 'center' }}
          >
            <img className="icon" src={i.actionable?.attachment?.path} />
            <div className="info">
              <span className="name">{i.actionable?.name}</span>
            </div>
          </div>
          <ProjectTypeBox type={i.actionable?.project_type}>
            {i.actionable?.project_type === 1 ? t('iteration') : t('sprint2')}
          </ProjectTypeBox>
        </ProjectItem>
      ))}
      {page * 30 < row?.pager?.total && (
        <LoadingMore onClick={onLoadingMore}>
          {moreLoading ? (
            <img
              width={16}
              style={{ marginRight: 4 }}
              src="https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/shareLoading.gif"
            />
          ) : null}
          {t('loadMore')}
        </LoadingMore>
      )}
    </>
  )
}

const AssignTask = (props: { onCancel(): void }) => {
  const [isSpinning, setIsSpinning] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const [page, setPage] = useState(1)
  const [dataList, setDataList] = useState<any>({})
  // 待办
  const onGetMineNoFinishList = async (isInit: boolean, page: number) => {
    setIsSpinning(true)
    const res = await getRecentProject({
      page: page,
      pagesize: 15,
    })
    if (isInit) {
      setDataList(res?.data)
    } else {
      const oldData = _.cloneDeep(dataList.list)
      const newData = _.cloneDeep(res.data?.list)
      addMore(oldData, newData)
      setDataList({
        pager: res.data?.pager,
        list: oldData,
      })
    }
    setIsSpinning(false)
  }
  const addMore = (oldData: any, newData: any) => {
    Object.keys(newData).forEach((i: string) => {
      if (Object.keys(oldData).includes(i)) {
        const temp = [...oldData[i], ...newData[i]]
        oldData[i] = temp
      } else {
        oldData[i] = newData[i]
      }
    })
  }
  const fetchMoreData = () => {
    const pages = page + 1
    setPage(pages)
    onGetMineNoFinishList(false, pages)
  }
  // 点击打开审核弹窗
  const onOpenExamine = (item: any) => {
    // setVerifyInfo(item)
    // setIsExamineVisible(true)
  }
  // 点击跳转详情
  const onClickItem = async (row: any) => {
    props.onCancel()
    // dispatch(setIsUpdateAddWorkItem(0))
    const params = encryptPhp(
      JSON.stringify({
        id: row.project_id,
        type: row.project_type === 2 ? 'sprint' : 'iteration',
        isOpenScreenDetail: true,
        detailId: row?.story_id,
        specialType:
          row.project_type === 2
            ? 1
            : row.project_type === 1 && row.is_bug === 1
            ? 2
            : 3,
      }),
    )

    setTimeout(() => {
      navigate(
        `${
          row.defaultHomeMenu
            ? row.defaultHomeMenu
            : `/ProjectDetail/${
                row.project_type === 2
                  ? 'Affair'
                  : row.is_bug === 2
                  ? 'Demand'
                  : 'Defect'
              }`
        }?data=${params}`,
      )
    }, 2)
  }
  // 计算时间显示
  const onComputedTime = (time: string) => {
    if (moment(time).isSame(moment().startOf('day'), 'day')) {
      return t('today')
    } else if (
      moment(time).isSame(moment().subtract(1, 'days').startOf('day'), 'day')
    ) {
      return t('yesterday')
    }
    return time
  }

  const hasMore = useMemo(() => {
    if (!dataList.list) {
      return false
    }
    const allTask = Object.values(dataList.list).flat(2)
    if (allTask.length < dataList.pager.total) {
      return true
    }
    return false
  }, [dataList])
  // 1是数据，2是更多
  const onComputedTab = (type: number) => {
    const result = type === 1 ? dataList?.list : hasMore
    return result
  }
  useEffect(() => {
    onGetMineNoFinishList(true, 1)
  }, [])
  return (
    <div>
      <SpinWrap indicator={<NewLoadingTransition />} spinning={isSpinning}>
        <AssignTaskWrap id="scrollableDiv">
          <InfiniteScroll
            dataLength={
              dataList.list ? Object.values(dataList.list).flat(2).length : 0
            }
            next={fetchMoreData}
            hasMore={onComputedTab(2)}
            loader={<Skeleton paragraph={{ rows: 1 }} active />}
            scrollableTarget="scrollableDiv"
          >
            {dataList.list
              ? Object.keys(dataList.list)?.map((k: any) => (
                  <ItemWrap key={k}>
                    <TimeName>{onComputedTime(k)}</TimeName>
                    <GroupItems
                      row={dataList.list?.[k]}
                      onOpenExamine={onOpenExamine}
                      onClickItem={onClickItem}
                      tabActive={1}
                      onCancel={props.onCancel}
                    />
                  </ItemWrap>
                ))
              : null}
          </InfiniteScroll>
          {(JSON.stringify(dataList.list) === '{}' ||
            dataList.list?.length <= 0) && <NoData />}
        </AssignTaskWrap>
      </SpinWrap>
    </div>
  )
}

export default AssignTask
