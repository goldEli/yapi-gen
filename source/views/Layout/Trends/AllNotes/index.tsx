/* eslint-disable no-promise-executor-return */
/* eslint-disable no-empty */
/* eslint-disable require-atomic-updates */
/* eslint-disable no-undefined */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { useDispatch, useSelector } from '@store/index'
import {
  changeNumber,
  changeVisible,
  changeVisibleFilter,
} from '@store/SiteNotifications'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  getContactStatistics,
  getMsgListData,
  setReadByClick,
} from '@/services/SiteNotifications'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import NoData from '@/components/NoData'
import { ContentWrap, HeaderWrap, ItemBox, MessageListWrap } from './style'
import dayjs from 'dayjs'
import InputSearch from '@/components/InputSearch'
import { SelectWrapBedeck } from '@/components/StyleCommon'
import RangePicker from '@/components/RangePicker'
import MoreSelect from '@/components/MoreSelect'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import PaginationBox from '../components/PaginationBox'
import moment from 'moment'
import { getMessage } from '@/components/Message'
import { encryptPhp } from '@/tools/cryptoPhp'
import { useNavigate } from 'react-router-dom'
import MessageItem from '../components/MessageItem'

const Index = () => {
  const lastId = useRef<any>(1)
  const all = useSelector(store => store.siteNotifications.all)
  const friendUsername = useRef<any>(undefined)
  const msgType = useRef<any>(undefined)
  const [dataList, setDataList] = useState<any>({
    list: [],
  })
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const searchRef = useRef<any>({
    search: '',
    customType: [],
    page: 1,
    pageSize: 10,
    endTime: [],
  })
  const [search, setSearch] = useState<string>('')
  const [customType, setCustomType] = useState<number[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [endTime, setEndTime] = useState([])
  const configuration = useSelector(
    store => store.siteNotifications.configuration,
  )
  const timeDiff = useSelector(store => store.user.loginInfo.timeDiff)

  // const fetchMoreData = async (type: number) => {
  //   const re4 = await getMsg_list({
  //     lastId: lastId.current,
  //     read: id === '2' ? 0 : id === '3' ? 1 : undefined,
  //     friendUsername: friendUsername.current,
  //     msgType: msgType.current,
  //   })
  //   const maxPage = re4.pager.total
  //   lastId.current += 1

  //   if (type === 1 && lastId.current === maxPage + 1) {
  //     setList(re4.list)
  //   } else if (type === 1) {
  //     setList(re4.list)
  //     if (re4.list.length < 1) {
  //     }
  //   } else if (type === 2 && lastId.current === maxPage + 1) {
  //     setList(e => e.concat(re4.list))
  //   } else if (type === 2) {
  //     setList(e => e.concat(re4.list))
  //   }
  // }

  // const setReads = async (values: any) => {
  //   const res = await setReadApi(values)
  //   setList([])
  //   lastId.current = 1
  //   await new Promise(resolve => setTimeout(resolve, 2000))
  //   fetchMoreData(1)

  //   if (res.code === 0) {
  //     const res2 = await getContactStatistics()
  //     let num = 0
  //     res2.list.slice(1, 6).forEach((i: any) => {
  //       num += Number(i.nread)
  //     })

  //     dispatch(changeNumber(num))
  //   }
  // }
  // const setReads2 = async (values: any) => {
  //   const res = await setReadApi(values)
  //   await new Promise(resolve => setTimeout(resolve, 2000))
  //   if (res.code === 0) {
  //     const res2 = await getContactStatistics()
  //     let num = 0
  //     res2.list.slice(1, 6).forEach((i: any) => {
  //       num += Number(i.nread)
  //     })

  //     dispatch(changeNumber(num))
  //   }
  // }
  // const setAllRead = () => {
  //   // const arr = list.map((i: any) => i.id)
  //   setReads(undefined)
  // }

  // const changeUser = (str: string, arr: any) => {
  //   setList([])
  //   msgType.current = id === '4' ? ['191', '132'].concat(arr ?? []) : arr
  //   friendUsername.current = str
  //   lastId.current = 1
  //   fetchMoreData(1)
  // }
  // const changeMsg = (arr: any) => {
  //   setList([])
  //   msgType.current = id === '4' ? ['191', '132'].concat(arr ?? []) : arr
  //   lastId.current = 1
  //   fetchMoreData(1)
  // }

  console.log(dataList)

  const notificationMattersOptions = useMemo(() => {
    if (configuration?.length) {
      if (id === '1') {
        return (
          configuration.find((l: any) => l.sendType === 'project')?.children ??
          []
        )
      }
      if (id === '2') {
        return (
          configuration.find((l: any) => l.sendType === 'sys')?.children ?? []
        )
      }
      if (id === '3') {
        return (
          configuration.find((l: any) => l.sendType === 'calendar')?.children ??
          []
        )
      }
      if (id === '4') {
        return (
          configuration.find((l: any) => l.sendType === 'report')?.children ??
          []
        )
      }
    }
    return []
  }, [id, JSON.stringify(configuration)])

  const typeObject: any = useMemo(() => {
    return {
      1: ['project'],
      2: ['sys'],
      3: ['calendar'],
      4: ['report'],
    }
  }, [])

  const onRead = async (id: string) => {
    const result = await setReadByClick([id])
  }

  const getMessageList = async () => {
    const { search, customType, page, pageSize, endTime } = searchRef.current
    const result = await getMsgListData({
      search: search ? search : undefined,
      friendUsername: id ? typeObject[id] : undefined,
      customType: customType?.length ? customType : undefined,
      page,
      pageSize,
      latTime: endTime?.map?.((s: any) => moment(s).unix())?.[0],
      endTime: endTime?.map?.((s: any) => moment(s).unix())?.[1],
    })
    if (result) {
      setDataList(result)
    }
  }

  useEffect(() => {
    setDataList({})
    getMessageList()
  }, [id, all])

  const formatMsgTime = useCallback(
    (time: number) => {
      const dateTime = new Date(time + timeDiff)
      const millisecond = dateTime.getTime()
      const now = new Date()
      const nowNew = now.getTime()
      let milliseconds = 0
      let timeSpanStr
      milliseconds = nowNew - millisecond
      if (milliseconds <= 1000 * 60 * 1) {
        // 小于一分钟展示为刚刚
        timeSpanStr = t('other.gangang')
      } else if (
        1000 * 60 * 1 < milliseconds &&
        milliseconds <= 1000 * 60 * 60
      ) {
        // 大于一分钟小于一小时展示为分钟
        timeSpanStr = t('other.minBefore', {
          number: Math.round(milliseconds / (1000 * 60)),
        })
      } else if (
        1000 * 60 * 60 * 1 < milliseconds &&
        milliseconds <= 1000 * 60 * 60 * 24
      ) {
        // 大于一小时小于一天展示为小时
        timeSpanStr = t('other.hourBefore', {
          number: Math.round(milliseconds / (1000 * 60 * 60)),
        })
      } else {
        timeSpanStr = dayjs.unix(time / 1000).format('YYYY-MM-DD HH:mm:ss')
      }
      return timeSpanStr
    },
    [timeDiff],
  )

  // 跳转到员工概况
  const onToEmployee = useCallback((e: any, body: any) => {
    e.stopPropagation()
    if (!body?.user_id) {
      // 历史数据
      getMessage({
        type: 'warning',
        msg: t('viewingHistoricalDataIsNotCurrently'),
      })
    } else if (body?.has_permission === 2) {
      // 是否有权限
      getMessage({ type: 'warning', msg: t('noPermissionToViewYet') })
    } else {
      // EmployeeProfile
      const params = encryptPhp(
        JSON.stringify({
          user_id: body.user_id,
        }),
      )
      navigate(`/EmployeeProfile?data=${params}`)
    }
  }, [])

  return (
    <MessageListWrap>
      <HeaderWrap>
        <InputSearch
          onChangeSearch={(value: string) => {
            setSearch(value)
            searchRef.current.search = value
            getMessageList()
          }}
          defaultValue={search}
          leftIcon
          placeholder={t('searchForDynamicContent')}
          width={184}
        />
        <SelectWrapBedeck style={{ margin: '0px 16px' }}>
          <span style={{ margin: '0 12px', fontSize: '14px' }}>
            {t('notificationMatters')}
          </span>
          <MoreSelect
            getPopupContainer={(node: any) => node}
            style={{ width: 184 }}
            options={notificationMattersOptions?.map((s: any) => ({
              ...s,
              id: s.value,
            }))}
            hiddenFooter
            value={customType}
            onChange={(value: number[]) => {
              setCustomType(value)
              searchRef.current.customType = value
              getMessageList()
            }}
          />
        </SelectWrapBedeck>
        <SelectWrapBedeck>
          <span style={{ margin: '0 12px', fontSize: '14px' }}>
            {t('time')}
          </span>
          <RangePicker
            width="260px"
            isShowQuick={false}
            dateValue={endTime?.map((i: any) => moment(i))}
            onChange={dates => {
              setEndTime(dates)
              searchRef.current.endTime = dates
              getMessageList()
            }}
          />
        </SelectWrapBedeck>
      </HeaderWrap>
      <ContentWrap>
        {dataList?.list?.length ? null : <NoData />}
        {dataList?.list?.map((i: any) => (
          <MessageItem
            key={i.id}
            item={i}
            onRead={onRead}
            formatMsgTime={formatMsgTime}
            onToEmployee={onToEmployee}
          />
        ))}
      </ContentWrap>
      <PaginationBox
        currentPage={page}
        total={dataList?.total}
        pageSize={pageSize}
        hasPadding
        onChange={(page: number, pageSize: number) => {
          setPage(page)
          setPageSize(pageSize)
          searchRef.current.page = page
          searchRef.current.pageSize = pageSize
          getMessageList()
        }}
      />
    </MessageListWrap>
  )
}

export default Index
