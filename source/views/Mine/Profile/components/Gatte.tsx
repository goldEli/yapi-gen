/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import highchartsGantt from 'highcharts/modules/gantt'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

highchartsGantt(Highcharts)

const Gatte = (props: any) => {
  const [t] = useTranslation()
  const { data: res } = props

  // console.log(res, 'gante数据')

  Highcharts.setOptions({
    lang: {
      decimalPoint: '',
      weekdays: [
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
        '星期天',
      ],
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
    noData: {
      align: 'center',
    },
    colors: [
      '#2877ff',
      '#AA4643',
      '#89A54E',
      '#80699B',
      '#3D96AE',
      '#fa9752',
      '#92A8CD',
      '#A47D7C',
      '#B5CA92',
    ],
    time: {
      useUTC: false,
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      tickPixelInterval: 1000,
      minRange: 80000000,
    },
    yAxis: {
      type: 'category',
      grid: {
        enabled: true,
        borderColor: 'rgba(0,0,0,0.3)',
        borderWidth: 1,
        columns: (() => {
          const state = res.every((item: any) => {
            return item.beginTime === null
          })
          if (state) {
            return [
              {
                title: {
                  text: t('mine.demandTitle'),
                },
                labels: {
                  format: '{point.name}',
                },
              },
              {
                title: {
                  text: t('common.status'),
                },
                labels: {
                  format: '{point.state}',
                },
              },
            ]
          }
          return [
            {
              title: {
                text: t('mine.demandTitle'),
              },
              labels: {
                format: '{point.name}',
              },
            },
            {
              title: {
                text: t('common.expectedStart'),
              },
              labels: {
                format: '{point.beginTime}',
              },
            },
            {
              title: {
                text: t('common.expectedEnd'),
              },
              labels: {
                format: '{point.endTime}',
              },
            },
            {
              title: {
                text: t('common.status'),
              },
              labels: {
                format: '{point.state}',
              },
            },
          ]
        })(),
      },
    },
    tooltip: {
      formatter(this: any): any {
        return `<div>
        开始时间: ${dayjs(this.point.start).format('YYYY-MM-DD HH:mm:ss')}<br/>
        结束时间: ${dayjs(this.point.end).format('YYYY-MM-DD HH:mm:ss')}<br/>
        </div>`
      },
    },
    series: [
      {
        name: t('mine.demandTitle'),
        data: res,
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
