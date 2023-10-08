/* eslint-disable react/no-unknown-property */
import InputSearch from '@/components/InputSearch'
import { DividerWrap, SelectWrapBedeck } from '@/components/StyleCommon'
import {
  KanBanHeaderWrap,
  SearchWrap,
  StatisticsWrap,
  SearchWrapLeft,
  SearchWrapRight,
  StatisticsItem,
} from '../style'
import { useTranslation } from 'react-i18next'
import RangePicker from '@/components/RangePicker'
import { useEffect, useLayoutEffect, useState } from 'react'
import MoreSelect from '@/components/MoreSelect'
import ScreenMinHover from '@/components/ScreenMinHover'
import moment from 'moment'

interface KanBanHeaderProps {
  onChangeFilter(value: any): void
  onUpdate(): void
  statistics: any
  filterParams: any
  onChangFilterUpdate(value: any): void
  isUpdate: boolean
}

const KanBanHeader = (props: KanBanHeaderProps) => {
  const [t] = useTranslation()
  const [boxMaps, setBoxMaps] = useState<any>()
  const [spanMaps, setSpanMaps] = useState<any>()
  const [searchFilterParams, setSearchFilterParams] = useState<any>(
    props.filterParams,
  )

  const statusList = [
    { label: '已完成', value: 2 },
    { label: '未开始', value: 3 },
    { label: '进行中', value: 4 },
    { label: '已逾期', value: 5 },
  ]

  const priorityList = [
    { label: '极高', value: 'extremely_high' },
    { label: '高', value: 'high' },
    { label: '中', value: 'middle' },
    { label: '低', value: 'low' },
    { label: '极低', value: 'extremely_low' },
  ]

  const statisticsList = [
    { name: '待规划', key: 'planning', color: 'var(--primary-d1)' },
    { name: '已完成', key: 'finish', color: 'var(--function-success)' },
    { name: '进行中', key: 'ongoing', color: '#A176FB' },
    { name: '已逾期', key: 'overdue', color: 'var(--function-warning)' },
  ]

  //   切换时间
  const onChangeTime = (dates: any) => {
    let resultTime = null
    if (dates) {
      resultTime = [
        moment(dates[0]).unix()
          ? moment(dates[0]).format('YYYY-MM-DD')
          : '1970-01-01',
        moment(dates[1]).unix() === 1893427200
          ? '2030-01-01'
          : moment(dates[1]).format('YYYY-MM-DD'),
      ]
      setSearchFilterParams({
        ...props.filterParams,
        time: resultTime,
      })
    } else {
      setSearchFilterParams({
        ...props.filterParams,
        time: null,
      })
    }
    props.onChangFilterUpdate({
      ...searchFilterParams,
      time: resultTime,
    })
  }

  //   点击切换搜素条件
  const onClickSearch = (value: any, key: string) => {
    if (key === 'keyword' && value === props.filterParams?.keyword) {
      return
    }
    setSearchFilterParams({
      ...props.filterParams,
      [key]: value,
    })
    props.onChangFilterUpdate({
      ...props.filterParams,
      [key]: value,
    })
  }

  useLayoutEffect(() => {
    const map: any = new Map()
    const mapSpan: any = new Map()
    const box = document.querySelectorAll('.SelectWrapBedeck')
    box.forEach(item => {
      const attr = item.getAttribute('datatype')
      const w = item.getBoundingClientRect().width
      map.set(attr, w)
    })
    setBoxMaps(map)
    const boxSpan = document.querySelectorAll('.time-spanTag')
    boxSpan.forEach(item => {
      const attr = item.getAttribute('datatype')
      const w = item.getBoundingClientRect().width
      mapSpan.set(attr, w)
    })
    setSpanMaps(mapSpan)
  }, [])

  // 向上传递参数
  useEffect(() => {
    if (props.isUpdate) {
      setSearchFilterParams(props.filterParams)
    } else {
      props.onChangeFilter({ ...props.filterParams, ...searchFilterParams })
    }
  }, [searchFilterParams, props.isUpdate])

  return (
    <KanBanHeaderWrap>
      <SearchWrap>
        <SearchWrapLeft>
          <InputSearch
            onChangeSearch={value => onClickSearch(value, 'keyword')}
            leftIcon
            placeholder="搜索任务名称/编号"
            width={192}
            defaultValue={searchFilterParams?.keyword}
          />
          <SelectWrapBedeck>
            <span
              style={{ margin: '0 16px', fontSize: '14px' }}
              className="time-spanTag"
              datatype="time"
            >
              {t('creationTime')}
            </span>
            <RangePicker
              width="230px"
              onChange={dates => onChangeTime(dates)}
              isShowQuick
              w={spanMaps?.get('time')}
              dateValue={
                searchFilterParams.time
                  ? [
                      moment(searchFilterParams.time[0]),
                      moment(searchFilterParams.time[1]),
                    ]
                  : null
              }
            />
          </SelectWrapBedeck>
          <SelectWrapBedeck className="SelectWrapBedeck" datatype="priority">
            <span style={{ margin: '0 16px', fontSize: '14px' }}>
              {t('priority')}
            </span>
            <MoreSelect
              showArrow
              mode="multiple"
              selectWidth={100}
              placeholder="全部"
              showSearch
              optionFilterProp="label"
              placement="bottomRight"
              width={boxMaps?.get('priority')}
              allowClear
              options={priorityList}
              onChange={(value: any) => onClickSearch(value, 'priority')}
              value={searchFilterParams?.priority}
            />
          </SelectWrapBedeck>
          <SelectWrapBedeck className="SelectWrapBedeck" datatype="status">
            <span style={{ margin: '0 16px', fontSize: '14px' }}>
              {t('taskStatus')}
            </span>
            <MoreSelect
              mode="multiple"
              selectWidth={100}
              placeholder="全部"
              showSearch
              optionFilterProp="label"
              showArrow
              allowClear
              placement="bottomRight"
              width={boxMaps?.get('status')}
              options={statusList}
              onChange={(value: any) => onClickSearch(value, 'status')}
              value={searchFilterParams?.status}
            />
          </SelectWrapBedeck>
        </SearchWrapLeft>
        <SearchWrapRight>
          <ScreenMinHover
            label={t('common.refresh')}
            icon="sync"
            onClick={props?.onUpdate}
          />
          <DividerWrap type="vertical" style={{ marginLeft: 8 }} />

          <ScreenMinHover
            label={t('full_screen')}
            icon="full-screen"
            onClick={() => {
              //
            }}
          />
        </SearchWrapRight>
      </SearchWrap>
      <StatisticsWrap>
        {statisticsList?.map((i: any) => (
          <StatisticsItem key={i.key}>
            <div className="provider" style={{ background: i.color }} />
            <div className="content">
              <div className="title">{i.name}</div>
              <div className="number">{props?.statistics?.[i.key]}项</div>
            </div>
          </StatisticsItem>
        ))}
      </StatisticsWrap>
    </KanBanHeaderWrap>
  )
}

export default KanBanHeader
