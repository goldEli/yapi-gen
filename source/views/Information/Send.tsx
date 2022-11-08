/* eslint-disable react/no-danger */
/* eslint-disable no-undefined */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/naming-convention */
import IconFont from '@/components/IconFont'
import {
  MyInput,
  PaginationWrap,
  StaffTableWrap,
} from '@/components/StyleCommon'
import { DatePicker, message, Pagination, Spin, Tooltip } from 'antd'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { rangPicker, SelectWrapBedeck } from '@/components/TableFilter'
import { DataWrap, TableBox, tableWrapP } from '../staff'
import NoData from '@/components/NoData'
import Sort from '@/components/Sort'
import WhiteDay from './components/WhiteDay'
import { useParams } from 'react-router-dom'
import LookDay from './components/LookDay'
import { getDailyList, writeDaily } from '@/services/daily'
import { DailyContext } from '.'

const titleList = {
  2: '修改日报',
  3: '修改周报',
  4: '修改月报',
}
const srr = [undefined, undefined, 1, 2, 3]
const Send = () => {
  const [t, i18n] = useTranslation()
  const [keyword, setKeyword] = useState<string>('')
  const { id: urlId = '' } = useParams<any>()
  const [listData, setListData] = useState<any>([])
  const [changeIds, setChangeIds] = useState<any>([])
  const [orderKey, setOrderKey] = useState<any>()
  const [order, setOrder] = useState<any>('')
  const [page, setPage] = useState<number>(1)
  const [created_at, setCreated_at] = useState<any>([])
  const [pagesize, setPagesize] = useState<number>(20)
  const [total, setTotal] = useState<number>()
  const [isSpinning, setIsSpinning] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [editId, setEditId] = useState('')
  const [showId, setShowId] = useState('')
  const [editType, setEditType] = useState('')
  const [visibleLook, setVisibleLook] = useState(false)
  const [visibleEditText, setVisibleEditText] = useState('')
  const context: any = useContext(DailyContext)

  const editClose = () => {
    setVisibleEdit(false)
  }

  const editConfirm = async (params: any, needId: any) => {
    const obj = {
      id: needId,
      finish_content: params.info,
      plan_content: params.info2,
      copysend: params.people,
      files: params.attachments.map((item: any) => item.url),
      story_ids: params.needs,
      type: editType,
    }

    const res = await writeDaily(obj, 2)
    if (res.code === 0) {
      message.success('成功')
      editClose()
      init()
    }
  }
  const lookClose = () => {
    setVisibleLook(false)
  }

  const lookConfirm = async (e: any) => {
    editClose()
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
      width: 100,
      title: <NewSort fixedKey="name">标题</NewSort>,
      dataIndex: 'name',
      key: 'name',
      render: (text: string | number) => {
        return <div>{text}</div>
      },
    },
    {
      title: <NewSort fixedKey="finish_content">内容摘要</NewSort>,
      dataIndex: 'finish_content',
      key: 'finish_content',
      width: 200,
      render: (text: string) => {
        return (
          <span
            style={{
              width: '200px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            dangerouslySetInnerHTML={{ __html: text || '--' }}
          />
        )
      },
    },
    {
      title: <NewSort fixedKey="file_count">附件数量</NewSort>,
      dataIndex: 'file_count',
      key: 'file_count',
      width: 200,
      render: (text: string) => {
        return <span>{`${text}个`}</span>
      },
    },
    {
      title: <NewSort fixedKey="story_count">关联需求</NewSort>,
      dataIndex: 'story_count',
      key: 'story_count',
      width: 150,
      render: (text: string) => {
        return <span>{`${text}个`}</span>
      },
    },
    {
      title: <NewSort fixedKey="created_at">创建日期</NewSort>,
      dataIndex: 'created_at',
      key: 'created_at',
      width: 160,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: '抄送人',
      dataIndex: 'copysend_user',
      key: 'copysend_user',
      width: 120,
      render: (text: any) => {
        return (
          <Tooltip
            title={text.join('  ；  ') || '--'}
            getPopupContainer={node => node}
          >
            <span
              style={{
                display: 'inline-block',
                width: '100px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {text.join('  ；  ') || '--'}
            </span>
          </Tooltip>
        )
      },
    },
    {
      title: '已阅',
      dataIndex: 'read_user',
      key: 'read_user',
      width: 170,
      render: (text: any) => {
        return <span>{text.join('  ；  ') || '--'}</span>
      },
    },

    {
      title: '操作',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      fixed: 'right',
      render: (text: string, record: any) => {
        return (
          <div style={{ textAlign: 'right' }}>
            {record.read_user.length > 0 ? null : (
              <span
                onClick={() => {
                  setVisibleEdit(true)
                  setVisibleEditText(
                    titleList[urlId as unknown as keyof typeof titleList],
                  )
                  setEditId(record.id)
                  setEditType(record.type)
                }}
                style={{
                  fontSize: '14px',
                  fontWeight: ' 400',
                  color: '#2877FF',
                  cursor: 'pointer',
                }}
              >
                修改
              </span>
            )}

            <span
              onClick={() => {
                setVisibleLook(true)
                setShowId(record.id)
              }}
              style={{
                fontSize: '14px',
                fontWeight: ' 400',
                color: '#2877FF',
                marginLeft: '16px',
                cursor: 'pointer',
              }}
            >
              查看
            </span>
          </div>
        )
      },
    },
  ]
  const updateOrderkey = (key: any, orderVal: any) => {
    setOrderKey(key)
    setOrder(orderVal)
  }
  const onPressEnter = (e: any) => {
    setKeyword(e.target.value)
  }

  const onChangePage = (newPage: any) => {
    setPage(newPage)
  }
  const onShowSizeChange = (current: any, size: any) => {
    setPagesize(size)
  }
  const onChangeTime = (key: any, dates: any) => {
    setCreated_at(dates)
  }

  const init = async () => {
    setIsSpinning(true)
    const obj = {
      type: srr[urlId as unknown as number],
      keyword,
      order,
      orderkey: orderKey,
      page,
      pagesize,
      created_at,
    }
    const res = await getDailyList(obj)
    if (res) {
      setIsSpinning(false)
    }
    setChangeIds(res.list.map((item: any) => item.id))
    setListData(res.list)
    setTotal(res.total)
  }
  const init2 = async () => {
    setIsSpinning(true)
    const obj = {
      type: srr[urlId as unknown as number],
      keyword: '',
      order: 0,
      orderkey: '',
      page: 1,
      pagesize: 20,
      created_at: [],
    }
    const res = await getDailyList(obj)
    if (res) {
      setIsSpinning(false)
    }
    setChangeIds(res.list.map((item: any) => item.id))
    setListData(res.list)
    setTotal(res.total)
  }
  const changePage = (e: any, id: any) => {
    const index = changeIds.findIndex((k: any) => k === id)
    const start = changeIds.at(0)
    const end = changeIds.at(-1)

    if (e === 1) {
      if (id === start) {
        setShowId(end)
        return
      }
      setShowId(changeIds[index - 1])
    } else {
      if (id === end) {
        setShowId(start)
        return
      }
      setShowId(changeIds[index + 1])
    }
  }

  useEffect(() => {
    init()
  }, [orderKey, order, page, pagesize, keyword, created_at])
  useEffect(() => {
    init2()
  }, [urlId, context.id])
  return (
    <div
      style={{
        height: 'calc(100% - 64px)',
      }}
    >
      <div
        style={{
          height: '52px',
          background: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '24px',
          paddingRight: '40px',
          justifyContent: 'space-between',
        }}
      >
        <SelectWrapBedeck>
          <span style={{ margin: '0 16px', fontSize: '14px' }}>创建时间</span>
          <DatePicker.RangePicker
            allowClear
            className={rangPicker}
            onChange={onChangeTime}
            getPopupContainer={node => node}
            format={(times: moment.Moment) => {
              if (times.unix() === 0 || times.unix() === 1893427200) {
                return t('common.null')
              }
              return times.format('YYYY-MM-DD')
            }}
            ranges={
              i18n.language === 'zh'
                ? {
                    最近一周: [
                      moment(new Date()).startOf('days').subtract(6, 'days'),
                      moment(new Date()).endOf('days'),
                    ],
                    最近一月: [
                      moment(new Date())
                        .startOf('months')
                        .subtract(1, 'months'),
                      moment(new Date()).endOf('days'),
                    ],
                    最近三月: [
                      moment(new Date())
                        .startOf('months')
                        .subtract(3, 'months'),
                      moment(new Date()).endOf('days'),
                    ],
                    今天开始: [
                      moment(new Date()).startOf('days'),
                      moment(1893427200 * 1000),
                    ],
                    今天截止: [moment(0), moment(new Date()).endOf('days')],
                    空: [moment(0), moment(0)],
                  }
                : {
                    'Last Week': [
                      moment(new Date()).startOf('days').subtract(6, 'days'),
                      moment(new Date()).endOf('days'),
                    ],
                    'Last Month': [
                      moment(new Date())
                        .startOf('months')
                        .subtract(1, 'months'),
                      moment(new Date()).endOf('days'),
                    ],
                    'Last March': [
                      moment(new Date())
                        .startOf('months')
                        .subtract(3, 'months'),
                      moment(new Date()).endOf('days'),
                    ],
                    'Start today': [
                      moment(new Date()).startOf('days'),
                      moment(1893427200 * 1000),
                    ],
                    'Due today': [moment(0), moment(new Date()).endOf('days')],
                    Empty: [moment(0), moment(0)],
                  }
            }
          />
        </SelectWrapBedeck>
        <MyInput
          suffix={
            <IconFont
              type="search"
              style={{ color: '#BBBDBF', fontSize: 20 }}
            />
          }
          onPressEnter={onPressEnter}
          onBlur={onPressEnter}
          placeholder={t('common.pleaseSearchDemand')}
          allowClear
        />
      </div>
      <div className={tableWrapP} style={{ height: `calc(100% - ${50}px)` }}>
        <StaffTableWrap
          style={{
            height: 'calc(100% - 50px)',
            overflow: 'hidden',
            padding: '16px 24px 0',
          }}
        >
          <DataWrap>
            <Spin spinning={isSpinning}>
              {!!listData &&
                (listData?.length > 0 ? (
                  <TableBox
                    rowKey="id"
                    columns={columnsData}
                    dataSource={listData}
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                    sticky
                  />
                ) : (
                  <NoData />
                ))}
            </Spin>
          </DataWrap>
        </StaffTableWrap>

        <PaginationWrap>
          <Pagination
            pageSize={pagesize}
            current={page}
            showSizeChanger
            showQuickJumper
            total={total}
            showTotal={newTotal => t('common.tableTotal', { count: newTotal })}
            pageSizeOptions={['10', '20', '50']}
            onChange={onChangePage}
            onShowSizeChange={onShowSizeChange}
          />
        </PaginationWrap>
      </div>
      {/* // 写日志的表单D */}
      <WhiteDay
        editId={editId}
        visibleEditText={visibleEditText}
        visibleEdit={visibleEdit}
        editClose={editClose}
        editConfirm={editConfirm}
      />

      <LookDay
        onChange={changePage}
        editId={showId}
        visible={visibleLook}
        onEditClose={lookClose}
        editConfirm={lookConfirm}
      />
    </div>
  )
}

export default Send
