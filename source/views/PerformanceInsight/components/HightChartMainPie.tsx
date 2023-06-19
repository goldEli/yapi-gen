// eslint-disable @typescript-eslint/no-invalid-this
// eslint-disable consistent-this
import {
  MoreWrap2,
  Myd,
} from '@/components/CommonProjectComponent/CommonMember/style'
import IconFont from '@/components/IconFont'
import { Dropdown, Menu, Space } from 'antd'
import Highcharts from 'highcharts'
import { useEffect, useState } from 'react'
import { Col1, HightChartsWrap, Time, TitleCss } from '../Header/Style'
import { HighchartsReactWrap, RightRow } from './style'
interface PropsMoreDropdown {
  data: Array<{ label: string; key: string }>
  onClickMenu(value: { label: string; key: string }): void
  defaultValue: { label: string; key: string }
}
const MoreDropdown = (props: PropsMoreDropdown) => {
  const [isVisible, setIsVisible] = useState(false)
  const menu = () => {
    const menuItems: any = []
    props.data?.forEach((i: { label: string; key: string }, idx: number) => {
      menuItems.push({
        key: idx,
        label: (
          <Myd
            active={i.key === props.defaultValue.key}
            onClick={() => props.onClickMenu(i)}
          >
            {i.label}
            {i.key === props.defaultValue.key && (
              <IconFont
                style={{ fontSize: 16, margin: '1px 0px 0px 15px' }}
                type="check"
              />
            )}
          </Myd>
        ),
      })
    })
    return <Menu items={menuItems} />
  }

  return (
    <Dropdown
      key={isVisible ? isVisible.toString() : null}
      visible={isVisible}
      overlay={menu}
      trigger={['hover']}
      placement="bottomRight"
      getPopupContainer={node => node}
      onVisibleChange={setIsVisible}
    >
      <MoreWrap2
        style={{
          padding: '0 8px',
        }}
      >
        <div
          style={{
            marginRight: '4px',
          }}
          className="job"
        >
          {props.defaultValue.label}
        </div>
        <span className="job1">
          <IconFont style={{ fontSize: 14 }} type="down" />
        </span>
      </MoreWrap2>
    </Dropdown>
  )
}
// 饼图
const HightChartMainPie = (props: {
  height: number
  titleType: boolean
  title: string
  chart: Models.Efficiency.ChartPie | undefined
  onChange?(item: { key: string; label: string }): void
}) => {
  const options: any = {
    credits: {
      enabled: false,
      spacing: [40, 0, 40, 0],
    },
    title: {
      floating: true,
      align: 'center',
      text: props.titleType ? '' : `${props.chart?.total}项`,
      verticalAlign: 'middle',
      y: 30,
      style: {
        fontSize: 20,
      },
    },
    chart: {
      height: 290,
      labelLine: {
        show: false,
      },
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'center',
      borderWidth: 0,
      y: 45,
      itemMarginBottom: 16,
      useHTML: true,
      labelFormatter: function () {
        // eslint-disable-next-line
        const _this: any = this
        return `<div style='fontSize: 14px;color:#646566;display:flex; width: 204px;height:26px;lineHeight:14px;paddingBottom:2px;whiteSpace: nowrap; overflow: hidden; textOverflow: ellipsis'>${_this?.name}: ${_this.y}%</div>`
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false,
        },
        showInLegend: true,
      },
    },
    tooltip: {
      backgroundColor: '#fff',
      background: '#fff',
      shadow: true,
      borderColor: '#fff',
      borderRadius: 6,
      headerFormat: props.titleType
        ? ''
        : '<div style="background:#fff;minWidth:108;height:76px;padding:16px"><div style="background:#fff;font-size:12px;margin-bottom:4px;font-family: SiYuanMedium;">{point.key}</div><div>',
      pointFormat: props.titleType
        ? '<span style="display:inline-block;width:8px;height:8px;borderRadius:50%;background:{point.color}"></span><span style="marginLeft:8px;fontSize:12px,color:#646566">{point.name}:{point.y}%</span></div>'
        : '<span style="display:inline-block;width:8px;height:8px;borderRadius:50%;background:{point.color}"></span><span style="marginLeft:8px;fontSize:12px,color:#646566">工作项：{point.y}%</span></div>',
      footerFormat: '</div>',
      shared: true,
      useHTML: true,
    },
    colors: props.titleType
      ? ['#FF5C5E', '#FA9746', '#F6BD16']
      : ['#4267ED', '#6688FF', '#9CB0F8', '#CED7F8', '#E3E9FA '],
    series: [
      {
        type: 'pie',
        size: '95%',
        name: 'Browser share',
        innerSize: '80%',
        center: ['100', '55%'],
        data: props.chart?.seriesData,
      },
    ],
  }
  let timer: any = null
  useEffect(() => {
    return () => {
      clearTimeout(timer)
    }
  }, [])
  const pieCallback = (c: any) => {
    timer = setTimeout(() => {
      c.setTitle({
        x: -((c.chartWidth - 233) / 2 - 10),
      })
    }, 50)
  }
  const [defaultValue, setDefaultValue] = useState<{
    label: string
    key: string
  }>({ label: '按优先级', key: 'priority' })
  // 切换状态
  const onClickMenu = async (item: { label: string; key: string }) => {
    setDefaultValue(item)
    props.onChange?.(item)
  }
  return (
    <div style={{ width: '49%' }}>
      <Col1>
        <RightRow>
          <Space size={12}>
            <TitleCss>{props.title}</TitleCss>
            <Time>{props.chart?.time}</Time>
          </Space>
        </RightRow>
        {props.titleType ? (
          <MoreDropdown
            onClickMenu={(value: { label: string; key: string }) =>
              onClickMenu(value)
            }
            data={[
              { label: '按严重程度', key: 'severity' },
              { label: '按优先级', key: 'priority' },
              { label: '按状态', key: 'status' },
            ]}
            defaultValue={defaultValue}
          />
        ) : null}
      </Col1>
      <HightChartsWrap height={props.height}>
        <HighchartsReactWrap
          width={400}
          highcharts={Highcharts}
          options={options}
          callback={pieCallback}
        />
      </HightChartsWrap>
    </div>
  )
}
export default HightChartMainPie
