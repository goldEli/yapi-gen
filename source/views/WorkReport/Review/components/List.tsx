import { useState } from 'react'
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
import LabelTag from '@/components/LabelTag'
import ReadStatusTag from './ReadStatusTag'

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
  const [reportedAt, setReportedAt] = useState<any>(null)
  const [submitAt, setSubmitAt] = useState<any>(null)
  const { pathname } = useLocation()
  const [isSpinning, setIsSpinning] = useState(false)
  const [order, setOrder] = useState<any>('')
  const [orderKey, setOrderKey] = useState<any>()
  const [visibleLook, setVisibleLook] = useState(false)
  const [total, setTotal] = useState<number>(250)
  const [pageObj, setPageObj] = useState({ page: 1, size: 20 })
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

  const updateOrderkey = (key: any, orderVal: any) => {
    setOrderKey(key)
    setOrder(orderVal)
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
  const columnsData: any = [
    {
      width: 188,
      title: t('common.title'),
      dataIndex: 'name',
      key: 'name',
      render: (text: string | number) => {
        return (
          <div>
            <span style={{ marginRight: 14 }}>{text}</span>
            <LabelTag
              options={[
                {
                  label: t('report.list.update'),
                  color: '#E56F0E',
                  background: 'rgba(250,151,70,0.1)',
                  state: 1,
                },
                {
                  label: t('report.list.makeup'),
                  color: '#7641E8',
                  background: 'rgba(161,118,251,0.1)',
                  state: 2,
                },
              ]}
              state={2}
            />
          </div>
        )
      },
    },
    {
      width: 450,
      title: t('report.list.summary'),
      dataIndex: 'finish_content',
      key: 'finish_content',
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
      dataIndex: 'file_count',
      key: 'file_count',
      render: (text: string | number) => {
        return <div>{text}</div>
      },
    },
    {
      width: 240,
      title: (
        <NewSort fixedKey="created_at">{t('report.list.submitTime')}</NewSort>
      ),
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string | number) => {
        return <div>{text}</div>
      },
    },
    {
      width: 160,
      title: t('report.list.readState'),
      align: 'center',
      dataIndex: 'state',
      key: 'state',
      render: (text: string | number) => {
        return <ReadStatusTag status="read" />
      },
    },
    {
      width: 92,
      title: t('report.list.operation'),
      align: 'center',
      fixed: 'right',
      render: (text: string, record: any) => {
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

  const onChangeTime = (dates: any) => {
    console.log(dates)
    if (dates === null) {
      setReportedAt(null)
      return
    }
    const date = []
    date[0] = moment(dates[0]).format('YYYY-MM-DD')
    date[1] = moment(dates[1]).format('YYYY-MM-DD')

    setReportedAt(date)
  }

  const onChangeType = (val: any) => {
    console.log(val)
  }

  const onPressEnter = (value: any) => {
    console.log(value)
  }

  const onChangePage = (page: any, size: number) => {
    setPageObj({ page, size })
  }

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
            dateValue={
              reportedAt ? [moment(reportedAt[0]), moment(reportedAt[1])] : null
            }
            onChange={onChangeTime}
          />
        </SelectWrapForList>
        <SelectWrapForList>
          <span style={{ margin: '0 16px', fontSize: '14px' }}>
            {t('report.list.dateSubmit')}
          </span>
          <RangePicker
            isShowQuick
            placement="bottomLeft"
            dateValue={
              submitAt ? [moment(submitAt[0]), moment(submitAt[1])] : null
            }
            onChange={onChangeTime}
          />
        </SelectWrapForList>
        <ClearButton>清除条件</ClearButton>
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
            col={id === 1 ? columnsData : columnsData.filter((k: any) => k.key)}
            // dataSource={[
            //   {
            //     name: '李钟硕的日报',
            //     finish_content:
            //       '内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX',
            //     file_count: '2023-4-6',
            //     created_at: '2023-4-6',
            //     state: '已读',
            //   },
            //   {
            //     name: '李钟硕的日报',
            //     finish_content:
            //       '内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX',
            //     file_count: '2023-4-6',
            //     created_at: '2023-4-6',
            //     state: '已读',
            //   },
            //   {
            //     name: '李钟硕的日报',
            //     finish_content:
            //       '内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX',
            //     file_count: '2023-4-4',
            //     created_at: '2023-4-6',
            //     state: '已读',
            //   },
            //   {
            //     name: '李钟硕的日报',
            //     finish_content:
            //       '内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX',
            //     file_count: '2023-4-7',
            //     created_at: '2023-4-6',
            //     state: '已读',
            //   },
            //   {
            //     name: '李钟硕的日报',
            //     finish_content:
            //       '内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX',
            //     file_count: '2023-4-6',
            //     created_at: '2023-4-6',
            //     state: '已读',
            //   },
            //   {
            //     name: '李钟硕的日报',
            //     finish_content:
            //       '内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX',
            //     file_count: '2023-4-9',
            //     created_at: '2023-4-6',
            //     state: '已读',
            //   },
            //   {
            //     name: '李钟硕的日报',
            //     finish_content:
            //       '内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX',
            //     file_count: '2023-4-6',
            //     created_at: '2023-4-6',
            //     state: '已读',
            //   },
            //   {
            //     name: '李钟硕的日报',
            //     finish_content:
            //       '内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX',
            //     file_count: '2023-4-6',
            //     created_at: '2023-4-6',
            //     state: '已读',
            //   },
            //   {
            //     name: '李钟硕的日报',
            //     finish_content:
            //       '内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX',
            //     file_count: '2023-4-6',
            //     created_at: '2023-4-6',
            //     state: '已读',
            //   },
            //   {
            //     name: '李钟硕的日报',
            //     finish_content:
            //       '内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX',
            //     file_count: '2023-4-6',
            //     created_at: '2023-4-6',
            //     state: '已读',
            //   },
            //   {
            //     name: '李钟硕的日报',
            //     finish_content:
            //       '内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX',
            //     file_count: '2023-4-6',
            //     created_at: '2023-4-6',
            //     state: '已读',
            //   },
            //   {
            //     name: '李钟硕的日报',
            //     finish_content:
            //       '内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX',
            //     file_count: '2023-4-6',
            //     created_at: '2023-4-6',
            //     state: '已读',
            //   },
            //   {
            //     name: '李钟硕的日报',
            //     finish_content:
            //       '内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX',
            //     file_count: '2023-4-6',
            //     created_at: '2023-4-6',
            //     state: '已读',
            //   },
            //   {
            //     name: '李钟硕的日报',
            //     finish_content:
            //       '内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX内容XXXXXXXXXXX',
            //     file_count: '2023-4-6',
            //     created_at: '2023-4-6',
            //     state: '已读',
            //   },
            // ]}
            dataSource={[]}
            noData={<NoData />}
          />
        </div>
        <PaginationBox
          total={total}
          pageSize={pageObj.size}
          currentPage={pageObj.page}
          onChange={onChangePage}
        />
      </ListContent>
    </>
  )
}

export default List
