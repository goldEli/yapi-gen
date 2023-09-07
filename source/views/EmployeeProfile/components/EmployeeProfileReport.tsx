/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-undefined */
import { useSelector } from '@store/index'
import {
  LoadingMore,
  OperationButton,
  ReportItemHeader,
  ReportItemHeaderLeft,
  ReportItemHeaderRight,
  ReportItemWrap,
  ReportWrap,
} from '../style'
import { useEffect, useState } from 'react'
import {
  followsCancel,
  followsMark,
  getMemberOverviewMoreReportList,
  getMemberOverviewReportList,
} from '@/services/employeeProfile'
import { Spin, Tooltip } from 'antd'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import NoData from '@/components/NoData'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import { getMessage } from '@/components/Message'
import CommonIconFont from '@/components/CommonIconFont'

interface ReportItemProps {
  // 当前数据
  item: any
  // 当前操作的人员id
  user_id: number
  onChangData(id: any, item: any): void
}

const ReportItem = (props: ReportItemProps) => {
  const { item, user_id, onChangData } = props

  // 标星或者是取消标星  state: true是已经标星，取消标星，反之， item:当前数据
  const onStar = async (state: boolean, item: any) => {
    const params = {
      type: 2,
      relation_id: item.id,
    }
    if (state) {
      await followsCancel(params)
      getMessage({ type: 'success', msg: '取消标星成功' })
    } else {
      await followsMark(params)
      getMessage({ type: 'success', msg: '标星成功' })
    }
    item.is_star = item.is_star === 1 ? 2 : 1
    onChangData(user_id, item)
  }

  // 打开汇报数据
  const onOpenInfo = (item: any) => {
    item.is_expended = item.is_expended === 1 ? 2 : 1
    onChangData(user_id, item)
  }

  return (
    <>
      <ReportItemWrap>
        <ReportItemHeader>
          {item.is_star === 1 && (
            <div className="icon">
              <CommonIconFont type="star" color="#FA9746" size={14} />
            </div>
          )}
          <ReportItemHeaderLeft>
            <CommonUserAvatar avatar={item.user.avatar} size="large" />
            <div className="info">
              <div className="name">
                {item.user.name}
                {item.title}
              </div>
              <div className="sub">
                {item.departments
                  .reverse()
                  ?.map((i: any) => i.name)
                  ?.join(' - ')}
              </div>
            </div>
          </ReportItemHeaderLeft>
          <ReportItemHeaderRight>
            <Tooltip
              placement="top"
              trigger="hover"
              title={item.is_expended === 1 ? '展开' : '折叠'}
            >
              <OperationButton onClick={() => onOpenInfo(item)}>
                <CommonIconFont
                  type={item.is_expended === 1 ? 'up-02' : 'down-02'}
                  size={20}
                />
              </OperationButton>
            </Tooltip>
            <Tooltip
              placement="top"
              trigger="hover"
              title={item.is_star === 1 ? '取消标星' : '标星'}
            >
              <OperationButton
                onClick={() => onStar(item.is_star === 1, item)}
                isStar={item.is_star === 1}
              >
                <CommonIconFont
                  type={item.is_star === 1 ? 'star' : 'star-adipf4l8'}
                  size={20}
                />
              </OperationButton>
            </Tooltip>
          </ReportItemHeaderRight>
        </ReportItemHeader>
      </ReportItemWrap>
    </>
  )
}

interface ReportItemGroupProps {
  // 当前数据
  item: any
  // 当前操作的人员id
  user_id: number
  // 上一页的最后一条数据
  lastData: any
  // 更多汇报修改数据
  onChangMoreData(arr: any, id: any): void
  onChangData(id: any, item: any): void
}

const ReportItemGroup = (props: ReportItemGroupProps) => {
  const { filterParams } = useSelector(store => store.employeeProfile)
  const { item, user_id, lastData, onChangMoreData, onChangData } = props
  const [page, setPage] = useState(1)
  // 点击加载更多
  const onLoadingMore = async () => {
    setPage(page + 1)
    const response = await getMemberOverviewMoreReportList({
      ...filterParams,
      ...{ user_id, current_time: lastData.created_at },
    })
    onChangMoreData(response?.list || [], user_id)
  }
  return (
    <>
      {item.list?.map((itemChild: any) => (
        <ReportItem
          key={itemChild.id}
          item={itemChild}
          user_id={user_id}
          onChangData={onChangData}
        />
      ))}
      <LoadingMore onClick={() => onLoadingMore()}>
        加载该成员更多日报
      </LoadingMore>
    </>
  )
}

const EmployeeProfileReport = () => {
  const { filterParams } = useSelector(store => store.employeeProfile)
  const [loading, setLoading] = useState(false)

  const [dataList, setDataList] = useState<any>({
    // list: undefined,
    list: [
      {
        current_user_id: '6',
        list: [
          {
            is_star: 1,
            isExpended: 2,
            id: 193,
            report_template_id: 52,
            is_auto: 2,
            start_time: '2023-09-06',
            type: 2,
            user_id: 6,
            created_at: '2023-09-06 14:11:51',
            name: '工作日报',
            project_id: 327,
            user: {
              id: 6,
              name: '马成龙',
              avatar:
                'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504303190676344834/2023-04-24/68e19872-c04e-44d4-b4c7-9b86bcd0cfd8.png',
            },
            project: {
              id: 327,
              name: 'mango测试项目',
            },
            title: '马成龙生成的2023-09-06工作日报(手动)',
            departments: [
              {
                // id: 1542006488750587906,
                name: 'php',
                // parent_id: 1622899318493040642,
              },
              {
                // id: 1622899318493040642,
                name: '成都定星科技',
                parent_id: 0,
              },
            ],
          },
          {
            is_star: 2,
            isExpended: 2,
            id: 194,
            report_template_id: 52,
            is_auto: 2,
            start_time: '2023-09-06',
            type: 2,
            user_id: 6,
            created_at: '2023-09-06 14:22:27',
            name: '工作日报',
            project_id: 327,
            user: {
              id: 6,
              name: '马成龙',
              avatar:
                'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504303190676344834/2023-04-24/68e19872-c04e-44d4-b4c7-9b86bcd0cfd8.png',
            },
            project: {
              id: 327,
              name: 'mango测试项目',
            },
            title: '马成龙生成的2023-09-06工作日报(手动)',
            departments: [
              {
                // id: 1542006488750587906,
                name: 'php',
                // parent_id: 1622899318493040642,
              },
              {
                // id: 1622899318493040642,
                name: '成都定星科技',
                parent_id: 0,
              },
            ],
          },
        ],
      },
    ],
  })

  // 点击加载更多日报，合并数据
  const onChangMoreData = (arr: any, id: number) => {
    setDataList(
      dataList?.list?.map((i: any) => ({
        ...i,
        list: i.current_user_id === id ? [...i.list, ...arr] : i.list,
      })),
    )
  }

  // 标星/取消标星，折叠/收起
  const onChangData = (id: any, item: any) => {
    const resultData = dataList?.list?.map((i: any) => ({
      ...i,
      list:
        i.current_user_id === id
          ? i.list?.map((k: any) => (k.id === item.id ? item : k))
          : i.list,
    }))
    setDataList({ list: resultData })
  }

  // 获取汇报列表
  const getReportList = async () => {
    const response = await getMemberOverviewReportList(filterParams)
    setDataList({ list: response })
    setLoading(false)
  }

  useEffect(() => {
    if (filterParams.status) {
      // setDataList({ list: undefined })
      // setLoading(true)
      // getReportList()
    }
  }, [filterParams.time, filterParams.isStart, filterParams.user_ids])
  return (
    <ReportWrap>
      <Spin
        spinning={loading}
        indicator={<NewLoadingTransition />}
        size="large"
      >
        {!!dataList?.list &&
          (dataList?.list?.length > 0 ? (
            dataList?.list?.map((i: any) => (
              <ReportItemGroup
                key={i.current_user_id}
                item={i}
                user_id={i.current_user_id}
                lastData={i.list[i.list?.length - 1]}
                onChangMoreData={onChangMoreData}
                onChangData={onChangData}
              />
            ))
          ) : (
            <NoData />
          ))}
      </Spin>
    </ReportWrap>
  )
}

export default EmployeeProfileReport
