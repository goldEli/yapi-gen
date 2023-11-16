import {
  Card,
  HeaderCardGroup,
  HeaderSearch,
  HeaderWrap,
  TabItem,
  TabsGroup,
} from '../style'
import InputSearch from '@/components/InputSearch'
import CommonIconFont from '@/components/CommonIconFont'
import { SelectWrapBedeck } from '@/components/StyleCommon'
import RangePicker from '@/components/RangePicker'
import { useEffect, useState } from 'react'
import { Checkbox } from 'antd'
import moment from 'moment'
import { useDispatch, useSelector } from '@store/index'
import { setCurrentClickNumber, setCurrentKey } from '@store/employeeProfile'
import { useTranslation } from 'react-i18next'
import { getMemberOverviewStatistics } from '@/services/employeeProfile'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'

interface EmployeeProfileHeaderProps {
  onChangeFilter(value: any): void
  filterParams: any
}

const EmployeeProfileHeader = (props: EmployeeProfileHeaderProps) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { currentKey, currentClickNumber } = useSelector(
    store => store.employeeProfile,
  )
  const [searchFilterParams, setSearchFilterParams] = useState<any>({
    // 搜索值
    keyword: '',
    // 创建时间
    time: paramsData?.user_id
      ? [
          moment().subtract(1, 'years').format('YYYY-MM-DD'),
          moment().format('YYYY-MM-DD'),
        ]
      : [
          moment().week(moment().week()).startOf('week').format('YYYY-MM-DD'),
          moment().week(moment().week()).endOf('week').format('YYYY-MM-DD'),
        ],
    // 是否是星标
    isStart: false,
    // 卡片状态
    status: 0,
  })
  const [active, setActive] = useState(paramsData?.user_id ? 5 : 0)
  const [memberStatistics, setMemberStatistics] = useState<any>({})

  const tabList = [
    { name: t('thisWeek'), key: 0 },
    { name: t('lastWeek'), key: 1 },
    { name: t('lastWeeks'), key: 2 },
    { name: t('lastMonth'), key: 3 },
    { name: t('nearlyMonths'), key: 4 },
    { name: t('nearlyYear'), key: 5 },
  ]

  // 卡片列表
  const cardList = [
    {
      name: t('overdue'),
      type: 'red',
      key: 5,
      fieldKey: 'overdue',
    },
    {
      name: t('inProgress'),
      type: 'blue',
      key: 4,
      fieldKey: 'start',
    },
    {
      name: t('toBePlanned'),
      type: 'org',
      key: 3,
      fieldKey: 'un_start',
    },
    {
      name: t('completed'),
      type: 'green',
      key: 2,
      fieldKey: 'completed',
    },
    {
      name: t('all'),
      type: 'purple',
      key: 1,
      fieldKey: 'all',
    },
  ]

  // 计算当前选中卡片的数据
  const onComputedCurrent = (obj: any, result: any, params?: any) => {
    const newObj = result[obj?.fieldKey]
    dispatch(setCurrentKey({ ...newObj, ...obj }))
    props.onChangeFilter(
      params ?? {
        ...props?.filterParams,
        ...searchFilterParams,

        ...{ user_ids: newObj?.user_ids, status: obj.key },
      },
    )
  }

  // 地址上存在人员时，更新任务列表
  const onUpdateUserId = (params: any) => {
    if (paramsData?.user_id) {
      props.onChangeFilter(params)
    }
  }

  //   切换时间
  const onChangeTime = (dates: any) => {
    const resultParams = {
      ...searchFilterParams,
      time: dates[0]
        ? [
            moment(dates[0]).format('YYYY-MM-DD'),
            moment(dates[1]).format('YYYY-MM-DD'),
          ]
        : null,
    }
    setSearchFilterParams(resultParams)
    setActive(dates ? -1 : 0)
    onUpdateUserId(resultParams)
  }

  //   点击切换tab
  const onChangeTab = (item: any) => {
    setActive(item.key)
    let time: any = []
    switch (item.key) {
      case 0:
        time = [
          moment().week(moment().week()).startOf('week').format('YYYY-MM-DD'),
          moment().week(moment().week()).endOf('week').format('YYYY-MM-DD'),
        ]
        break
      case 1:
        time = [
          moment().subtract(1, 'week').startOf('week').format('YYYY-MM-DD'),
          moment().subtract(1, 'week').endOf('week').format('YYYY-MM-DD'),
        ]
        break
      case 2:
        time = [
          moment()
            .day(moment().day() - 13)
            .format('YYYY-MM-DD'),
          moment().format('YYYY-MM-DD'),
        ]
        break
      case 3:
        time = [
          moment().subtract(1, 'month').format('YYYY-MM-DD'),
          moment().format('YYYY-MM-DD'),
        ]
        break
      case 4:
        time = [
          moment().subtract(3, 'months').format('YYYY-MM-DD'),
          moment().format('YYYY-MM-DD'),
        ]
        break
      case 5:
        time = [
          moment().subtract(1, 'years').format('YYYY-MM-DD'),
          moment().format('YYYY-MM-DD'),
        ]
        break
    }
    setSearchFilterParams({
      ...searchFilterParams,
      time,
    })
    onUpdateUserId({
      ...searchFilterParams,
      time,
    })
    dispatch(setCurrentClickNumber(currentClickNumber + 1))
  }

  //   点击切换搜素条件
  const onClickSearch = (value: any, key: string) => {
    if (key === 'keyword' && value === searchFilterParams.keyword) {
      return
    }
    setSearchFilterParams({
      ...searchFilterParams,
      [key]: value,
    })
    onUpdateUserId({
      ...searchFilterParams,
      [key]: value,
    })
  }

  // 获取卡片数据
  const getStatistics = async (params: any) => {
    // 如果是修改筛选条件则，不带user_id
    const response = await getMemberOverviewStatistics(params)
    setMemberStatistics(response)
    const currentResult = currentKey?.key
      ? cardList?.filter((i: any) => i.key === currentKey?.key)[0]
      : cardList[0]
    onComputedCurrent(currentResult, response)
  }

  useEffect(() => {
    if (!paramsData?.user_id) {
      getStatistics(searchFilterParams)
    }
  }, [searchFilterParams])

  useEffect(() => {
    if (paramsData?.user_id) {
      setActive(paramsData?.user_id ? 5 : 0)
      const resultParams = JSON.parse(JSON.stringify(searchFilterParams))
      resultParams.status = 1
      resultParams.time = [
        moment().subtract(1, 'years').format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD'),
      ]
      resultParams.user_ids = [Number(paramsData?.user_id)]
      setSearchFilterParams({
        ...searchFilterParams,
        ...resultParams,
      })
      const newObj = {
        total: 1,
        user_ids: [Number(paramsData?.user_id)],
        fieldKey: 'all',
      }
      onComputedCurrent(
        cardList[cardList?.length - 1],
        { all: newObj },
        {
          ...searchFilterParams,
          ...resultParams,
        },
      )
    } else {
      dispatch(setCurrentKey(null))
    }
  }, [paramsData?.user_id])

  return (
    <HeaderWrap>
      <HeaderSearch style={{ marginBottom: paramsData?.user_id ? 0 : 20 }}>
        <InputSearch
          onChangeSearch={value => onClickSearch(value, 'keyword')}
          leftIcon
          placeholder={t('employeeSearch')}
          width={184}
        />
        <SelectWrapBedeck>
          <span style={{ margin: '0 16px', fontSize: '14px' }}>
            {t('creationTime')}
          </span>
          <RangePicker
            width="260px"
            isShowQuick={false}
            dateValue={
              searchFilterParams.time
                ? [
                    moment(searchFilterParams.time[0]),
                    moment(searchFilterParams.time[1]),
                  ]
                : null
            }
            onChange={dates => onChangeTime(dates)}
            hasClear={false}
          />
        </SelectWrapBedeck>
        <TabsGroup>
          {tabList.map((i: any) => (
            <TabItem
              onClick={() => onChangeTab(i)}
              key={i.key}
              isActive={active === i.key}
            >
              {i.name}
            </TabItem>
          ))}
        </TabsGroup>
        <Checkbox
          checked={searchFilterParams.isStart}
          onChange={e => onClickSearch(e.target.checked, 'isStart')}
        >
          {t('starsOnly')}
        </Checkbox>
      </HeaderSearch>
      {!paramsData?.user_id && (
        <HeaderCardGroup>
          {cardList.map((i: any) => (
            <Card
              isActive={currentKey?.fieldKey === i.fieldKey}
              key={i.key}
              onClick={() => {
                props.onChangeFilter({
                  ...props?.filterParams,
                  ...{
                    status: i.key,
                    user_ids: memberStatistics[i.fieldKey]?.user_ids,
                  },
                })
                onComputedCurrent(i, memberStatistics)
                // dispatch(setCurrentClickNumber(currentClickNumber + 1))
              }}
            >
              <CommonIconFont type={i.type} size={20} />
              <div className="name">
                {i.name}（
                {t('totalPerson', {
                  total: memberStatistics[i.fieldKey]?.total,
                })}
                ）
              </div>
            </Card>
          ))}
        </HeaderCardGroup>
      )}
    </HeaderWrap>
  )
}

export default EmployeeProfileHeader
