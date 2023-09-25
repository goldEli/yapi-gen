import InputSearch from '@/components/InputSearch'
import { SelectWrap, SelectWrapBedeck } from '@/components/StyleCommon'
import {
  KanBanHeaderWrap,
  SearchWrap,
  StatisticsWrap,
  SearchWrapLeft,
} from '../style'
import { useTranslation } from 'react-i18next'
import RangePicker from '@/components/RangePicker'
import { useLayoutEffect, useState } from 'react'
import CustomSelect from '@/components/CustomSelect'
import IconFont from '@/components/IconFont'
import { Form } from 'antd'

const KanBanHeader = () => {
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const [boxMaps, setBoxMaps] = useState<any>()

  //   切换时间
  const onChangeTime = (dates: any) => {
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
              <SelectWrap
                showArrow
                onChange={confirm}
                mode="multiple"
                width={100}
                placeholder={t('common.pleaseSelect')}
                showSearch
                optionFilterProp="label"
                placement="bottomRight"
                dropdownMatchSelectWidth={boxMaps?.get('1')}
                allowClear
                options={[]}
              />
            </Form.Item>
          </SelectWrapBedeck>
          <SelectWrapBedeck className="SelectWrapBedeck" datatype="status">
            <span style={{ margin: '0 16px', fontSize: '14px' }}>任务状态</span>
            <Form.Item name="status">
              <SelectWrap
                onChange={confirm}
                mode="multiple"
                width={100}
                placeholder={t('common.pleaseSelect')}
                showSearch
                optionFilterProp="label"
                showArrow
                allowClear
                placement="bottomRight"
                dropdownMatchSelectWidth={boxMaps?.get('status')}
                options={[]}
              />
            </Form.Item>
          </SelectWrapBedeck>
        </SearchWrapLeft>
      </SearchWrap>
      <StatisticsWrap></StatisticsWrap>
    </KanBanHeaderWrap>
  )
}

export default KanBanHeader
