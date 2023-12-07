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
import {
  setCurrentClickNumber,
  setCurrentKey,
  setFilterParamsOverall,
} from '@store/employeeProfile'
import { useTranslation } from 'react-i18next'
import { getMemberOverviewStatistics } from '@/services/employeeProfile'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { getParamsData } from '@/tools'
import CommonButton from '@/components/CommonButton'
import MoreSelect from '@/components/MoreSelect'
import { setFilterParams } from '@store/project'
import useUpdateFilterParams from './hooks/useUpdateFilterParams'
interface EmployeeProfileHeaderProps {
  onChangeFilter(value: any): void
  checkPersonStatus?(status: boolean): void
}

const EmployeeProfileHeader = (props: EmployeeProfileHeaderProps) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { updateFilterParams, restRouter } = useUpdateFilterParams()
  const { currentKey, currentClickNumber, filterParamsOverall } = useSelector(
    store => store.employeeProfile,
  )

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
      name: t('mine.overdue'),
      label: t('overdue'),
      value: 1,
    },
    {
      name: t('inProgress'),

      label: t('inProgress'),
      value: 2,
    },
    {
      name: t('toBePlanned'),

      label: t('toBePlanned'),
      value: 3,
    },
    {
      name: t('completed'),

      label: t('completed'),
      value: 4,
    },
    {
      name: t('all'),

      label: t('all'),
      value: null,
    },
  ]
  //   切换时间
  const onChangeTime = (dates: any) => {
    setActive(dates ? -1 : 0)
    updateFilterParams({
      time: dates[0]
        ? [
            moment(dates[0]).format('YYYY-MM-DD'),
            moment(dates[1]).format('YYYY-MM-DD'),
          ]
        : null,
    })
  }

  //   点击快速切换日期tab
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
    updateFilterParams({ time })
    dispatch(setCurrentClickNumber(currentClickNumber + 1))
  }
  //   点击切换搜素条件
  const onClickSearch = (value: any, key: string) => {
    if (key === 'keyword' && value === filterParamsOverall.keyword) {
      return
    }
    updateFilterParams({ keyword: value })
  }
  // 重置搜索条件
  const reset = () => {
    setActive('')
    updateFilterParams({ status: null, time: null, keyword: '' })
  }
  useEffect(() => {
    const { start_time, end_time, user_id } = paramsData ?? {}

    // 从左侧菜单
    if (!user_id) {
      dispatch(setCurrentKey(null))
      return
    }
    setActive('')
    // 从钉钉日报过来需要更新时间
    if (paramsData?.user_id && paramsData?.start_time) {
      setTimeout(() => {
        updateFilterParams({
          time: [
            moment(start_time).format('YYYY-MM-DD'),
            moment(end_time).format('YYYY-MM-DD'),
          ],
        })
      })
    }
    // 从人员进来
    if (user_id && !start_time) {
      updateFilterParams({
        time: null,
      })
    }
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
              updateFilterParams({ status: value })
            }}
            options={cardList}
            fieldNames={{ label: 'name', value: 'key', options: 'options' }}
            hiddenFooter
            more
            value={filterParamsOverall.status}
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
              filterParamsOverall.time
                ? [
                    moment(filterParamsOverall.time[0]),
                    moment(filterParamsOverall.time[1]),
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
          checked={filterParamsOverall.personStatus}
          onChange={e => {
            setTimeout(() => {
              updateFilterParams({ personStatus: e.target.checked })
            })
          }}
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
