import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import highchartsGantt from 'highcharts/modules/gantt'

highchartsGantt(Highcharts)

const Gatte = () => {
  Highcharts.setOptions({
    lang: {
      noData: '暂无数据',
      weekdays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      months: [
        '一月',
        '儿月',
        '三月',
        '四月',
        '五月',
        '六月',
        '七月',
        '八月',
        '九月',
        '十月',
        '十一月',
        '十二月',
      ],
    },
  })
  const options = {
    time: {
      useUTC: false,
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      tickPixelInterval: 170,
    },
    yAxis: {
      type: 'category',
      grid: {
        enabled: true,
        borderColor: 'rgba(0,0,0,0.3)',
        borderWidth: 1,
        columns: [
          {
            title: {
              text: '需求标题',
            },
            labels: {
              format: '{point.name}',
            },
          },
          {
            title: {
              text: '预计开始时间',
            },
            labels: {
              format: '{point.beginTime}',
            },
          },
          {
            title: {
              text: '预计结束时间',
            },
            labels: {
              format: '{point.endTime}',
            },
          },
          {
            title: {
              text: '状态',
            },
            labels: {
              format: '{point.state}',
            },
          },
        ],
      },
    },
    tooltip: {
      xDateFormat: '%e %b %Y, %H:%M',
    },
    series: [
      {
        name: 'Project 1',
        data: [
          {
            start: Date.UTC(2017, 10, 18, 8),
            end: Date.UTC(2017, 10, 25, 16),
            name: '需求名称',
            beginTime: '2022-6-20',
            endTime: '2022-6-20',
            state: '实现zhong',
            y: 0,
          },
          {
            start: Date.UTC(2017, 10, 20, 8),
            end: Date.UTC(2017, 10, 24, 16),
            name: '需求名称',
            beginTime: '2022-6-20',
            endTime: '2022-6-20',
            state: '实现zhong',
            y: 1,
          },
          {
            start: Date.UTC(2017, 10, 25, 16),
            end: Date.UTC(2017, 10, 25, 16),
            name: '需求名称',
            beginTime: '2022-6-20',
            endTime: '2022-6-20',
            state: '实现zhong',
            y: 2,
          },
          {
            start: Date.UTC(2017, 10, 20, 8),
            end: Date.UTC(2017, 10, 24, 16),
            name: '需求名称',
            beginTime: '2022-6-20',
            endTime: '2022-6-20',
            state: '实现zhong',
            y: 3,
          },
          {
            start: Date.UTC(2017, 10, 27, 8),
            end: Date.UTC(2017, 11, 3, 16),
            name: '需求名称',
            beginTime: '2022-6-20',
            endTime: '2022-6-20',
            state: '实现zhong',
            y: 3,
          },
          {
            start: Date.UTC(2017, 10, 27, 8),
            end: Date.UTC(2017, 11, 3, 16),
            name: '需求名称',
            beginTime: '2022-6-20',
            endTime: '2022-6-20',
            state: '实现zhong',
            y: 3,
          },
          {
            start: Date.UTC(2017, 10, 23, 8),
            end: Date.UTC(2017, 11, 15, 16),
            name: '需求名称',
            beginTime: '2022-6-20',
            endTime: '2022-6-20',
            state: '实现zhong',
            y: 4,
          },
        ],
      },
    ],
    exporting: {
      sourceWidth: 5000,
    },
  }
  return (
    <div>
      <HighchartsReact
        constructorType="ganttChart"
        highcharts={Highcharts}
        options={options}
      />
    </div>
  )
}

export default Gatte
