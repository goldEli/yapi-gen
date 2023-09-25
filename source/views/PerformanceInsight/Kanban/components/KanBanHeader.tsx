import InputSearch from '@/components/InputSearch'
import {
  CloseWrap,
  DividerWrap,
  SelectWrap,
  SelectWrapBedeck,
} from '@/components/StyleCommon'
import {
  KanBanHeaderWrap,
  SearchWrap,
  StatisticsWrap,
  SearchWrapLeft,
  SearchWrapRight,
} from '../style'
import { useTranslation } from 'react-i18next'
import RangePicker from '@/components/RangePicker'
import { useLayoutEffect, useState } from 'react'
import CustomSelect from '@/components/CustomSelect'
import IconFont from '@/components/IconFont'
import { Form } from 'antd'
import MoreSelect from '@/components/MoreSelect'
import ScreenMinHover from '@/components/ScreenMinHover'

const KanBanHeader = () => {
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const [boxMaps, setBoxMaps] = useState<any>()

  const statusList = [
    { label: '全部', value: 1 },
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

  //   切换时间
  const onChangeTime = (dates: any) => {
    //
  }

  const onUpdate = () => {
    //
  }

  useLayoutEffect(() => {
    const map: any = new Map()
    const box = document.querySelectorAll('.SelectWrapBedeck')
    box.forEach(item => {
      const attr = item.getAttribute('datatype')
      const w = item.getBoundingClientRect().width
      map.set(attr, w)
    })
    setBoxMaps(map)
  }, [])

  return (
    <KanBanHeaderWrap>
      <SearchWrap>
        <SearchWrapLeft form={form}>
          <Form.Item name="keyword">
            <InputSearch leftIcon placeholder="搜索任务名称/编号" width={192} />
          </Form.Item>
          <Form.Item name="time">
            <SelectWrapBedeck>
              <span style={{ margin: '0 16px', fontSize: '14px' }}>
                {t('creationTime')}
              </span>
              <RangePicker
                width="230px"
                onChange={dates => onChangeTime(dates)}
                isShowQuick
              />
            </SelectWrapBedeck>
          </Form.Item>
          <SelectWrapBedeck className="SelectWrapBedeck" datatype="1">
            <span style={{ margin: '0 16px', fontSize: '14px' }}>优先级</span>
            <Form.Item name="1">
              <MoreSelect
                showArrow
                onChange={confirm}
                mode="multiple"
                selectWidth={100}
                placeholder={t('common.pleaseSelect')}
                showSearch
                optionFilterProp="label"
                placement="bottomRight"
                width={boxMaps?.get('1')}
                allowClear
                options={priorityList}
              />
            </Form.Item>
          </SelectWrapBedeck>
          <SelectWrapBedeck className="SelectWrapBedeck" datatype="status">
            <span style={{ margin: '0 16px', fontSize: '14px' }}>任务状态</span>
            <Form.Item name="status">
              <MoreSelect
                onChange={confirm}
                mode="multiple"
                selectWidth={100}
                placeholder={t('common.pleaseSelect')}
                showSearch
                optionFilterProp="label"
                showArrow
                allowClear
                placement="bottomRight"
                width={boxMaps?.get('status')}
                options={statusList}
              />
            </Form.Item>
          </SelectWrapBedeck>
        </SearchWrapLeft>
        <SearchWrapRight>
          <ScreenMinHover
            label={t('common.refresh')}
            icon="sync"
            onClick={onUpdate}
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
      <StatisticsWrap></StatisticsWrap>
    </KanBanHeaderWrap>
  )
}

export default KanBanHeader
