// 我发送的日志列表

/* eslint-disable react/no-danger */
/* eslint-disable no-undefined */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/naming-convention */
import { message, Tooltip } from 'antd'
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { SelectWrapBedeck } from '@/components/TableFilter'
import NoData from '@/components/NoData'
import Sort from '@/components/Sort'
import WhiteDay from './components/WhiteDay'
import { useParams } from 'react-router-dom'
import LookDay from './components/LookDay'
import { getDailyList, writeDaily } from '@/services/daily'
import { DailyContext } from '.'
import RangePicker from '@/components/RangePicker'
import InputSearch from '@/components/InputSearch'
import PaginationBox from '@/components/TablePagination'
import { useDispatch, useSelector } from '@store/index'
import { changeRest } from '@store/log'
import ResizeTable from '@/components/ResizeTable'

const srr = [undefined, undefined, 1, 2, 3]
const Send = () => {
  const [t] = useTranslation()
  const [keyword, setKeyword] = useState<string>('')
  const { id: urlId = '' } = useParams<any>()
  const [listData, setListData] = useState<any>([])
  const [changeIds, setChangeIds] = useState<any>([])
  const [orderKey, setOrderKey] = useState<any>()
  const [order, setOrder] = useState<any>('')
  const [pageObj, setPageObj] = useState({ page: 1, size: 20 })
  const [created_at, setCreated_at] = useState<any>(null)
  const [total, setTotal] = useState<number>(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [editId, setEditId] = useState('')
  const [showId, setShowId] = useState('')
  const [editType, setEditType] = useState('')
  const [visibleLook, setVisibleLook] = useState(false)
  const [type, setType] = useState('')
  const context: any = useContext(DailyContext)
  const dispatch = useDispatch()
  const isRest = useSelector(state => state.log.isRest)
  const editClose = () => {
    setVisibleEdit(false)
  }

  const editConfirm = async (params: any, needId: any) => {
    const obj = {
      id: needId,
      finish_content: params.info,
      plan_content: params.info2,
      copysend: params.people,
      files: params.attachments,
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
                width: '200px',
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
            title={text.join(';') || '--'}
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
              {text.join(';') || '--'}
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
        return <span>{text.join(';') || '--'}</span>
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
          <div style={{ textAlign: 'right', width: '82px' }}>
            {record.read_user.length > 0 ? null : (
              <span
                onClick={() => {
                  setVisibleEdit(true)
                  setEditId(record.id)
                  setEditType(record.type)
                  setType(record.type)
                }}
                style={{
                  fontSize: '14px',
                  fontWeight: ' 400',
                  color: 'var(--primary-d2)',
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
                color: 'var(--primary-d2)',
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

  const onChangePage = (page: any, size: number) => {
    setPageObj({ page, size })
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
      page: pageObj.page,
      pagesize: pageObj.size,
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
    dispatch(changeRest(false))
  }

  const init2 = async () => {
    setIsSpinning(true)
    const obj = {
      type: srr[urlId as unknown as number],
      keyword,
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
  }, [orderKey, order, pageObj, keyword, created_at, isRest])

  useEffect(() => {
    init2()
  }, [urlId, context.id])

  return (
    <div
      style={{
        height: 'calc(100% - 100px)',
        // padding: '16px',
      }}
    >
      <div
        style={{
          width: '100%',
          background: 'var(--neutral-white-d2)',
          display: 'flex',
          alignItems: 'center',
          paddingRight: '24px',
          paddingBottom: '20px',
          marginLeft: '24px',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--neutral-n6-d1)',
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
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
          }}
        >
          <InputSearch
            placeholder={t('p2.search')}
            onChangeSearch={onPressEnter}
            leftIcon
          />
        </div>
      </div>
      <div style={{ height: `calc(100% - ${50}px)` }}>
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
            col={columnsData}
            dataSource={listData}
            noData={<NoData />}
          />
        </div>
        <PaginationBox
          total={total}
          pageSize={pageObj.size}
          currentPage={pageObj.page}
          onChange={onChangePage}
        />
      </div>
      {/* // 写日志的表单D */}
      <WhiteDay
        editId={editId}
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
