/* eslint-disable react/no-danger */
/* eslint-disable no-undefined */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/naming-convention */
import {
  PaginationWrap,
  StaffTableWrap,
  TableWrap,
} from '@/components/StyleCommon'
import { message, Pagination, Spin, Tooltip } from 'antd'
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { SelectWrapBedeck } from '@/components/TableFilter'
import { DataWrap, tableWrapP } from '../staff'
import NoData from '@/components/NoData'
import Sort from '@/components/Sort'
import WhiteDay from './components/WhiteDay'
import { useParams } from 'react-router-dom'
import LookDay from './components/LookDay'
import { getDailyList, writeDaily } from '@/services/daily'
import { DailyContext } from '.'
import CommonInput from '@/components/CommonInput'
import RangePicker from '@/components/RangePicker'
import styled from '@emotion/styled'

const TableBox = styled(TableWrap)({
  height: '100%',
  '.ant-table, .ant-table-content,.ant-table-container': {
    height: '100%',
  },
  '.ant-table table': {
    paddingBottom: 0,
  },
})

const titleList = {
  2: '修改日报',
  3: '修改周报',
  4: '修改月报',
}
const srr = [undefined, undefined, 1, 2, 3]
const Send = () => {
  const dataWrapRef = useRef<HTMLDivElement>(null)
  const [t] = useTranslation()
  const [keyword, setKeyword] = useState<string>('')
  const { id: urlId = '' } = useParams<any>()
  const [listData, setListData] = useState<any>([])
  const [changeIds, setChangeIds] = useState<any>([])
  const [orderKey, setOrderKey] = useState<any>()
  const [order, setOrder] = useState<any>('')
  const [page, setPage] = useState<number>(1)
  const [created_at, setCreated_at] = useState<any>(null)
  const [pagesize, setPagesize] = useState<number>(20)
  const [total, setTotal] = useState<number>()
  const [isSpinning, setIsSpinning] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [editId, setEditId] = useState('')
  const [showId, setShowId] = useState('')
  const [editType, setEditType] = useState('')
  const [visibleLook, setVisibleLook] = useState(false)
  const [visibleEditText, setVisibleEditText] = useState('')
  const [type, setType] = useState('')
  const context: any = useContext(DailyContext)
  const [dataWrapHeight, setDataWrapHeight] = useState(0)
  const [tableWrapHeight, setTableWrapHeight] = useState(0)
  useLayoutEffect(() => {
    if (dataWrapRef.current) {
      const currentHeight = dataWrapRef.current.clientHeight
      if (currentHeight !== dataWrapHeight) {
        setDataWrapHeight(currentHeight)
      }

      const tableBody = dataWrapRef.current.querySelector('.ant-table-tbody')
      if (tableBody && tableBody.clientHeight !== tableWrapHeight) {
        setTableWrapHeight(tableBody.clientHeight)
      }
    }
  }, [listData])
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
      message.success(t('setting.success'))
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
      title: <NewSort fixedKey="name">{t('common.title')}</NewSort>,
      dataIndex: 'name',
      key: 'name',
      render: (text: string | number) => {
        return <div>{text}</div>
      },
    },
    {
      title: t('p2.synopsis'),
      dataIndex: 'finish_content',
      key: 'finish_content',
      width: 200,
      render: (text: string) => {
        return (
          <Tooltip
            placement="topLeft"
            title={
              (
                <span
                  dangerouslySetInnerHTML={{
                    __html: text.trim().slice(0, 100),
                  }}
                />
              ) || '--'
            }
            getPopupContainer={node => node}
          >
            <span
              style={{
                display: 'block',
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              dangerouslySetInnerHTML={{ __html: text.trim().slice(0, 100) }}
            />
          </Tooltip>
        )
      },
    },
    {
      title: (
        <NewSort fixedKey="file_count">{t('p2.NumberOfAttachments')}</NewSort>
      ),
      dataIndex: 'file_count',
      key: 'file_count',
      width: 200,
      render: (text: string) => {
        return <span>{`${text}${t('p2.ge')}`}</span>
      },
    },
    {
      title: (
        <NewSort fixedKey="story_count">{t('p2.RelatedRequirements')}</NewSort>
      ),
      dataIndex: 'story_count',
      key: 'story_count',
      width: 150,
      render: (text: string) => {
        return <span>{`${text}${t('p2.ge')}`}</span>
      },
    },
    {
      title: <NewSort fixedKey="created_at">{t('p2.dateCreated')}</NewSort>,
      dataIndex: 'created_at',
      key: 'created_at',
      width: 160,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: t('common.copySend'),
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
      title: t('p2.haveRead'),
      dataIndex: 'read_user',
      key: 'read_user',
      width: 170,
      render: (text: any) => {
        return <span>{text.join('  ；  ') || '--'}</span>
      },
    },

    {
      title: t('newlyAdd.operation'),
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      fixed: 'right',
      render: (text: string, record: any) => {
        return (
          <div style={{ textAlign: 'right', width: '72px' }}>
            {record.read_user.length > 0 ? null : (
              <span
                onClick={() => {
                  setVisibleEdit(true)
                  setVisibleEditText(
                    titleList[urlId as unknown as keyof typeof titleList],
                  )
                  setEditId(record.id)
                  setEditType(record.type)
                  setType(record.type)
                }}
                style={{
                  fontSize: '14px',
                  fontWeight: ' 400',
                  color: '#2877FF',
                  cursor: 'pointer',
                }}
              >
                {t('p2.edit')}
              </span>
            )}

            <span
              onClick={() => {
                setVisibleLook(true)
                setShowId(record.id)
                setType(record.type)
                setTimeout(() => {
                  init()
                }, 1000)
              }}
              style={{
                fontSize: '14px',
                fontWeight: ' 400',
                color: '#2877FF',
                marginLeft: '16px',
                cursor: 'pointer',
              }}
            >
              {t('p2.show')}
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
  const onPressEnter = (value: any) => {
    setKeyword(value)
  }

  const onChangePage = (newPage: any) => {
    setPage(newPage)
  }
  const onShowSizeChange = (current: any, size: any) => {
    setPagesize(size)
  }
  const onChangeTime = (dates: any) => {
    if (dates === null) {
      setCreated_at(null)
      return
    }
    const date = []
    date[0] = moment(dates[0]).format('YYYY-MM-DD')
    date[1] = moment(dates[1]).format('YYYY-MM-DD')

    setCreated_at(date)
  }

  const init = async () => {
    setIsSpinning(true)
    const obj: any = {
      type: srr[urlId as unknown as number],
      keyword,
      order,
      orderkey: orderKey,
      page,
      pagesize,
    }
    if (created_at) {
      obj.created_at = created_at
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
    setTimeout(() => {
      init()
    }, 1000)
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
  const tableY =
    tableWrapHeight > dataWrapHeight - 52 ? dataWrapHeight - 52 : void 0
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
          paddingRight: '24px',
          justifyContent: 'space-between',
        }}
      >
        <SelectWrapBedeck>
          <span style={{ margin: '0 16px', fontSize: '14px' }}>
            {t('p2.dateCreated')}
          </span>
          <RangePicker
            isShowQuick
            dateValue={
              created_at ? [moment(created_at[0]), moment(created_at[1])] : null
            }
            onChange={onChangeTime}
          />
        </SelectWrapBedeck>
        <CommonInput
          placeholder={t('p2.search')}
          onChangeSearch={onPressEnter}
        />
      </div>
      <div className={tableWrapP} style={{ height: `calc(100% - ${50}px)` }}>
        <StaffTableWrap
          style={{
            height: 'calc(100% - 50px)',
            overflow: 'hidden',
            padding: '16px 16px 0',
          }}
        >
          <DataWrap ref={dataWrapRef}>
            <Spin spinning={isSpinning}>
              {!!listData &&
                (listData?.length > 0 ? (
                  <TableBox
                    rowKey="id"
                    columns={columnsData}
                    dataSource={listData}
                    pagination={false}
                    scroll={{
                      x: 'max-content',
                      y: tableY,
                    }}
                    tableLayout="auto"
                    showSorterTooltip={false}
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
        type={type}
      />

      <LookDay
        onChange={changePage}
        editId={showId}
        visible={visibleLook}
        onEditClose={lookClose}
        editConfirm={lookConfirm}
        type={type}
      />
    </div>
  )
}

export default Send
