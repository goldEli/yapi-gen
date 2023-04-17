/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { useEffect, useMemo, useState } from 'react'
import { Tooltip } from 'antd'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { useLocation, useParams } from 'react-router-dom'
import { SelectWrapBedeck } from '@/components/StyleCommon'
import moment from 'moment'
import RangePicker from '@/components/RangePicker'
import CustomSelect from '@/components/CustomSelect'
import InputSearch from '@/components/InputSearch'
import ResizeTable from '@/components/ResizeTable'
import PaginationBox from '@/components/TablePagination'
import Sort from '@/components/Sort'
import NoData from '@/components/NoData'
import ReadStatusTag from './ReadStatusTag'
import ReportDetailDrawer from './ReportDetailDrawer'
import {
  getRepSentList,
  getRepReceivedList,
  getRepPublicList,
} from '@/services/report'
import { templateList } from '@/services/formwork'
import { getStaffList } from '@/services/staff'
import HandleReport from './HandleReport'
import { useDispatch, useSelector } from '@store/index'
import { setViewReportModal } from '@store/workReport'
import LabelTag from '@/components/LabelTag'

const ListTitle = styled.div`
  height: 32px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 24px 20px 24px;
  span {
    font-size: 16px;
    font-family: SiYuanMedium;
    font-weight: 500;
    color: #323233;
  }
`

const ListHead = styled.div({
  background: 'var(--neutral-white-d2)',
  display: 'flex',
  alignItems: 'center',
  paddingRight: '24px',
  paddingBottom: '20px',
  marginLeft: '24px',
  borderBottom: '1px solid var(--neutral-n6-d1)',
})

const SelectWrapForList = styled(SelectWrapBedeck)`
  margin-right: 16px;
`
const ListContent = styled.div`
  height: calc(100% - ${50}px);
`

const ClearButton = styled.div`
  width: 56px;
  height: 22px;
  font-size: 14px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #6688ff;
  line-height: 22px;
  margin-left: 24px;
  white-space: nowrap;
  cursor: pointer;
`
const defaultPageParam = { page: 1, pagesize: 20 }

const statusOptions = [
  { label: '未读', value: 1 },
  { label: '已读', value: 2 },
  { label: '已评', value: 3 },
]
const reportState = [
  {
    label: '更新',
    color: '#E56F0E',
    background: 'rgba(250,151,70,0.1)',
    state: 1,
  },
  {
    label: '补交',
    color: '#7641E8 ',
    background: 'rgba(161,118,251,0.1)',
    state: 2,
  },
]
const List = () => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const { pathname } = useLocation()
  const [isSpinning, setIsSpinning] = useState(false)
  const { viewReportModal } = useSelector(store => store.workReport)
  const [order, setOrder] = useState<any>('')
  const [orderKey, setOrderKey] = useState<any>()
  const [total, setTotal] = useState<number>(250)
  const [pageObj, setPageObj] = useState(defaultPageParam)
  const [listData, setListData] = useState<any[]>([])
  const [repTypeOptions, setRepTypeOptions] = useState<any[]>([])
  const [userOptions, setUserOptions] = useState<any[]>([])
  const [queryParams, setQueryParams] = useState<any>({})
  const [editId, setEditId] = useState<any>()
  const [visibleEdit, setVisibleEdit] = useState(false)
  const params = useParams()
  const id = Number(params?.id)

  const menuList = [
    {
      id: 1,
      name: t('report.list.review'),
      path: '/Report/Review/List/1',
      state: 1,
    },
    {
      id: 2,
      name: t('report.list.reviewMe'),
      path: '/Report/Review/List/2',
    },
    {
      id: 3,
      name: t('report.list.openReview'),
      path: '/Report/Review/List/3',
    },
  ]

  const getList = async () => {
    try {
      setIsSpinning(true)
      let res
      switch (id) {
        case 1:
          res = await getRepSentList({ ...pageObj, ...queryParams })
          break
        case 2:
          res = await getRepReceivedList({ ...pageObj, ...queryParams })
          break
        case 3:
          res = await getRepPublicList({ ...pageObj, ...queryParams })
          break
      }
      setIsSpinning(false)
      setListData(res.list)
      setTotal(res.pager.total)
    } catch (error) {
      console.log('error', error)
    }
  }

  const updateOrderkey = (key: any, orderVal: any) => {
    setOrderKey(key)
    setOrder(orderVal)
  }

  useEffect(() => {
    getList()
  }, [pageObj, queryParams])

  useEffect(() => {
    setQueryParams({})
    setPageObj({ ...pageObj, page: 1 })
  }, [id])

  const onClickView = (row: any) => {
    dispatch(
      setViewReportModal({
        visible: true,
        id: row.id,
        ids: listData?.map((i: any) => i.id),
      }),
    )
  }
  const NewSort = (props: any) => {
    return (
      <Sort
        fixedKey={props.fixedKey}
        onChangeKey={updateOrderkey}
        nowKey={orderKey}
        order={order}
      >
        {props.children}
      </Sort>
    )
  }
  const columns: any[] = [
    {
      width: 188,
      title: t('common.title'),
      dataIndex: 'user',
      render: (_: string, record: any) => {
        return (
          <>
            <span style={{ marginRight: 12 }}>{String(record.user.name)}</span>
            <LabelTag
              options={reportState}
              state={
                record.is_supply === 1 ? 1 : record.is_update === 1 ? 2 : 0
              }
            />
          </>
        )
      },
    },
    {
      width: 450,
      title: t('report.list.summary'),
      dataIndex: 'report_precis',
      render: (text: string, record: any) => {
        return (
          <Tooltip
            placement="topLeft"
            title={text || '--'}
            getPopupContainer={node => node}
          >
            <span
              className="summarySpan"
              style={{
                display: 'block',
                width: '400px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
              }}
              onClick={() => onClickView(record)}
            >
              {text.trim().slice(0, 100)}
            </span>
          </Tooltip>
        )
      },
    },
    {
      width: 252,
      title: t('report.list.reportTime'),
      sorter: (a: any, b: any) => {
        return moment(a.start_time).valueOf() - moment(b.start_time).valueOf()
      },
      dataIndex: 'start_time',
      render: (_: string, record: any) => {
        return <span>{`${record.start_time} ~ ${record.end_time}`}</span>
      },
    },
    {
      width: 240,
      title: t('report.list.submitTime'),
      dataIndex: 'created_at',
      sorter: (a: any, b: any) => {
        return moment(a.created_at).valueOf() - moment(b.created_at).valueOf()
      },
    },
    {
      width: 160,
      title: t('report.list.readState'),
      align: 'center',
      dataIndex: 'is_read',
      render: (text: string | number) => {
        return <ReadStatusTag status={text === 1 ? 'read' : 'no'} />
      },
    },
    {
      width: 92,
      title: t('report.list.operation'),
      align: 'center',
      fixed: 'right',
      render: (_: string, record: any) => {
        return (
          <span
            onClick={() => {
              setVisibleEdit(true)
              setEditId(record.id)
            }}
            style={{
              fontSize: '14px',
              fontWeight: ' 400',
              color: 'var(--primary-d2)',
              cursor: 'pointer',
            }}
          >
            {t('report.list.modify')}
          </span>
        )
      },
    },
  ]
  const nowPath2 = Number(pathname.split('/')[4]) || ''
  const title = menuList[(nowPath2 as number) - 1]?.name

  const onChangeTime = (type: string, dates: any) => {
    const date = []
    date[0] = moment(dates[0]).format('YYYY-MM-DD')
    date[1] = moment(dates[1]).format('YYYY-MM-DD')
    if (type === 'report') {
      setQueryParams({
        ...queryParams,
        report_start_time: date[0],
        report_end_time: date[1],
      })
      return
    }
    setQueryParams({
      ...queryParams,
      send_start_time: date[0],
      send_end_time: date[1],
    })
  }

  const onChangeStatusType = (value: any) => {
    setQueryParams({
      ...queryParams,
      type: value,
    })
  }
  const onChangeSubmitter = (value: any) => {
    setQueryParams({
      ...queryParams,
      user_id: value,
    })
  }
  const onChangeRepType = (value: any) => {
    setQueryParams({
      ...queryParams,
      report_template_id: value,
    })
  }

  const onPressEnter = (value: any) => {
    if (value) {
      setQueryParams({
        keyword: value,
      })
    } else {
      setQueryParams({
        ...queryParams,
        keyword: value,
      })
    }
    setPageObj({ ...pageObj, page: 1 })
  }

  const onChangePage = (page: any, size: number) => {
    setPageObj({ page, pagesize: size })
  }

  const restQuery = () => {
    setQueryParams({})
  }

  const repDate = useMemo(() => {
    if (queryParams.report_start_time && queryParams.report_end_time) {
      return [
        moment(queryParams.report_start_time),
        moment(queryParams.report_end_time),
      ]
    }
    return null
  }, [queryParams])

  const submitDate = useMemo(() => {
    if (queryParams.send_start_time && queryParams.send_end_time) {
      return [
        moment(queryParams.send_start_time),
        moment(queryParams.send_end_time),
      ]
    }
    return null
  }, [queryParams])

  const extraSelect = (
    <>
      <SelectWrapForList>
        <span style={{ margin: '0 16px', fontSize: '14px' }}>
          {t('report.list.submitter')}
        </span>
        <CustomSelect
          style={{ width: 148 }}
          getPopupContainer={(node: any) => node}
          allowClear
          optionFilterProp="label"
          value={[queryParams.user_id]}
          options={userOptions}
          onChange={onChangeSubmitter}
        />
      </SelectWrapForList>
      <SelectWrapForList>
        <span style={{ margin: '0 16px', fontSize: '14px' }}>
          {t('report.list.status')}
        </span>
        <CustomSelect
          style={{ width: 148 }}
          getPopupContainer={(node: any) => node}
          allowClear
          optionFilterProp="label"
          options={statusOptions}
          onChange={onChangeStatusType}
        />
      </SelectWrapForList>
    </>
  )
  const generateOptions = (item: any) => {
    return {
      label: item.name,
      value: item.id,
    }
  }
  const getTemplateList = async () => {
    const data = await templateList()
    setRepTypeOptions(
      [{ label: '所有', value: null }].concat(data.map(generateOptions)),
    )
  }

  const getUserList = async () => {
    const data = await getStaffList({ all: 1 })
    setUserOptions(data.map(generateOptions))
  }

  useEffect(() => {
    getTemplateList()
    getUserList()
  }, [])

  return (
    <>
      <ListTitle>
        <span>{title}</span>
        <div>
          <InputSearch
            placeholder={t('report.list.search')}
            onChangeSearch={onPressEnter}
            leftIcon
          />
        </div>
      </ListTitle>
      <ListHead>
        <SelectWrapForList>
          <span style={{ margin: '0 16px', fontSize: '14px' }}>
            {t('report.list.reportType')}
          </span>
          <CustomSelect
            style={{ width: 148 }}
            getPopupContainer={(node: any) => node}
            allowClear
            optionFilterProp="label"
            defaultValue={[null]}
            value={[queryParams.report_template_id || null]}
            options={repTypeOptions}
            onChange={onChangeRepType}
          />
        </SelectWrapForList>
        {id !== 1 && (id === 2 || id === 3) ? extraSelect : null}
        <SelectWrapForList>
          <span style={{ margin: '0 16px', fontSize: '14px' }}>
            {t('report.list.dateReport')}
          </span>
          <RangePicker
            isShowQuick
            placement="bottomLeft"
            dateValue={repDate}
            onChange={date => onChangeTime('report', date)}
          />
        </SelectWrapForList>
        <SelectWrapForList>
          <span style={{ margin: '0 16px', fontSize: '14px' }}>
            {t('report.list.dateSubmit')}
          </span>
          <RangePicker
            isShowQuick
            placement="bottomLeft"
            dateValue={submitDate}
            onChange={date => onChangeTime('submit', date)}
          />
        </SelectWrapForList>
        <ClearButton onClick={restQuery}>清除条件</ClearButton>
      </ListHead>
      <ListContent>
        <div
          style={{
            height: 'calc(100% - 50px)',
            overflow: 'hidden',
            padding: '16px 16px 0',
          }}
        >
          <ResizeTable
            isSpinning={isSpinning}
            dataWrapNormalHeight="100%"
            col={
              id === 1
                ? columns
                : columns?.filter((item: any) => item.dataIndex)
            }
            noData={<NoData />}
            dataSource={listData}
          />
        </div>
        <PaginationBox
          total={total}
          pageSize={pageObj.pagesize}
          currentPage={pageObj.page}
          onChange={onChangePage}
        />
      </ListContent>
      {viewReportModal.visible && <ReportDetailDrawer />}

      <HandleReport
        editId={editId}
        visibleEdit={visibleEdit}
        editClose={() => setVisibleEdit(false)}
        visibleEditText="修改汇报"
      />
    </>
  )
}

export default List
