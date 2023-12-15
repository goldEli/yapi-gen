/* eslint-disable no-promise-executor-return */
/* eslint-disable no-empty */
/* eslint-disable require-atomic-updates */
/* eslint-disable no-undefined */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { useSelector } from '@store/index'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { getMsgListData, setReadByClick } from '@/services/SiteNotifications'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import NoData from '@/components/NoData'
import { ContentWrap, HeaderWrap, MessageListWrap } from './style'
import dayjs from 'dayjs'
import InputSearch from '@/components/InputSearch'
import { SelectWrapBedeck } from '@/components/StyleCommon'
import RangePicker from '@/components/RangePicker'
import MoreSelect from '@/components/MoreSelect'
import PaginationBox from '../components/PaginationBox'
import moment from 'moment'
import { getMessage } from '@/components/Message'
import { encryptPhp } from '@/tools/cryptoPhp'
import { useNavigate } from 'react-router-dom'
import MessageItem from '../components/MessageItem'
import _ from 'lodash'

const Index = () => {
  const all = useSelector(store => store.siteNotifications.all)
  const [dataList, setDataList] = useState<any>({
    list: [],
  })
  const [t] = useTranslation()
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

  const onRead = _.debounce(async (id: string) => {
    const result = await setReadByClick([id])
    if (result) {
      getMessageList()
    }
  }, 500)

  const getMessageList = async () => {
    const { search, customType, page, pageSize, endTime } = searchRef.current
    const result = await getMsgListData({
      search: search ? search : undefined,
      friendUsername: id ? typeObject[id] : undefined,
      customType: customType?.length ? customType : undefined,
      page,
      pageSize,
      latTime: endTime?.map?.((s: any) => moment(s).startOf('day').unix())?.[0],
      endTime: endTime?.map?.((s: any) => moment(s).endOf('day').unix())?.[1],
      orderBy: 'create_time',
    })
    if (result) {
      setDataList(result)
    }
  }

  useEffect(() => {
    setDataList({})
    getMessageList()
    return () => {
      searchRef.current = {
        search: '',
        customType: [],
        page: 1,
        pageSize: 10,
        endTime: [],
      }
      setSearch('')
      setCustomType([])
      setPage(1)
      setPageSize(10)
      setEndTime([])
    }
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
            setPage(1)
            searchRef.current.page = 1
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
            width={220}
            options={notificationMattersOptions?.map((s: any) => ({
              ...s,
              id: s.value,
            }))}
            hiddenFooter
            value={customType}
            onChange={(value: number[]) => {
              setCustomType(value)
              searchRef.current.customType = value
              setPage(1)
              searchRef.current.page = 1
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
              setPage(1)
              searchRef.current.page = 1
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
