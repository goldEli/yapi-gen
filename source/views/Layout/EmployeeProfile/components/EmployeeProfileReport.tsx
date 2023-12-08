/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-undefined */
import { useSelector } from '@store/index'
import {
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
import { useEffect, useState, useMemo, useCallback } from 'react'
import { getMemberReportList } from '@/services/employeeProfile'
import { Skeleton, Spin, Tooltip } from 'antd'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import { getMessage } from '@/components/Message'
import CommonIconFont from '@/components/CommonIconFont'
import {
  addReportComment,
  delReportComment,
  getReportComment,
} from '@/services/report'
import { useTranslation } from 'react-i18next'
import { Editor } from 'ifunuikit'
import IconFont from '@/components/IconFont'
import DeleteConfirm from '@/components/DeleteConfirm'
import CommentFooter from '@/components/CommonComment/CommentFooter'
import { getStaffListAll } from '@/services/staff'
import { getIdsForAt } from '@/tools'
import UploadAttach from '@/components/UploadAttach'
import InfiniteScroll from 'react-infinite-scroll-component'
import useUpdateFilterParams from './hooks/useUpdateFilterParams'
import _ from 'lodash'
interface ReportItemProps {
  item: any
  reportFirstData: any
  onGetReportFirstData(val: any): void
  onChangData(val: number): void
  personArr: any[]
}

const ReportItem = (props: ReportItemProps) => {
  const [t] = useTranslation()
  const { userInfo } = useSelector(store => store.user)
  const {
    item,
    reportFirstData,
    onGetReportFirstData,
    onChangData,
    personArr,
  } = props
  const [commentList, setCommentList] = useState([])
  const [isVisible, setIsVisible] = useState(false)
  const [isDeleteId, setIsDeleteId] = useState(0)

  const onOpen = _.debounce(onChangData, 200)

  useEffect(() => {
    setCommentList(item.comment)
  }, [JSON.stringify(item.comment)])

  // 获取汇报评论
  const getReportCommentData = async (id: number) => {
    const response = await getReportComment({
      report_user_id: id,
      page: 1,
      pagesize: 999,
    })
    setCommentList(response.list)
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
        report_user_id: item?.id,
        id: isDeleteId,
      })
      getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
      setIsDeleteId(0)
      setIsVisible(false)
      getReportCommentData(item?.id)
    } catch (error) {
      //
    }
  }

  // 评论
  const onComment = async (value: any) => {
    const params = {
      report_user_id: item.id,
      content: value.info,
      a_user_ids: getIdsForAt(value.info),
    }
    await addReportComment(params)
    getMessage({ msg: t('report.list.okComment'), type: 'success' })
    getReportCommentData(item.id)
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
          <ReportItemHeaderLeft>
            <CommonUserAvatar avatar={item.user?.avatar} size="large" />
            <div className="info">
              <div className="name">{item.title}</div>
              <div className="sub">
                {item.user?.company_name}-{item.user?.department_name}-
                {item.user?.job_name}
              </div>
            </div>
          </ReportItemHeaderLeft>
          <ReportItemHeaderRight>
            <Tooltip
              placement="top"
              trigger="hover"
              title={item.is_expended === 1 ? t('expand') : t('fold')}
            >
              <OperationButton onClick={() => onOpen(item.id)}>
                <CommonIconFont
                  type={item.is_expended === 1 ? 'up-02' : 'down-02'}
                  size={20}
                />
              </OperationButton>
            </Tooltip>
          </ReportItemHeaderRight>
        </ReportItemHeader>
        {item.is_expended === 1 && (
          <>
            <div style={{ padding: '0 24px' }}>
              <Title style={{ marginTop: 8 }}>
                {t('report.list.reportProject')}
              </Title>
              <Msg style={{ marginTop: 8 }}>{item?.project?.name}</Msg>
              {item.report_content?.map((items: any) => (
                <div key={items.id}>
                  {items.type === 4 && (
                    <Title style={{ marginBottom: 8 }}>
                      {items.name_text}: {items.pivot.params?.length}
                      {t('report.list.pieces')}
                    </Title>
                  )}
                  {items.type === 3 && items.name !== 'total_schedule' && (
                    <>
                      <Title>{items.name_text}</Title>
                      <Editor
                        readonly
                        disableUpdateValue
                        value={items?.pivot?.content}
                      />
                    </>
                  )}
                  {items.type === 4 &&
                    items.pivot.params?.map((el: any) => (
                      <RowRadius
                        key={el.id}
                        isSelect={
                          reportFirstData?.id === el.id &&
                          reportFirstData?.onlyId === item.id
                        }
                        onClick={() => {
                          onGetReportFirstData({
                            project_id: item.project_id,
                            id: el.id,
                            project_type: el.project_type,
                            is_bug: el.is_bug,
                            user_id: item.user.id,
                            onlyId: item.id,
                          })
                        }}
                      >
                        <Radius />
                        {items?.name === 'overdue_tasks' &&
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

                  {items.type === 2 && (
                    <>
                      <Title>{items?.name_text}</Title>
                      <AttachmentBox list={items?.pivot?.params} />
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
                            at
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
              placeholder={t('commentOnLog', { name: item?.user?.name })}
              personList={personArr}
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

interface EmployeeProfileReportProps {
  // 需要向上传递第一个日报的第一个需求的数据
  onGetReportFirstData(val: any): void
  data: any
  loading: boolean
  setLoading(val: boolean): void
  setUserReportList(val: any): void
  reportFirstData: any
}

const EmployeeProfileReport = (props: EmployeeProfileReportProps) => {
  const {
    data,
    loading,
    setLoading,
    setUserReportList,
    reportFirstData,
    onGetReportFirstData,
  } = props
  const [page, setPage] = useState(1)
  const { filterParamsOverall } = useUpdateFilterParams()
  const [arr, setArr] = useState<any>(null)

  // 点击加载更多日报，合并数据
  const fetchMoreData = async () => {
    const newPage = page + 1
    setLoading(true)
    const response = await getMemberReportList({
      ...filterParamsOverall,
      page: newPage,
    }).finally(() => {
      setLoading(false)
    })
    if (response && response?.list?.length) {
      setPage(response.page)
      setUserReportList({
        ...data,
        list: [...data.list, ...response.list],
      })
    }
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

  // 折叠/收起
  const onChangData = useCallback(
    (id: any) => {
      const resultData = data?.list?.map((i: any) => {
        if (i.id === id) {
          return {
            ...i,
            is_expended: i.is_expended === 1 ? 2 : 1,
          }
        }
        return i
      })
      setUserReportList({
        ...data,
        list: resultData,
      })
    },
    [data],
  )

  useEffect(() => {
    getPersonList()
  }, [])

  console.log(data, 'ladatata', reportFirstData)

  return (
    <ReportWrap>
      <Spin
        spinning={loading}
        indicator={<NewLoadingTransition />}
        size="large"
      >
        <ReportItemBox id="ReportItemBox">
          <InfiniteScroll
            dataLength={data?.list?.length}
            next={fetchMoreData}
            hasMore={data?.list?.length < data?.total}
            loader={<Skeleton paragraph={{ rows: 1 }} active />}
            scrollableTarget="ReportItemBox"
          >
            {data?.list?.length > 0 &&
              data?.list?.map((i: any) => (
                <ReportItem
                  key={i.id}
                  item={i}
                  reportFirstData={reportFirstData}
                  onGetReportFirstData={onGetReportFirstData}
                  onChangData={onChangData}
                  personArr={arr}
                />
              ))}
          </InfiniteScroll>
        </ReportItemBox>
      </Spin>
    </ReportWrap>
  )
}

export default EmployeeProfileReport
