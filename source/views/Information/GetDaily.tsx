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
import { Checkbox, DatePicker, Pagination, Space, Spin } from 'antd'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import {
  rangPicker,
  SelectWrap,
  SelectWrapBedeck,
} from '@/components/TableFilter'
import { DataWrap, TableBox, tableWrapP } from '../staff'
import NoData from '@/components/NoData'
import Sort from '@/components/Sort'
import { getReceiveList } from '@/services/daily'
import { useParams } from 'react-router-dom'
import { getStaffList2 } from '@/services/staff'
import LookDay from './components/LookDay'
import { DailyContext } from '.'
import CommonInput from '@/components/CommonInput'
import RangePicker from '@/components/RangePicker'

const srr = [
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  1,
  2,
  3,
]
const Get = () => {
  const [t, i18n] = useTranslation()
  const [keyword, setKeyword] = useState<string>('')
  const { id: urlId = '' } = useParams<any>()
  const [listData, setListData] = useState<any>([])
  const [orderKey, setOrderKey] = useState<any>()
  const [order, setOrder] = useState<any>(3)
  const [page, setPage] = useState<number>(1)
  const [created_at, setCreated_at] = useState<any>(null)
  const [pagesize, setPagesize] = useState<number>(20)
  const [total, setTotal] = useState<number>()
  const [isSpinning, setIsSpinning] = useState(false)
  const [options, setOptions] = useState<any>([])
  const [userId, setUserId] = useState<any>('')
  const [status, setStatus] = useState<any>(false)
  const [changeIds, setChangeIds] = useState<any>([])
  const [showId, setShowId] = useState('')
  const [visibleLook, setVisibleLook] = useState(false)
  const [type, setType] = useState('')
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
      title: <NewSort fixedKey="finish_content">{t('p2.synopsis')}</NewSort>,
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
      title: (
        <NewSort fixedKey="file_count">{t('p2.NumberOfAttachments')}</NewSort>
      ),
      dataIndex: 'file_count',
      key: 'file_count',
      width: 200,
      render: (text: string) => {
        return <span>{`${text}个`}</span>
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
        return <span>{`${text}个`}</span>
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
      title: <NewSort fixedKey="role_name">{t('p2.MyReadingStatus')}</NewSort>,
      dataIndex: 'role_name',
      key: 'role_name',
      width: 170,
      render: (text: string, record: any) => {
        return (
          <div>
            <span
              style={{
                width: '8px',
                height: '8px',
                background: record.status === 1 ? '#43BA9A' : 'red',
                display: 'inline-block',
                borderRadius: '50%',
                marginRight: '8px',
              }}
            />
            <span>{record.status === 1 ? t('p2.haveRead') : '未读'}</span>
          </div>
        )
      },
    },

    {
      title: t('newlyAdd.operation'),
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      fixed: 'right',
      render: (text: string, record: any) => {
        return (
          <div>
            <span
              onClick={() => {
                setVisibleLook(true)
                setShowId(record.id)
                setType(record.type)
              }}
              style={{
                fontSize: '14px',
                fontWeight: ' 400',
                color: '#2877FF',
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
  const confirm = (e: any) => {
    setUserId(e)
  }
  const onChange = (e: any) => {
    setStatus(e.target.checked)
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
  const lookClose = () => {
    setVisibleLook(false)
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
      userId,
      status,
    }
    if (created_at) {
      obj.created_at = created_at
    }
    const res = await getReceiveList(obj)
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
      userId: '',
      status: false,
    }
    const res = await getReceiveList(obj)
    if (res) {
      setIsSpinning(false)
    }
    setChangeIds(res.list.map((item: any) => item.id))
    setListData(res.list)
    setTotal(res.total)
  }
  useEffect(() => {
    init()
  }, [orderKey, order, page, pagesize, keyword, created_at, userId, status])
  useEffect(() => {
    init2()
  }, [urlId])

  const getList = async () => {
    const result = await getStaffList2({ all: 1 })

    setOptions(
      result.map((item: any) => {
        return {
          label: item.name,
          value: item.id,
        }
      }),
    )
  }
  useEffect(() => {
    getList()
  }, [])

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
          justifyContent: 'space-between',
          paddingLeft: '24px',
          paddingRight: '24px',
          gap: '20px',
        }}
      >
        <Space size={16} style={{ display: 'flex', alignItems: 'center' }}>
          <SelectWrapBedeck>
            <span style={{ margin: '0 16px', fontSize: '14px' }}>
              {t('p2.dateCreated')}
            </span>
            <RangePicker
              isShowQuick
              dateValue={
                created_at
                  ? [moment(created_at[0]), moment(created_at[1])]
                  : null
              }
              onChange={onChangeTime}
            />
          </SelectWrapBedeck>

          <SelectWrapBedeck>
            <span style={{ margin: '0 16px', fontSize: '14px' }}>
              {t('p2.sender')}
            </span>

            <SelectWrap
              allowClear
              showArrow
              style={{ width: '100%' }}
              placeholder={t('common.pleaseSelect')}
              onChange={confirm}
              optionFilterProp="label"
              options={options}
            />
          </SelectWrapBedeck>
          <Checkbox onChange={onChange}>只看未阅</Checkbox>
        </Space>
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
      <LookDay
        onChange={changePage}
        editId={showId}
        visible={visibleLook}
        onEditClose={lookClose}
        type={type}
      />
    </div>
  )
}

export default Get
