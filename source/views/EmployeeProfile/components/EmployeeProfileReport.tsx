/* eslint-disable react/jsx-no-leaked-render */
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
  Title,
  Msg,
  RowRadius,
  Radius,
  DetailItem,
  CommentBox,
  ReportItemBox,
  ProviderBox,
} from '../style'
import { useEffect, useState } from 'react'
import {
  getMemberOverviewMoreReportList,
  getMemberOverviewReportList,
} from '@/services/employeeProfile'
import { Spin, Tooltip } from 'antd'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import NoData from '@/components/NoData'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import { getMessage } from '@/components/Message'
import CommonIconFont from '@/components/CommonIconFont'
import {
  addReportComment,
  delReportComment,
  getReportComment,
  getReportInfo,
} from '@/services/report'
import { useTranslation } from 'react-i18next'
import { Editor } from 'ifunuikit'
import IconFont from '@/components/IconFont'
import DeleteConfirm from '@/components/DeleteConfirm'
import CommentFooter from '@/components/CommonComment/CommentFooter'
import { getStaffListAll } from '@/services/staff'
import { getIdsForAt } from '@/tools'
import UploadAttach from '@/components/UploadAttach'

interface ReportItemProps {
  // 当前数据
  item: any
  // 当前操作的人员id
  user_id: number
  onChangData(id: any, item: any): void
}

const ReportItem = (props: ReportItemProps) => {
  const [t] = useTranslation()
  const { userInfo } = useSelector(store => store.user)
  const { item, user_id, onChangData } = props
  const [reportInfo, setReportInfo] = useState<any>({})
  const [commentList, setCommentList] = useState([])
  const [isVisible, setIsVisible] = useState(false)
  const [isDeleteId, setIsDeleteId] = useState(0)
  const [arr, setArr] = useState<any>(null)

  // // 标星或者是取消标星  state: true是已经标星，取消标星，反之， item:当前数据
  // const onStar = async (state: boolean, item: any) => {
  //   const params = {
  //     type: 2,
  //     relation_id: item.id,
  //   }
  //   if (state) {
  //     await followsCancel(params)
  //     getMessage({ type: 'success', msg: t('cancelStarSuccessfully') })
  //   } else {
  //     await followsMark(params)
  //     getMessage({ type: 'success', msg: t('starSuccess') })
  //   }
  //   item.is_star = item.is_star === 1 ? 2 : 1
  //   onChangData(user_id, item)
  // }

  // 获取汇报评论
  const getReportCommentData = async (id: number) => {
    const response = await getReportComment({
      report_user_id: id,
      page: 1,
      pagesize: 999,
    })
    setCommentList(response.list)
  }

  // 获取汇报详情
  const getReportDetail = async (id: number) => {
    const info = await getReportInfo({ id })
    setReportInfo(info)
  }

  // 获取人员数组
  const getPersonList = async () => {
    const companyList = await getStaffListAll({ all: 1 })
    const filterCompanyList = companyList.map((item: any) => ({
      id: item.id,
      label: item.name,
    }))
    setArr(filterCompanyList)
  }

  // 打开汇报数据
  const onOpenInfo = (item: any) => {
    item.is_expended = item.is_expended === 1 ? 2 : 1
    onChangData(user_id, item)
    if (item.is_expended === 1) {
      getReportDetail(item.id)
      getReportCommentData(item.id)
      getPersonList()
    }
  }

  const AttachmentBox = (props: { list: any }) => {
    const list = props.list?.length ? props.list : []
    const resultList = list?.map((item: any) => {
      return {
        url: item.url,
        id: new Date().getTime() + Math.random(),
        size: item.size,
        time: item.ctime,
        name: item.name || '--',
        suffix: item.ext,
        username: item.username,
      }
    })
    return list?.length ? (
      <UploadAttach isReport canUpdate power defaultList={resultList} />
    ) : (
      <span>--</span>
    )
  }

  // 删除评论
  const onDeleteComment = (item: any) => {
    setIsVisible(true)
    setIsDeleteId(item.id)
  }

  // 删除确认事件
  const onDeleteConfirm = async () => {
    try {
      await delReportComment({
        report_user_id: reportInfo?.id,
        id: isDeleteId,
      })
      getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
      setIsDeleteId(0)
      setIsVisible(false)
      getReportCommentData(reportInfo?.id)
    } catch (error) {
      //
    }
  }

  // 评论
  const onComment = async (value: any) => {
    const params = {
      report_user_id: reportInfo.id,
      content: value.info,
      a_user_ids: getIdsForAt(value.info),
    }
    await addReportComment(params)
    getMessage({ msg: t('report.list.okComment'), type: 'success' })
    getReportCommentData(reportInfo.id)
  }

  return (
    <>
      <ReportItemWrap>
        <DeleteConfirm
          text={t('mark.cd')}
          isVisible={isVisible}
          onChangeVisible={() => setIsVisible(!isVisible)}
          onConfirm={onDeleteConfirm}
        />
        <ReportItemHeader isExpended={item.is_expended === 1}>
          {/* {item.is_star === 1 && (
            <div className="icon">
              <CommonIconFont type="star" color="#FA9746" size={14} />
            </div>
          )} */}
          <ReportItemHeaderLeft>
            <CommonUserAvatar avatar={item.user?.avatar} size="large" />
            <div className="info">
              <div className="name">
                {t('reportTitle', {
                  name: item.user?.name,
                  time: item?.start_time,
                  reportName: item?.name,
                })}
              </div>
              <div className="sub">
                {item?.departments?.map((i: any) => i.name)?.join(' - ')}
              </div>
            </div>
          </ReportItemHeaderLeft>
          <ReportItemHeaderRight>
            <Tooltip
              placement="top"
              trigger="hover"
              title={item.is_expended === 1 ? t('expand') : t('fold')}
            >
              <OperationButton onClick={() => onOpenInfo(item)}>
                <CommonIconFont
                  type={item.is_expended === 1 ? 'up-02' : 'down-02'}
                  size={20}
                />
              </OperationButton>
            </Tooltip>
            {/* <Tooltip
              placement="top"
              trigger="hover"
              title={item.is_star === 1 ? t('unstar') : t('star')}
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
            </Tooltip> */}
          </ReportItemHeaderRight>
        </ReportItemHeader>
        {item.is_expended === 1 && (
          <>
            <div style={{ padding: '0 24px' }}>
              <Title style={{ marginTop: 8 }}>
                {t('report.list.reportProject')}
              </Title>
              <Msg style={{ marginTop: 8 }}>{reportInfo?.project?.name}</Msg>
              {reportInfo.report_content?.map((item: any) => (
                <div key={item.id}>
                  {item.type === 4 && (
                    <Title style={{ marginBottom: 8 }}>
                      {item.name_text}: {item.pivot.params?.length}
                      {t('report.list.pieces')}
                    </Title>
                  )}
                  {item.type === 3 && item.name !== 'total_schedule' && (
                    <>
                      <Title>{item.name_text}</Title>
                      <Editor
                        readonly
                        disableUpdateValue
                        value={item?.pivot?.content}
                      />
                    </>
                  )}
                  {item.type === 4 &&
                    item.pivot.params?.map((el: any) => (
                      <RowRadius key={el.id}>
                        <Radius />
                        {item?.name === 'overdue_tasks' &&
                        el.expected_day > 0 ? (
                          <span
                            style={{ marginRight: 3, whiteSpace: 'nowrap' }}
                          >
                            [{t('report.list.overdue')}
                            {el.expected_day}
                            {t('report.list.day')}]
                          </span>
                        ) : null}
                        <Msg>
                          {el.name}
                          {`（${
                            el.user_schedule_percent
                              ? el.user_schedule_percent
                              : 0
                          }%  ${el.user_today_task_time ?? 0}h）`}
                        </Msg>
                      </RowRadius>
                    ))}

                  {item.type === 2 && (
                    <>
                      <Title>{item?.name_text}</Title>
                      <AttachmentBox list={item?.pivot?.params} />
                    </>
                  )}
                </div>
              ))}
              <DetailItem>
                <Title style={{ marginBottom: 8 }}>{t('common.comment')}</Title>
                {commentList && commentList.length
                  ? commentList.map((i: any) => (
                      <CommentBox key={i.id}>
                        <div className="headWrap">
                          <div className="header">
                            <CommonUserAvatar name={i.comment_user.name} />
                            <div className="time">{i.created_at || '--'}</div>
                          </div>
                          {userInfo?.id === i.comment_user.id ? (
                            <IconFont
                              className="deleteIcon"
                              style={{ marginLeft: 20 }}
                              type="close"
                              onClick={() => onDeleteComment(i)}
                            />
                          ) : null}
                        </div>
                        <div className="content">
                          <Editor
                            readonly
                            disableUpdateValue
                            value={i?.content}
                          />
                        </div>
                      </CommentBox>
                    ))
                  : '--'}
              </DetailItem>
            </div>
            <CommentFooter
              placeholder={t('commentOnLog', { name: item.user.name })}
              personList={arr}
              onConfirm={onComment}
              style={{
                position: 'sticky',
                bottom: 0,
                padding: '16px 4% 16px 4%',
              }}
              maxHeight="72vh"
              isEmployee
            />
          </>
        )}
      </ReportItemWrap>
      <ProviderBox />
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
  const [t] = useTranslation()
  const { filterParams } = useSelector(store => store.employeeProfile)
  const { item, user_id, lastData, onChangMoreData, onChangData } = props
  const [page, setPage] = useState(1)
  const [moreLoading, setMoreLoading] = useState(false)
  // 点击加载更多
  const onLoadingMore = async () => {
    setMoreLoading(true)
    const response = await getMemberOverviewMoreReportList({
      ...filterParams,
      ...{ user_id, current_time: lastData.created_at },
    })
    onChangMoreData(response?.list || [], user_id)
    setPage(page + 1)
    setMoreLoading(false)
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
      {item.list?.length >= 15 * page && (
        <LoadingMore onClick={onLoadingMore}>
          {moreLoading && (
            <img
              width={16}
              style={{ marginRight: 4 }}
              src="https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/shareLoading.gif"
            />
          )}
          {t('loadMoreDailyReportsForThisMember')}
        </LoadingMore>
      )}
    </>
  )
}

const EmployeeProfileReport = () => {
  const { filterParams } = useSelector(store => store.employeeProfile)
  const [loading, setLoading] = useState(false)

  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })

  // 点击加载更多日报，合并数据
  const onChangMoreData = (arr: any, id: number) => {
    setDataList({
      list: dataList?.list?.map((i: any) => ({
        ...i,
        list: i.current_user_id === id ? [...i.list, ...arr] : i.list,
      })),
    })
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
      setDataList({ list: undefined })
      setLoading(true)
      getReportList()
    }
  }, [filterParams.time, filterParams.user_ids])

  return (
    <ReportWrap>
      <Spin
        spinning={loading}
        indicator={<NewLoadingTransition />}
        size="large"
      >
        <ReportItemBox>
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
        </ReportItemBox>
      </Spin>
    </ReportWrap>
  )
}

export default EmployeeProfileReport
