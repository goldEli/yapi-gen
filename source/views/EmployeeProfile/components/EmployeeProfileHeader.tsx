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

interface EmployeeProfileHeaderProps {
  // 调用获取卡片及任务数据
  onGetData(params: any): void
}

const EmployeeProfileHeader = (props: EmployeeProfileHeaderProps) => {
  const [searchParams, setSearchParams] = useState<any>({
    // 搜索值
    keyword: '',
    // 创建时间
    time: [
      moment().week(moment().week()).startOf('week').format('YYYY-MM-DD'),
      moment().week(moment().week()).endOf('week').format('YYYY-MM-DD'),
    ],
    // 是否是星标
    isStart: false,
    // 卡片状态
    status: 5,
  })
  const [active, setActive] = useState(0)

  const tabList = [
    { name: '本周', key: 0 },
    { name: '上周', key: 1 },
    { name: '近2周', key: 2 },
    { name: '近1月', key: 3 },
    { name: '近3月', key: 4 },
    { name: '近1年', key: 5 },
  ]

  // 卡片列表
  const cardList = [
    {
      name: '已逾期',
      type: 'red',
      key: 5,
    },
    {
      name: '进行中',
      type: 'blue',
      key: 4,
    },
    {
      name: '待规划',
      type: 'org',
      key: 3,
    },
    {
      name: '已完成',
      type: 'green',
      key: 2,
    },
    {
      name: '全部',
      type: 'purple',
      key: 1,
    },
  ]

  //   切换时间
  const onChangeTime = (dates: any) => {
    setSearchParams({
      ...searchParams,
      time: dates
        ? [
            moment(dates[0]).format('YYYY-MM-DD'),
            moment(dates[1]).format('YYYY-MM-DD'),
          ]
        : null,
    })
    setActive(dates ? -1 : 0)
  }

  //   点击切换tab
  const onChangeTab = (key: number) => {
    setActive(key)
  }

  //   点击切换星标
  const onClickSearch = (value: any, key: string) => {
    if (key === 'keyword' && value === searchParams.keyword) {
      return
    }
    setSearchParams({
      ...searchParams,
      [key]: value,
    })
  }

  useEffect(() => {
    // 计算回填时间的
    if (active !== -1) {
      let time: any = []
      switch (active) {
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
              .format('YYYY/MM/DD'),
            moment().format('YYYY/MM/DD'),
          ]
          break
        case 3:
          time = [
            moment().subtract(1, 'month').format('YYYY/MM/DD'),
            moment().format('YYYY/MM/DD'),
          ]
          break
        case 4:
          time = [
            moment().subtract(3, 'months').format('YYYY/MM/DD'),
            moment().format('YYYY/MM/DD'),
          ]
          break
        case 5:
          time = [
            moment().subtract(1, 'years').format('YYYY/MM/DD'),
            moment().format('YYYY/MM/DD'),
          ]
          break
      }
      //   阻止相同调用
      if (
        time[0] !== searchParams.time[0] ||
        time[1] !== searchParams.time[1]
      ) {
        setSearchParams({
          ...searchParams,
          time,
        })
      }
    }
  }, [active])

  useEffect(() => {
    props.onGetData(searchParams)
  }, [searchParams])

  return (
    <HeaderWrap>
      <HeaderSearch>
        <InputSearch
          onChangeSearch={value => onClickSearch(value, 'keyword')}
          leftIcon
          placeholder="搜索编号/任务"
          width={184}
        />
        <SelectWrapBedeck>
          <span style={{ margin: '0 16px', fontSize: '14px' }}>创建时间</span>
          <RangePicker
            width={'308px'}
            isShowQuick={false}
            dateValue={
              searchParams.time
                ? [moment(searchParams.time[0]), moment(searchParams.time[1])]
                : null
            }
            onChange={dates => onChangeTime(dates)}
          />
        </SelectWrapBedeck>
        <TabsGroup>
          {tabList.map((i: any) => (
            <TabItem
              onClick={() => onChangeTab(i.key)}
              key={i.key}
              isActive={active === i.key}
            >
              {i.name}
            </TabItem>
          ))}
        </TabsGroup>
        <Checkbox
          checked={searchParams.isStart}
          onChange={e => onClickSearch(e.target.checked, 'isStart')}
        >
          仅星标
        </Checkbox>
      </HeaderSearch>
      <HeaderCardGroup>
        {cardList.map((i: any) => (
          <Card key={i.key} onClick={() => onClickSearch(i.key, 'status')}>
            <CommonIconFont type={i.type} />
            <div className="name">{i.name}（11）</div>
          </Card>
        ))}
      </HeaderCardGroup>
    </HeaderWrap>
  )
}

export default EmployeeProfileHeader
