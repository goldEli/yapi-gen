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
import { Checkbox, Select } from 'antd'
import moment from 'moment'
import { useDispatch, useSelector } from '@store/index'
import { setCurrentClickNumber, setCurrentKey } from '@store/employeeProfile'
import { useTranslation } from 'react-i18next'
import { getMemberOverviewStatistics } from '@/services/employeeProfile'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { getParamsData } from '@/tools'
import CommonButton from '@/components/CommonButton'
import MoreSelect from '@/components/MoreSelect'
interface EmployeeProfileHeaderProps {
  onChangeFilter(value: any): void
  filterParams: any
}

const EmployeeProfileHeader = (props: EmployeeProfileHeaderProps) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const paramsData = getParamsData(searchParams)
  const { currentKey, currentClickNumber } = useSelector(
    store => store.employeeProfile,
  )
  // 初始化参数  从钉钉日报过来需要回填时间
  const initParams = {
    // 搜索值
    keyword: '',
    // 创建时间
    time: paramsData?.date
      ? [
          moment().subtract(1, 'years').format('YYYY-MM-DD'),
          moment().format('YYYY-MM-DD'),
        ]
      : null,
    // 是否是星标
    isStart: false,
    // 状态
    status: 1,
  }
  const [searchFilterParams, setSearchFilterParams] = useState<any>(initParams)
  const [active, setActive] = useState(paramsData?.user_id ? 5 : '')

  const tabList = [
    { name: t('thisWeek'), key: 0 },
    { name: t('lastWeek'), key: 1 },
    { name: t('lastWeeks'), key: 2 },
    { name: t('lastMonth'), key: 3 },
    { name: t('nearlyMonths'), key: 4 },
    { name: t('nearlyYear'), key: 5 },
  ]

  // 状态列表
  const cardList = [
    {
      name: t('overdue'),
      type: 'red',
      key: 5,
      fieldKey: 'overdue',
      label: t('overdue'),
      value: 5,
    },
    {
      name: t('inProgress'),
      type: 'blue',
      key: 4,
      fieldKey: 'start',
      label: t('inProgress'),
      value: 4,
    },
    {
      name: t('toBePlanned'),
      type: 'org',
      key: 3,
      fieldKey: 'un_start',
      label: t('toBePlanned'),
      value: 3,
    },
    {
      name: t('completed'),
      type: 'green',
      key: 2,
      fieldKey: 'completed',
      label: t('completed'),
      value: 2,
    },
    {
      name: t('all'),
      type: 'purple',
      key: 1,
      fieldKey: 'all',
      label: t('all'),
      value: 1,
    },
  ]

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
  // 重置路由
  const restRouter = () => {
    const searchParams = new URLSearchParams(location.search)

    searchParams.delete('data')

    const queryString = searchParams.toString()

    navigate(`?${queryString}`)
  }
  //   点击切换tab
  const onChangeTab = (item: any) => {
    setActive(item.key)
    restRouter()
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
    // onUpdateUserId({
    //   ...searchFilterParams,
    //   time,
    // })
    props.onChangeFilter({
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
  // 重置搜索条件
  const reset = () => {
    setSearchFilterParams(initParams)
    setActive('')
  }
  useEffect(() => {
    // 从左侧菜单
    if (!paramsData?.user_id) {
      dispatch(setCurrentKey(null))
      return
    }
    setActive('')
    // 从钉钉日报过来需要更新时间
    if (paramsData?.user_id && paramsData?.date) {
      setSearchFilterParams((pre: any) => {
        return {
          ...pre,
          time: [],
        }
      })
    }

    // if (paramsData?.user_id) {
    //   setActive(paramsData?.user_id ? 5 : 0)
    //   const resultParams = JSON.parse(JSON.stringify(searchFilterParams))
    //   resultParams.status = 1
    //   resultParams.time = [
    //     moment().subtract(1, 'years').format('YYYY-MM-DD'),
    //     moment().format('YYYY-MM-DD'),
    //   ]
    //   resultParams.user_ids = [Number(paramsData?.user_id)]
    //   setSearchFilterParams({
    //     ...searchFilterParams,
    //     ...resultParams,
    //   })
    // } else {
    //   dispatch(setCurrentKey(null))
    // }
  }, [paramsData?.user_id])

  return (
    <HeaderWrap>
      <HeaderSearch>
        <InputSearch
          onChangeSearch={value => onClickSearch(value, 'keyword')}
          leftIcon
          placeholder={t('employeeSearch')}
          width={184}
        />
        <SelectWrapBedeck>
          <span style={{ margin: '0 16px', fontSize: '14px' }}>状态</span>
          <MoreSelect
            onFocus={() => {}}
            width={202}
            onConfirm={() => {}}
            onChange={(value: number) => {
              console.log(value)
              setSearchFilterParams((pre: any) => ({ ...pre, status: value }))
            }}
            options={cardList}
            fieldNames={{ label: 'name', value: 'key', options: 'options' }}
            hiddenFooter
            more
            value={searchFilterParams.status}
          ></MoreSelect>
        </SelectWrapBedeck>
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
          包含离职人员
        </Checkbox>
        <CommonButton type="primaryText" size="small" onClick={reset}>
          重置
        </CommonButton>
      </HeaderSearch>
    </HeaderWrap>
  )
}

export default EmployeeProfileHeader
