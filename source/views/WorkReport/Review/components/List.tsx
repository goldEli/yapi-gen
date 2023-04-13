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

const List = () => {
  const [t] = useTranslation()
  const { pathname } = useLocation()
  const [isSpinning, setIsSpinning] = useState(false)
  const [order, setOrder] = useState<any>('')
  const [orderKey, setOrderKey] = useState<any>()
  const [visibleLook, setVisibleLook] = useState(false)
  const [total, setTotal] = useState<number>(250)
  const [pageObj, setPageObj] = useState({ page: 1, pagesize: 20 })
  const [listData, setListData] = useState<any[]>([])
  const [queryParams, setQueryParams] = useState<any>({})
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
  }, [id, pageObj, queryParams])

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
  const columns: any = [
    {
      width: 188,
      title: t('common.title'),
      dataIndex: 'user',
      render: (_: string, record: any) => {
        return <span>{String(record.user.name)}</span>
      },
    },
    {
      width: 450,
      title: t('report.list.summary'),
      dataIndex: 'report_precis',
      render: (text: string) => {
        return (
          <Tooltip
            placement="topLeft"
            title={text || '--'}
            getPopupContainer={node => node}
          >
            <span
              style={{
                display: 'block',
                width: '400px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {text.trim().slice(0, 100)}
            </span>
          </Tooltip>
        )
      },
    },
    {
      width: 252,
      title: (
        <NewSort fixedKey="file_count">{t('report.list.reportTime')}</NewSort>
      ),
      dataIndex: 'start_time',
      render: (_: string, record: any) => {
        return <span>{`${record.start_time} ~ ${record.end_time}`}</span>
      },
    },
    {
      width: 240,
      title: (
        <NewSort fixedKey="created_at">{t('report.list.submitTime')}</NewSort>
      ),
      dataIndex: 'created_at',
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
              // setVisibleEdit(true)
              // setEditId(record.id)
              // setEditType(record.type)
              // setType(record.type)
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

  const onChangeType = (val: any) => {
    console.log(val)
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
    if (queryParams.report_start_time && queryParams.report_end_time) {
      return [
        moment(queryParams.send_start_time),
        moment(queryParams.report_end_time),
      ]
    }
    return null
  }, [queryParams])

  const extraSelect = (
    <>
      <SelectWrapForList>
        <span style={{ margin: '0 16px', fontSize: '14px' }}>
          {id === 2 && t('report.list.submitter')}
          {id === 3 && t('report.list.informant')}
        </span>
        <CustomSelect
          style={{ width: 148 }}
          getPopupContainer={(node: any) => node}
          allowClear
          optionFilterProp="label"
          defaultValue={['all']}
          options={[
            { label: '所有', value: 'all' },
            { label: '张三', value: 'date' },
            { label: '李四', value: 'date1' },
            { label: '王五', value: 'date2' },
          ]}
          onChange={onChangeType}
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
          defaultValue={['all']}
          options={[
            { label: '所有', value: 'all' },
            { label: '未读', value: 'unread' },
            { label: '已读', value: 'read' },
            { label: '已评', value: 'reviewed' },
          ]}
          onChange={onChangeType}
        />
      </SelectWrapForList>
    </>
  )

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
            defaultValue={['all']}
            options={[
              { label: '所有', value: 'all' },
              { label: '工作日报', value: 'date' },
              { label: '工作日报1', value: 'date1' },
              { label: '工作日报2', value: 'date2' },
            ]}
            onChange={onChangeType}
          />
        </SelectWrapForList>
        {id !== 1 && (id === 2 || id === 3) ? extraSelect : null}
        <SelectWrapForList>
          <span style={{ margin: '0 16px', fontSize: '14px' }}>
            {t('report.list.dateReport')}
          </span>
          <RangePicker
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
            col={columns}
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
      <ReportDetailDrawer />
    </>
  )
}

export default List
