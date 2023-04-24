/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { useEffect, useMemo, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { useLocation, useParams } from 'react-router-dom'
import { SelectWrapBedeck } from '@/components/StyleCommon'
import moment from 'moment'
import RangePicker from '@/components/RangePicker'
import CustomSelect from '@/components/MoreSelect'
import InputSearch from '@/components/InputSearch'
import ResizeTable from '@/components/ResizeTable'
import PaginationBox from '@/components/TablePagination'
import Sort from '@/components/Sort'
import NoData from '@/components/NoData'
import ReadStatusTag from './ReadStatusTag'
import {
  getRepSentList,
  getRepReceivedList,
  getRepPublicList,
  templateLatelyList,
} from '@/services/report'
import { getStaffList } from '@/services/staff'
import HandleReport from './HandleReport'
import LabelTag from '@/components/LabelTag'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import { Divider, Space, Tooltip } from 'antd'
import { useSelector, useDispatch } from '@store/index'
import ScreenMinHover from '@/components/ScreenMinHover'
import { saveViewReportDetailDrawer } from '@store/workReport/workReport.thunk'
import { css } from '@emotion/css'

const listContainer = css`
  margin: 0 24px;
`

const ListTitle = styled.div`
  height: 32px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0;
  .title-text {
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
})

const SelectWrapForList = styled(SelectWrapBedeck)`
  margin-right: 16px;
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

const List = () => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const { pathname } = useLocation()
  const [isSpinning, setIsSpinning] = useState(false)
  const [total, setTotal] = useState<number>(0)
  const [pageObj, setPageObj] = useState(defaultPageParam)
  const [listData, setListData] = useState<any[]>([])
  const [repTypeOptions, setRepTypeOptions] = useState<any[]>([])
  const [userOptions, setUserOptions] = useState<any[]>([])
  const [queryParams, setQueryParams] = useState<any>({})
  const [editId, setEditId] = useState<any>()
  const [visibleEdit, setVisibleEdit] = useState(false)
  const params = useParams()
  const id = Number(params?.id)
  const { isFresh } = useSelector(state => state.workReport.listUpdate)

  const statusOptions = [
    { label: t('p2.noRead'), value: 1, id: 1 },
    { label: t('p2.haveRead'), value: 2, id: 2 },
    { label: t('report.list.haveComment'), value: 3, id: 3 },
  ]
  const reportState = [
    {
      label: t('report.list.update'),
      color: '#E56F0E',
      background: 'rgba(250,151,70,0.1)',
      state: 1,
    },
    {
      label: t('report.list.makeup'),
      color: '#7641E8 ',
      background: 'rgba(161,118,251,0.1)',
      state: 2,
    },
  ]

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
      setListData([])
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

  useEffect(() => {
    if (isFresh !== 0) {
      getList()
    }
  }, [isFresh])

  useEffect(() => {
    getList()
  }, [pageObj, queryParams])

  useEffect(() => {
    setQueryParams({})
    setPageObj({ ...pageObj, page: 1 })
  }, [id])

  const onClickView = (row: any) => {
    dispatch(
      saveViewReportDetailDrawer({
        visible: true,
        id: row.id,
        ids: listData?.map((i: any) => i.id),
      }),
    )
  }

  const onUpdateOrderKey = (key: any, val: any) => {
    setQueryParams({
      ...queryParams,
      order: val === 2 ? 'desc' : 'asc',
      orderkey: key,
    })
  }

  const NewSort = (props: any) => {
    return (
      <Sort
        fixedKey={props.fixedKey}
        onChangeKey={props.onUpdateOrderKey}
        nowKey={props.nowKey}
        order={props.order}
      >
        {props.children}
      </Sort>
    )
  }
  const columns: any[] = [
    {
      width: 200,
      title: (
        <NewSort
          fixedKey="user_id"
          nowKey={queryParams.orderkey}
          order={queryParams.order}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.title')}
        </NewSort>
      ),
      dataIndex: 'user',
      render: (_: string, record: any) => {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: 52,
              cursor: 'pointer',
            }}
            className="canClickDetail"
            onClick={() => onClickView(record)}
          >
            {record.user?.avatar ? (
              <img
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                }}
                src={record.user?.avatar}
              />
            ) : (
              <span>
                <CommonUserAvatar size="small" />
              </span>
            )}
            <Tooltip
              placement="topLeft"
              title={`${String(record.user.name)}${t('report.list.of')}${
                record.name
              }`}
              getPopupContainer={node => node}
            >
              <span
                style={{
                  display: 'inline-block',
                  maxWidth: 160,
                  marginRight: 12,
                  marginLeft: 8,
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  verticalAlign: 'middle',
                }}
              >
                {String(record.user.name)}
                {t('report.list.of')}
                {record.name}
              </span>
              {(id === 1 || id === 3) && record.is_supply === 1 && (
                <LabelTag options={reportState} state={2} />
              )}
              {id === 2 &&
                (record.is_supply !== 2 || record.is_update !== 2) && (
                  <LabelTag
                    options={reportState}
                    state={
                      record.is_supply === 1
                        ? 2
                        : record.is_update === 1
                        ? 1
                        : 0
                    }
                  />
                )}
            </Tooltip>
          </div>
        )
      },
    },
    {
      width: 450,
      title: (
        <NewSort
          fixedKey="user_id"
          nowKey={queryParams.orderkey}
          order={queryParams.order}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('report.list.summary')}
        </NewSort>
      ),
      dataIndex: 'report_precis',
      render: (text: string, record: any) => {
        return (
          <Tooltip
            placement="topLeft"
            title={text || '--'}
            getPopupContainer={node => node}
          >
            <span
              className="canClickDetail"
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
      title: (
        <NewSort
          fixedKey="start_time"
          nowKey={queryParams.orderkey}
          order={queryParams.order}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('report.list.reportTime')}
        </NewSort>
      ),
      dataIndex: 'start_time',
      render: (_: string, record: any) => {
        return record.submit_cycle === 4 ? (
          '--'
        ) : (
          <span>{`${record.start_time} ~ ${moment(record.end_time).format(
            'YYYY-MM-DD',
          )}`}</span>
        )
      },
    },
    {
      width: 240,
      title: (
        <NewSort
          fixedKey="updated_at"
          nowKey={queryParams.orderkey}
          order={queryParams.order}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('report.list.submitTime')}
        </NewSort>
      ),
      dataIndex: 'updated_at',
    },
    {
      width: 160,
      title: t('report.list.readState'),
      align: 'center',
      dataIndex: 'type',
      render: (text: number, record: any) => {
        return id === 1 ? (
          <ReadStatusTag status={record.is_read === 1 ? 'read' : 'no'} />
        ) : (
          <ReadStatusTag
            status={text === 2 ? 'read' : text === 1 ? 'no' : 'have'}
          />
        )
      },
    },
    {
      width: 92,
      title: t('report.list.operation'),
      align: 'center',
      fixed: 'right',
      render: (_: string, record: any) => {
        return record?.is_submitter_edit === 1 ? (
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
        ) : (
          <span
            style={{
              fontSize: '14px',
              fontWeight: ' 400',
              color: '#bbbdbf',
              cursor: 'not-allowed',
            }}
          >
            修改
          </span>
        )
      },
    },
  ]
  const nowPath2 = Number(pathname.split('/')[4]) || ''
  const title = menuList[(nowPath2 as number) - 1]?.name

  const onChangeTime = (type: string, dates: any) => {
    const date = []
    date[0] = dates ? moment(dates[0]).format('YYYY-MM-DD') : null
    date[1] = dates ? moment(dates[1]).format('YYYY-MM-DD') : null
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
      type: value ? (Array.isArray(value) ? value : [value]) : value,
    })
  }
  const onChangeSubmitter = (value: any) => {
    setQueryParams({
      ...queryParams,
      user_ids: value ? (Array.isArray(value) ? value : [value]) : value,
    })
  }
  const onChangeRepType = (value: any) => {
    setQueryParams({
      ...queryParams,
      report_template_ids: value
        ? Array.isArray(value)
          ? value
          : [value]
        : value,
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
          showArrow
          showSearch
          value={queryParams.user_ids}
          options={userOptions}
          onChange={onChangeSubmitter}
          onConfirm={() => null}
        />
      </SelectWrapForList>
      {id !== 3 && (
        <SelectWrapForList>
          <span style={{ margin: '0 16px', fontSize: '14px' }}>
            {t('report.list.status')}
          </span>
          <CustomSelect
            showArrow
            showSearch
            value={queryParams.type}
            style={{ width: 148 }}
            getPopupContainer={(node: any) => node}
            allowClear
            optionFilterProp="label"
            options={statusOptions}
            onChange={onChangeStatusType}
            onConfirm={() => null}
          />
        </SelectWrapForList>
      )}
    </>
  )
  const generateOptions = (item: any) => {
    return {
      label: item.name,
      value: item.id,
      id: item.id,
    }
  }
  // 获取我可操作的模板list
  const getTemplateList = async () => {
    const res = await templateLatelyList()
    if (res && res.code === 0) {
      const data = res?.data || {}
      const temp = [
        ...(data.otherTemplate || []),
        ...(data.usedTemplate || []),
      ].filter(
        (item: any) =>
          !(item.is_current_cycle_used && item.is_cycle_limit === 1),
      )
      setRepTypeOptions(temp.map(generateOptions))
    }
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
    <div className={listContainer}>
      <ListTitle>
        <span className="title-text">{title}</span>
        <Space size={24}>
          <InputSearch
            defaultValue={queryParams.keyword}
            placeholder={t('report.list.search')}
            onChangeSearch={onPressEnter}
            leftIcon
            isReport
          />
          <ScreenMinHover
            label={t('common.refresh')}
            icon="sync"
            onClick={getList}
          />
        </Space>
      </ListTitle>
      <ListHead>
        <SelectWrapForList>
          <span style={{ margin: '0 16px', fontSize: '14px' }}>
            {t('report.list.reportType')}
          </span>
          <CustomSelect
            showArrow
            showSearch
            style={{ width: 148 }}
            getPopupContainer={(node: any) => node}
            allowClear
            optionFilterProp="label"
            value={queryParams.report_template_ids}
            options={repTypeOptions}
            onChange={onChangeRepType}
            onConfirm={() => null}
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
        <ClearButton onClick={restQuery}>{t('common.clearForm')}</ClearButton>
      </ListHead>

      <Divider style={{ margin: '20px 0' }} />
      <ResizeTable
        isSpinning={isSpinning}
        dataWrapNormalHeight="calc(100vh - 264px)"
        col={
          id === 1
            ? columns
            : id === 3
            ? columns?.filter(
                (item: any) => item.dataIndex && item.dataIndex !== 'type',
              )
            : columns?.filter((item: any) => item.dataIndex)
        }
        noData={<NoData />}
        dataSource={listData}
      />

      {total ? (
        <PaginationBox
          total={total}
          pageSize={pageObj.pagesize}
          currentPage={pageObj.page}
          onChange={onChangePage}
        />
      ) : null}

      <HandleReport
        editId={editId}
        visibleEdit={visibleEdit}
        editClose={() => setVisibleEdit(false)}
        visibleEditText={t('report.list.modifyReport')}
      />
    </div>
  )
}

export default List
